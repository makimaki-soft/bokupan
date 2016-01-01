mkmk.phases.rotateAllowPhase.attr({
    nextPhase : [mkmk.phases.actionChoicePhase]
  
  , onEnter : function(){
        cc.log("onEnter Rotate Phase");
        // mainMapLayer.addCursorToAllows();
        var self = this;
        var mainMapLayer = this.layers.mainMapLayer;
        
        var currPlayer = gameStatus.getCurrPlayer();
        
        var targetArrow = getArrowByRoadPosition(currPlayer.getCurrPosition());
        mainMapLayer.addCursorToArrow(targetArrow);
        if(currPlayer.isMe()){
            self.ev = cc.EventListener.create({
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
            cc.eventManager.addListener(self.ev,mainMapLayer);
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
                        self.gotoNextPhase(0,1000, true);
                    }
                }
                
            });
    }
  
  , onExit : function(){
        cc.log("onExit Rotate Phase");
        var self = this;
        var mainMapLayer = this.layers.mainMapLayer;
        cc.eventManager.removeCustomListeners(Helper.LABEL.TOUCH);
        cc.eventManager.removeListener(self.ev);
        mainMapLayer.removeCursorAllow();
  }
});