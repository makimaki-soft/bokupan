var NEIGHBER = {
  LEFT  : 0,
  ABAVE : 1,
  RIGHT : 2,
  BELOW : 3
}

var DIR = {
  LEFT  : 0,
  UP    : 1,
  RIGHT : 2,
  DOWN  : 3
} 

var DIR_ANG = [
    -90 // LEFT
  ,   0 // ABAVE
  ,  90 // RIGHT
  , 180 // BELOW
];

var POSITION_ID = {
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
  ALLOW_1 : 13,
  ALLOW_2 : 14,
  ALLOW_3 : 15,
  ALLOW_4 : 16,
  ROAD_1  : 17,
  ROAD_2  : 18,
  ROAD_3  : 19,
  ROAD_4  : 20,
  ROAD_5  : 21,
  ROAD_6  : 22,
  ROAD_7  : 23,
  ROAD_8  : 24,
  ROAD_9  : 25,
  ROAD_10  : 26,
  ROAD_11  : 27,
  ROAD_12  : 28,
  NUM_POSISION : 29
}

var ITEM = {
  ARROW : 0,
  POLICE : 1,
  PEOPLE : 2,
  NUM : 3
}

// Positional relationship of the house to each other
var HOME_Relation = [
  //             LEFT,              ABOVE,              RIGHT,              BELOW
  [POSITION_ID.HOME_A, POSITION_ID.ROAD_3 , POSITION_ID.ROAD_1,               null],   // HOME_1
  [POSITION_ID.ROAD_1, POSITION_ID.ROAD_4 , POSITION_ID.ROAD_2,               null],   // HOME_2
  [POSITION_ID.ROAD_2, POSITION_ID.ROAD_5 , POSITION_ID.HOME_B,               null],   // HOME_3
  [              null, POSITION_ID.ROAD_8 , POSITION_ID.ROAD_6, POSITION_ID.ROAD_3],   // HOME_4
  [POSITION_ID.ROAD_6, POSITION_ID.ROAD_9 , POSITION_ID.ROAD_7, POSITION_ID.ROAD_4],   // HOME_5
  [POSITION_ID.ROAD_7, POSITION_ID.ROAD_10,               null, POSITION_ID.ROAD_5],   // HOME_6
  [POSITION_ID.HOME_C,               null, POSITION_ID.ROAD_11, POSITION_ID.ROAD_8],   // HOME_7
  [POSITION_ID.ROAD_11,              null, POSITION_ID.ROAD_12, POSITION_ID.ROAD_9],   // HOME_8
  [POSITION_ID.ROAD_12,              null, POSITION_ID.HOME_D, POSITION_ID.ROAD_10],   // HOME_9
  [              null,               null, POSITION_ID.HOME_1,               null],   // HOME_A
  [POSITION_ID.HOME_3,               null,               null,               null],   // HOME_B
  [              null,               null, POSITION_ID.HOME_7,               null],   // HOME_C
  [POSITION_ID.HOME_9,               null,               null,               null],   // HOME_D
  [              null,             DIR.UP,          DIR.RIGHT,           DIR.DOWN],   // ALLOW_1
  [          DIR.LEFT,             DIR.UP,          DIR.RIGHT,               null],   // ALLOW_2
  [          DIR.LEFT,               null,          DIR.RIGHT,           DIR.DOWN],   // ALLOW_3
  [          DIR.LEFT,             DIR.UP,               null,           DIR.DOWN],   // ALLOW_4
  [POSITION_ID.HOME_1,               null, POSITION_ID.HOME_2,               null],   // ROAD_1
  [POSITION_ID.HOME_2,               null, POSITION_ID.HOME_3,               null],   // ROAD_2
  [              null, POSITION_ID.HOME_4,               null, POSITION_ID.HOME_1],   // ROAD_3
  [              null, POSITION_ID.HOME_5,               null, POSITION_ID.HOME_2],   // ROAD_4
  [              null, POSITION_ID.HOME_6,               null, POSITION_ID.HOME_3],   // ROAD_5
  [POSITION_ID.HOME_4,               null, POSITION_ID.HOME_5,               null],   // ROAD_6
  [POSITION_ID.HOME_5,               null, POSITION_ID.HOME_6,               null],   // ROAD_7
  [              null, POSITION_ID.HOME_7,               null, POSITION_ID.HOME_4],   // ROAD_8
  [              null, POSITION_ID.HOME_8,               null, POSITION_ID.HOME_5],   // ROAD_9
  [              null, POSITION_ID.HOME_9,               null, POSITION_ID.HOME_6],   // ROAD_10
  [POSITION_ID.HOME_7,               null, POSITION_ID.HOME_8,               null],   // ROAD_11
  [POSITION_ID.HOME_8,               null, POSITION_ID.HOME_9,               null],   // ROAD_12
]

