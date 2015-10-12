var MainMapLayer = cc.LayerColor.extend({
    sprite:null
  , ctor:function (color,w,h) {
        this._super(color,w,h);
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
        
        this.allows = [];
        var ratate  = [0, 270, 90, 180];
        for(var i=0 ; i<4 ; i++){
          var allow = new cc.Sprite(res.Yajirushi);
          var cor = getAllowCoordinate(i);
          allow.attr({
              scaleX: 50/allow.width,
              scaleY: 50/allow.height,
              x: cor.x,
              y: cor.y,
              rotation : ratate[i],
              anchorX: 0.5,
              anchorY: 0.5
          });
          this.addChild(allow, 0);
          this.allows.push(allow);
          cc.log(this.allows.length);
        }
                  
        return true;
    }
  , serPlayerIcon:function(){
      this.playerIcon = new Avatar(res.DummyObj);
      this.playerIcon.setSize(40,40);
      this.playerIcon.setPos(POSITION.HOME_5);
      this.addChild(this.playerIcon, 0);
    }
  , setMenuLayer:function(menuLayer){
      this.menuLayer = menuLayer;
  }
  , addCursorAllow:function(){
      var target = this.allows[0];
      var offsetX = [-40, 0, 40, 0];
      var offsetY = [0, 40, 0, -40];
      var ratate  = [-90, 0, 90, 180];
      this.AllowCursors = [];
      
      var dir = [1,2,3];
      
      for (var i in dir) {
        var idx = dir[i];
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
        this.AllowCursors.push(cursor);
        this.addChild(cursor);
      }
  }
  , addCursor:function(){
      var offsetX = [-40, 0, 40, 0];
      var offsetY = [0, 40, 0, -40];
      var ratate  = [-90, 0, 90, 180];
      var target = this.playerIcon;
      this.cursors = [];
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
        this.cursors.push(cursor);
        this.addChild(cursor);
      }
    }
  , removeCursor:function(){
    for (var i = 0, len = this.cursors.length; i < len; i++) {
      this.cursors[i].removeFromParent(true);
    }
  }
  , isInside(x,y){
      var pos = this.getPosition();
      var borderX = this.width + pos.x;
      var borderY = this.height + pos.y;
      if( pos.x < x && pos.y <  y && x < borderX && y < borderY){
        return true;
      }
      return false;
  }
  , isValid(direction){
      var dirCand = getNeighber(this.playerIcon.position);
      for (var i in dirCand) {
        if(direction == dirCand[i]){
          return true;
        }
      }
      return false;
  }
  , movePlayer:function(direction){
      //cc.log("movePlayer called");
      if(this.isValid(direction)){
        var nextHome = getNextHome(this.playerIcon.position, direction);
        var nextAdress = getCoordinate(nextHome);
        var move = cc.MoveTo.create(1,cc.p(nextAdress.x,nextAdress.y));
        this.playerIcon.runAction(move);
        this.playerIcon.setNextPos(nextHome);
        this.playerIcon.scheduleOnce(this.playerIcon.updatePos,1);
        return true;
      }
      return false;
  }
  , rotateAllow:function(direction){
      //cc.log("movePlayer called");
      if(1){
        var nextHome = getNextHome(this.playerIcon.position, direction);
        var nextAdress = getCoordinate(nextHome);
        var move = new _cc.RotateTo(1,90,0);
        this.allows[0].runAction(move);
        // this.playerIcon.setNextPos(nextHome);
        // this.allows[0].scheduleOnce(this.playerIcon.updatePos,1);
        return true;
      }
      return false;
  }
  , getRelativeDirection(x,y){
      var relativeX =  x - this.x - this.playerIcon.x;
      var relativeY =  y - this.y - this.playerIcon.y;
            
      if(relativeX > 0 && relativeX-Math.abs(relativeY) > 0){
        return NEIGHBER.RIGHT;
      }else if(relativeY > 0 && relativeY - Math.abs(relativeX) > 0){
        return NEIGHBER.ABAVE;
      }else if(relativeX < 0 && Math.abs(relativeX)-Math.abs(relativeY) > 0){
        return NEIGHBER.LEFT;
      }else{
        return NEIGHBER.BELOW;
      }
  }
  , getRelativeDirectionAllow(x,y){
      var relativeX =  x - this.x - this.allows[0].x;
      var relativeY =  y - this.y - this.allows[0].y;
            
      if(relativeX > 0 && relativeX-Math.abs(relativeY) > 0){
        return NEIGHBER.RIGHT;
      }else if(relativeY > 0 && relativeY - Math.abs(relativeX) > 0){
        return NEIGHBER.ABAVE;
      }else if(relativeX < 0 && Math.abs(relativeX)-Math.abs(relativeY) > 0){
        return NEIGHBER.LEFT;
      }else{
        return NEIGHBER.BELOW;
      }
  }
});
