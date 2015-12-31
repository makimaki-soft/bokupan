var Mkmk_MenuItemImage = cc.MenuItemImage.extend({
    ctor:function (normalImage, selectedImage, label, callback, target) {
        this.target = target;
        this.CallBackOrg = function(){
          rtc_manager.send(rtc_helper.encode(label, {}));
          cc.eventManager.dispatchCustomEvent(label);
        };
        
        this._super(normalImage, selectedImage, this.CallBackOrg, target);
    }
  
 , addCallbackFunc:function(  fnc,    // callBack
                              target, // "this" of callBack
                              id      // condition ID
 ){
      this.setCallback(function(sender){
          // sender には setCallback をcallしたオブジェクトが入る
          if(sender.CallBackOrg){
            // コンストラクタ呼び出し時のtargetでcallBackをcall
            sender.CallBackOrg.call(this);
          }
          // 追加のcallBackをcall
          fnc.call(target, id, 0);
      },this.target);
  } 
});
