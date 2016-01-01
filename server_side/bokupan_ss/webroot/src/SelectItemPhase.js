mkmk.phases.selectItemPhase.attr({
    
    nextPhase : [ mkmk.phases.rotateAllAllowPhase,
                  mkmk.phases.movePolicePhase,
                  mkmk.phases.movePeoplePhase
                ]
                  
  , onEnter : function(){
        cc.log("onEnter Select Item Phase");
        var self = this;
        var mainMapLayer = this.layers.mainMapLayer;
        mainMapLayer.addItemCard();

        cc.eventManager.addCustomListener(Helper.LABEL.ITEM_ARROW ,function (event) {
                cc.log(event.getUserData());  
                self.gotoNextPhase(0);
            });
        cc.eventManager.addCustomListener(Helper.LABEL.ITEM_POLICE ,function (event) {
                cc.log(event.getUserData());  
                self.gotoNextPhase(1);
            });
        cc.eventManager.addCustomListener(Helper.LABEL.ITEM_PEOPLE ,function (event) {
                cc.log(event.getUserData());  
                self.gotoNextPhase(2);
            });
    }
    
  , onExit : function(){
        cc.log("onExit Select Item Phase");
        var mainMapLayer = this.layers.mainMapLayer;
        cc.eventManager.removeCustomListeners(Helper.LABEL.ITEM_ARROW);
        cc.eventManager.removeCustomListeners(Helper.LABEL.ITEM_POLICE);
        cc.eventManager.removeCustomListeners(Helper.LABEL.ITEM_PEOPLE);
        mainMapLayer.removeItemCard();
    }
});