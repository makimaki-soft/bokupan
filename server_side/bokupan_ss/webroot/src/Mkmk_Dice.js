var castDice = function(){
	return (Math.floor( Math.random() * 100 ) % 6)+1;
}

var chooseHome = function(){
	var home = (Math.floor( Math.random() * 100 ) % 9)+1;
	switch(home){
		case 1:
			return POSITION_ID.HOME_1;
		case 2:
			return POSITION_ID.HOME_2;
		case 3:
			return POSITION_ID.HOME_3;
		case 4:
			return POSITION_ID.HOME_4;
		case 5:
			return POSITION_ID.HOME_5;
		case 6:
			return POSITION_ID.HOME_6;
		case 7:
			return POSITION_ID.HOME_7;
		case 8:
			return POSITION_ID.HOME_8;
		case 9:
			return POSITION_ID.HOME_9;
		default:
			return null;
	}
}