var MainMapLayer = cc.LayerColor.extend({
    sprite:null,
    ctor:function (color,w,h) {
        this._super(color,w,h);
		
        // add MainMap splash screen"
        this.sprite = new cc.Sprite(res.MainMap_png);
      
        this.sprite.attr({
            scaleX: this.width/this.sprite.width,
            scaleY: this.height/this.sprite.height,
            x: 0,
            y: 0,
            anchorX: 0,
            anchorY: 0
        });
        
        this.addChild(this.sprite, 0);
                
        return true;
    }
});
