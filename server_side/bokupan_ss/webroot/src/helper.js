function Helper(){
	this.id = 0; // 送信する変数
};

/* Labelの定義 */
Helper.LABEL = {
    MOVE_BUTTON		: "MOVE_BUTTON"
  , ARROW_BUTTON 	: "ARROW_BUTTON"
  , GET_BUTTON 		: "GET_BUTTON"
  , ITEM_BUTTON 	: "ITEM_BUTTON" 
  , ITEM_ARROW		: "ITEM_ARROW"
  , ITEM_POLICE		: "ITEM_POLICE"
  , ITEM_PEOPLE		: "ITEM_PEOPLE"
  , TOUCH 			: "TOUCH"
  , NEW_PLAYER 		: "NEW_PLAYER"
  , CAST_DICE		: "CAST_DICE"
  , CHOOSE_HOME		: "CHOOSE_HOME"
  , TWO_CHOICE		: "TWO_CHOICE"
}

/*
 * 送信用にjson文字列にエンコードする。
 */
Helper.prototype.encode = function(_label, _action){
	this.id++;
/*
	var return_str = null;
	switch (_label) {
		case Helper.LABEL.MOVE_BUTTON:
			return_str = this.move_formatter(this.id, _action);
			break;
		case default:
			break;
	}
	return return_str;
*/
	return JSON.stringify({
		"id": this.id,
		"label": _label,
		"action": _action
	});
}

/*
 * ラベル毎に
 */
Helper.prototype.move_formatter = function(_id, _action) {
	return JSON.stringify({
		"id": _id,
		"label": Helper.LABEL.MOVE_BUTTON,
		"action": _action
	});
}

/*
 * 受信したjson文字列をデコードする。
 * idが自分のid以下の場合は捨てる。
 */
Helper.prototype.decode = function(_recive_json_str) {
	var receive_data = JSON.parse(_recive_json_str);
	if(receive_data.id <= this.id && receive_data.label != Helper.LABEL.NEW_PLAYER ) {
		console.log("igonre this data (received:", receive_data.id, ") this:",this.id );
		return null;
	}
	this.id = receive_data.id;
	return receive_data;
}