

var Mkmk_MenuItemImage = cc.MenuItemImage.extend({
    ctor:function (normalImage, selectedImage, callback, target) {
        this.target = target;
        this.firstCallBack = callback;
        this._super(normalImage, selectedImage, this.firstCallBack, target);
    }
  
 , addCondition:function(fnc,obj){
      this.setCallback(function(sender){
          if(sender.firstCallBack){
            sender.firstCallBack.call(this);
          }
          fnc.call(obj);
      },this.target);
  } 
});



function Mkmk_Phase() {
    this.onEnter = function(){
      cc.log("onEnter");
    };
    this.onExit = function(){
      cc.log("onExit");
    };
    this.setOnEnterEvent = function(item){
        item.addStartCondition(this.onEnter);
    };
    this.setOnExitEvent = function(item){
        item.addEndCondition(this.onExit);
    };
    this.setClickEventListener = function(item,fnc){
        item.addCondition(fnc,this);
    };
    this.gotoNextPhase = function(delay_msec){
      this.onExit();
      var tmp = this;
      setTimeout(function(){
        tmp.nextPhase.onEnter.call(tmp.nextPhase);
      }, delay_msec);
    }
}

