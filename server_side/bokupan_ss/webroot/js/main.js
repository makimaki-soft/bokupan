(function() {

// rtc関連
var open_callback_handler = function(peer_id) {
	
	var host_pid = $("#info").data("room-hpid");
	var member_num = parseInt($("#info").data("room-member"));
	var is_host = (host_pid == "") ? true : false;
	if(is_host) { // ホストユーザの場合(部屋人数が1の時)はサーバにpeer_idを送る
		console.log("I am host");
		$.ajax({
			url: '/bokupan-ss/rooms/ready/' +$("#info").data("room-id") + '/' + peer_id,
			success: function(data) {
				//console.log(data);
			}
		});
	}else { // ホストユーザでない場合はサーバに人数追加する
		console.log("I am servant");
		$.ajax({
			method: "POST",
			url: '/bokupan-ss/rooms/edit/' + $("#info").data("room-id"),
			data: {"member_num": member_num + 1},
			success: function(data) {
				//console.log(data);
			}
		});

		// hostに接続
		rtc_manager.connecting(host_pid);
	}
}

var close_callback_handler = function(){
	$.ajax({
		method: "POST",
		url: '/bokupan-ss/rooms/delete/' + $("#info").data("room-id"),
		success: function(data) {
			console.log("close success");
		}
	});
}

rtc_manager.init(open_callback_handler, close_callback_handler);

$(window).on('beforeunload', function() {
	return "ゲームを修了しました。";
});

})();