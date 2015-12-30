var GameStatusLayer = cc.LayerColor.extend({
    sprite:null
    , statusLabel: null
    , ctor:function (color,w,h) {
        this._super(color,w,h);

        // 背景画像を配置
        var _sprite = new cc.Sprite(res.MessegeWindow);
        _sprite.attr({
            scaleX: 400/_sprite.width,
            scaleY: 50/_sprite.height,
            x: 0,
            y: 8,
            anchorX: 0,
            anchorY: 0
        });
        this.addChild(_sprite, 0);

        statusLabel = cc.LabelTTF.create("ゲーム開始までお待ち下さい。","Meiryo",22);
        statusLabel.attr({
            x: 10,
            y: 15,
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