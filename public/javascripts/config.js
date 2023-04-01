/************************************************************/
/*********************** CONFIG VALUES **********************/
/************************************************************/

let ENEMY_NUMBER = 5;
let ENEMY_SPEED = 1/10000;
let ENEMY_SPAWN_COOLDOWN = 2000; //ms


let TURRET_RELOAD = 200; //ms
let TURRET_RANGE = 500; //px

let BULLET_DAMAGE = 50;
let BULLET_SPEED = 2000; 




/************************************************************/
/*************************** GAME ***************************/
/************************************************************/


let map =      
[[ 0,-1, 0, 0, 0, 0, 0, 0, 0, 0],
[ 0,-1, 0, 0, 0, 0, 0, 0, 0, 0],
[ 0,-1,-1,-1,-1,-1,-1,-1, 0, 0],
[ 0, 0, 0, 0, 0, 0, 0,-1, 0, 0],
[ 0, 0, 0, 0, 0, 0, 0,-1, 0, 0],
[ 0, 0, 0, 0, 0, 0, 0,-1, 0, 0],
[ 0, 0, 0, 0, 0, 0, 0,-1, 0, 0],
[ 0, 0, 0, 0, 0, 0, 0,-1, 0, 0]];


