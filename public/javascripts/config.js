/************************************************************/
/*********************** CONFIG VALUES **********************/
/************************************************************/

let ENEMY_NUMBER = 5;
let ENEMY_SPEED = 1/25000;
let ENEMY_SPAWN_COOLDOWN = 1000; //ms

let TURRET_RELOAD = 1000; //ms
let TURRET_RANGE = 500; //px

let BULLET_DAMAGE = 50;
let BULLET_SPEED = 2000; 

let START_MONEY = 500


/************************************************************/
/*************************** GAME ***************************/
/************************************************************/

let difficulty = 0;
let map =      
[[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[ 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
[ 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
[ 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
[ 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0],
[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];


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
        'hp':100,
        'points':50
    },
    'tankred':{
        'speed':0.6,
        'hp':250,
        'points':150
    },
    'tankyellow':{
        'speed':3,
        'hp':200,
        'points':100
    }
}

let turretStats = {
    'turret':{
        'reload':1000,
        'damage':50,
        'range':3,
        'price':400
    },
    'cannon':{
        'reload':5000,
        'damage':1000,
        'range':10,
        'price':700
    }
}

let rounds = 
{
    1:{
        'tankred':1,
        'tank':3
    },

    2:{
        'tank':3,
        'tankred':1
    },

    3:{
        'tank':3,
        'tankred':1
    },

    4:{
        'tank':4,
        'tankred':2
    },
    
    5:{
        'tank':5,
        'tankred':2
    },
}


/*
DEFAULT
    range : 6
    damage : 3
    reload : 6

MINIGUN
    range : 5
    damage : 2
    *reload : 10

SNIPER
    *range : 10
    damage : 8
    reload : 1

CAÑON
    range : 3
    *damage : 10
    reload : 4

*/