function Mkmk_PlayerStatus(playerID, playerName, initialPosition){
	this.playerID   = playerID;
	this.PlayerName = playerName;
	this.currPos = initialPosition;
	this.initialPosition = initialPosition;
	
	// カゴ、コンテナの初期値は空
	this.basketStatus = 0;
	this.containerStatus = 0;
	this.ItemAlreadyUsed = 0;
	
	this.setNewPantsToBasket = function(position_id){
		if(isTargetHome(position_id)){
			this.basketStatus |= (1 << position_id);
		}
	}
	
	this.setBasketToContainer = function(){
		this.containerStatus |= this.basketStatus;
		this.basketStatus = 0;
	}
	
	this.checkAcquired = function(position_id){
		var usage = this.basketStatus | this.containerStatus;
		return Boolean(usage & (1<<position_id));
	}
	
	this.checkContainerFull = function(){
		return (this.containerStatus == 0x1FF);
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
	}
	
	this.isAlreadyUse = function(item_id){
		return Boolean(this.ItemAlreadyUsed & (1<<item_id));
	}
	
	this.isAlreadyUseAll = function(item_id){
		return (this.ItemAlreadyUsed == 0x07);
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