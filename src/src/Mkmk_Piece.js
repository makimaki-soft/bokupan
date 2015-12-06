/*!
 * * コマ（プレイヤーアイコン）
 *  - 画像中央をアンカーポイントとしたSpriteオブジェクト
 *  - POSITION_IDを用いて位置を制御する
 */
var Mkmk_Piece = cc.Sprite.extend({
    ctor:function (image) {
        this._super(image);
        this.anchorX = 0.5;
        this.anchorY = 0.5;
    }
  , setPos:function(positionID){
        this.positionID = positionID;
        var cod = getCoordinate(positionID);
        this.x = cod.x;
        this.y = cod.y;
    }
  , getPos:function(){
        return this.positionID;
    }
  , setSize:function(sizeX, sizeY){
       this.scaleX = sizeX/this.width;
       this.scaleY = sizeY/this.height;
    }
  , setNextPos:function(positionID){
      this.NextPositionID = positionID;
    }
  , updatePos:function(){
      this.positionID = this.NextPositionID;
      var cod = getCoordinate(this.positionID);
      this.x = cod.x;
      this.y = cod.y;
    }
  , setNextDir:function(direction){
      this.NextDir = direction;
    }
  , updateDir:function(){
      this.dir = this.NextDir;
    }
  , setPlayerStatus:function(player){
    this.player = player;
  }
  , fireViewChangeEvent:function(){
    this.player.view.statusChanged();
  }
});