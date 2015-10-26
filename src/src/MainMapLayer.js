/* global idx */
var MainMapLayer = cc.LayerColor.extend({
    sprite:null
  , ctor:function (color,w,h) {
        this._super(color,w,h);

        // マップSpriteを作成＆表示
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

        // 矢印Spriteを作成＆表示
        this.allows = [];
        var dir_ini = [ DIR.UP,
                        DIR.LEFT,
                        DIR.RIGHT,
                        DIR.DOWN
                       ];
        var id   = [POSITION_ID.ALLOW_1,
                    POSITION_ID.ALLOW_2,
                    POSITION_ID.ALLOW_3,
                    POSITION_ID.ALLOW_4
                   ];
        for(var i=0 ; i<id.length ; i++){
          var allow = new Mkmk_Piece(res.Yajirushi);
          var pos = getCoordinate(id[i]);

          allow.attr({
              scaleX: 50/allow.width,
              scaleY: 50/allow.height,
              x: pos.x,
              y: pos.y,
              rotation : DIR_ANG[dir_ini[i]],
              anchorX: 0.5,
              anchorY: 0.5,
              dir : dir_ini[i]
          });
          this.addChild(allow, 0);
          this.allows.push(allow);
          cc.log(this.allows.length, allow.dir);
        }

        return true;
    }
  , setPlayerIcon:function(){
      this.playerIcon = new Mkmk_Piece(res.DummyObj);
      this.playerIcon.setSize(40,40);
      this.playerIcon.setPos(POSITION_ID.HOME_5);
      this.addChild(this.playerIcon, 0);
    }
  , setMenuLayer:function(menuLayer){
      this.menuLayer = menuLayer;
  }
  , addCursorToAllows:function(){

      // カーソルと標識の距離を調整
      var offsetX = [-40, 0, 40, 0];
      var offsetY = [0, 40, 0, -40];
      var pos_id = [POSITION_ID.ALLOW_1,
                    POSITION_ID.ALLOW_2,
                    POSITION_ID.ALLOW_3,
                    POSITION_ID.ALLOW_4
                   ];
      this.AllowCursors = [];

      for( var targetID = 0; targetID<pos_id.length ; targetID++ ){

        var target = this.allows[targetID];
        var dirCand = getNeighber(pos_id[targetID]);
        for (var i=0 ; i<dirCand.length ; i++) {
          var idx = dirCand[i];
          if( idx == target.dir){
            // 同じ方向は選択肢に出さない
            continue;
          }
          // 選択方向のSprite作成＆表示
          var cursor = new cc.Sprite(res.Allow_png);
          cursor.attr({
            scaleX: 30/cursor.width,
            scaleY: 30/cursor.height,
            x: target.x + offsetX[idx],
            y: target.y + offsetY[idx],
            rotation : DIR_ANG[idx],
            anchorX: 0.5,
            anchorY: 0.5
          });
          this.AllowCursors.push(cursor);
          this.addChild(cursor);
        }
      }
  }
  , addCursorToPlayer:function(){
      var offsetX = [-40, 0, 40, 0];
      var offsetY = [0, 40, 0, -40];
      var ratate  = [-90, 0, 90, 180];
      var target = this.playerIcon;
      this.cursors = [];
      var mvChoices = getNeighber(target.getPos());

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
  , removeCursorAllow:function(){
    for (var i = 0, len = this.AllowCursors.length; i < len; i++) {
      this.AllowCursors[i].removeFromParent(true);
    }
  }
  , isInside:function(x,y){
      var pos = this.getPosition();
      var borderX = this.width + pos.x;
      var borderY = this.height + pos.y;
      if( pos.x < x && pos.y <  y && x < borderX && y < borderY){
        return true;
      }
      return false;
  }
  , isValid:function(direction){
      var dirCand = getNeighber(this.playerIcon.getPos());
      for (var i in dirCand) {
        if(direction == dirCand[i]){
          return true;
        }
      }
      return false;
  }
  , isValidAllowDir:function(positionID, currDir, NextDir){
      var dirCand = getNeighber(positionID);
      for (var i=0 ; i<dirCand.length ; i++) {
        var idx = dirCand[i];
        if( idx == currDir){
          // 同じ方向は選択肢に出さない
          continue;
        }
        if( idx == NextDir){
          return true;
        }
      }
      return false;
  }
  , movePlayer:function(direction){
      //cc.log("movePlayer called");
      if(this.isValid(direction)){
        var nextHome = getNextHome(this.playerIcon.getPos(), direction);
        var nextAdress = getCoordinate(nextHome);
        var move = cc.MoveTo.create(1,cc.p(nextAdress.x,nextAdress.y));
        this.playerIcon.runAction(move);
        this.playerIcon.setNextPos(nextHome);
        this.playerIcon.scheduleOnce(this.playerIcon.updatePos,1);
        return true;
      }
      return false;
  }
  , rotateAllow:function(positionID, direction){
      //cc.log("movePlayer called");
      var idx = positionID-POSITION_ID.ALLOW_1;
      var currDir = this.allows[idx].dir;
      if(this.isValidAllowDir(positionID, currDir, direction)){
        var currRotation = this.allows[idx].rotation;
        var diff = DIR_ANG[direction] - currRotation;
        var move = new cc.RotateTo(1,DIR_ANG[direction],0);
        this.allows[idx].runAction(move);
        this.allows[idx].setNextDir(direction);
        this.allows[idx].scheduleOnce(this.allows[0].updateDir,1);
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
  , getClosestPosition(x,y){
      var pos_id = [POSITION_ID.ALLOW_1,
                    POSITION_ID.ALLOW_2,
                    POSITION_ID.ALLOW_3,
                    POSITION_ID.ALLOW_4
                   ];
      var minDist = Number.MAX_VALUE;
      var bestPos = 0;
      for( var i=0 ; i<pos_id.length ; i++){
        var currPos = pos_id[i]
        var pos_x = Coordinate[currPos].x;
        var pos_y = Coordinate[currPos].y;
        var dist_sq = Math.pow(pos_x-x+this.x,2) + Math.pow(pos_y-y+this.y,2);
        if(dist_sq<minDist){
          minDist = dist_sq;
          bestPos = currPos;
        }
      }

      return bestPos;
  }
  , getRelativeDirectionAllow(positionID, x,y){
      var idx = positionID-POSITION_ID.ALLOW_1;
      var relativeX =  x - this.x - this.allows[idx].x;
      var relativeY =  y - this.y - this.allows[idx].y;

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
