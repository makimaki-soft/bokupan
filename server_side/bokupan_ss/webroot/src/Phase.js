var mkmk = mkmk || {};

var playCnt = 2;

mkmk.Phase = function() {
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
        var nextIdx = parentPhase.nextPhaseIdx;
        parentPhase.gotoNextPhase(nextIdx, delay_msec+1500, false);
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

/**
 * Phaseのインスタンス
 * @type {Object}
 */
mkmk.phases = (function(){

    var phase = {};
    var list = mkmk.phaseList.list;

    for(var key in list) {
        phase[list[key]] = new mkmk.Phase();
    }

    return phase;
}());