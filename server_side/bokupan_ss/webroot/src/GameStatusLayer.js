var GameStatusLayer = cc.LayerColor.extend({
    sprite:null
    , statusLabel: null
    , ctor:function (color,w,h) {
        this._super(color,w,h);
        statusLabel = cc.LabelTTF.create("ゲーム開始までお待ち下さい。","Meiryo",28);
        statusLabel.attr({
            x: 0,
            y: 0,
            anchorX: 0,
            anchorY: 0
        });
        this.addChild(statusLabel, 0);
        return true;
    }
    , updateMsg: function(msg) {
        statusLabel.setString(msg);
        this.scheduleOnce(function(){
           statusLabel.setString("");
        }, 1.0);
    }
});