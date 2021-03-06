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
        
        ////////////  Define Players //////////// 
        var player1 = new Mkmk_PlayerStatus(0, "Tezuka", POSITION_ID.HOME_A, playerStatusLayer);
        menuLayer.setPlayer(player1);
        mainMapLayer.setPlayer(player1);
        playerStatusLayer.setPlayer(player1);
        
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
            
            player1.checkIfUpdateContainer();
            
            menuLayer.setMoveMenuEnable(true);
            menuLayer.setRotateMenuEnable(isIntersectionWithArrow(player1.getCurrPosition()));
            menuLayer.setCollectMenuEnable(isTargetHome(player1.getCurrPosition()));
            menuLayer.setItemMenuEnable(!player1.isAlreadyUseAll());
            
            this.setOnClickEventListener(menuLayer.rotateIcon,  this.gotoNextPhase, 0);
            this.setOnClickEventListener(menuLayer.moveIcon,    this.gotoNextPhase, 1);
            this.setOnClickEventListener(menuLayer.CollectIcon, this.gotoNextPhase, 2);
            this.setOnClickEventListener(menuLayer.ItemIcon,    this.gotoNextPhase, 3);
        }
        actionChoicePhase.onExit = function(){
            cc.log("onExit Action Choice Phase");
            menuLayer.setMoveMenuEnable(false);
            menuLayer.setRotateMenuEnable(false);
            menuLayer.setCollectMenuEnable(false);
            menuLayer.setItemMenuEnable(false);
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
                            playerMovePhase.gotoNextPhase(0, 1000, true);
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
            // mainMapLayer.addCursorToAllows();
            var targetArrow = getArrowByRoadPosition(player1.getCurrPosition());
            mainMapLayer.addCursorToArrow(targetArrow);
            rotateAllowPhase.ev = cc.EventListener.create({
                event: cc.EventListener.TOUCH_ONE_BY_ONE,
                swallowTouches: true,
                onTouchBegan: function (touch, event) {
                    var touchX = touch.getLocationX();
                    var touchY = touch.getLocationY();
                    
                    if(mainMapLayer.isInside(touchX, touchY)){
                        // var closestAllow = mainMapLayer.getClosestPosition(touchX,touchY);
                        var dir = mainMapLayer.getRelativeDirectionAllow(targetArrow, touchX,touchY);
                        var res = mainMapLayer.rotateAllow(targetArrow, dir);
                        if(res){
                            rotateAllowPhase.gotoNextPhase(0,1000, true);
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
                collectPantsPhase.gotoNextPhase(0,0, false);
                return;
            }
      
            if(!player1.checkAcquired(currPos)){
                player1.setNewPantsToBasket(currPos);
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
     
            this.setOnClickEventListener(mainMapLayer.ItemArrowIcon,   this.gotoNextPhase, 0);
            this.setOnClickEventListener(mainMapLayer.ItemPoliceIcon,  this.gotoNextPhase, 1); 
            this.setOnClickEventListener(mainMapLayer.ItemPeopleIcon,  this.gotoNextPhase, 2);   
        }
        selectItemPhase.onExit = function(){
            cc.log("onExit Select Item Phase");
            mainMapLayer.removeItemCard();
        }
        //////////// ▲SelectItemPhase▲ ////////////
        
        //////////// ▼RotateAllAllowPhase▼ ////////////
        rotateAllAllowPhase.nextPhase[0] = actionChoicePhase;
        rotateAllAllowPhase.onEnter = function(){
            cc.log("onEnter Rotate All Arrow Phase");
            if(player1.isAlreadyUse(ITEM.ARROW)){
                mainMapLayer.textConsole("使用済みです");
                this.gotoNextPhase(0,1000, false);
                return;
            }
            mainMapLayer.rotateAllArrowClockwise();
            player1.useItem(ITEM.ARROW);
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
            if(player1.isAlreadyUse(ITEM.POLICE)){
                mainMapLayer.textConsole("使用済みです");
                this.gotoNextPhase(0,1000, false);
                return;
            }
            var num = castDice();
            mainMapLayer.playDiceAnimation(num);
            mainMapLayer.movePolice(num, function(currPos){
                this.checkIfForfeitPosition(currPos);
            }, player1);
            player1.useItem(ITEM.POLICE);
            this.gotoNextPhase(0,1200*num, true);
        }
        movePolicePhase.onExit = function(){
            cc.log("onExit Move Police Phase");
        }
        //////////// ▲Move Police Phase▲ ////////////
        
        //////////// ▼Move People Phase▼ ////////////
        movePeoplePhase.nextPhase[0] = actionChoicePhase;
        movePeoplePhase.onEnter = function(){
            cc.log("onEnter Move People Phase");
            if(player1.isAlreadyUse(ITEM.PEOPLE)){
                mainMapLayer.textConsole("使用済みです");
                this.gotoNextPhase(0,1000, false);
                return;
            }
            var num = castDice();
            mainMapLayer.playDiceAnimation(num);
            player1.useItem(ITEM.PEOPLE);
            this.gotoNextPhase(0,1000, true);
        }
        movePeoplePhase.onExit = function(){
            cc.log("onExit Move People Phase");
        }
        
        //////////// ▲Move People Phase▲ ////////////
        
        //////////// ▼Player Phase▼ ////////////
        playerPhase.nextPhase[0] = comPhase;
        playerPhase.setchildEntryPoint( actionChoicePhase );
        playerPhase.onEnter = function(){
            cc.log("onEnter Player Phase");
            
            this.gotoChildPhase(0);
        }
        playerPhase.onExit = function(){
            cc.log("onExit Player Phase");
        }
        //////////// ▲Player Phase▲ ////////////
        
        //////////// ▼Com Phase▼ ////////////
        comPhase.nextPhase[0]  = playerPhase;
        comPhase.onEnter = function(){
            cc.log("onEnter Com Phase");
            mainMapLayer.textConsole("警察が動きます。");
            
            var num = castDice();
            mainMapLayer.playDiceAnimation(num);
            mainMapLayer.movePolice(num, function(currPos){
                this.checkIfForfeitPosition(currPos);
            }, player1);
            this.gotoNextPhase(0,1200*num, false);
        }
        comPhase.onExit = function(){
            cc.log("onExit Com Phase");
        }
        //////////// ▲Com Phase▲ ////////////
        
        //////////// Phase Entry Point ////////////
        playerPhase.onEnter();
    }
});
