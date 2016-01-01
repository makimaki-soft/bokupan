mkmk.phases.collectPantsPhase.attr({

    nextPhase : [mkmk.phases.actionChoicePhase]
       
  , onEnter : function(){
        cc.log("onEnter Collect Pants Phase");
        var self = this;
        var mainMapLayer = this.layers.mainMapLayer;
        var gameStatusLayer = this.layers.gameStatusLayer;
        var currPlayer = gameStatus.getCurrPlayer();
        var currPos = currPlayer.getCurrPosition();
        
        if(!isTargetHome(currPos)){
            self.gotoNextPhase(0,0, false);
            return;
        }
    
        if(!currPlayer.checkAcquired(currPos)){
            currPlayer.setNewPantsToBasket(currPos);
            mainMapLayer.textConsole("取得しました");
            gameStatusLayer.updateMsg(currPlayer.playerName + "さんがパンツを取得しました。");
            self.gotoNextPhase(0,1000, true);
        }else{
            mainMapLayer.textConsole("取得済みです");
            gameStatusLayer.updateMsg("取得済みです。");
            self.gotoNextPhase(0,1000, false);
        }
        
        if(currPlayer.checkIfForfeitPosition(bkpn.police.getCurrPosition())) { //警察と接触
            mainMapLayer.playCutinAnimation(res.CutinForfeitPolice);
            mainMapLayer.resetPlayerPosition(currPlayer);
            cc.log("逮捕!!");
            gameStatusLayer.updateMsg(currPlayer.playerName + "さんが逮捕されました。");
        }
        else if(currPlayer.checkIfForfeitPosition(bkpn.girl.currPos)) { // 住人に見つかる
            mainMapLayer.playCutinAnimation(getGirlCutinResouce(bkpn.girl.currPos));
            mainMapLayer.resetPlayerPosition(currPlayer);
            cc.log("通報!!");
            gameStatusLayer.updateMsg(currPlayer.playerName + "さんが通報されました。");
        }
    }
    
  , onExit : function(){
        cc.log("onExit Collect Pants Phase");
    }



});