let map =      
[[ 0,-1, 0, 0, 0, 0, 0, 0, 0, 0],
[ 0,-1, 0, 0, 0, 0, 0, 0, 0, 0],
[ 0,-1,-1,-1,-1,-1,-1,-1, 0, 0],
[ 0, 0, 0, 0, 0, 0, 0,-1, 0, 0],
[ 0, 0, 0, 0, 0, 0, 0,-1, 0, 0],
[ 0, 0, 0, 0, 0, 0, 0,-1, 0, 0],
[ 0, 0, 0, 0, 0, 0, 0,-1, 0, 0],
[ 0, 0, 0, 0, 0, 0, 0,-1, 0, 0]];

let config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: 'arcade'
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
let ENEMY_NUMBER = 5;
let ENEMY_SPEED = 1/10000;
let BULLET_DAMAGE = 50;
let game = new Phaser.Game(config);

function preload ()
{
    this.load.atlas('sprites', 'sprite/sprite.png', 'sprite/sprite_atlas.json');    
    this.load.image('bullet', 'images/bullet.png');
    this.load.image('enemy','images/tank.png')
    this.load.image('turret', 'images/turret.png'); 
}

function create ()
{
    let graphics = this.add.graphics();    
    drawGrid(graphics);

// the path for our enemies
// parameters are the start x and y of our path
path = this.add.path(96, -32);
path.lineTo(96, 164);
path.lineTo(480, 164);
path.lineTo(480, 544);

graphics.lineStyle(3, 0xffffff, 1);
// visualize the path
path.draw(graphics);
enemies = this.physics.add.group({ classType: Enemy, runChildUpdate: true });
this.nextEnemy = 0;
turrets = this.add.group({ classType: Turret, runChildUpdate: true });
this.input.on('pointerdown', placeTurret);
bullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });
this.physics.add.overlap(enemies, bullets, damageEnemy);

}
function update(time, delta) {  
    // if its time for the next enemy
    if (time > this.nextEnemy && ENEMY_NUMBER>0)
    {        
        ENEMY_NUMBER--;
        let enemy = new Enemy(game.scene.scenes[0])
        enemies.add(enemy,true);
        
        
        // place the enemy at the start of the path
        enemy.startOnPath();
        
        this.nextEnemy = time + 2000;     
    }
}
function drawGrid(graphics) {
    graphics.lineStyle(1, 0x0000ff, 0.8);
    for(let i = 0; i < 8; i++) {
        graphics.moveTo(0, i * 64);
        graphics.lineTo(640, i * 64);
    }
    for(let j = 0; j < 10; j++) {
        graphics.moveTo(j * 64, 0);
        graphics.lineTo(j * 64, 512);
    }
    graphics.strokePath();
}
function placeTurret(pointer) {
    let i = Math.floor(pointer.y/64);
    let j = Math.floor(pointer.x/64);
    if(canPlaceTurret(i, j)) {
        let turret = turrets.get();
        if (turret)
        {
            turret.setActive(true);
            turret.setVisible(true);
            turret.place(i, j);
        }   
    }
}
function canPlaceTurret(i, j) {
    return map[i][j] === 0;
}
function addBullet(x, y, angle,enemy) {
    let bullet = bullets.get();
    if (bullet)
    {
        bullet.fire(x, y, angle,enemy);
    }
}
function getEnemy(x, y, distance) {
    let enemyUnits = enemies.getChildren();
    
    for(let i = 0; i < enemyUnits.length; i++) {
    }
    let firstEnemy = enemies.getFirstAlive()
    return firstEnemy;
    return false;
}
function damageEnemy(enemy, bullet) {  
    // only if both enemy and bullet are alive
    if (enemy.active === true && bullet.active === true) {
        // we remove the bullet right away
        bullet.setActive(false);
        bullet.setVisible(false);    
        
        // decrease the enemy hp with BULLET_DAMAGE 
        enemy.receiveDamage(BULLET_DAMAGE);
    }
}
class Enemy extends Phaser.GameObjects.Image{
    constructor (scene)
    {
        super(scene,0, 0, 'sprites','tank')
        // Phaser.GameObjects.Image.call(this, scene, 0, 0, 'sprites', 'tank');
        this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
        this.displayHeight=100;
        this.displayWidth=100
    }
    update(time, delta)
    {
        // move the t point along the path, 0 is the start and 0 is the end
        this.follower.t += ENEMY_SPEED * delta;
        
        // get the new x and y coordinates in vec
        path.getPoint(this.follower.t, this.follower.vec);
        let angle = Phaser.Math.Angle.Between(this.x, this.y, this.follower.vec.x, this.follower.vec.y);
        this.angle = (angle + Math.PI/2) * Phaser.Math.RAD_TO_DEG;
        // update enemy x and y to the newly obtained x and y
        this.setPosition(this.follower.vec.x, this.follower.vec.y);
        
        console.log(angle)
        // if we have reached the end of the path, remove the enemy
        if (this.follower.t >= 1)
        {   
            this.setActive(false);
            this.setVisible(false);
        }
    }
    startOnPath()
    {
        // set the t parameter at the start of the path
        this.follower.t = 0;
        
        // get x and y of the given t point            
        path.getPoint(this.follower.t, this.follower.vec);
        
        // set the x and y of our enemy to the received from the previous step
        this.setPosition(this.follower.vec.x, this.follower.vec.y);
        this.hp = 100;
    }
    receiveDamage(damage) {
        this.hp -= damage;           
        
        // if hp drops below 0 we deactivate this enemy
        if(this.hp <= 0) {
            this.setActive(false);
            this.setVisible(false);      
        }
    }
};

