function Mkmk_PlayerStatus(playerID, playerName, initialPosition, view, peerID){
	this.playerID   = playerID;
	this.PlayerName = playerName;
	this.currPos = initialPosition;
	this.initialPosition = initialPosition;
	this.view = view;
	this.myPeerID = peerID;
	
	// カゴ、コンテナの初期値は空
	this.basketStatus = 0;
	this.containerStatus = 0;
	this.ItemAlreadyUsed = 0;
	
	this.setNewPantsToBasket = function(position_id){
		if(isTargetHome(position_id)){
			this.basketStatus |= (1 << position_id);
		}
		view.statusChanged(this);
	}
	
	this.setBasketToContainer = function(){
		this.containerStatus |= this.basketStatus;
		this.basketStatus = 0;
		view.statusChanged(this);
	}

	this.isBasket = function(position_id){
		var usage = this.basketStatus;
		return Boolean(usage & (1<<position_id));
	}

	this.isCollected = function(position_id){
		var usage = this.containerStatus;
		return Boolean(usage & (1<<position_id));
	}
	
	this.checkAcquired = function(position_id){
		var usage = this.basketStatus | this.containerStatus;
		return Boolean(usage & (1<<position_id));
	}
	
	this.checkContainerFull = function(){
		return (this.containerStatus == 0x1FF);
	}
	
	this.clearBasket = function(){
		this.basketStatus = 0;
		view.statusChanged(this);
	}
	
	this.getCurrPosition = function(){
		return this.currPos;
	}
	this.setCurrPosition = function(position_id){
		this.currPos = position_id;
	}
	
	this.useItem = function(item_id){
		if( item_id < ITEM.NUM ){
			this.ItemAlreadyUsed |= (1 << item_id);
		}
		view.statusChanged(this);
	}
	
	this.isAlreadyUse = function(item_id){
		return Boolean(this.ItemAlreadyUsed & (1<<item_id));
	}
	
	this.isAlreadyUseAll = function(item_id){
		return (this.ItemAlreadyUsed == 0x07);
	}
	this.isMe = function(){
		return (this.myPeerID == rtc_manager.getmyid());
	}
	this.checkIfUpdateContainer = function(){
		if( this.initialPosition == this.currPos ){
			this.setBasketToContainer();
		}
	}
	this.checkIfForfeitPosition = function(pos){
		if( pos == this.currPos && this.basketStatus > 0){
			this.clearBasket();
			return true;
		}
		return false;
	}
}

function Mkmk_PoliceStatus(initialPosition){
	this.currPos = initialPosition;
	this.currDir = DIR.RIGHT;
	this.arrows = null;
	
	this.getCurrPosition = function(){
		return this.currPos;
	}
	this.setCurrPosition = function(position_id){
		this.currPos = position_id;
	}
	this.setArrows = function(arrows){
		this.arrows = arrows;
	}
	this.getNextDir = function(){
		
		var currPos = this.currPos;
		var currDir = this.currDir;
		
		switch(currPos){
			case POSITION_ID.HOME_1:
				switch(currDir){
					case DIR.LEFT:
						return DIR.UP;
					case DIR.DOWN:
						return DIR.RIGHT;
				}
				break;
			case POSITION_ID.HOME_2:
				return this.arrows[1].dir;
			case POSITION_ID.HOME_3:
				switch(currDir){
					case DIR.RIGHT:
						return DIR.UP;
					case DIR.DOWN:
						return DIR.LEFT;
				}
				break;
			case POSITION_ID.HOME_4:
				return this.arrows[0].dir;
			case POSITION_ID.HOME_5:
				return currDir;
			case POSITION_ID.HOME_6:
				return this.arrows[3].dir;
			case POSITION_ID.HOME_7:
				switch(currDir){
					case DIR.LEFT:
						return DIR.DOWN;
					case DIR.UP:
						return DIR.RIGHT;
				}
				break;
			case POSITION_ID.HOME_8:
				return this.arrows[2].dir;
			case POSITION_ID.HOME_9:
				switch(currDir){
					case DIR.RIGHT:
						return DIR.DOWN;
					case DIR.UP:
						return DIR.LEFT;
				}
				break;
		}
		
		return currDir;
	}
	this.updateDir = function(){
		this.currDir = this.getNextDir();
	}
}

function Mkmk_GirlsStatus(initialPosition){
	this.currPos = initialPosition;
	
	this.setPos = function(pos){
		this.currPos = pos;
	}
}

function Mkmk_GameStatus(){
	
	this.players = [];
	this.currPlayerIdx = 0;
	
	this.addPlayer = function(newPlayer){
		
		this.players.push(newPlayer);
		this.players.sort(function(a,b){
    		if(a.playerID<b.playerID) return -1;
    		if(a.playerID > b.playerID) return 1;
    		return 0;
		});
	}
	this.getCurrPlayer = function(){
		return this.players[this.currPlayerIdx];
	}
	this.getPlayer = function(playerIdx){
		return this.players[playerIdx];
	}
	this.chengePlayer = function(){
		var idx = this.currPlayerIdx;
		var nextIdx = (++idx)%this.players.length;
		this.currPlayerIdx = nextIdx;
	}
	this.getNewPlayerID = function(){
		return this.players.length;
	}
	this.findPlayerByPeerID = function(peerID){
		for(var i=0 ; i<this.players.length; i++){
			if( this.players[i].myPeerID == peerID ){
				return this.players[i];
			}
		}
		
		return null;
	}
	/**
     * 最終プレイヤーの判定
     *  @param player {Mkmk_PlayerStatus} - プレイヤー
	 *  @return {boolean} 最終プレイヤーかどうか
     */
	this.isLastPlayer = function(player){
		if( player.playerID == this.players.length -1 ){
			return true;
		}
		return false;
	}
	/**
	 *  全プレイヤーオブジェクト配列の取得
	 *  @return {Mkmk_PlayerStatus[]} - プレイヤー配列
	 */
	this.getAllPlayers = function(){
		return this.players;
	}
}	

var gameStatus = new Mkmk_GameStatus();
