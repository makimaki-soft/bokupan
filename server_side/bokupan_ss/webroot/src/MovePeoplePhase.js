mkmk.phases.movePeoplePhase.attr({
    
    nextPhase : [mkmk.phases.actionChoicePhase]
        
  , onEnter : function(){
        cc.log("onEnter Move People Phase");
        var self = this;
        var mainMapLayer     = this.layers.mainMapLayer;
        var gameStatusLayer  = this.layers.gameStatusLayer;
        
        var currPlayer = gameStatus.getCurrPlayer();
        
        if(currPlayer.isAlreadyUse(ITEM.PEOPLE)){
            mainMapLayer.textConsole("使用済みです");
            gameStatusLayer.updateMsg("使用済みです。");
            this.gotoNextPhase(0,1000, false);
            return;
        }
        
        cc.eventManager.addCustomListener(Helper.LABEL.CHOOSE_HOME,function (event) {
            cc.log(event.getUserData());
            var nextHome = event.getUserData().home;  
            var allplayers = gameStatus.getAllPlayers();
            
            for( var i=0 ; i<allplayers.length ; i++){
                if( allplayers[i].checkIfForfeitPosition(nextHome) ){ // 通報
                    mainMapLayer.playCutinAnimation(getGirlCutinResouce(nextHome));
                    mainMapLayer.resetPlayerPosition(allplayers[i]);
                    cc.log("通報!!");
                    gameStatusLayer.updateMsg(allplayers[i].playerName + "さんが通報されました。");
                }
            }
            
            mainMapLayer.moveGirl(nextHome);
            bkpn.girl.setPos(nextHome);
            self.gotoNextPhase(0,1000, true);
        });
        
        if(currPlayer.isMe()){
            var home = chooseHome();
            var home_action = {"home":home};
            rtc_manager.send(rtc_helper.encode(Helper.LABEL.CHOOSE_HOME, home_action));
            cc.eventManager.dispatchCustomEvent(Helper.LABEL.CHOOSE_HOME, home_action);
        }
        currPlayer.useItem(ITEM.PEOPLE);
    }
    
  , onExit : function(){
        cc.log("onExit Move People Phase");
        cc.eventManager.removeCustomListeners(Helper.LABEL.CHOOSE_HOME);
    }
});