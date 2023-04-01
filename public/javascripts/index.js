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

let game = new Phaser.Game(config);

let ronda = 1;

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
    if (time > this.nextEnemy && rounds[ronda]['turret'])
    {        
        rounds[ronda]['turret']--;
        let enemy = new Enemy(game.scene.scenes[0])
        enemies.add(enemy,true);
        
        
        // place the enemy at the start of the path
        enemy.startOnPath();
        
        this.nextEnemy = time + ENEMY_SPAWN_COOLDOWN;     
    }
    if(rounds[ronda]['turret']==0 && enemies.countActive() == 0){
        console.log("aa")
        ronda++;
        enemies.clear(true,true)
        this.nextEnemy = time + 5000;
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