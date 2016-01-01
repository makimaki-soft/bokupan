mkmk.phases.playerMovePhase.attr({

    nextPhase : [mkmk.phases.actionChoicePhase]
  
  , onEnter : function(){
        cc.log("onEnter Move Phase");
        var self = this;
        var mainMapLayer = this.layers.mainMapLayer;
            
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
            cc.eventManager.addListener(self.ev,mainMapLayer);
        }
        
        cc.eventManager.addCustomListener(Helper.LABEL.TOUCH,function (event) {
                cc.log(event.getUserData());
                var touch = event.getUserData();
                var touchX = touch.touchX;
                var touchY = touch.touchY;
                var girl   = bkpn.girl;

                if(mainMapLayer.isInside(touchX, touchY)){
                    var dir = mainMapLayer.getRelativeDirection(currID, touchX,touchY);
                    var result = mainMapLayer.movePlayer(currID, dir, function(currPos){
                        if(this.checkIfForfeitPosition(currPos)) { // 警察と接触
                            mainMapLayer.playCutinAnimation(res.CutinForfeitPolice);
                            mainMapLayer.resetPlayerPosition(this);
                            cc.log("逮捕!!");
                            gameStatusLayer.updateMsg(this.playerName + "さんが逮捕されました。");
                        }
                        else if(this.checkIfForfeitPosition(girl.currPos)) { // 住人に見つかる
                            mainMapLayer.playCutinAnimation(getGirlCutinResouce(girl.currPos));
                            mainMapLayer.resetPlayerPosition(this);
                            cc.log("通報!!");
                            gameStatusLayer.updateMsg(this.playerName + "さんが通報されました。");
                        }
                    }, currPlayer);
                    if(result){
                        var delay = 1000;
                        var police = bkpn.police;
                        if( currPlayer.checkIfForfeitPositionWithoutStatusChange(police.getCurrPosition()) ){
                            delay += 1000;
                        }
                        else if( currPlayer.checkIfForfeitPositionWithoutStatusChange(girl.currPos)){
                            delay += 1000;
                        }
                        self.gotoNextPhase(0, delay, true);
                    }
                }
            });
    }
    
  , onExit : function(){
        cc.log("onExit Move Phase");
        var self = this;
        var mainMapLayer = this.layers.mainMapLayer;
        
        cc.eventManager.removeListener(self.ev);
        cc.eventManager.removeCustomListeners(Helper.LABEL.TOUCH);
        mainMapLayer.removeCursor();
    }
});