class Turret extends Phaser.GameObjects.Image{
    constructor (scene)
    {
        super(scene,0, 0, 'turret')
        this.nextTic = 0;
    }
    // we will place the turret according to the grid
    place(i, j) {            
        this.y = i * 64 + 64/2;
        this.x = j * 64 + 64/2;
        map[i][j] = 1;            
    }
    update(time, delta)
    {   
        let enemy = getEnemy(this.x, this.y, 300);
        if(enemy){
            let angle = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);
            this.angle = (angle + Math.PI/2) * Phaser.Math.RAD_TO_DEG;
        }
        if(time > this.nextTic) {
            this.fire(enemy);
            this.nextTic = time + 300;
        }
    }
    fire(enemy) {
        if(enemy) {
            addBullet(this.x, this.y, this.angle,enemy);
            
        }
    }
}


class Bullet extends Phaser.GameObjects.Image{
    constructor(scene)
    {
        super(scene,0, 0, 'bullet')
        this.dx = 0;
        this.dy = 0;
        this.lifespan = 0;
        this.speed = Phaser.Math.GetSpeed(600, 1);
    }
    update(time, delta)
    {
        this.angle = Phaser.Math.Angle.Between(this.x, this.y, this.enemy.x, this.enemy.y);
        this.dx = Math.cos(this.angle);
        this.dy = Math.sin(this.angle);
        this.lifespan -= delta;
        this.x += this.dx * (this.speed * delta);
        this.y += this.dy * (this.speed * delta);
        if (this.lifespan <= 0)
        {
            this.setActive(false);
            this.setVisible(false);
        }
    }
    fire(x, y, angle,enemy)
    {
        this.setActive(true);
        this.setVisible(true);
        this.setPosition(x, y);
        // this.setRotation(angle);
        this.lifespan = 300;
        this.enemy = enemy
    }
}



// let Turret = new Phaser.Class({
//     Extends: Phaser.GameObjects.Image,
//     initialize:
//     function Turret (scene)
//     {
//         Phaser.GameObjects.Image.call(this, scene, 0, 0,'turret');
//         this.width=108;
//         this.height=192;
//         this.nextTic = 0;
//         console.log(this)
//     },
//     // we will place the turret according to the grid
//     place: function(i, j) {            
//         this.y = i * 64 + 64/2;
//         this.x = j * 64 + 64/2;
//         map[i][j] = 1;            
//     },
//     update: function (time, delta)
//     {   
//         let enemy = getEnemy(this.x, this.y, 300);
//         if(enemy){
//             let angle = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);
//             this.angle = (angle + Math.PI/2) * Phaser.Math.RAD_TO_DEG;
//         }
//         if(time > this.nextTic) {
//             this.fire(enemy);
//             this.nextTic = time + 300;
//         }
//     },
//     fire: function(enemy) {
//         if(enemy) {
//             addBullet(this.x, this.y, this.angle,enemy);
            
//         }
//     },
    
// });



// let Bullet = new Phaser.Class({
//     Extends: Phaser.GameObjects.Image,
//     initialize:
//     function Bullet (scene)
//     {
//         Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');
//         this.dx = 0;
//         this.dy = 0;
//         this.lifespan = 0;
//         this.speed = Phaser.Math.GetSpeed(600, 1);
//     },
//     update: function (time, delta)
//     {
//         this.angle = Phaser.Math.Angle.Between(this.x, this.y, this.enemy.x, this.enemy.y);
//         this.dx = Math.cos(this.angle);
//         this.dy = Math.sin(this.angle);
//         this.lifespan -= delta;
//         this.x += this.dx * (this.speed * delta);
//         this.y += this.dy * (this.speed * delta);
//         if (this.lifespan <= 0)
//         {
//             this.setActive(false);
//             this.setVisible(false);
//         }
//     },
//     fire: function (x, y, angle,enemy)
//     {
//         this.setActive(true);
//         this.setVisible(true);
//         //  Bullets fire from the middle of the screen to the given x/y
//         this.setPosition(x, y);
//     //  we don't need to rotate the bullets as they are round
//         // this.setRotation(angle);
//         this.lifespan = 300;
//         this.enemy = enemy
//     }
// });