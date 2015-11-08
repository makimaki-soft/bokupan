/*
 * WebRTC用 javascriptソース
 * ペアリングを行う
 */

var rtc_manager = function() {

	var APIKEY = "e60d120e-13a7-4050-b6d2-94616fece3d6";
	var DEBUG_MODE = 0;

	var peer = null;
	var myid = null; // 自身のPeerID
	var connectId = null;
	var receive_action = null; //func

	var close_callback;// コネクションのcloseイベントが発火した時に実行する処理

	var connect = function(c) {
		console.log("peer.on('connection') called." + c.peer);
		connectId = c.peer;
		c.on('data', receive);
		c.on('close', function(){
			console.log("[Close]:プレイヤーが退出しました。ゲームを修了します。");
			close_callback();
		});
		c.on('error', function(e){
			console.log("[Error]:" + e);
			console.log("エラーが発生しました。ゲームを修了します。");
		});
	}

	var receive = function(data) {
		console.log('Received: ' + data);

		if(receive_action != null) {
			receive_action(this.peer, data);
		}
	}

	return {
		// 最初に呼ぶ
		init : function(_open_callback, _close_callback) {
			peer = new Peer({key : APIKEY, debug : DEBUG_MODE});
			peer.on('open', function(id) {
				myid = id;
				console.log('My peer ID is: ' + myid);
				_open_callback(id);
			});
			peer.on('connection', connect);
			close_callback = _close_callback;
		},

		// 最初に接続するときに呼ぶ
		connecting : function(to) {
			console.log("connect to " + to);
			connectId = to;
			var conn = peer.connect(to);
			conn.on('open', function(){
				console.log("conn.on('data') called.");
				conn.send("Hello!");
				connect(conn);
			});
		},

		send : function(msg) {
			if (Object.keys(peer.connections).length != 0) {
				var conn = peer.connections[connectId][0];
				conn.send(msg);
			}else {
				console.log("no connections");
			}
		},

		close : function() {
			if (!!peer && !peer.destroyed) {
				peer.destroy();
			}
		},

		getmyid : function() {
			return myid;
		},

		setReceiveAction : function(_func) {
			// _funcが関数かどうか判定
			// if(){return;}
			receive_action = _func;
		}
	}
}();