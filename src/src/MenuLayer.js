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
      
      this.moveIcon = new cc.MenuItemImage(
            res.IconMove,
            res.IconMove,
            map.playerMove, 
            map);
            
        this.moveIcon.attr({
            scaleX: this.height/this.moveIcon.height,
            scaleY: this.height/this.moveIcon.height,
            x: 0,
            y: 0,
            anchorX: 0,
            anchorY: 0
        });
        
        var menu = new cc.Menu(this.moveIcon);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu, 1);  
  }  
});