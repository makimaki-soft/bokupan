var NEIGHBER = {
  LEFT  : 0,
  ABAVE : 1,
  RIGHT : 2,
  BELOW : 3
}

var POSITION = {
  HOME_1 : 0,
  HOME_2 : 1,
  HOME_3 : 2,
  HOME_4 : 3, 
  HOME_5 : 4,
  HOME_6 : 5,
  HOME_7 : 6,
  HOME_8 : 7,
  HOME_9 : 8,
  HOME_A : 9,
  HOME_B : 10,
  HOME_C : 11,
  HOME_D : 12,
  NUM_HOME : 13
}

var NextHome = [
  [POSITION.HOME_A, POSITION.HOME_4, POSITION.HOME_2,            null],   // HOME_1
  [POSITION.HOME_1, POSITION.HOME_5, POSITION.HOME_3,            null],   // HOME_2
  [POSITION.HOME_2, POSITION.HOME_6, POSITION.HOME_B,            null],   // HOME_3
  [           null, POSITION.HOME_7, POSITION.HOME_5, POSITION.HOME_1],   // HOME_4
  [POSITION.HOME_4, POSITION.HOME_8, POSITION.HOME_6, POSITION.HOME_2],   // HOME_5
  [POSITION.HOME_5, POSITION.HOME_9,            null, POSITION.HOME_3],   // HOME_6
  [POSITION.HOME_C,            null, POSITION.HOME_8, POSITION.HOME_4],   // HOME_7
  [POSITION.HOME_7,            null, POSITION.HOME_9, POSITION.HOME_5],   // HOME_8
  [POSITION.HOME_8,            null, POSITION.HOME_D, POSITION.HOME_6],   // HOME_9
  [           null,            null, POSITION.HOME_1,            null],   // HOME_A
  [POSITION.HOME_3,            null,            null,            null],   // HOME_B
  [           null,            null, POSITION.HOME_7,            null],   // HOME_C
  [POSITION.HOME_9,            null,            null,            null]    // HOME_D
]

var HomeCoordinate = {
    homeA : {x:24 , y:90 }
  , homeB : {x:374, y:90 }
  , homeC : {x:24  ,y:310}
  , homeD : {x:374, y:310}
  , home1 : {x:90,  y:90 }
  , home2 : {x:200, y:90 }
  , home3 : {x:309, y:90 }
  , home4 : {x:90,  y:200}
  , home5 : {x:200, y:200}
  , home6 : {x:309, y:200}
  , home7 : {x:90,  y:310}
  , home8 : {x:200, y:310}
  , home9 : {x:309, y:310}
}

var getCoordinate = function(pos){
  switch(pos){
    case POSITION.HOME_1:
      return HomeCoordinate.home1;
    case POSITION.HOME_2:
      return HomeCoordinate.home2;
    case POSITION.HOME_3:
      return HomeCoordinate.home3;
    case POSITION.HOME_4:
      return HomeCoordinate.home4;
    case POSITION.HOME_5:
      return HomeCoordinate.home5;
    case POSITION.HOME_6:
      return HomeCoordinate.home6;
    case POSITION.HOME_7:
      return HomeCoordinate.home7;
    case POSITION.HOME_8:
      return HomeCoordinate.home8;
    case POSITION.HOME_9:
      return HomeCoordinate.home9;
    case POSITION.HOME_A:
      return HomeCoordinate.homeA;
    case POSITION.HOME_B:
      return HomeCoordinate.homeB;
    case POSITION.HOME_C:
      return HomeCoordinate.homeC;
    case POSITION.HOME_D:
      return HomeCoordinate.homeD;
  }  
}

var getNeighber = function(pos){
  switch(pos){
    case POSITION.HOME_1:
      return [NEIGHBER.LEFT,NEIGHBER.ABAVE,NEIGHBER.RIGHT];
    case POSITION.HOME_2:
      return [NEIGHBER.LEFT,NEIGHBER.ABAVE,NEIGHBER.RIGHT];
    case POSITION.HOME_3:
      return [NEIGHBER.LEFT,NEIGHBER.ABAVE,NEIGHBER.RIGHT];
    case POSITION.HOME_4:
      return [NEIGHBER.ABAVE,NEIGHBER.RIGHT,NEIGHBER.BELOW];
    case POSITION.HOME_5:
      return [NEIGHBER.LEFT,NEIGHBER.ABAVE,NEIGHBER.RIGHT,NEIGHBER.BELOW];
    case POSITION.HOME_6:
      return [NEIGHBER.LEFT,NEIGHBER.ABAVE,NEIGHBER.BELOW];
    case POSITION.HOME_7:
      return [NEIGHBER.LEFT,NEIGHBER.RIGHT,NEIGHBER.BELOW];
    case POSITION.HOME_8:
      return [NEIGHBER.LEFT,NEIGHBER.RIGHT,NEIGHBER.BELOW];
    case POSITION.HOME_9:
      return [NEIGHBER.LEFT,NEIGHBER.RIGHT,NEIGHBER.BELOW];
    case POSITION.HOME_A:
      return [NEIGHBER.RIGHT];
    case POSITION.HOME_B:
      return [NEIGHBER.LEFT];
    case POSITION.HOME_C:
      return [NEIGHBER.RIGHT];
    case POSITION.HOME_D:
      return [NEIGHBER.LEFT];
  }  
}

var getNextHome = function(pos, neighber){
      return NextHome[pos][neighber];
}

