var BokupanMainScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        
        //var layer = new HelloWorldLayer();
        //this.addChild(layer);
        
        // for debug
        var debugInfoLayer = new DebugInfoLayer();
        debugInfoLayer.setPosition(cc.p(0,0));
        debugInfoLayer.scheduleUpdate();
        this.addChild(debugInfoLayer);
        
        var position_Y = 0;
        
        var playerStatusLayer = new DummyLayer(cc.color(200,200,50,100), g_layout.playerstatus_width, g_layout.playerstatus_height);
        var menuLayer = new MenuLayer(cc.color(255,200,100,100), g_layout.menu_width, g_layout.menu_height);
        var mainMapLayer = new MainMapLayer(cc.color(100,255,140,100), g_layout.map_width, g_layout.map_height);
        var enemyStatusLayer = new DummyLayer(cc.color(70,200,70,100), g_layout.enemystatus_width, g_layout.enemystatus_height);
        
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
        
        // sample 
        
        mainMapLayer.serPlayerIcon();
        
        menuLayer.setMoveFunction(mainMapLayer);
        mainMapLayer.setMenuLayer(menuLayer);
        
        var playerMovePhase = new Mkmk_Phase();
        var ActionChoicePhase = new Mkmk_Phase();
        var RotateAllowPhase = new Mkmk_Phase();
        
        //////////// playerMovePhase ////////////
        playerMovePhase.nextPhase = ActionChoicePhase;
        playerMovePhase.onEnter = function(){
            cc.log("onEnter Move Phase");
            mainMapLayer.addCursor();
            playerMovePhase.ev = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: function (touch, event) {
                    var touchX = touch.getLocationX();
                    var touchY = touch.getLocationY();
                    // cc.log(event);
                    if(mainMapLayer.isInside(touchX, touchY)){
                        var dir = mainMapLayer.getRelativeDirection(touchX,touchY);
                        var res = mainMapLayer.movePlayer(dir);
                        if(res){
                            playerMovePhase.gotoNextPhase(1000);
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
        
        //////////// ActionChoicePhase ////////////
        ActionChoicePhase.nextPhase = RotateAllowPhase;
        ActionChoicePhase.onEnter = function(){
            cc.log("onEnter Action Choice Phase");
            menuLayer.setMoveMenuEnable(true);
            
            // this.setClickEventListener(menuLayer.moveIcon, this.gotoNextPhase);
            this.setClickEventListener(menuLayer.rotateIcon, this.gotoNextPhase);
        }
        ActionChoicePhase.onExit = function(){
            cc.log("onExit Action Choice Phase");
            menuLayer.setMoveMenuEnable(false);
        }
        
        //////////// RotateAllowPhase ////////////
        RotateAllowPhase.nextPhase = ActionChoicePhase;
        RotateAllowPhase.onEnter = function(){
            cc.log("onEnter Rotate Phase");
            mainMapLayer.addCursorAllow();
            RotateAllowPhase.ev = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: function (touch, event) {
                    var touchX = touch.getLocationX();
                    var touchY = touch.getLocationY();
                    // cc.log(event);
                    if(mainMapLayer.isInside(touchX, touchY)){
                        var dir = mainMapLayer.getRelativeDirectionAllow(touchX,touchY);
                        var res = mainMapLayer.rotateAllow(dir);
                        if(res){
                            RotateAllowPhase.gotoNextPhase(1000);
                        }
                    }
                }
            });
            cc.eventManager.addListener(RotateAllowPhase.ev,mainMapLayer);
        }
        
        //////////// Entry Point ////////////
        ActionChoicePhase.onEnter();
    }
});
