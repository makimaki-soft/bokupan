var test = function(){
    
    cc.log("test ");
}

var MenuLayer = cc.LayerColor.extend({
    sprite:null,
    ctor:function (color,w,h) {
        this._super(color,w,h);		        
                
        return true;
    }
  , setMoveFunction:function(map){
      this.map = map;
      
      var moveIcon = new cc.MenuItemImage(
            res.IconMove,
            res.IconMove,
            map.playerMove, 
            map);
            
        moveIcon.attr({
            scaleX: this.height/moveIcon.height,
            scaleY: this.height/moveIcon.height,
            x: 0,
            y: 0,
            anchorX: 0,
            anchorY: 0
        });
        
        this.menuMove = new cc.Menu(moveIcon);
        this.menuMove.x = 0;
        this.menuMove.y = 0;
        this.addChild(this.menuMove, 1);
        
        this.setMoveMenuEnable = function(bool){
            this.menuMove.setEnabled(bool);
        };
        this.setMoveMenuResume = function(){
            this.menuMove.setEnabled(true);
        };
  }
});