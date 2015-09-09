var Avatar = cc.Sprite.extend({
    ctor:function (image) {
        this._super(image);
        this.anchorX = 0.5;
        this.anchorY = 0.5;
    }
  , setPos:function(position){
        this.position = position;
        var cod = getCoordinate(position);
        this.x = cod.x;
        this.y = cod.y;
    }
  , setSize:function(sizeX, sizeY){
       this.scaleX = sizeX/this.width;
       this.scaleY = sizeY/this.height;
    }
  , setNextPos:function(position){
      this.NextPosition = position;
    }
  , updatePos:function(){
      this.position = this.NextPosition;
      var cod = getCoordinate(this.position);
      this.x = cod.x;
      this.y = cod.y;
  }
});