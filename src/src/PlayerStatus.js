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