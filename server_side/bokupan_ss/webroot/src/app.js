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
        var actionChoicePhase   = new Mkmk_Phase();
        var playerMovePhase     = new Mkmk_Phase();
        var rotateAllowPhase    = new Mkmk_Phase();
        var collectPantsPhase   = new Mkmk_Phase();
        var selectItemPhase     = new Mkmk_Phase();
        var rotateAllAllowPhase = new Mkmk_Phase();
        var movePolicePhase     = new Mkmk_Phase();
        var movePeoplePhase     = new Mkmk_Phase();
        
        
        
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
            
            cc.eventManager.addCustomListener(LABEL.ARROW_BUTTON ,function (event) {
                    cc.log(event.getUserData());  
                    actionChoicePhase.gotoNextPhase(0);
                });
            
            cc.eventManager.addCustomListener(LABEL.MOVE_BUTTON,function (event) {
                    cc.log(event.getUserData());  
                    actionChoicePhase.gotoNextPhase(1);
                });
            cc.eventManager.addCustomListener(LABEL.GET_BUTTON,function (event) {
                    cc.log(event.getUserData());  
                    actionChoicePhase.gotoNextPhase(2);
                });
                
            // this.setOnClickEventListener(menuLayer.rotateIcon,  this.gotoNextPhase, 0);
            // this.setOnClickEventListener(menuLayer.moveIcon,    this.gotoNextPhase, 1);
            // this.setOnClickEventListener(menuLayer.CollectIcon, this.gotoNextPhase, 2);
            this.setOnClickEventListener(menuLayer.ItemIcon,    this.gotoNextPhase, 3);
        }
        actionChoicePhase.onExit = function(){
            cc.log("onExit Action Choice Phase");
            menuLayer.setMoveMenuEnable(false);
            menuLayer.setRotateMenuEnable(false);
            menuLayer.setCollectMenuEnable(false);
            menuLayer.setItemMenuEnable(false);
            
            cc.eventManager.removeCustomListeners(LABEL.ARROW_BUTTON);
            cc.eventManager.removeCustomListeners(LABEL.MOVE_BUTTON);
            cc.eventManager.removeCustomListeners(LABEL.GET_BUTTON);
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
                        
                        rtc_manager.send({"label":LABEL.TOUCH,
                                          "touchX" :touch.getLocationX(),
                                          "touchY" :touch.getLocationY()
                                          });
                                          
                        cc.eventManager.dispatchCustomEvent(LABEL.TOUCH,{
                                                        "touchX" :touch.getLocationX(),
                                                        "touchY" :touch.getLocationY()});
                    }
                });
                cc.eventManager.addListener(playerMovePhase.ev,mainMapLayer);
            }
            
            cc.eventManager.addCustomListener(LABEL.TOUCH,function (event) {
                    cc.log(event.getUserData());
                    var touch = event.getUserData();
                    var touchX = touch.touchX;
                    var touchY = touch.touchY;
                    if(mainMapLayer.isInside(touchX, touchY)){
                        var dir = mainMapLayer.getRelativeDirection(currID, touchX,touchY);
                        var res = mainMapLayer.movePlayer(currID, dir);
                        if(res){
                            playerMovePhase.gotoNextPhase(0, 1000);
                        }
                    }
                });
        };
        playerMovePhase.onExit = function(){
            cc.log("onExit Move Phase");
            cc.eventManager.removeListener(playerMovePhase.ev);
            cc.eventManager.removeCustomListeners(LABEL.TOUCH);
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
                        
                        rtc_manager.send({"label":LABEL.TOUCH,
                                            "touchX" :touch.getLocationX(),
                                            "touchY" :touch.getLocationY()
                                            });
                                            
                        cc.eventManager.dispatchCustomEvent(LABEL.TOUCH,{
                                                        "touchX" :touch.getLocationX(),
                                                        "touchY" :touch.getLocationY()});
                    }
                });
                cc.eventManager.addListener(rotateAllowPhase.ev,mainMapLayer);
            }
            
            cc.eventManager.addCustomListener(LABEL.TOUCH,function (event) {
                    cc.log(event.getUserData());
                    var touch = event.getUserData();
                    var touchX = touch.touchX;
                    var touchY = touch.touchY;
                    
                    if(mainMapLayer.isInside(touchX, touchY)){
                        // var closestAllow = mainMapLayer.getClosestPosition(touchX,touchY);
                        var dir = mainMapLayer.getRelativeDirectionAllow(targetArrow, touchX,touchY);
                        var res = mainMapLayer.rotateAllow(targetArrow, dir);
                        if(res){
                            rotateAllowPhase.gotoNextPhase(0,1000);
                        }
                    }
                    
                });
        }
        rotateAllowPhase.onExit = function(){
            cc.log("onExit Rotate Phase");
            cc.eventManager.removeCustomListeners(LABEL.TOUCH);
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
                collectPantsPhase.gotoNextPhase(0,0);
                return;
            }
      
            if(!currPlayer.checkAcquired(currPos)){
                currPlayer.setNewPantsToBasket(currPos);
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
            
            var currPlayer = gameStatus.getCurrPlayer();
            
            if(currPlayer.isAlreadyUse(ITEM.ARROW)){
                mainMapLayer.textConsole("使用済みです");
                this.gotoNextPhase(0,1000);
                return;
            }
            mainMapLayer.rotateAllArrowClockwise();
            currPlayer.useItem(ITEM.ARROW);
            this.gotoNextPhase(0,1000);
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
                this.gotoNextPhase(0,1000);
                return;
            }
            var num = castDice();
            mainMapLayer.playDiceAnimation(num);
            mainMapLayer.movePolice(num);
            currPlayer.useItem(ITEM.POLICE);
            this.gotoNextPhase(0,2000);
        }
        movePolicePhase.onExit = function(){
            cc.log("onExit Move Police Phase");
        }
        //////////// ▲Move Police Phase▲ ////////////
        
        //////////// ▼Move People Phase▼ ////////////
        movePeoplePhase.nextPhase[0] = actionChoicePhase;
        movePeoplePhase.onEnter = function(){
            cc.log("onEnter Move People Phase");
            
            var currPlayer = gameStatus.getCurrPlayer();
            
            if(currPlayer.isAlreadyUse(ITEM.PEOPLE)){
                mainMapLayer.textConsole("使用済みです");
                this.gotoNextPhase(0,1000);
                return;
            }
            var num = castDice();
            mainMapLayer.playDiceAnimation(num);
            currPlayer.useItem(ITEM.PEOPLE);
            this.gotoNextPhase(0,2000);
        }
        movePeoplePhase.onExit = function(){
            cc.log("onExit Move People Phase");
        }
        
        //////////// ▲Move People Phase▲ ////////////
        
        //////////// Phase Entry Point ////////////
        
        // 
        
        rtc_manager.setReceiveAction(function(peerID, data){
            // cc.log(peerID,data);
            switch(data.label){
                case "NEW_PLAYER":
                    // プレイヤーが参加する。
                    if( rtc_manager.isHost ){
                        var newID = gameStatus.getNewPlayerID();
                        var firstPos = [POSITION_ID.HOME_A, POSITION_ID.HOME_B, POSITION_ID.HOME_C, POSITION_ID.HOME_D];
                        var newPlayer = new Mkmk_PlayerStatus(newID, "Tezuka", firstPos[newID], peerID);
                        mainMapLayer.setPlayer(newPlayer);
                        gameStatus.addPlayer(newPlayer);
                        mainMapLayer.textConsole("プレイヤーが参加しました。");
                        
                        // 相手のIDを教えてやる。
                        rtc_manager.send({  "label"  : "NEW_PLAYER",
                                            "id"     : newID,
                                            "peerID" : peerID
                                    });
                   　}else{
                       var newID = data.id;
                       var firstPos = [POSITION_ID.HOME_A, POSITION_ID.HOME_B, POSITION_ID.HOME_C, POSITION_ID.HOME_D];
                       var newPlayer = new Mkmk_PlayerStatus(newID, "Tezuka", firstPos[newID], data.peerID);
                       mainMapLayer.setPlayer(newPlayer);
                       gameStatus.addPlayer(newPlayer);
                       mainMapLayer.textConsole("プレイヤーが参加しました。");
                       
                       var hostPlayer = new Mkmk_PlayerStatus(0 , "Tezuka", firstPos[0], peerID);
                       mainMapLayer.setPlayer(hostPlayer);
                       gameStatus.addPlayer(hostPlayer);
                    }
                    
                    // 人数が集まったらゲームを開始する。
                    if( gameStatus.players.length == 2 ){
                        actionChoicePhase.onEnter();
                    }
                    break;
                case LABEL.TOUCH:
                    cc.eventManager.dispatchCustomEvent(LABEL.TOUCH,{
                                                        "touchX" :data.touchX,
                                                        "touchY" :data.touchY});
                    break;
                default:
                    cc.eventManager.dispatchCustomEvent(data.label);
                    cc.log(data);
                    break;
            }    
        });
        
        ////////////  Define Players //////////// 
        if(rtc_manager.isHost){
            var player1 = new Mkmk_PlayerStatus(0, "Tezuka", POSITION_ID.HOME_A, rtc_manager.getmyid());
            menuLayer.setPlayer(player1);
            mainMapLayer.setPlayer(player1);
            gameStatus.addPlayer(player1);
        }else{
            rtc_manager.send({ "label":"NEW_PLAYER" });
        }
    }
});
