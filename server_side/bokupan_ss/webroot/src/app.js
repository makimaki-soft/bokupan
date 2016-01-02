var rtc_helper = new Helper();

var bkpn = bkpn || {};

var BokupanMainScene = cc.Scene.extend({
    
    /**
     * Constructor function
     */
    onEnter:function () {
        this._super(); 
        bkpn.scene = { main : this };
        
        // define layers
        this.layers = (function(){
            
            var playerStatusLayer   = new PlayerStatusLayer (cc.color(200,200, 50,100), g_layout.playerstatus_width, g_layout.playerstatus_height);
            var menuLayer           = new MenuLayer         (cc.color(255,200,100,100), g_layout.        menu_width, g_layout.        menu_height);
            var mainMapLayer        = new MainMapLayer      (cc.color(100,255,140,100), g_layout.         map_width, g_layout.         map_height);
            var gameStatusLayer     = new GameStatusLayer   (cc.color(  0,  0,  0,100), g_layout. enemystatus_width, g_layout. enemystatus_height);
           
            var position_Y = 0;
            playerStatusLayer.setPosition(cc.p(0,0));           position_Y += g_layout.playerstatus_height;
            menuLayer.setPosition(cc.p(0,position_Y));          position_Y += g_layout.menu_height;
            mainMapLayer.setPosition(cc.p(0,position_Y));       position_Y += g_layout.map_height;
            gameStatusLayer.setPosition(cc.p(0,position_Y));    position_Y += g_layout.enemystatus_height;
           
            return {
                  playerStatusLayer : playerStatusLayer
                , menuLayer         : menuLayer
                , mainMapLayer      : mainMapLayer
                , gameStatusLayer   : gameStatusLayer
            };
        }());
        
        // Add all layers to this scene
        for(var key in this.layers ){
            this.addChild(this.layers[key]);
        }
       
        // Add all layers to each phase
        for(var key in mkmk.phases ){
            mkmk.phases[key].attr({ layers : this.layers });
        }
        
        var mainMapLayer = this.layers.mainMapLayer;
        var menuLayer = this.layers.menuLayer;
        var playerStatusLayer = this.layers.playerStatusLayer;
        
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

        bkpn.terminateBokupan = function(){
            var winner = gameStatus.getPlayer(gameStatus.winner);
                cc.log(winner);
                var gameClearLayer      = new GameClearLayer    (cc.color(  0,  0, 70,100), g_layout. canvas_width,      g_layout. canvas_height )   ;
                gameClearLayer.setPosition(cc.p(0,0));
                mainMapLayer.textConsole(winner.playerName +  "さんが勝ちました。");
                gameClearLayer.setWinnerInfo(winner);
                thisScene.addChild(gameClearLayer, 1);
        };
        
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
});

