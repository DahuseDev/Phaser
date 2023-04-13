/************************************************************/
/*********************** CONFIG VALUES **********************/
/************************************************************/

let ENEMY_NUMBER = 5;
let ENEMY_SPEED = 1/10000;
let ENEMY_SPAWN_COOLDOWN = 2000; //ms

let TURRET_RELOAD = 1000; //ms
let TURRET_RANGE = 500; //px

let BULLET_DAMAGE = 50;
let BULLET_SPEED = 2000; 




/************************************************************/
/*************************** GAME ***************************/
/************************************************************/

let difficulty = 0;
let map =      
[[ 0,-1, 0, 0, 0, 0, 0, 0, 0, 0],
[ 0,-1, 0, 0, 0, 0, 0, 0, 0, 0],
[ 0,-1,-1,-1,-1,-1,-1,-1, 0, 0],
[ 0, 0, 0, 0, 0, 0, 0,-1, 0, 0],
[ 0, 0, 0, 0, 0, 0, 0,-1, 0, 0],
[ 0, 0, 0, 0, 0, 0, 0,-1, 0, 0],
[ 0, 0, 0, 0, 0, 0, 0,-1, 0, 0],
[ 0, 0, 0, 0, 0, 0, 0,-1, 0, 0]];


// pasar a map 
// let mapa3 = new Map([[1,"a"],[2,"3"]])

// let rounds = 
// new Map([
//     [1,
//         new Map([
//             ['tank',1]
//         ])
//     ],

//     [2,
//         new Map([
//             ['tank',2]
//         ])
//     ],

//     [3,
//         new Map([
//             ['tank',3]
//         ])
//     ],

//     [4,
//         new Map([
//             ['tank',4]
//         ])
//     ],

//     [5,
//         new Map([
//             ['tank',5]
//         ])
//     ],
// ])

let enemyStats = {
    'tank':{
        'speed':1,
        'hp':100
    },
    'tankRed':{
        'speed':0.6,
        'hp':250
    }
}

let rounds = 
{
    1:{
        'tank':1
    },

    2:{
        'tank':2,
        'tankRed':1
    },

    3:{
        'tank':3,
        'tankRed':1
    },

    4:{
        'tank':4,
        'tankRed':2
    },
    
    5:{
        'tank':5,
        'tankRed':2
    },
}