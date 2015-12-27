var GameClearLayer = cc.LayerColor.extend({
    sprite:null,
    ctor:function (color,w,h) {
        this._super(color,w,h);
    }
    , setWinnerInfo : function(player){
        
        var linkText = new cc.MenuItemFont("スタート画面に戻る", function(){
            location.href = "/bokupan-ss"            
        });
        
        linkText.attr({
            x: 0,
            y: -100,
            anchorX: 0.5,
            anchorY: 0
        });
        
        var linkMenu = new cc.Menu(linkText);
        
        var str = player.PlayerName + "さんが勝ちました！";
        var message = cc.LabelTTF.create(str,"Meiryo",28);
        message.attr({
            x: this.width/2,
            y: this.height/2,
            anchorX: 0.5,
            anchorY: 0
        });
        
        
        this.addChild(linkMenu, 0);
        this.addChild(message, 0);
        
    }
});