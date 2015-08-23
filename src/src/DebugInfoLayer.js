var DebugInfoLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        this._super();
		        
        this.windowsize = new cc.LabelTTF("","Arial",30);
        this.windowsize.attr({
            x: 0,
            y: 0,
            anchorX: 0,
            anchorY: 0
        });
        //this.windowsize.setFontFillColor(cc.color(10,10,10,0));
        this.addChild(this.windowsize,0);   
        
        this.canvassize = new cc.LabelTTF("","Arial",30);
        this.canvassize.attr({
            x: 0,
            y: this.windowsize.getFontSize(),
            anchorX: 0,
            anchorY: 0
        });
        //this.windowsize.setFontFillColor(cc.color(10,10,10,0));
        this.addChild(this.canvassize,0);   
        
        
        
        return true;
    }
     ,update:function(dt) {
        var winSizeStr = "inner " + innerWidth.toString(10) +"x"+innerHeight.toString(10);
        this.windowsize.setString(winSizeStr);
        
        var canvas = document.getElementById("gameCanvas");
        var canvasSizeStr = "canvas " + canvas.width.toString(10) + "x" + canvas.height.toString(10);
        this.canvassize.setString(canvasSizeStr);
     }
});