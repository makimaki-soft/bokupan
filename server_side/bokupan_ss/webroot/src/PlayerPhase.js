mkmk.phases.playerPhase.attr({
    
    nextPhase : [ mkmk.phases.comPhase,
                  mkmk.phases.playerPhase]
                  
  , childPhase :  mkmk.phases.actionChoicePhase 
      
   /**
    * playerPhaseの開始処理
    *  - 次のフェーズがComかプレイヤーか決定し、子フェーズを開始する。
    */
  , onEnter : function(){
        cc.log("onEnter Player Phase");
        var self = this;
        var gameStatusLayer = this.layers.gameStatusLayer;
        var menuLayer       = this.layers.menuLayer;
             
        var currPlayer = gameStatus.getCurrPlayer();

        menuLayer.updateGameStatusText(currPlayer);
        gameStatusLayer.updateMsg(currPlayer.playerName + "さんのターンです。");
        
        // 順番が最後のプレイヤのフェーズが終了するとComフェーズ、それ以外は次のプレイヤのフェーズ
        if(gameStatus.isLastPlayer(currPlayer)){
            this.nextPhaseIdx = 0; // comPhase
        }else{
            this.nextPhaseIdx = 1; // playerPhase
        }
        
        // 子フェーズを開始する。
        this.gotoChildPhase(0);
    }
    
    /**
     * playerPhaseの終了処理
     *  - 次のプレイヤーに変更する。
     */
  , onExit : function(){
        cc.log("onExit Player Phase");
        var currPlayer = gameStatus.getCurrPlayer();
        setTimeout(function(){
            // 終了判定
            if( currPlayer.checkIfUpdateContainer() ){
                bkpn.terminateBokupan();
            }
        }, 1000 );
        gameStatus.chengePlayer();
    }
});