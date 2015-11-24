var rtc_helper = new Helper();

var BokupanMainScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
                
        // for debug
        var debugInfoLayer = new DebugInfoLayer();
        debugInfoLayer.setPosition(cc.p(0,0));
        debugInfoLayer.scheduleUpdate();
        this.addChild(debugInfoLayer);
        
        var position_Y = 0;
        
        var　playerStatusLayer = new PlayerStatusLayer (cc.color(200,200, 50,100), g_layout.playerstatus_width, g_layout.playerstatus_height);
        var　menuLayer         = new MenuLayer         (cc.color(255,200,100,100), g_layout.        menu_width, g_layout.        menu_height);
        var　mainMapLayer      = new MainMapLayer      (cc.color(100,255,140,100), g_layout.         map_width, g_layout.         map_height);
        var　enemyStatusLayer  = new DummyLayer        (cc.color( 70,200, 70,100), g_layout. enemystatus_width, g_layout. enemystatus_height);

        playerStatusLayer.setPosition(cc.p(0,0));
        this.addChild(playerStatusLayer);
        position_Y += g_layout.playerstatus_height;
        
        menuLayer.setPosition(cc.p(0,position_Y));
        this.addChild(menuLayer);
        position_Y += g_layout.menu_height;
        
        mainMapLayer.setPosition(cc.p(0,position_Y));
        this.addChild(mainMapLayer);
        position_Y += g_layout.map_height;

        enemyStatusLayer.setPosition(cc.p(0,position_Y));
        this.addChild(enemyStatusLayer);
        position_Y += g_layout.enemystatus_height;
        
        
        
        ////////////  Define Phases //////////// 
        var actionChoicePhase   = new Mkmk_Phase();
        var playerMovePhase     = new Mkmk_Phase();
        var rotateAllowPhase    = new Mkmk_Phase();
        var collectPantsPhase   = new Mkmk_Phase();
        var selectItemPhase     = new Mkmk_Phase();
        var rotateAllAllowPhase = new Mkmk_Phase();
        var movePolicePhase     = new Mkmk_Phase();
        var movePeoplePhase     = new Mkmk_Phase();
        
        var comPhase            = new Mkmk_Phase();
        var playerPhase         = new Mkmk_Phase();
        
        //////////// Police ////////////
        var police = new Mkmk_PoliceStatus(POSITION_ID.HOME_7);
        mainMapLayer.setPolice(police);
        police.setArrows(mainMapLayer.allows);
        
        // sample 
        menuLayer.setMapLayer(mainMapLayer);
        mainMapLayer.setMenuLayer(menuLayer);
        
        //////////// ▼ActionChoicePhase▼ ////////////
        actionChoicePhase.nextPhase[0] = rotateAllowPhase;
        actionChoicePhase.nextPhase[1] = playerMovePhase;
        actionChoicePhase.nextPhase[2] = collectPantsPhase;
        actionChoicePhase.nextPhase[3] = selectItemPhase;
        actionChoicePhase.onEnter = function(){
            cc.log("onEnter Action Choice Phase");
            var currPlayer = gameStatus.getCurrPlayer();
            
            if(currPlayer.isMe()){
                menuLayer.setMoveMenuEnable(true);
                menuLayer.setRotateMenuEnable(isIntersectionWithArrow(currPlayer.getCurrPosition()));
                menuLayer.setCollectMenuEnable(isTargetHome(currPlayer.getCurrPosition()));
                menuLayer.setItemMenuEnable(!currPlayer.isAlreadyUseAll());
            }
            currPlayer.checkIfUpdateContainer();
            
            cc.eventManager.addCustomListener(Helper.LABEL.ARROW_BUTTON ,function (event) {
                    cc.log(event.getUserData());  
                    actionChoicePhase.gotoNextPhase(0);
                });
            
            cc.eventManager.addCustomListener(Helper.LABEL.MOVE_BUTTON,function (event) {
                    cc.log(event.getUserData());  
                    actionChoicePhase.gotoNextPhase(1);
                });
            cc.eventManager.addCustomListener(Helper.LABEL.GET_BUTTON,function (event) {
                    cc.log(event.getUserData());  
                    actionChoicePhase.gotoNextPhase(2);
                });
                
            cc.eventManager.addCustomListener(Helper.LABEL.ITEM_BUTTON ,function (event) {
                    cc.log(event.getUserData());  
                    actionChoicePhase.gotoNextPhase(3);
                });
                
            // this.setOnClickEventListener(menuLayer.rotateIcon,  this.gotoNextPhase, 0);
            // this.setOnClickEventListener(menuLayer.moveIcon,    this.gotoNextPhase, 1);
            // this.setOnClickEventListener(menuLayer.CollectIcon, this.gotoNextPhase, 2);
            //this.setOnClickEventListener(menuLayer.ItemIcon,    this.gotoNextPhase, 3);
        }
        actionChoicePhase.onExit = function(){
            cc.log("onExit Action Choice Phase");
            menuLayer.setMoveMenuEnable(false);
            menuLayer.setRotateMenuEnable(false);
            menuLayer.setCollectMenuEnable(false);
            menuLayer.setItemMenuEnable(false);
            
            cc.eventManager.removeCustomListeners(Helper.LABEL.ARROW_BUTTON);
            cc.eventManager.removeCustomListeners(Helper.LABEL.MOVE_BUTTON);
            cc.eventManager.removeCustomListeners(Helper.LABEL.GET_BUTTON);
            cc.eventManager.removeCustomListeners(Helper.LABEL.ITEM_BUTTON);
        }
        //////////// ▲ActionChoicePhase▲ ////////////
        
        //////////// ▼playerMovePhase▼ ////////////
        playerMovePhase.nextPhase[0] = actionChoicePhase;
        playerMovePhase.onEnter = function(){
            cc.log("onEnter Move Phase");
            var currPlayer = gameStatus.getCurrPlayer();
            var currID = currPlayer.playerID;
            mainMapLayer.addCursorToPlayer(currID);
            if(currPlayer.isMe()){
                this.ev = cc.EventListener.create({
                    event: cc.EventListener.TOUCH_ONE_BY_ONE,
                    swallowTouches: true,
                    onTouchBegan: function (touch, event) {
                        
                        var touch_action = { "touchX" :touch.getLocationX(),
                                      "touchY" :touch.getLocationY()
                                    };
                        
                        rtc_manager.send(rtc_helper.encode(Helper.LABEL.TOUCH, touch_action));
                        cc.eventManager.dispatchCustomEvent(Helper.LABEL.TOUCH,touch_action);
                    }
                });
                cc.eventManager.addListener(playerMovePhase.ev,mainMapLayer);
            }
            
            cc.eventManager.addCustomListener(Helper.LABEL.TOUCH,function (event) {
                    cc.log(event.getUserData());
                    var touch = event.getUserData();
                    var touchX = touch.touchX;
                    var touchY = touch.touchY;

                    if(mainMapLayer.isInside(touchX, touchY)){
                        var dir = mainMapLayer.getRelativeDirection(currID, touchX,touchY);
                        var res = mainMapLayer.movePlayer(currID, dir);
                        if(res){
                            playerMovePhase.gotoNextPhase(0, 1000, true);
                        }
                    }
                });
        };
        playerMovePhase.onExit = function(){
            cc.log("onExit Move Phase");
            cc.eventManager.removeListener(playerMovePhase.ev);
            cc.eventManager.removeCustomListeners(Helper.LABEL.TOUCH);
            mainMapLayer.removeCursor();
        }
        //////////// ▲playerMovePhase▲ ////////////
        
        //////////// ▼RotateAllowPhase▼ ////////////
        rotateAllowPhase.nextPhase[0] = actionChoicePhase;
        rotateAllowPhase.onEnter = function(){
            cc.log("onEnter Rotate Phase");
            // mainMapLayer.addCursorToAllows();
            var currPlayer = gameStatus.getCurrPlayer();
            
            var targetArrow = getArrowByRoadPosition(currPlayer.getCurrPosition());
            mainMapLayer.addCursorToArrow(targetArrow);
            if(currPlayer.isMe()){
                rotateAllowPhase.ev = cc.EventListener.create({
                    event: cc.EventListener.TOUCH_ONE_BY_ONE,
                    swallowTouches: true,
                    onTouchBegan: function (touch, event) {
                        
                        var touch_action = { "touchX" :touch.getLocationX(),
                                             "touchY" :touch.getLocationY()
                                           };
                        
                        rtc_manager.send(rtc_helper.encode(Helper.LABEL.TOUCH, touch_action));
                        cc.eventManager.dispatchCustomEvent(Helper.LABEL.TOUCH,touch_action);
                    }
                });
                cc.eventManager.addListener(rotateAllowPhase.ev,mainMapLayer);
            }
            
            cc.eventManager.addCustomListener(Helper.LABEL.TOUCH,function (event) {
                    cc.log(event.getUserData());
                    var touch = event.getUserData();
                    var touchX = touch.touchX;
                    var touchY = touch.touchY;
                    
                    if(mainMapLayer.isInside(touchX, touchY)){
                        // var closestAllow = mainMapLayer.getClosestPosition(touchX,touchY);
                        var dir = mainMapLayer.getRelativeDirectionAllow(targetArrow, touchX,touchY);
                        var res = mainMapLayer.rotateAllow(targetArrow, dir);
                        if(res){
                            rotateAllowPhase.gotoNextPhase(0,1000, true);
                        }
                    }
                    
                });
        }
        rotateAllowPhase.onExit = function(){
            cc.log("onExit Rotate Phase");
            cc.eventManager.removeCustomListeners(Helper.LABEL.TOUCH);
            cc.eventManager.removeListener(rotateAllowPhase.ev);
            mainMapLayer.removeCursorAllow();
        }
        //////////// ▲RotateAllowPhase▲ ////////////
        
        //////////// ▼CollectPantsPhase▼ ////////////
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
                collectPantsPhase.gotoNextPhase(0,1000, true);
            }else{
                mainMapLayer.textConsole("取得済みです");
                collectPantsPhase.gotoNextPhase(0,1000, false);
            }
        }
        collectPantsPhase.onExit = function(){
            cc.log("onExit Collect Pants Phase");
        }
        //////////// ▲CollectPantsPhase▲ ////////////
         
        //////////// ▼SelectItemPhase▼ ////////////
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
        rotateAllAllowPhase.nextPhase[0] = actionChoicePhase;
        rotateAllAllowPhase.onEnter = function(){
            cc.log("onEnter Rotate All Arrow Phase");
            var currPlayer = gameStatus.getCurrPlayer();
            
            if(currPlayer.isAlreadyUse(ITEM.ARROW)){
                mainMapLayer.textConsole("使用済みです");
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
        movePolicePhase.nextPhase[0] = actionChoicePhase;
        movePolicePhase.onEnter = function(){
            cc.log("onEnter Move Police Phase");
            var currPlayer = gameStatus.getCurrPlayer();
            
            if(currPlayer.isAlreadyUse(ITEM.POLICE)){
                mainMapLayer.textConsole("使用済みです");
                this.gotoNextPhase(0,1000, false);
                return;
            }
            
            cc.eventManager.addCustomListener(Helper.LABEL.CAST_DICE,function (event) {
                cc.log(event.getUserData());
                var num = event.getUserData().roll;
                
                mainMapLayer.playDiceAnimation(num);
                mainMapLayer.movePolice(num, function(currPos){
                    this.checkIfForfeitPosition(currPos);
                }, currPlayer);
                movePolicePhase.gotoNextPhase(0,1200*num, true);
            });
            
            if(currPlayer.isMe()){
                var roll = castDice();
                var roll_action = {"roll":roll};
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
        movePeoplePhase.nextPhase[0] = actionChoicePhase;
        movePeoplePhase.onEnter = function(){
            cc.log("onEnter Move People Phase");
            var currPlayer = gameStatus.getCurrPlayer();
            
            if(currPlayer.isAlreadyUse(ITEM.PEOPLE)){
                mainMapLayer.textConsole("使用済みです");
                this.gotoNextPhase(0,1000, false);
                return;
            }
            var num = castDice();
            mainMapLayer.playDiceAnimation(num);
            currPlayer.useItem(ITEM.PEOPLE);
            this.gotoNextPhase(0,1000, true);
        }
        movePeoplePhase.onExit = function(){
            cc.log("onExit Move People Phase");
        }
        
        //////////// ▲Move People Phase▲ ////////////
        
        //////////// ▼Player Phase▼ ////////////
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
            gameStatus.chengePlayer();
        }
        //////////// ▲Player Phase▲ ////////////
        
        //////////// ▼Com Phase▼ ////////////
        comPhase.nextPhase[0]  = playerPhase;
        comPhase.onEnter = function(){
            cc.log("onEnter Com Phase");
            mainMapLayer.textConsole("警察が動きます。");
            this.nextPhaseIdx = 0;
            var currPlayer = gameStatus.getCurrPlayer();
            
            cc.eventManager.addCustomListener(Helper.LABEL.CAST_DICE,function (event) {
                cc.log(event.getUserData());
                var num = event.getUserData().roll;
                
                mainMapLayer.playDiceAnimation(num);
                mainMapLayer.movePolice(num, function(currPos){
                    this.checkIfForfeitPosition(currPos);
                }, currPlayer);
                comPhase.gotoNextPhase(0,1200*num, false);
            });
            
            if(currPlayer.isMe()){
                var roll = castDice();
                var roll_action = {"roll":roll};
                rtc_manager.send(rtc_helper.encode(Helper.LABEL.CAST_DICE, roll_action));
                cc.eventManager.dispatchCustomEvent(Helper.LABEL.CAST_DICE, roll_action);
            }
        }
        comPhase.onExit = function(){
            cc.log("onExit Com Phase");
            cc.eventManager.removeCustomListeners(Helper.LABEL.CAST_DICE);
        }
        //////////// ▲Com Phase▲ ////////////
        
        //////////// Phase Entry Point ////////////
        //////////// Phase Entry Point ////////////
        
        // 
        
        rtc_manager.setReceiveAction(function(peerID, data){
            // cc.log(peerID,data);
            var decoded = rtc_helper.decode(data);
            
            switch(decoded.label){
                case Helper.LABEL.NEW_PLAYER:
                    // プレイヤーが参加する。
                    if( rtc_manager.isHost ){
                        var newID = gameStatus.getNewPlayerID();
                        var firstPos = [POSITION_ID.HOME_A, POSITION_ID.HOME_B, POSITION_ID.HOME_C, POSITION_ID.HOME_D];
                        var newPlayer = new Mkmk_PlayerStatus(newID, "Tezuka", firstPos[newID], playerStatusLayer, peerID);
                        mainMapLayer.setPlayer(newPlayer);
                        gameStatus.addPlayer(newPlayer);
                        mainMapLayer.textConsole("プレイヤーが参加しました。");
                        
                        // 相手のIDを教えてやる。
                        rtc_manager.send(rtc_helper.encode(Helper.LABEL.NEW_PLAYER, {
                                                                    "id"     : newID,
                                                                    "peerID" : peerID}));
                   　}else{
                       
                       var newID = decoded.action.id;
                       var firstPos = [POSITION_ID.HOME_A, POSITION_ID.HOME_B, POSITION_ID.HOME_C, POSITION_ID.HOME_D];
                       var newPlayer = new Mkmk_PlayerStatus(newID, "Tezuka", firstPos[newID], playerStatusLayer, decoded.action.peerID);
                       mainMapLayer.setPlayer(newPlayer);
                       gameStatus.addPlayer(newPlayer);
                       mainMapLayer.textConsole("プレイヤーが参加しました。");
                       
                       var hostPlayer = new Mkmk_PlayerStatus(0 , "Tezuka", firstPos[0], playerStatusLayer, peerID);
                       mainMapLayer.setPlayer(hostPlayer);
                       gameStatus.addPlayer(hostPlayer);
                    }
                    
                    // 人数が集まったらゲームを開始する。
                    if( gameStatus.players.length == 2 ){
                        playerPhase.onEnter();
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
            var player1 = new Mkmk_PlayerStatus(0, "Tezuka", POSITION_ID.HOME_A, playerStatusLayer, rtc_manager.getmyid());
            menuLayer.setPlayer(player1);
            mainMapLayer.setPlayer(player1);
            gameStatus.addPlayer(player1);
        }else{
            rtc_manager.send(rtc_helper.encode(Helper.LABEL.NEW_PLAYER, {}));
        }

    }
});
