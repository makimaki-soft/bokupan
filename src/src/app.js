var BokupanMainScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
                
        // for debug
        var debugInfoLayer = new DebugInfoLayer();
        debugInfoLayer.setPosition(cc.p(0,0));
        debugInfoLayer.scheduleUpdate();
        this.addChild(debugInfoLayer);
        
        var position_Y = 0;
        
        var　playerStatusLayer = new DummyLayer      (cc.color(200,200, 50,100), g_layout.playerstatus_width, g_layout.playerstatus_height);
        var　menuLayer         = new MenuLayer       (cc.color(255,200,100,100), g_layout.        menu_width, g_layout.        menu_height);
        var　mainMapLayer      = new MainMapLayer    (cc.color(100,255,140,100), g_layout.         map_width, g_layout.         map_height);
        var　enemyStatusLayer  = new DummyLayer      (cc.color( 70,200, 70,100), g_layout. enemystatus_width, g_layout. enemystatus_height);

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
        var actionChoicePhase  = new Mkmk_Phase();
        var playerMovePhase    = new Mkmk_Phase();
        var rotateAllowPhase   = new Mkmk_Phase();
        var collectPantsPhase  = new Mkmk_Phase();
        
        ////////////  Define Players //////////// 
        var player1 = new Mkmk_PlayerStatus(0, "Tezuka", POSITION_ID.HOME_2);
        menuLayer.setPlayer(player1);
        mainMapLayer.setPlayer(player1);
        
        // sample 
        mainMapLayer.setPlayerIcon();
        menuLayer.setMapLayer(mainMapLayer);
        mainMapLayer.setMenuLayer(menuLayer);
        
        //////////// ▼ActionChoicePhase▼ ////////////
        actionChoicePhase.nextPhase[0] = rotateAllowPhase;
        actionChoicePhase.nextPhase[1] = playerMovePhase;
        actionChoicePhase.nextPhase[2] = collectPantsPhase;
        actionChoicePhase.onEnter = function(){
            cc.log("onEnter Action Choice Phase");
            menuLayer.setMoveMenuEnable(true);
            menuLayer.setRotateMenuEnable(true);
            menuLayer.setCollectMenuEnable(isTargetHome(player1.getCurrPosition()));
          
            this.setOnClickEventListener(menuLayer.rotateIcon,  this.gotoNextPhase, 0);
            this.setOnClickEventListener(menuLayer.moveIcon,    this.gotoNextPhase, 1);
            this.setOnClickEventListener(menuLayer.CollectIcon, this.gotoNextPhase, 2);
        }
        actionChoicePhase.onExit = function(){
            cc.log("onExit Action Choice Phase");
            menuLayer.setMoveMenuEnable(false);
            menuLayer.setRotateMenuEnable(false);
            menuLayer.setCollectMenuEnable(false);
        }
        //////////// ▲ActionChoicePhase▲ ////////////
        
        //////////// ▼playerMovePhase▼ ////////////
        playerMovePhase.nextPhase[0] = actionChoicePhase;
        playerMovePhase.onEnter = function(){
            cc.log("onEnter Move Phase");
            mainMapLayer.addCursorToPlayer();
            this.ev = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: function (touch, event) {
                    var touchX = touch.getLocationX();
                    var touchY = touch.getLocationY();
                    if(mainMapLayer.isInside(touchX, touchY)){
                        var dir = mainMapLayer.getRelativeDirection(touchX,touchY);
                        var res = mainMapLayer.movePlayer(dir);
                        if(res){
                            playerMovePhase.gotoNextPhase(0, 1000);
                        }
                    }
                }
            });
            cc.eventManager.addListener(playerMovePhase.ev,mainMapLayer);
        };
        playerMovePhase.onExit = function(){
            cc.log("onExit Move Phase");
            cc.eventManager.removeListener(playerMovePhase.ev);
            mainMapLayer.removeCursor();
        }
        //////////// ▲playerMovePhase▲ ////////////
        
        //////////// ▼RotateAllowPhase▼ ////////////
        rotateAllowPhase.nextPhase[0] = actionChoicePhase;
        rotateAllowPhase.onEnter = function(){
            cc.log("onEnter Rotate Phase");
            mainMapLayer.addCursorToAllows();
            rotateAllowPhase.ev = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: function (touch, event) {
                    var touchX = touch.getLocationX();
                    var touchY = touch.getLocationY();
                    
                    if(mainMapLayer.isInside(touchX, touchY)){
                        var closestAllow = mainMapLayer.getClosestPosition(touchX,touchY);
                        var dir = mainMapLayer.getRelativeDirectionAllow(closestAllow, touchX,touchY);
                        var res = mainMapLayer.rotateAllow(closestAllow, dir);
                        if(res){
                            rotateAllowPhase.gotoNextPhase(0,1000);
                        }
                    }
                }
            });
            cc.eventManager.addListener(rotateAllowPhase.ev,mainMapLayer);
        }
        rotateAllowPhase.onExit = function(){
            cc.log("onExit Rotate Phase");
            cc.eventManager.removeListener(rotateAllowPhase.ev);
            mainMapLayer.removeCursorAllow();
        }
        //////////// ▲RotateAllowPhase▲ ////////////
        
        //////////// ▼CollectPantsPhase▼ ////////////
        collectPantsPhase.nextPhase[0] = actionChoicePhase;
        collectPantsPhase.onEnter = function(){
            cc.log("onEnter Collect Pants Phase");
            
            var currPos = player1.getCurrPosition();
            
            if(!isTargetHome(currPos)){
                collectPantsPhase.gotoNextPhase(0,0);
                return;
            }
            if(player1.checkAcquired(currPos)){
                
            }
            
            if(!player1.checkAcquired(currPos)){
                player1.setNewPantsToBasket(currPos);
                mainMapLayer.textConsole("取得しました");
            }else{
                mainMapLayer.textConsole("取得済みです");
            }
            collectPantsPhase.gotoNextPhase(0,1000);
        }
        collectPantsPhase.onExit = function(){
            cc.log("onExit Collect Pants Phase");
        }
        //////////// ▲CollectPantsPhase▲ ////////////
        
        
        
        //////////// Phase Entry Point ////////////
        actionChoicePhase.onEnter();
    }
});