var Coordinate = [
    {x:90,  y:90 }  // HOME_1
  , {x:200, y:90 }  // HOME_2
  , {x:309, y: 90}  // HOME_3
  , {x: 90, y:200}  // HOME_4
  , {x:200, y:200}  // HOME_5
  , {x:309, y:200}  // HOME_6
  , {x: 90, y:310}  // HOME_7
  , {x:200, y:310}  // HOME_8
  , {x:309, y:310}  // HOME_9
  , {x: 24, y: 90}  // HOME_A
  , {x:374, y: 90}  // HOME_B
  , {x: 24, y:310}  // HOME_C
  , {x:374, y:310}  // HOME_D
  , {x: 35, y:168}  // ALLOW_1
  , {x:239, y: 39}  // ALLOW_2
  , {x:165, y:370}  // ALLOW_3
  , {x:365, y:233}  // ALLOW_4
  , {x:145, y: 90}  // ROAD_1
  , {x:255, y: 90}  // ROAD_2
  , {x: 90, y:145}  // ROAD_3
  , {x:200, y:145}  // ROAD_4
  , {x:309, y:145}  // ROAD_5
  , {x:145, y:200}  // ROAD_6
  , {x:255, y:200}  // ROAD_7
  , {x: 90, y:255}  // ROAD_8
  , {x:200, y:255}  // ROAD_9
  , {x:309, y:255}  // ROAD_10
  , {x:145, y:310}  // ROAD_11
  , {x:255, y:310}  // ROAD_12
];  



var getCoordinate = function(positionID){
  return Coordinate[positionID];
}

var getNextHome = function(pos, neighber){
      return HOME_Relation[pos][neighber];
}

var getNeighber = function(pos){
  var neighber = [];
  var cand = [NEIGHBER.LEFT, NEIGHBER.ABAVE, NEIGHBER.RIGHT, NEIGHBER.BELOW];
  for(var i=0 ; i<cand.length ; i++){
    if( HOME_Relation[pos][i] != null){
      neighber.push(cand[i]);
    }
  }
  return neighber;
}

var isHome = function(positionID){
  return POSITION_ID.HOME_1 <= positionID && positionID <= POSITION_ID.HOME_D;
}
var isTargetHome = function(positionID){
  return POSITION_ID.HOME_1 <= positionID && positionID <= POSITION_ID.HOME_9;
}
var isDenHome = function(positionID){
  return POSITION_ID.HOME_A <= positionID && positionID <= POSITION_ID.HOME_D;
}
var isRoad = function(positionID){
  return POSITION_ID.ROAD_1 <= positionID && positionID <= POSITION_ID.ROAD_12;
}
var isArrow = function(positionID){
  return POSITION_ID.ALLOW_1 <= positionID && positionID <= POSITION_ID.ALLOW_4;
}

var isIntersectionWithArrow = function(positionID){
  return     ( positionID == POSITION_ID.HOME_2) 
          || ( positionID == POSITION_ID.HOME_4) 
          || ( positionID == POSITION_ID.HOME_6) 
          || ( positionID == POSITION_ID.HOME_8);
          
}

var getArrowByRoadPosition = function(positionID){
  switch(positionID){
    case POSITION_ID.HOME_2:
      return POSITION_ID.ALLOW_2;
    case POSITION_ID.HOME_4:
      return POSITION_ID.ALLOW_1;
    case POSITION_ID.HOME_6:
      return POSITION_ID.ALLOW_4;
    case POSITION_ID.HOME_8:
      return POSITION_ID.ALLOW_3;
    default:
      return null;
  }        
}
