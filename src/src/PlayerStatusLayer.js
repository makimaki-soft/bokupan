//menuLayerからコピペッタだけ
var PlayerStatusLayer = cc.LayerColor.extend({
    sprite:null,
    ctor:function (color,w,h) {
        this._super(color,w,h);
        this.moveIcon = new Mkmk_MenuItemImage(
            res.IconMove,
            res.IconMove2);
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
        // 矢印回転ボタンの作成＆表示
        this.rotateIcon = new Mkmk_MenuItemImage(
            res.IconChange,
            res.IconChange2);
        this.rotateIcon.attr({
            scaleX: this.height/this.rotateIcon.height,
            scaleY: this.height/this.rotateIcon.height,
            x: 0,
            y: 0,
            anchorX: -1,
            anchorY: 0
        });
        this.menuRotate = new cc.Menu(this.rotateIcon);
        this.menuRotate.x = 0;
        this.menuRotate.y = 0;
        this.addChild(this.menuRotate, 0);
        
        // 採取ボタンの追加
        this.CollectIcon = new Mkmk_MenuItemImage(
            res.IconGet,
            res.IconGet2);
        this.CollectIcon.attr({
            scaleX: this.height/this.CollectIcon.height,
            scaleY: this.height/this.CollectIcon.height,
            x: 0,
            y: 0,
            anchorX: -2,
            anchorY: 0
        });
        this.menuCollect = new cc.Menu(this.CollectIcon);
        this.menuCollect.x = 0;
        this.menuCollect.y = 0;
        this.addChild(this.menuCollect, 0);
        
        // アイテムボタンの追加
        this.ItemIcon = new Mkmk_MenuItemImage(
            res.IconItem,
            res.IconItem2);
        this.ItemIcon.attr({
            scaleX: this.height/this.ItemIcon.height,
            scaleY: this.height/this.ItemIcon.height,
            x: 0,
            y: 0,
            anchorX: -3,
            anchorY: 0
        });
        this.menuItem = new cc.Menu(this.ItemIcon);
        this.menuItem.x = 0;
        this.menuItem.y = 0;
        this.addChild(this.menuItem, 0);

        return true;
    }
  , statusChanged:function(){
      alert();
    }
  , setPlayer:function(player){
      this.player = player;
    }
});