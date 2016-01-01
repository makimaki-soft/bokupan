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
       
        //////////// ▼Player Phase▼ ////////////
        
        //////////// ▲Player Phase▲ ////////////
        
        //////////// ▼Com Phase▼ ////////////
        
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


