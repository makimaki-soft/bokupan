mkmk.phases.rotateAllAllowPhase.attr({
    
    nextPhase : [ mkmk.phases.actionChoicePhase ]
  
  , onEnter : function(){
        cc.log("onEnter Rotate All Arrow Phase");
        var self = this;
        var mainMapLayer = this.layers.mainMapLayer;
        var gameStatusLayer = this.layers.gameStatusLayer;
        var currPlayer = gameStatus.getCurrPlayer();
        
        if(currPlayer.isAlreadyUse(ITEM.ARROW)){
            mainMapLayer.textConsole("使用済みです");
            gameStatusLayer.updateMsg("使用済みです。");

            self.gotoNextPhase(0,1000, false);
            return;
        }
        mainMapLayer.rotateAllArrowClockwise();
        currPlayer.useItem(ITEM.ARROW);
        self.gotoNextPhase(0,1000, true);
    }
    
  , onExit : function(){
        cc.log("onExit Rotate All Arrow Phase");
    }
});