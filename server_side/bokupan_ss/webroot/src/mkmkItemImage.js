var Mkmk_MenuItemImage = cc.MenuItemImage.extend({
    ctor:function (normalImage, selectedImage, label, callback, target) {
        this.target = target;
        this.CallBackOrg = function(){
          rtc_manager.send(rtc_helper.encode(label, {}));
          cc.eventManager.dispatchCustomEvent(label);
        };
        
        this._super(normalImage, selectedImage, this.CallBackOrg, target);
    }
});
