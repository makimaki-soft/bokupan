rtc_manager.setReceiveAction(function(peerID, data){
    // cc.log(peerID,data);
    var mainMapLayer = bkpn.scene.main.layers.mainMapLayer;
    var gameStatusLayer = bkpn.scene.main.layers.gameStatusLayer;
    var playerStatusLayer = bkpn.scene.main.layers.playerStatusLayer;
    
    var decoded = rtc_helper.decode(data);

    if(decoded == null){
        return;
    }

    var home_text = ["A", "B", "C", "D"];
    switch(decoded.label){
        case Helper.LABEL.NEW_PLAYER:
            // プレイヤーが参加する。
            if( rtc_manager.isHost ){
                    
                // 初めて送られてきたpeerIDの場合は、プレイヤーを追加する
                var currLen  = gameStatus.players.length;
                for(var i=0 ; i<currLen ; i++ ){
                    if(gameStatus.players[i].myPeerID==peerID){
                        // すでに作成ずみ
                        break;
                    }
                    var newID = gameStatus.getNewPlayerID();
                    var firstPos = [POSITION_ID.HOME_A, POSITION_ID.HOME_B, POSITION_ID.HOME_C, POSITION_ID.HOME_D];
                    var newPlayer = new Mkmk_PlayerStatus(newID, home_text[newID], firstPos[newID], playerStatusLayer, peerID);
                    mainMapLayer.setPlayer(newPlayer);
                    gameStatus.addPlayer(newPlayer);
                    mainMapLayer.textConsole("プレイヤーが参加しました。");
                    gameStatusLayer.updateMsg(newPlayer.playerName + "さんが参加しました。");

                    break;
                }

                // 全員のIDを教えてやる。
                currLen  = gameStatus.players.length;
                for(var i=0 ; i<currLen ; i++ ){
                    var currPlayer = gameStatus.players[i];
                    rtc_manager.send(rtc_helper.encode(Helper.LABEL.NEW_PLAYER, {
                                                            "id"     : currPlayer.playerID,
                                                            "peerID" : currPlayer.myPeerID}));
                }

            　}else{
                
                var newID = decoded.action.id;
                var targetPeerID = decoded.action.peerID;

                // 作成済みでないプレイヤを追加する
                var bFind = false;
                for(var i=0 ; i<gameStatus.players.length ; i++ ){
                    if(gameStatus.players[i].myPeerID==targetPeerID){
                        bFind = true;
                        break;
                    }
                }

                if( !bFind ){
                    var firstPos = [POSITION_ID.HOME_A, POSITION_ID.HOME_B, POSITION_ID.HOME_C, POSITION_ID.HOME_D];
                    var newPlayer = new Mkmk_PlayerStatus(newID, home_text[newID], firstPos[newID], playerStatusLayer, decoded.action.peerID);
                    mainMapLayer.setPlayer(newPlayer);
                    gameStatus.addPlayer(newPlayer);
                    playerStatusLayer.setPlayer(newPlayer);
                    mainMapLayer.textConsole("プレイヤーが参加しました。");
                    gameStatusLayer.updateMsg(newPlayer.playerName + "さんが参加しました。");
                }
            }
            
            // 人数が集まったらゲームを開始する。
            if( gameStatus.players.length == 2 ){
                mkmk.phases.playerPhase.onEnter();
                gameStatusLayer.updateMsg("ゲームを開始します。");
            }
            break;
        default:
            cc.eventManager.dispatchCustomEvent(decoded.label, decoded.action);
            cc.log(decoded);
            break;
    }    
});