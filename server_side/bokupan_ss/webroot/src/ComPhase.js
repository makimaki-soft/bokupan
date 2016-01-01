mkmk.phases.comPhase.attr({
    
    nextPhase : [mkmk.phases.playerPhase]
    
  , onEnter : function(){
        cc.log("onEnter Com Phase");
        this.nextPhaseIdx = 0;
        var currPlayer = gameStatus.getCurrPlayer();
        
        var self = this;
        var mainMapLayer = this.layers.mainMapLayer;
        var gameStatusLayer = this.layers.gameStatusLayer;
        
        cc.eventManager.addCustomListener(Helper.LABEL.TWO_CHOICE,function (event) {
            cc.log(event.getUserData());
            var isPolicePhase = event.getUserData().isPolice;
            
            if(isPolicePhase){
                mainMapLayer.textConsole("警察が動きます。");
                gameStatusLayer.updateMsg("警察が動きます。");
                var allplayers = gameStatus.getAllPlayers();
                var num1 = event.getUserData().roll1;
                mainMapLayer.playDiceAnimation(num1, 0);
                var num2 = event.getUserData().roll2;
                mainMapLayer.playDiceAnimation(num2, 80);

                mainMapLayer.movePolice(num1+num2, function(currPos){
                    for( var i=0 ; i<this.length ; i++ ){
                        if(this[i].checkIfForfeitPosition(currPos)){
                            mainMapLayer.playCutinAnimation(res.CutinForfeitPolice);
                            mainMapLayer.resetPlayerPosition(this[i]);
                            cc.log("逮捕!!");
                            gameStatusLayer.updateMsg(this[i].playerName + "さんが逮捕されました。");
                        }
                    }
                }, allplayers);
                self.gotoNextPhase(0,1200*(num1+num2), false);
            }else{
                mainMapLayer.textConsole("住人が動きます。");
                gameStatusLayer.updateMsg("住人が動きます。");
                
                var nextHome = event.getUserData().home;  
                var allplayers = gameStatus.getAllPlayers();
            
                for( var i=0 ; i<allplayers.length ; i++){
                    if( allplayers[i].checkIfForfeitPosition(nextHome) ){
                        mainMapLayer.playCutinAnimation(getGirlCutinResouce(nextHome));
                        mainMapLayer.resetPlayerPosition(allplayers[i]);
                        cc.log("通報!!");
                        gameStatusLayer.updateMsg(allplayers[i].playerName + "さんが通報されました。");
                    }
                }

                mainMapLayer.moveGirl(nextHome);
                bkpn.girl.setPos(nextHome);
                self.gotoNextPhase(0,1100, false);
            }
        });
        
        if(currPlayer.isMe()){
            var isPolicePhase = twoChoice();
            var roll_action;
            
            if( isPolicePhase ){
                var roll1 = castDice();
                var roll2 = castDice();
                roll_action = {"isPolice":isPolicePhase, "roll1":roll1, "roll2":roll2};
            }else{
                var home = chooseHome();
                roll_action = {"isPolice":isPolicePhase, "home":home };
            }
            rtc_manager.send(rtc_helper.encode(Helper.LABEL.TWO_CHOICE, roll_action));
            cc.eventManager.dispatchCustomEvent(Helper.LABEL.TWO_CHOICE, roll_action);
        }
    }
    
  , onExit : function(){
        cc.log("onExit Com Phase");
        cc.eventManager.removeCustomListeners(Helper.LABEL.TWO_CHOICE);
    }
});