var Mkmk_MenuItemImage = cc.MenuItemImage.extend({
    ctor:function (normalImage, selectedImage, callback, target) {
        this.target = target;
        this.CallBackOrg = callback;
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

function Mkmk_Phase() {
    this.nextPhase = [];
    this.onEnter = function(){
      cc.log("onEnter");
    };
    this.onExit = function(){
      cc.log("onExit");
    };
    this.setOnClickEventListener = function(mkmk_menuitem,fnc, id){
        mkmk_menuitem.addCallbackFunc(fnc,this, id);
    };
    this.gotoNextPhase = function(id, delay_msec){
      this.onExit();
      var nextPhase = this.nextPhase[id];
      setTimeout(function(){
        nextPhase.onEnter();
      }, delay_msec);
    }

    //ステータスを更新

}
