var MenuLayer = cc.LayerColor.extend({
    sprite:null,
    ctor:function (color,w,h) {
        this._super(color,w,h);
        
        
        
        
        return true;
    }
  , setMoveFunction:function(map){
      this.map = map;
      
      this.moveIcon = new Mkmk_MenuItemImage(
            res.IconMove,
            res.IconMove,
            /*map.playerMove*/  0, 
            map);
            
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
        
        this.setMoveMenuEnable = function(bool){
            this.menuMove.setEnabled(bool);
        };
        this.setMoveMenuResume = function(){
            this.menuMove.setEnabled(true);
        };
  }
});