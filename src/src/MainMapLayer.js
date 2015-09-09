var MainMapLayer = cc.LayerColor.extend({
    sprite:null
  , ctor:function (color,w,h) {
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
  , updateSection:function(){
      cc.log("updateSection");
      
      // if INITIAL
      this.playerIcon = new Avatar(res.DummyObj);
      this.playerIcon.setSize(40,40);
      this.playerIcon.setPos(POSITION.HOME_1);
        
      this.addChild(this.playerIcon, 0);
    }
  , playerMove:function(){
        cc.log("playerMove");
        var offsetX = [-40, 0, 40, 0];
        var offsetY = [0, 40, 0, -40];
        var ratate  = [-90, 0, 90, 180];
        var zeroX = this.x;
        var zeroY = this.y;
        var target = this.playerIcon;
        var cursors = [];
        var mvChoices = getNeighber(target.position);
        
        for (var i in mvChoices) {
          var idx = mvChoices[i];
          var cursor = new cc.Sprite(res.Allow_png);
          cursor.attr({
            scaleX: 30/cursor.width,
            scaleY: 30/cursor.height,
            x: target.x + offsetX[idx],
            y: target.y + offsetY[idx],
            rotation : ratate[idx],
            anchorX: 0.5,
            anchorY: 0.5
          });
          cursors.push(cursor);
          this.addChild(cursor);
        }
        
        var ev = cc.EventListener.create({
          event: cc.EventListener.TOUCH_ONE_BY_ONE,
          swallowTouches: true,
          onTouchBegan: function (touch, event) {
            var touchX = touch.getLocationX() - zeroX;
            var touchY = touch.getLocationY() - zeroY;
            // cc.log("Touch at (%f, %f)", touchX, touchY);
            
            var diffX = touchX - target.x;
            var diffY = touchY - target.y;
            var dir;
            
            if(diffX > 0 && diffX-Math.abs(diffY) > 0){
              dir = NEIGHBER.RIGHT;
            }else if(diffY > 0 && diffY - Math.abs(diffX) > 0){
              dir = NEIGHBER.ABAVE;
            }else if(diffX < 0 && Math.abs(diffX)-Math.abs(diffY) > 0){
              dir = NEIGHBER.LEFT;
            }else{
              dir = NEIGHBER.BELOW;
            }
            
            var isValid = false;
            for (var i in mvChoices) {
              isValid = (dir == mvChoices[i]);
              if(isValid){
                break;
              }
            }
            
            if(isValid){
              var nextHome = getNextHome(target.position, dir);
              var nextAdress = getCoordinate(nextHome);
            
              var move = cc.MoveTo.create(1,cc.p(nextAdress.x,nextAdress.y));
              target.runAction(move);
              
              for (var i = 0, len = cursors.length; i < len; i++) {
                cursors[i].removeFromParent(true);
              }
              
              cc.eventManager.removeListener(this);
              
              target.setNextPos(nextHome);
              target.scheduleOnce(target.updatePos, 1.1);
            }
            
            return true;
          }
        });
        cc.eventManager.addListener(ev,this);
    }
});
