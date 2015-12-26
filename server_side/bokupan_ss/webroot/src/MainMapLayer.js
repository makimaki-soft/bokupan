/* global idx */
var MainMapLayer = cc.LayerColor.extend({
    sprite:null
  , ctor:function (color,w,h) {
        this._super(color,w,h);

        this.playerIcons = [null, null, null, null];

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
  , setPlayerIcon:function(player){
      var icons = [ res.Player1_png, res.Player2_png, res.Player3_png, res.Player4_png ];
      var iconIdx =  player.playerID;
      var newIcon =  new Mkmk_Piece(icons[iconIdx]);
      var id = player.playerID;
      newIcon.setSize(40,40);
      newIcon.setPos(player.getCurrPosition());
      this.playerIcons[id] = newIcon;
      this.addChild(newIcon, 0);
    }
  , setPoliceIcon:function(){
      this.policeIcon = new Mkmk_Piece(res.PoliceIcon);
      this.policeIcon.setSize(40,40);
      this.policeIcon.setPos(this.police.getCurrPosition());
      this.addChild(this.policeIcon, 0);
  }
  , setMenuLayer:function(menuLayer){
      this.menuLayer = menuLayer;
  }
  , addCursorToArrow:function(position_id){
      if(!isArrow(position_id)){
        return;
      }
      
      // カーソルと標識の距離を調整
      var offsetX = [-40, 0, 40, 0];
      var offsetY = [0, 40, 0, -40];
      
      this.AllowCursors = [];
      
      var target = this.allows[position_id-POSITION_ID.ALLOW_1];
      var dirCand = getNeighber(position_id);
      
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
  , addCursorToPlayer:function(id){
      var offsetX = [-40, 0, 40, 0];
      var offsetY = [0, 40, 0, -40];
      var ratate  = [-90, 0, 90, 180];
      var target = this.playerIcons[id];
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
  , isValid:function(icon, direction){
      var dirCand = getNeighber(icon.getPos());
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
  , movePiece:function(icon, direction){
      if(this.isValid(icon, direction)){
        var nextHome = getNextHome(icon.getPos(), direction);
        var nextAdress = getCoordinate(nextHome);
        var move = cc.MoveTo.create(1,cc.p(nextAdress.x,nextAdress.y));
        icon.runAction(move);
        icon.setNextPos(nextHome);
        icon.scheduleOnce(icon.updatePos,1);
        return true;
      }
      return false;
  }
  , movePlayer:function(id, direction, callback, target){
      //cc.log("movePlayer called");
      if( this.movePiece(this.playerIcons[id], direction) ){
        var player = gameStatus.getPlayer(id);
        player.setCurrPosition(this.playerIcons[id].NextPositionID);
        this.scheduleOnce(function(){
          if(callback){
            if( target ){ 
                callback.call(target, this.police.getCurrPosition());
              }else{
                callback.call(this, this.police.getCurrPosition());
              }
          }
        }, 1.2 );
        return true;
      }
      return false;
  }
  , resetPlayerPosition:function(player){
      var pos = Coordinate[player.initialPosition];
      var move = cc.MoveTo.create(1, cc.p(pos.x, pos.y));
      var icon = this.playerIcons[player.playerID];
      icon.runAction(move);
      icon.setNextPos(player.initialPosition);
      icon.scheduleOnce(icon.updatePos,1);
  }
  , movePolice:function(num, callback, target){
      this.movePoliceRecursive(this.police.getNextDir(), 1, num, callback, target);
  }
  , movePoliceRecursive:function(direction, currDepth, maxDepth, callback, target){
      if( this.movePiece(this.policeIcon, direction) ){
        this.police.updateDir();
        this.scheduleOnce(function(){
            this.police.setCurrPosition(this.policeIcon.NextPositionID);
            if(callback){
              cc.log("callback");
              if( target ){ 
                callback.call(target, this.police.getCurrPosition());
              }else{
                callback.call(this, this.police.getCurrPosition());
              }
            }
            if(currDepth< maxDepth){
              this.movePoliceRecursive(this.police.getNextDir(), currDepth+1, maxDepth, callback, target);
            }
        }, 1.2);
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
  , rotateAllArrowClockwise:function(){
    
    for(var i=0 ; i<this.allows.length ; i++){
      var currDir = this.allows[i].dir;
      var nextDir = (currDir+1)%4;
      while(!(this.rotateAllow(POSITION_ID.ALLOW_1+i, nextDir))){
        nextDir = (nextDir+1)%4;
      }
    }
  }
  , getRelativeDirection(id,x,y){
      var relativeX =  x - this.x - this.playerIcons[id].x;
      var relativeY =  y - this.y - this.playerIcons[id].y;

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
  , setPlayer:function(player){
      this.setPlayerIcon(player);
    }
  , setPolice:function(police){
      this.police = police;
      this.setPoliceIcon();
  }
  , removeText:function(){
      this.removeChild(this.text);
  }
  , textConsole:function(str){
      this.text = cc.LabelTTF.create(str,"Meiryo",28);
      this.text.attr({
            x: 0,
            y: 0,
            anchorX: 0,
            anchorY: 0
        });
      this.addChild(this.text, 0);
      this.scheduleOnce(this.removeText, 1 );
  }
  , playDiceAnimation:function(num, offset){
      if(num<1 || 6<num){
        return;
      }
      
      // サイコロのSpriteを作成
      var dice = new cc.Sprite(res.Dice1);
      dice.attr({
          scaleX: 80/dice.width,
          scaleY: 80/dice.height,
          x: 50 + offset,
          y: 50,
          anchorX: 0,
          anchorY: 0
      });
      
      // 段々低くなっていくジャンプ
      var jumps = [];
      jumps[0] = cc.JumpBy.create(0.30, cc.p(30,-50), 50,1);
      jumps[1] = cc.JumpBy.create(0.25, cc.p(30,  0), 40,1);
      jumps[1] = cc.JumpBy.create(0.20, cc.p(20,  0), 30,1);
      jumps[2] = cc.JumpBy.create(0.10, cc.p(10,  0),  5,1);
      jumps[3] = cc.JumpBy.create(0.10, cc.p( 5,  0),  2,1);
      var jumpMotion = cc.Sequence.create(jumps);
      
      // 回転アニメーション
      var animation = new cc.Animation();
      animation.addSpriteFrameWithFile(res.Dice1);
      animation.addSpriteFrameWithFile(res.Dice2);
      animation.addSpriteFrameWithFile(res.Dice3);
      animation.addSpriteFrameWithFile(res.Dice4);
      animation.addSpriteFrameWithFile(res.Dice5);
      animation.addSpriteFrameWithFile(res.Dice6);
      animation.setDelayPerUnit(1/30);
      animation.setLoops(3.5);
      var rotateMotion = new cc.Animate(animation);
      
      // サイコロアニメーションに合成
      var diceAnimation = new cc.Spawn();
      diceAnimation.initWithTwoActions(rotateMotion,jumpMotion);
      
      // 出目の設定
      var dispResult = new cc.CallFunc(function(){
          var src = [res.Dice1, res.Dice2, res.Dice3, res.Dice4, res.Dice5, res.Dice6]
          var deme = new cc.Sprite(src[num-1]);
          dice.setSpriteFrame(deme.getSpriteFrame());
          this.scheduleOnce(function(){
            this.removeChild(dice, 1);
          }, 1 );
      }, this)
      
      // アニメーション後に出目を表示するようにシーケンスを作成
      var seqence = [];
      seqence[0] = diceAnimation;
      seqence[1] = dispResult;
      var wholeMotion = new cc.Sequence(seqence);
      
      this.addChild(dice, 1);
      dice.runAction(wholeMotion);
  }
  , removeItemCard:function(){
      this.removeChild(this.menuItemArrow, 0);
      this.removeChild(this.menuItemPolice, 0);
      this.removeChild(this.menuItemPeople, 0);
      
  }
  , addItemCard:function(){   
        // アイテムボタンの追加
        this.ItemArrowIcon = new Mkmk_MenuItemImage(
            res.CardArrow,
            res.CardArrow,
            Helper.LABEL.ITEM_ARROW);
        this.ItemArrowIcon.attr({
            scaleX: 100/this.ItemArrowIcon.height,
            scaleY: 100/this.ItemArrowIcon.height,
            x: 0,
            y: 0,
            anchorX: 0,
            anchorY: 0
        });
        this.menuItemArrow = new cc.Menu(this.ItemArrowIcon);
        this.menuItemArrow.x = 0;
        this.menuItemArrow.y = 0;
        this.addChild(this.menuItemArrow, 0);
        
        this.ItemPoliceIcon = new Mkmk_MenuItemImage(
            res.CardPolice,
            res.CardPolice,
            Helper.LABEL.ITEM_POLICE);
        this.ItemPoliceIcon.attr({
            scaleX: 100/this.ItemPoliceIcon.height,
            scaleY: 100/this.ItemPoliceIcon.height,
            x: 0,
            y: 0,
            anchorX: -1,
            anchorY: 0
        });
        this.menuItemPolice = new cc.Menu(this.ItemPoliceIcon);
        this.menuItemPolice.x = 0;
        this.menuItemPolice.y = 0;
        this.addChild(this.menuItemPolice, 0);
        
        this.ItemPeopleIcon = new Mkmk_MenuItemImage(
            res.CardPeople,
            res.CardPeople,
            Helper.LABEL.ITEM_PEOPLE);
        this.ItemPeopleIcon.attr({
            scaleX: 100/this.ItemPeopleIcon.height,
            scaleY: 100/this.ItemPeopleIcon.height,
            x: 0,
            y: 0,
            anchorX: -2,
            anchorY: 0
        });
        this.menuItemPeople = new cc.Menu(this.ItemPeopleIcon);
        this.menuItemPeople.x = 0;
        this.menuItemPeople.y = 0;
        this.addChild(this.menuItemPeople, 0);
  }
});
