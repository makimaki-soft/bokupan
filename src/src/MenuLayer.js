var MenuLayer = cc.LayerColor.extend({
    sprite:null,
    ctor:function (color,w,h) {
        this._super(color,w,h);
        
        this.moveIcon = new Mkmk_MenuItemImage(
            res.IconMove,
            res.IconMove);
            
        this.moveIcon.attr({
            scaleX: this.height/this.moveIcon.height,
            scaleY: this.height/this.moveIcon.height,
            x: 0,
            y: 0,
            anchorX: 0,
            anchorY: 0
        });
        
        this.menuMove = new cc.Menu(this.moveIcon);
        this.menuMove.x = 0;
        this.menuMove.y = 0;
        this.addChild(this.menuMove, 0);
        
        this.rotateIcon = new Mkmk_MenuItemImage(
            res.IconAllow,
            res.IconAllow2);
        
        this.rotateIcon.attr({
            scaleX: this.height/this.rotateIcon.height,
            scaleY: this.height/this.rotateIcon.height,
            x: 100,
            y: 0,
            anchorX: 0,
            anchorY: 0
        });
        
        this.menuRotate = new cc.Menu(this.rotateIcon);
        this.menuRotate.x = 0;
        this.menuRotate.y = 0;
        this.addChild(this.menuRotate, 0);
        
        return true;
    }
  , setMapLayer:function(map){
      this.map = map;
    }
  , setMoveMenuEnable:function(bool){
      this.menuMove.setEnabled(bool);
    }
  , setRotateMenuEnable:function(bool){
      this.menuRotate.setEnabled(bool);
    }
});