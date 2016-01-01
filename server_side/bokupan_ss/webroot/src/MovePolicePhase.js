mkmk.phases.movePolicePhase.attr({
    
    nextPhase : [mkmk.phases.actionChoicePhase]
    
  , onEnter : function(){
        cc.log("onEnter Move Police Phase");
        var self = this;
        var mainMapLayer     = this.layers.mainMapLayer;
        var gameStatusLayer  = this.layers.gameStatusLayer;
        
        var currPlayer = gameStatus.getCurrPlayer();
        
        if(currPlayer.isAlreadyUse(ITEM.POLICE)){
            mainMapLayer.textConsole("使用済みです");
            gameStatusLayer.updateMsg("使用済みです。");
            this.gotoNextPhase(0,1000, false);
            return;
        }
        
        cc.eventManager.addCustomListener(Helper.LABEL.CAST_DICE,function (event) {
            cc.log(event.getUserData());
            
            var allplayers = gameStatus.getAllPlayers();
            var num1 = event.getUserData().roll1;
            mainMapLayer.playDiceAnimation(num1, 0);
            var num2 = event.getUserData().roll2;
            mainMapLayer.playDiceAnimation(num2, 80);
            mainMapLayer.movePolice((num1+num2), function(currPos){
                for( var i=0 ; i<this.length ; i++ ){
                    if(this[i].checkIfForfeitPosition(currPos)) {
                        mainMapLayer.playCutinAnimation(res.CutinForfeitPolice);
                        mainMapLayer.resetPlayerPosition(this[i]);
                        cc.log("逮捕!!");
                        gameStatusLayer.updateMsg(this[i].playerName + "さんが逮捕されました。");
                    }
                }
            }, allplayers);
            self.gotoNextPhase(0,1200*(num1+num2), true);
        });
        
        if(currPlayer.isMe()){
            var roll1 = castDice();
            var roll2 = castDice();
            var roll_action = {"roll1":roll1, "roll2":roll2};
            rtc_manager.send(rtc_helper.encode(Helper.LABEL.CAST_DICE, roll_action));
            cc.eventManager.dispatchCustomEvent(Helper.LABEL.CAST_DICE, roll_action);
        }
        currPlayer.useItem(ITEM.POLICE);
    }
        
  , onExit : function(){
        cc.log("onExit Move Police Phase");
        cc.eventManager.removeCustomListeners(Helper.LABEL.CAST_DICE);
    }

});