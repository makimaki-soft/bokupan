
var callbuck_left = function(sender){
    console.log("callbuck_left called");
    var move = cc.MoveBy.create(1,cc.p(-100,0));
    this.runAction(move);
    sender.initWithString(
            "up",
            callbuck_up, 
            this);
}

var callbuck_down = function(sender){
    console.log("callbuck_down called");
    var move = cc.MoveBy.create(1,cc.p(0,-100));
    this.runAction(move);
    sender.initWithString(
            "left",
            callbuck_left, 
            this);
}

var callbuck_right = function(sender){
    console.log("callbuck_right called");
    var move = cc.MoveBy.create(1,cc.p(100,0));
    this.runAction(move);
    sender.initWithString(
            "down",
            callbuck_down, 
            this);
}

var callbuck_up = function(sender){
    console.log("callbuck_up called");
    var move = cc.MoveBy.create(1,cc.p(0,100));
    this.runAction(move);
    sender.initWithString(
            "right",
            callbuck_right, 
            this);
}

var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;
        cc.log(size.width,size.height);

        // add a "close" icon to exit the progress. it's an autorelease object
        var closeItem = new cc.MenuItemImage(
            res.CloseNormal_png,
            res.CloseSelected_png,
            0, this);
        closeItem.attr({
            x: size.width - 20,
            y: 20,
            anchorX: 0.5,
            anchorY: 0.5
        });

        var menu = new cc.Menu(closeItem);
        menu.x = 0;
        menu.y = 0;
        this.addChild(menu, 1);

        // add "HelloWorld" splash screen"
        this.sprite = new cc.Sprite(res.HelloWorld_png);
        this.sprite.attr({
            x: size.width / 2,
            y: size.height / 2
        });
        this.addChild(this.sprite, 0);
        
        var person = new cc.LabelTTF("(^^)","Arial",20);
        person.setPosition(cc.p(100,100));
        this.addChild(person,0);
       
        var botton_up = cc.MenuItemFont.create(
            "up",
            callbuck_up, 
            person);
        botton_up.setPosition(cc.p(size.width / -2 + 100,size.height/-2+50));
        this.addChild(new cc.Menu(botton_up),0);
        
        return true;
    }
});

var BokupanMainScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        
        //var layer = new HelloWorldLayer();
        //this.addChild(layer);
        
        // for debug
        var debugInfoLayer = new DebugInfoLayer();
        debugInfoLayer.setPosition(cc.p(0,0));
        debugInfoLayer.scheduleUpdate();
        this.addChild(debugInfoLayer);
        
        var position_Y = 0;
        
        var playerStatusLayer = new DummyLayer(cc.color(200,200,50,100), g_layout.playerstatus_width, g_layout.playerstatus_height);
        var menuLayer = new MenuLayer(cc.color(255,200,100,100), g_layout.menu_width, g_layout.menu_height);
        var mainMapLayer = new MainMapLayer(cc.color(100,255,140,100), g_layout.map_width, g_layout.map_height);
        var enemyStatusLayer = new DummyLayer(cc.color(70,200,70,100), g_layout.enemystatus_width, g_layout.enemystatus_height);
        
        playerStatusLayer.setPosition(cc.p(0,0));
        this.addChild(playerStatusLayer);
        position_Y += g_layout.playerstatus_height;
        
        menuLayer.setPosition(cc.p(0,position_Y));
        this.addChild(menuLayer);
        position_Y += g_layout.menu_height;
        
        mainMapLayer.setPosition(cc.p(0,position_Y));
        this.addChild(mainMapLayer);
        position_Y += g_layout.map_height;

        enemyStatusLayer.setPosition(cc.p(0,position_Y));
        this.addChild(enemyStatusLayer);
        position_Y += g_layout.enemystatus_height;
        
        // todo 
        
        mainMapLayer.updateSection();
        // mainMapLayer.playerMove();
        menuLayer.setMoveFunction(mainMapLayer);
        mainMapLayer.setMenuLayer(menuLayer);
        //menuLayer.moveFunc = mainMapLayer.playerMove;
    }
});
