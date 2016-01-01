var rtc_helper = new Helper();

var bkpn = bkpn || {};

var BokupanMainScene = cc.Scene.extend({
    
    /**
     * Constructor function
     */
    onEnter:function () {
        this._super();
        
        
        this.layers = defineLayers();
        
       
        for(var key in mkmk.phases ){
            mkmk.phases[key].attr({ layers : this.layers });
        }
        
        bokupaninit.call(this);
    }
});

function defineLayers(){
    
    var test1 = new PlayerStatusLayer (cc.color(200,200, 50,100), g_layout.playerstatus_width, g_layout.playerstatus_height);
    var test2 = new MenuLayer         (cc.color(255,200,100,100), g_layout.        menu_width, g_layout.        menu_height);
    var test3 = new MainMapLayer      (cc.color(100,255,140,100), g_layout.         map_width, g_layout.         map_height);
    var test4 = new GameStatusLayer   (cc.color( 70,200, 70,100), g_layout. enemystatus_width, g_layout. enemystatus_height);
    var test5 = new GameClearLayer    (cc.color(  0,  0, 70,100), g_layout. canvas_width,      g_layout. canvas_height )   ;
    
    return {
          playerStatusLayer : test1
        , menuLayer         : test2
        , mainMapLayer      : test3
        , gameStatusLayer   : test4
        , gameClearLayer    : test5
    };
};

/**
 * Constructor function, override it to extend the construction behavior, remember to call "this._super()" in the extended "ctor" function.
 * @param {cc.Node} [stencil=null]
 */
