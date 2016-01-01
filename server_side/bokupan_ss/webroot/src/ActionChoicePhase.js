mkmk.phases.actionChoicePhase.attr({
    
    nextPhase : [
          mkmk.phases.rotateAllowPhase
        , mkmk.phases.playerMovePhase
        , mkmk.phases.collectPantsPhase
        , mkmk.phases.selectItemPhase
    ]
    
    , onEnter : function(){
            cc.log("onEnter Action Choice Phase");
            var self = this;
            var menuLayer    = this.layers.menuLayer;
            var mainMapLayer = this.layers.mainMapLayer;
            
            var currPlayer = gameStatus.getCurrPlayer();
            menuLayer.updateGameStatusText(currPlayer);
            
            // 終了判定
            if( currPlayer.checkIfUpdateContainer() ){
                // 未対応
                terminateBokupan();
            }
            
            mainMapLayer.setCurrPlayerCursor(currPlayer);
            
            if(currPlayer.isMe() && gameStatus.winner == -1 ){
                menuLayer.setMoveMenuEnable(true);
                menuLayer.setRotateMenuEnable(isIntersectionWithArrow(currPlayer.getCurrPosition()));
                menuLayer.setCollectMenuEnable(isTargetHome(currPlayer.getCurrPosition()));
                menuLayer.setItemMenuEnable(!currPlayer.isAlreadyUseAll());
            }
            
            cc.eventManager.addCustomListener(Helper.LABEL.ARROW_BUTTON ,function (event) {
                    cc.log(event.getUserData());  
                    self.gotoNextPhase(0);
                });
            
            cc.eventManager.addCustomListener(Helper.LABEL.MOVE_BUTTON,function (event) {
                    cc.log(event.getUserData());  
                    self.gotoNextPhase(1);
                });
            cc.eventManager.addCustomListener(Helper.LABEL.GET_BUTTON,function (event) {
                    cc.log(event.getUserData());  
                    self.gotoNextPhase(2);
                });

            cc.eventManager.addCustomListener(Helper.LABEL.ITEM_BUTTON ,function (event) {
                    cc.log(event.getUserData());  
                    self.gotoNextPhase(3);
                });
                
            // this.setOnClickEventListener(menuLayer.rotateIcon,  this.gotoNextPhase, 0);
            // this.setOnClickEventListener(menuLayer.moveIcon,    this.gotoNextPhase, 1);
            // this.setOnClickEventListener(menuLayer.CollectIcon, this.gotoNextPhase, 2);
            // this.setOnClickEventListener(menuLayer.ItemIcon,    this.gotoNextPhase, 3);
        }
        
      , onExit : function(){
            cc.log("onExit Action Choice Phase");
            var self = this;
            var menuLayer    = this.layers.menuLayer;
            var mainMapLayer = this.layers.mainMapLayer;
            
            menuLayer.setMoveMenuEnable(false);
            menuLayer.setRotateMenuEnable(false);
            menuLayer.setCollectMenuEnable(false);
            menuLayer.setItemMenuEnable(false);
            
            mainMapLayer.removeCurrPlayerCursor();
            
            cc.eventManager.removeCustomListeners(Helper.LABEL.ARROW_BUTTON);
            cc.eventManager.removeCustomListeners(Helper.LABEL.MOVE_BUTTON);
            cc.eventManager.removeCustomListeners(Helper.LABEL.GET_BUTTON);
            cc.eventManager.removeCustomListeners(Helper.LABEL.ITEM_BUTTON);
        }
});