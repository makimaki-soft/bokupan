var PlayerStatusLayer = cc.LayerColor.extend({
    sprite:null,
    ctor:function (color,w,h) {
        this._super(color,w,h);
        this.menuPocket = new Mkmk_MenuItemImage(
            res.PocketMenu,
            res.PocketMenu);
        this.menuPocket.attr({
            scaleX: this.height/2/this.menuPocket.height,
            scaleY: this.height/2/this.menuPocket.height,
            x: 0,
            y: 0,
            anchorX: 0,
            anchorY: -1
        });
        this.menuPocket = new cc.Menu(this.menuPocket);
        this.menuPocket.x = 0;
        this.menuPocket.y = 0;
        this.addChild(this.menuPocket, 0);

//手持ち9個のリスト　デフォルトはvisible=false
        this.pocket1 = new Mkmk_MenuItemImage(
            res.Pocket1,
            res.Pocket1);
        this.pocket1.attr({
            scaleX: this.height/2/this.pocket1.height,
            scaleY: this.height/2/this.pocket1.height,
            x: 0,
            y: 0,
            anchorX: -2,
            anchorY: -1
        });
        this.pocket1 = new cc.Menu(this.pocket1);
        this.pocket1.x = 0;
        this.pocket1.y = 0;
        this.addChild(this.pocket1, 0);

        this.pocket2 = new Mkmk_MenuItemImage(
            res.Pocket2,
            res.Pocket2);
        this.pocket2.attr({
            scaleX: this.height/2/this.pocket2.height,
            scaleY: this.height/2/this.pocket2.height,
            x: 0,
            y: 0,
            anchorX: -3,
            anchorY: -1
        });
        this.pocket2 = new cc.Menu(this.pocket2);
        this.pocket2.x = 0;
        this.pocket2.y = 0;
        this.addChild(this.pocket2, 0);

        this.pocket3 = new Mkmk_MenuItemImage(
            res.Pocket3,
            res.Pocket3);
        this.pocket3.attr({
            scaleX: this.height/2/this.pocket3.height,
            scaleY: this.height/2/this.pocket3.height,
            x: 0,
            y: 0,
            anchorX: -4,
            anchorY: -1
        });
        this.pocket3 = new cc.Menu(this.pocket3);
        this.pocket3.x = 0;
        this.pocket3.y = 0;
        this.addChild(this.pocket3, 0);

        this.pocket4 = new Mkmk_MenuItemImage(
            res.Pocket4,
            res.Pocket4);
        this.pocket4.attr({
            scaleX: this.height/2/this.pocket4.height,
            scaleY: this.height/2/this.pocket4.height,
            x: 0,
            y: 0,
            anchorX: -5,
            anchorY: -1
        });
        this.pocket4 = new cc.Menu(this.pocket4);
        this.pocket4.x = 0;
        this.pocket4.y = 0;
        this.addChild(this.pocket4, 0);

        this.pocket5 = new Mkmk_MenuItemImage(
            res.Pocket5,
            res.Pocket5);
        this.pocket5.attr({
            scaleX: this.height/2/this.pocket5.height,
            scaleY: this.height/2/this.pocket5.height,
            x: 0,
            y: 0,
            anchorX: -6,
            anchorY: -1
        });
        this.pocket5 = new cc.Menu(this.pocket5);
        this.pocket5.x = 0;
        this.pocket5.y = 0;
        this.addChild(this.pocket5, 0);

        this.pocket6 = new Mkmk_MenuItemImage(
            res.Pocket6,
            res.Pocket6);
        this.pocket6.attr({
            scaleX: this.height/2/this.pocket6.height,
            scaleY: this.height/2/this.pocket6.height,
            x: 0,
            y: 0,
            anchorX: -7,
            anchorY: -1
        });
        this.pocket6 = new cc.Menu(this.pocket6);
        this.pocket6.x = 0;
        this.pocket6.y = 0;
        this.addChild(this.pocket6, 0);

        this.pocket7 = new Mkmk_MenuItemImage(
            res.Pocket7,
            res.Pocket7);
        this.pocket7.attr({
            scaleX: this.height/2/this.pocket7.height,
            scaleY: this.height/2/this.pocket7.height,
            x: 0,
            y: 0,
            anchorX: -8,
            anchorY: -1
        });
        this.pocket7 = new cc.Menu(this.pocket7);
        this.pocket7.x = 0;
        this.pocket7.y = 0;
        this.addChild(this.pocket7, 0);

        this.pocket8 = new Mkmk_MenuItemImage(
            res.Pocket8,
            res.Pocket8);
        this.pocket8.attr({
            scaleX: this.height/2/this.pocket8.height,
            scaleY: this.height/2/this.pocket8.height,
            x: 0,
            y: 0,
            anchorX: -9,
            anchorY: -1
        });
        this.pocket8 = new cc.Menu(this.pocket8);
        this.pocket8.x = 0;
        this.pocket8.y = 0;
        this.addChild(this.pocket8, 0);

        this.pocket9 = new Mkmk_MenuItemImage(
            res.Pocket9,
            res.Pocket9);
        this.pocket9.attr({
            scaleX: this.height/2/this.pocket9.height,
            scaleY: this.height/2/this.pocket9.height,
            x: 0,
            y: 0,
            anchorX: -10,
            anchorY: -1
        });
        this.pocket9 = new cc.Menu(this.pocket9);
        this.pocket9.x = 0;
        this.pocket9.y = 0;
        this.addChild(this.pocket9, 0);


//獲得済みメニュー
        this.menuCollected = new Mkmk_MenuItemImage(
            res.CollectedMenu,
            res.CollectedMenu);
        this.menuCollected.attr({
            scaleX: this.height/2/this.menuCollected.height,
            scaleY: this.height/2/this.menuCollected.height,
            x: 0,
            y: 0,
            anchorX: 0,
            anchorY: 0
        });
        this.menuCollected = new cc.Menu(this.menuCollected);
        this.menuCollected.x = 0;
        this.menuCollected.y = 0;
        this.addChild(this.menuCollected, 0);

//手持ち9個のリスト　デフォルトはvisible=false
        this.collected1 = new Mkmk_MenuItemImage(
            res.Collected1,
            res.Collected1);
        this.collected1.attr({
            scaleX: this.height/2/this.collected1.height,
            scaleY: this.height/2/this.collected1.height,
            x: 0,
            y: 0,
            anchorX: -2,
            anchorY: 0
        });
        this.collected1 = new cc.Menu(this.collected1);
        this.collected1.x = 0;
        this.collected1.y = 0;
        this.addChild(this.collected1, 0);

        this.collected2 = new Mkmk_MenuItemImage(
            res.Collected2,
            res.Collected2);
        this.collected2.attr({
            scaleX: this.height/2/this.collected2.height,
            scaleY: this.height/2/this.collected2.height,
            x: 0,
            y: 0,
            anchorX: -3,
            anchorY: 0
        });
        this.collected2 = new cc.Menu(this.collected2);
        this.collected2.x = 0;
        this.collected2.y = 0;
        this.addChild(this.collected2, 0);

        this.collected3 = new Mkmk_MenuItemImage(
            res.Collected3,
            res.Collected3);
        this.collected3.attr({
            scaleX: this.height/2/this.collected3.height,
            scaleY: this.height/2/this.collected3.height,
            x: 0,
            y: 0,
            anchorX: -4,
            anchorY: 0
        });
        this.collected3 = new cc.Menu(this.collected3);
        this.collected3.x = 0;
        this.collected3.y = 0;
        this.addChild(this.collected3, 0);

        this.collected4 = new Mkmk_MenuItemImage(
            res.Collected4,
            res.Collected4);
        this.collected4.attr({
            scaleX: this.height/2/this.collected4.height,
            scaleY: this.height/2/this.collected4.height,
            x: 0,
            y: 0,
            anchorX: -5,
            anchorY: 0
        });
        this.collected4 = new cc.Menu(this.collected4);
        this.collected4.x = 0;
        this.collected4.y = 0;
        this.addChild(this.collected4, 0);

        this.collected5 = new Mkmk_MenuItemImage(
            res.Collected5,
            res.Collected5);
        this.collected5.attr({
            scaleX: this.height/2/this.collected5.height,
            scaleY: this.height/2/this.collected5.height,
            x: 0,
            y: 0,
            anchorX: -6,
            anchorY: 0
        });
        this.collected5 = new cc.Menu(this.collected5);
        this.collected5.x = 0;
        this.collected5.y = 0;
        this.addChild(this.collected5, 0);

        this.collected6 = new Mkmk_MenuItemImage(
            res.Collected6,
            res.Collected6);
        this.collected6.attr({
            scaleX: this.height/2/this.collected6.height,
            scaleY: this.height/2/this.collected6.height,
            x: 0,
            y: 0,
            anchorX: -7,
            anchorY: 0
        });
        this.collected6 = new cc.Menu(this.collected6);
        this.collected6.x = 0;
        this.collected6.y = 0;
        this.addChild(this.collected6, 0);

        this.collected7 = new Mkmk_MenuItemImage(
            res.Collected7,
            res.Collected7);
        this.collected7.attr({
            scaleX: this.height/2/this.collected7.height,
            scaleY: this.height/2/this.collected7.height,
            x: 0,
            y: 0,
            anchorX: -8,
            anchorY: 0
        });
        this.collected7 = new cc.Menu(this.collected7);
        this.collected7.x = 0;
        this.collected7.y = 0;
        this.addChild(this.collected7, 0);

        this.collected8 = new Mkmk_MenuItemImage(
            res.Collected8,
            res.Collected8);
        this.collected8.attr({
            scaleX: this.height/2/this.collected8.height,
            scaleY: this.height/2/this.collected8.height,
            x: 0,
            y: 0,
            anchorX: -9,
            anchorY: 0
        });
        this.collected8 = new cc.Menu(this.collected8);
        this.collected8.x = 0;
        this.collected8.y = 0;
        this.addChild(this.collected8, 0);

        this.collected9 = new Mkmk_MenuItemImage(
            res.Collected9,
            res.Collected9);
        this.collected9.attr({
            scaleX: this.height/2/this.collected9.height,
            scaleY: this.height/2/this.collected9.height,
            x: 0,
            y: 0,
            anchorX: -10,
            anchorY: 0
        });
        this.collected9 = new cc.Menu(this.collected9);
        this.collected9.x = 0;
        this.collected9.y = 0;
        this.addChild(this.collected9, 0);

        //所持アイテム　使用済みにはバツ印をオーバーレイ
        this.menuUsed = new Mkmk_MenuItemImage(
            res.UsedMenu,
            res.UsedMenu);
        this.menuUsed.attr({
            scaleX: this.height/2/this.menuUsed.height,
            scaleY: this.height/2/this.menuUsed.height,
            x: 0,
            y: 0,
            anchorX: -5.5,
            anchorY: 0
        });
        this.menuUsed = new cc.Menu(this.menuUsed);
        this.menuUsed.x = 0;
        this.menuUsed.y = 0;
        this.addChild(this.menuUsed, 0);

        this.cardArrow = new Mkmk_MenuItemImage(
            res.CardArrow,
            res.CardArrow);
        this.cardArrow.attr({
            scaleX: this.height/2/this.cardArrow.height,
            scaleY: this.height/2/this.cardArrow.height,
            x: 0,
            y: 0,
            anchorX: -13,
            anchorY: 0
        });
        this.cardArrow = new cc.Menu(this.cardArrow);
        this.cardArrow.x = 0;
        this.cardArrow.y = 0;
        this.addChild(this.cardArrow, 0);
        this.cardArrowDisable = new Mkmk_MenuItemImage(
            res.DisableMark,
            res.DisableMark);
        this.cardArrowDisable.attr({
            scaleX: this.height/2/this.cardArrowDisable.height,
            scaleY: this.height/2/this.cardArrowDisable.height,
            x: 0,
            y: 1,
            anchorX: -13,
            anchorY: 0
        });
        this.cardArrowDisable = new cc.Menu(this.cardArrowDisable);
        this.cardArrowDisable.x = 0;
        this.cardArrowDisable.y = 0;
        this.addChild(this.cardArrowDisable, 0);

        this.cardPolice = new Mkmk_MenuItemImage(
            res.CardPolice,
            res.CardPolice);
        this.cardPolice.attr({
            scaleX: this.height/2/this.cardPolice.height,
            scaleY: this.height/2/this.cardPolice.height,
            x: 0,
            y: 0,
            anchorX: -14,
            anchorY: 0
        });
        this.cardPolice = new cc.Menu(this.cardPolice);
        this.cardPolice.x = 0;
        this.cardPolice.y = 0;
        this.addChild(this.cardPolice, 0);
        this.cardPoliceDisable = new Mkmk_MenuItemImage(
            res.DisableMark,
            res.DisableMark);
        this.cardPoliceDisable.attr({
            scaleX: this.height/2/this.cardPoliceDisable.height,
            scaleY: this.height/2/this.cardPoliceDisable.height,
            x: 0,
            y: 1,
            anchorX: -14,
            anchorY: 0
        });
        this.cardPoliceDisable = new cc.Menu(this.cardPoliceDisable);
        this.cardPoliceDisable.x = 0;
        this.cardPoliceDisable.y = 0;
        this.addChild(this.cardPoliceDisable, 0);

        this.cardPeople = new Mkmk_MenuItemImage(
            res.CardPeople,
            res.CardPeople);
        this.cardPeople.attr({
            scaleX: this.height/2/this.cardPeople.height,
            scaleY: this.height/2/this.cardPeople.height,
            x: 0,
            y: 0,
            anchorX: -15,
            anchorY: 0
        });
        this.cardPeople = new cc.Menu(this.cardPeople);
        this.cardPeople.x = 0;
        this.cardPeople.y = 0;
        this.addChild(this.cardPeople, 0);
        this.cardPeopleDisable = new Mkmk_MenuItemImage(
            res.DisableMark,
            res.DisableMark);
        this.cardPeopleDisable.attr({
            scaleX: this.height/2/this.cardPeopleDisable.height,
            scaleY: this.height/2/this.cardPeopleDisable.height,
            x: 0,
            y: 1,
            anchorX: -15,
            anchorY: 0
        });
        this.cardPeopleDisable = new cc.Menu(this.cardPeopleDisable);
        this.cardPeopleDisable.x = 0;
        this.cardPeopleDisable.y = 0;
        this.addChild(this.cardPeopleDisable, 0);

        //プレイヤー名の表示
        this.playerName = new cc.LabelTTF.create("","Meiryo",this.height);
        this.playerName.attr({
            x: 0,
            y: 0,
            anchorX: 0,
            anchorY: 0
        });
        this.addChild(this.playerName, 0);


        this.pocketList = [this.pocket1,this.pocket2,this.pocket3,this.pocket4,this.pocket5,this.pocket6,this.pocket7,this.pocket8,this.pocket9];
        this.collectedList = [this.collected1,this.collected2,this.collected3,this.collected4,this.collected5,this.collected6,this.collected7,this.collected8,this.collected9];
        this.usedList = [this.cardArrowDisable,this.cardPoliceDisable,this.cardPeopleDisable];
        function init(Mkmk_MenuItemImage){
            Mkmk_MenuItemImage.setVisible(false);
        }
        this.pocketList.forEach(init);
        this.collectedList.forEach(init);
        this.usedList.forEach(init);
        //アイテムの初期状態セット

        return true;
    }
  , statusChanged:function(player){
      for (var i = this.pocketList.length - 1; i >= 0; i--) {
          this.pocketList[i].setVisible(player.isBasket(i));
      };
      for (var i = this.collectedList.length - 1; i >= 0; i--) {
          this.collectedList[i].setVisible(player.isCollected(i));
      };
      for (var i = this.usedList.length - 1; i >= 0; i--) {
          this.usedList[i].setVisible(player.isAlreadyUse(i));
      };
    }
  , updatePlayerStatusView:function(player){
    cc.log("update status");
    this.removeChild(this.playerName, 0);
    this.playerName = new cc.LabelTTF.create(player.playerName,"Meiryo",this.height/2);
    this.playerName.attr({
        x: this.width-this.playerName.width,
        y: this.height-this.playerName.height,
        anchorX: 0,
        anchorY: 0
    });
    this.addChild(this.playerName, 0);
  }
  , setPlayer:function(player){
      this.player = player;
    }
});