function bokupaninit(){
    
    var thisScene = this;
                
        // for debug
        var debugInfoLayer = new DebugInfoLayer();
        debugInfoLayer.setPosition(cc.p(0,0));
        debugInfoLayer.scheduleUpdate();
        this.addChild(debugInfoLayer);
        
        var position_Y = 0;
        
        var playerStatusLayer = this.layers.playerStatusLayer;
        var menuLayer         = this.layers.menuLayer;
        var mainMapLayer      = this.layers.mainMapLayer;
        var gameStatusLayer   = this.layers.gameStatusLayer;
        var gameClearLayer    = this.layers.gameClearLayer;

        playerStatusLayer.setPosition(cc.p(0,0));
        this.addChild(playerStatusLayer);
        position_Y += g_layout.playerstatus_height;
        
        menuLayer.setPosition(cc.p(0,position_Y));
        this.addChild(menuLayer);
        position_Y += g_layout.menu_height;
        
        mainMapLayer.setPosition(cc.p(0,position_Y));
        this.addChild(mainMapLayer);
        position_Y += g_layout.map_height;

        gameStatusLayer.setPosition(cc.p(0,position_Y));
        this.addChild(gameStatusLayer);
        position_Y += g_layout.enemystatus_height;
        
        gameClearLayer.setPosition(cc.p(0,0));
        
        ////////////  Define Phases //////////// 
        var actionChoicePhase   = mkmk.phases.actionChoicePhase;
        var playerMovePhase     = mkmk.phases.playerMovePhase;
        var rotateAllowPhase    = mkmk.phases.rotateAllowPhase;
        var collectPantsPhase   = mkmk.phases.collectPantsPhase;
        var selectItemPhase     = mkmk.phases.selectItemPhase;
        var rotateAllAllowPhase = mkmk.phases.rotateAllAllowPhase;
        var movePolicePhase     = mkmk.phases.movePolicePhase;
        var movePeoplePhase     = mkmk.phases.movePeoplePhase;
        
        var comPhase            = mkmk.phases.comPhase;
        var playerPhase         = mkmk.phases.playerPhase;
        
        //////////// Police ////////////
        var police = new Mkmk_PoliceStatus(POSITION_ID.HOME_7);
        mainMapLayer.setPolice(police);
        police.setArrows(mainMapLayer.allows);
        bkpn.police = police;
        
        /////////// Girls //////////////
        var girl = new Mkmk_GirlsStatus(POSITION_ID.HOME_9);
        mainMapLayer.setGirl(girl);
        bkpn.girl = girl;
        
        // sample 
        menuLayer.setMapLayer(mainMapLayer);
        mainMapLayer.setMenuLayer(menuLayer);

        var terminateBokupan = function(){
            var winner = gameStatus.getPlayer(gameStatus.winner);
                cc.log(winner);
                mainMapLayer.textConsole(winner.playerName +  "さんが勝ちました。");
                gameClearLayer.setWinnerInfo(winner);
                thisScene.addChild(gameClearLayer, 1);
        };
        
        //////////// ▼RotateAllowPhase▼ ////////////
        
        //////////// ▲RotateAllowPhase▲ ////////////
        
        //////////// ▼CollectPantsPhase▼ ////////////
        collectPantsPhase.nextPhase = [];
        collectPantsPhase.nextPhase[0] = actionChoicePhase;
        collectPantsPhase.onEnter = function(){
            cc.log("onEnter Collect Pants Phase");
            
            var currPlayer = gameStatus.getCurrPlayer();
            var currPos = currPlayer.getCurrPosition();
            
            if(!isTargetHome(currPos)){
                collectPantsPhase.gotoNextPhase(0,0, false);
                return;
            }
      
            if(!currPlayer.checkAcquired(currPos)){
                currPlayer.setNewPantsToBasket(currPos);
                mainMapLayer.textConsole("取得しました");
                gameStatusLayer.updateMsg(currPlayer.playerName + "さんがパンツを取得しました。");
                collectPantsPhase.gotoNextPhase(0,1000, true);
            }else{
                mainMapLayer.textConsole("取得済みです");
                gameStatusLayer.updateMsg("取得済みです。");
                collectPantsPhase.gotoNextPhase(0,1000, false);
            }
            
            if(currPlayer.checkIfForfeitPosition(police.getCurrPosition())) { //警察と接触
                mainMapLayer.playCutinAnimation(res.CutinForfeitPolice);
                mainMapLayer.resetPlayerPosition(currPlayer);
                cc.log("逮捕!!");
                gameStatusLayer.updateMsg(currPlayer.playerName + "さんが逮捕されました。");
            }
            else if(currPlayer.checkIfForfeitPosition(girl.currPos)) { // 住人に見つかる
                mainMapLayer.playCutinAnimation(getGirlCutinResouce(girl.currPos));
                mainMapLayer.resetPlayerPosition(currPlayer);
                cc.log("通報!!");
                gameStatusLayer.updateMsg(currPlayer.playerName + "さんが通報されました。");
            }
        }
        collectPantsPhase.onExit = function(){
            cc.log("onExit Collect Pants Phase");
        }
        //////////// ▲CollectPantsPhase▲ ////////////
         
        //////////// ▼SelectItemPhase▼ ////////////
        selectItemPhase.nextPhase = [];
        selectItemPhase.nextPhase[0] = rotateAllAllowPhase;
        selectItemPhase.nextPhase[1] = movePolicePhase;
        selectItemPhase.nextPhase[2] = movePeoplePhase;
        selectItemPhase.onEnter = function(){
            cc.log("onEnter Select Item Phase");
            mainMapLayer.addItemCard();
     
            cc.eventManager.addCustomListener(Helper.LABEL.ITEM_ARROW ,function (event) {
                    cc.log(event.getUserData());  
                    selectItemPhase.gotoNextPhase(0);
                });
            cc.eventManager.addCustomListener(Helper.LABEL.ITEM_POLICE ,function (event) {
                    cc.log(event.getUserData());  
                    selectItemPhase.gotoNextPhase(1);
                });
            cc.eventManager.addCustomListener(Helper.LABEL.ITEM_PEOPLE ,function (event) {
                    cc.log(event.getUserData());  
                    selectItemPhase.gotoNextPhase(2);
                });
        }
        selectItemPhase.onExit = function(){
            cc.log("onExit Select Item Phase");
            cc.eventManager.removeCustomListeners(Helper.LABEL.ITEM_ARROW);
            cc.eventManager.removeCustomListeners(Helper.LABEL.ITEM_POLICE);
            cc.eventManager.removeCustomListeners(Helper.LABEL.ITEM_PEOPLE);
            mainMapLayer.removeItemCard();
        }
        //////////// ▲SelectItemPhase▲ ////////////
        
        //////////// ▼RotateAllAllowPhase▼ ////////////
        rotateAllAllowPhase.nextPhase = [];
        rotateAllAllowPhase.nextPhase[0] = actionChoicePhase;
        rotateAllAllowPhase.onEnter = function(){
            cc.log("onEnter Rotate All Arrow Phase");
            var currPlayer = gameStatus.getCurrPlayer();
            
            if(currPlayer.isAlreadyUse(ITEM.ARROW)){
                mainMapLayer.textConsole("使用済みです");
                gameStatusLayer.updateMsg("使用済みです。");

                this.gotoNextPhase(0,1000, false);
                return;
            }
            mainMapLayer.rotateAllArrowClockwise();
            currPlayer.useItem(ITEM.ARROW);
            this.gotoNextPhase(0,1000, true);
        }
        rotateAllAllowPhase.onExit = function(){
            cc.log("onExit Rotate All Arrow Phase");
        }
        //////////// ▲RotateAllAllowPhase▲ ////////////
        
        //////////// ▼Move Police Phase▼ ////////////
        movePolicePhase.nextPhase = [];
        movePolicePhase.nextPhase[0] = actionChoicePhase;
        movePolicePhase.onEnter = function(){
            cc.log("onEnter Move Police Phase");
            var currPlayer = gameStatus.getCurrPlayer();
            
            if(currPlayer.isAlreadyUse(ITEM.POLICE)){
                mainMapLayer.textConsole("使用済みです");
                gameStatusLayer.updateMsg("使用済みです。");
                this.gotoNextPhase(0,1000, false);
                return;
            }
            
            cc.eventManager.addCustomListener(Helper.LABEL.CAST_DICE,function (event) {
                cc.log(event.getUserData());
                
                var allplayers = gameStatus.getAllPlayers();
                var num1 = event.getUserData().roll1;
                mainMapLayer.playDiceAnimation(num1, 0);
                var num2 = event.getUserData().roll2;
                mainMapLayer.playDiceAnimation(num2, 80);
                mainMapLayer.movePolice((num1+num2), function(currPos){
                    for( var i=0 ; i<this.length ; i++ ){
                        if(this[i].checkIfForfeitPosition(currPos)) {
                            mainMapLayer.playCutinAnimation(res.CutinForfeitPolice);
                            mainMapLayer.resetPlayerPosition(this[i]);
                            cc.log("逮捕!!");
                            gameStatusLayer.updateMsg(this[i].playerName + "さんが逮捕されました。");
                        }
                    }
                }, allplayers);
                movePolicePhase.gotoNextPhase(0,1200*(num1+num2), true);
            });
            
            if(currPlayer.isMe()){
                var roll1 = castDice();
                var roll2 = castDice();
                var roll_action = {"roll1":roll1, "roll2":roll2};
                rtc_manager.send(rtc_helper.encode(Helper.LABEL.CAST_DICE, roll_action));
                cc.eventManager.dispatchCustomEvent(Helper.LABEL.CAST_DICE, roll_action);
            }
            currPlayer.useItem(ITEM.POLICE);
        }
        movePolicePhase.onExit = function(){
            cc.log("onExit Move Police Phase");
            cc.eventManager.removeCustomListeners(Helper.LABEL.CAST_DICE);
        }
        //////////// ▲Move Police Phase▲ ////////////
        
        //////////// ▼Move People Phase▼ ////////////
        movePeoplePhase.nextPhase = [];
        movePeoplePhase.nextPhase[0] = actionChoicePhase;
        movePeoplePhase.onEnter = function(){
            cc.log("onEnter Move People Phase");
            var currPlayer = gameStatus.getCurrPlayer();
            
            if(currPlayer.isAlreadyUse(ITEM.PEOPLE)){
                mainMapLayer.textConsole("使用済みです");
                gameStatusLayer.updateMsg("使用済みです。");
                this.gotoNextPhase(0,1000, false);
                return;
            }
            
            cc.eventManager.addCustomListener(Helper.LABEL.CHOOSE_HOME,function (event) {
                cc.log(event.getUserData());
                var nextHome = event.getUserData().home;  
                var allplayers = gameStatus.getAllPlayers();
              
                for( var i=0 ; i<allplayers.length ; i++){
                    if( allplayers[i].checkIfForfeitPosition(nextHome) ){ // 通報
                        mainMapLayer.playCutinAnimation(getGirlCutinResouce(nextHome));
                        mainMapLayer.resetPlayerPosition(allplayers[i]);
                        cc.log("通報!!");
                        gameStatusLayer.updateMsg(allplayers[i].playerName + "さんが通報されました。");
                    }
                }
                
                mainMapLayer.moveGirl(nextHome);
                girl.setPos(nextHome);
                movePeoplePhase.gotoNextPhase(0,1000, true);
            });
            
            if(currPlayer.isMe()){
                var home = chooseHome();
                var home_action = {"home":home};
                rtc_manager.send(rtc_helper.encode(Helper.LABEL.CHOOSE_HOME, home_action));
                cc.eventManager.dispatchCustomEvent(Helper.LABEL.CHOOSE_HOME, home_action);
            }
            currPlayer.useItem(ITEM.PEOPLE);
        }
        movePeoplePhase.onExit = function(){
            cc.log("onExit Move People Phase");
            cc.eventManager.removeCustomListeners(Helper.LABEL.CHOOSE_HOME);
        }
        
        //////////// ▲Move People Phase▲ ////////////
        
        //////////// ▼Player Phase▼ ////////////
        playerPhase.nextPhase = [];
        playerPhase.nextPhase[0] = comPhase;
        playerPhase.nextPhase[1] = playerPhase;
        playerPhase.setchildEntryPoint( actionChoicePhase ); // 子フェーズの設定
        /**
         * playerPhaseの開始処理
         *  - 次のフェーズがComかプレイヤーか決定し、子フェーズを開始する。
         */
        playerPhase.onEnter = function(){
            cc.log("onEnter Player Phase");
            
            var currPlayer = gameStatus.getCurrPlayer();

            menuLayer.updateGameStatusText(currPlayer);
            gameStatusLayer.updateMsg(currPlayer.playerName + "さんのターンです。");
            
            // 順番が最後のプレイヤのフェーズが終了するとComフェーズ、それ以外は次のプレイヤのフェーズ
            if(gameStatus.isLastPlayer(currPlayer)){
                this.nextPhaseIdx = 0; // comPhase
            }else{
                this.nextPhaseIdx = 1; // playerPhase
            }
            
            // 子フェーズを開始する。
            this.gotoChildPhase(0);
        }
        /**
         * playerPhaseの終了処理
         *  - 次のプレイヤーに変更する。
         */
        playerPhase.onExit = function(){
            cc.log("onExit Player Phase");
            var currPlayer = gameStatus.getCurrPlayer();
            setTimeout(function(){
                // 終了判定
                if( currPlayer.checkIfUpdateContainer() ){
                    terminateBokupan();
                }
            }, 1000 );
            gameStatus.chengePlayer();
        }
        //////////// ▲Player Phase▲ ////////////
        
        //////////// ▼Com Phase▼ ////////////
        comPhase.nextPhase = [];
        comPhase.nextPhase[0]  = playerPhase;
        comPhase.onEnter = function(){
            cc.log("onEnter Com Phase");
            this.nextPhaseIdx = 0;
            var currPlayer = gameStatus.getCurrPlayer();
            
            cc.eventManager.addCustomListener(Helper.LABEL.TWO_CHOICE,function (event) {
                cc.log(event.getUserData());
                var isPolicePhase = event.getUserData().isPolice;
                
                if(isPolicePhase){
                    mainMapLayer.textConsole("警察が動きます。");
                    gameStatusLayer.updateMsg("警察が動きます。");
                    var allplayers = gameStatus.getAllPlayers();
                    var num1 = event.getUserData().roll1;
                    mainMapLayer.playDiceAnimation(num1, 0);
                    var num2 = event.getUserData().roll2;
                    mainMapLayer.playDiceAnimation(num2, 80);
    
                    mainMapLayer.movePolice(num1+num2, function(currPos){
                        for( var i=0 ; i<this.length ; i++ ){
                            if(this[i].checkIfForfeitPosition(currPos)){
                                mainMapLayer.playCutinAnimation(res.CutinForfeitPolice);
                                mainMapLayer.resetPlayerPosition(this[i]);
                                cc.log("逮捕!!");
                                gameStatusLayer.updateMsg(this[i].playerName + "さんが逮捕されました。");
                            }
                        }
                    }, allplayers);
                    comPhase.gotoNextPhase(0,1200*(num1+num2), false);
                }else{
                    mainMapLayer.textConsole("住人が動きます。");
                    gameStatusLayer.updateMsg("住人が動きます。");
                    
                    var nextHome = event.getUserData().home;  
                    var allplayers = gameStatus.getAllPlayers();
              
                    for( var i=0 ; i<allplayers.length ; i++){
                        if( allplayers[i].checkIfForfeitPosition(nextHome) ){
                            mainMapLayer.playCutinAnimation(getGirlCutinResouce(nextHome));
                            mainMapLayer.resetPlayerPosition(allplayers[i]);
                            cc.log("通報!!");
                            gameStatusLayer.updateMsg(allplayers[i].playerName + "さんが通報されました。");
                        }
                    }

                    mainMapLayer.moveGirl(nextHome);
                    girl.setPos(nextHome);
                    comPhase.gotoNextPhase(0,1100, false);
                }
            });
            
            if(currPlayer.isMe()){
                var isPolicePhase = twoChoice();
                var roll_action;
                
                if( isPolicePhase ){
                    var roll1 = castDice();
                    var roll2 = castDice();
                    roll_action = {"isPolice":isPolicePhase, "roll1":roll1, "roll2":roll2};
                }else{
                    var home = chooseHome();
                    roll_action = {"isPolice":isPolicePhase, "home":home };
                }
                rtc_manager.send(rtc_helper.encode(Helper.LABEL.TWO_CHOICE, roll_action));
                cc.eventManager.dispatchCustomEvent(Helper.LABEL.TWO_CHOICE, roll_action);
            }
        }
        comPhase.onExit = function(){
            cc.log("onExit Com Phase");
            cc.eventManager.removeCustomListeners(Helper.LABEL.TWO_CHOICE);
        }
        //////////// ▲Com Phase▲ ////////////
        
        //////////// Phase Entry Point ////////////
        //////////// Phase Entry Point ////////////
        
        rtc_manager.setReceiveAction(function(peerID, data){
            // cc.log(peerID,data);
            var decoded = rtc_helper.decode(data);

            if(decoded == null){
                return;
            }

            var home_text = ["A", "B", "C", "D"];
            switch(decoded.label){
                case Helper.LABEL.NEW_PLAYER:
                    // プレイヤーが参加する。
                    if( rtc_manager.isHost ){
                            
                        // 初めて送られてきたpeerIDの場合は、プレイヤーを追加する
                        var currLen  = gameStatus.players.length;
                        for(var i=0 ; i<currLen ; i++ ){
                           if(gameStatus.players[i].myPeerID==peerID){
                               // すでに作成ずみ
                               break;
                           }
                           var newID = gameStatus.getNewPlayerID();
                           var firstPos = [POSITION_ID.HOME_A, POSITION_ID.HOME_B, POSITION_ID.HOME_C, POSITION_ID.HOME_D];
                           var newPlayer = new Mkmk_PlayerStatus(newID, home_text[newID], firstPos[newID], playerStatusLayer, peerID);
                           mainMapLayer.setPlayer(newPlayer);
                           gameStatus.addPlayer(newPlayer);
                           mainMapLayer.textConsole("プレイヤーが参加しました。");
                           gameStatusLayer.updateMsg(newPlayer.playerName + "さんが参加しました。");

                           break;
                        }

                        // 全員のIDを教えてやる。
                        currLen  = gameStatus.players.length;
                        for(var i=0 ; i<currLen ; i++ ){
                            var currPlayer = gameStatus.players[i];
                            rtc_manager.send(rtc_helper.encode(Helper.LABEL.NEW_PLAYER, {
                                                                    "id"     : currPlayer.playerID,
                                                                    "peerID" : currPlayer.myPeerID}));
                        }

                   　}else{
                       
                       var newID = decoded.action.id;
                       var targetPeerID = decoded.action.peerID;

                       // 作成済みでないプレイヤを追加する
                       var bFind = false;
                       for(var i=0 ; i<gameStatus.players.length ; i++ ){
                           if(gameStatus.players[i].myPeerID==targetPeerID){
                               bFind = true;
                               break;
                           }
                       }

                       if( !bFind ){
                           var firstPos = [POSITION_ID.HOME_A, POSITION_ID.HOME_B, POSITION_ID.HOME_C, POSITION_ID.HOME_D];
                           var newPlayer = new Mkmk_PlayerStatus(newID, home_text[newID], firstPos[newID], playerStatusLayer, decoded.action.peerID);
                           mainMapLayer.setPlayer(newPlayer);
                           gameStatus.addPlayer(newPlayer);
                           playerStatusLayer.setPlayer(newPlayer);
                           mainMapLayer.textConsole("プレイヤーが参加しました。");
                           gameStatusLayer.updateMsg(newPlayer.playerName + "さんが参加しました。");
                       }
                    }
                    
                    // 人数が集まったらゲームを開始する。
                    if( gameStatus.players.length == 4 ){
                        playerPhase.onEnter();
                        gameStatusLayer.updateMsg("ゲームを開始します。");
                    }
                    break;
                default:
                    cc.eventManager.dispatchCustomEvent(decoded.label, decoded.action);
                    cc.log(decoded);
                    break;
            }    
        });
        
        ////////////  Define Players //////////// 
        if(rtc_manager.isHost){
            var home_text = ["A", "B", "C", "D"];
            var player1 = new Mkmk_PlayerStatus(0, home_text[0], POSITION_ID.HOME_A, playerStatusLayer, rtc_manager.getmyid());
            menuLayer.setPlayer(player1);
            mainMapLayer.setPlayer(player1);
            playerStatusLayer.setPlayer(player1);
            gameStatus.addPlayer(player1);
        }else{
            rtc_manager.send(rtc_helper.encode(Helper.LABEL.NEW_PLAYER, {}));
            cc.log("requent my id");
        }
     
    
}


