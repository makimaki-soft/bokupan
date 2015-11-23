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

var playCnt = 2;

function Mkmk_Phase() {
    this.nextPhase = [];
    this.childPhase = null;
    this.parentPhase = null;
    this.onEnter = function(){
      cc.log("onEnter");
    };
    this.onExit = function(){
      cc.log("onExit");
    };
    this.setOnClickEventListener = function(mkmk_menuitem,fnc, id){
        mkmk_menuitem.addCallbackFunc(fnc,this, id);
    };
    this.gotoNextPhase = function(id, delay_msec, bDec){
      this.onExit();
      var nextPhase = this.nextPhase[id];
      nextPhase.setParentEntoryPoint(this.parentPhase);
      
      if(bDec){
        playCnt--;
      }
      
      if( playCnt == 0 ){
        playCnt = 2;
        var parentPhase = this.parentPhase;
        parentPhase.gotoNextPhase(0, delay_msec+1500, false);
      } else{ 
        setTimeout(function(){
          nextPhase.onEnter();
        }, delay_msec);
      }
    }
    this.setchildEntryPoint = function(childPhase){
        this.childPhase = childPhase;
    };
    this.setParentEntoryPoint = function(parentPhase){
        this.parentPhase = parentPhase;
    };
    this.gotoChildPhase = function(delay_msec){
      var nextPhase = this.childPhase;
      nextPhase.setParentEntoryPoint(this);
      setTimeout(function(){
        nextPhase.onEnter();
      }, delay_msec);
    };
    //ステータスを更新

}
