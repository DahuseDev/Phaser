let config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'phaser-example',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1920,
        height: 1080
    },
    // width: window.innerWidth,
    // height: window.innerHeight,
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
let player = new Player(START_MONEY); 
let ronda = 1;
let focus = new Focus();
function preload ()
{
    this.load.atlas('sprites', 'sprite/sprite.png', 'sprite/sprite_atlas.json'); 
    this.load.image('wall', 'images/hud-texture-wall.png'); 
    this.load.image('background', 'images/background.png');
    
}

function create ()
{
    let graphics = this.add.graphics();    
    let scene = game.scene.scenes[0];
    let bg = this.add.image(800, 590, 'background');
    // graphics.depth=100
    bg.displayWidth=1600;
    bg.displayHeight = 980;
    drawGrid(graphics);

    // the path for our enemies
    // parameters are the start x and y of our path
    path = this.add.path((0*30), (17*30));
    path.lineTo((26*30)+15, (17*30));
    path.lineTo((26*30)+15, (10*30)+15);
    path.lineTo((25*30)+15, (9*30)+15);
    path.lineTo((18*30)+15, (9*30)+15);
    path.lineTo((17*30)+15, (10*30)+15);
    path.lineTo((17*30)+15, (27*30)+15);
    path.lineTo((15*30)+15, (29*30)+15);
    path.lineTo((10*30)+15, (29*30)+15);
    path.lineTo((8*30)+15, (27*30)+15);
    path.lineTo((8*30)+15, (23*30)+15);
    path.lineTo((9*30)+15, (22*30)+15);
    path.lineTo((31*30)+15, (22*30)+15);
    path.lineTo((33*30)+15, (20*30)+15);
    path.lineTo((33*30)+15, (15*30)+15);
    path.lineTo((34*30)+15, (14*30)+15);
    path.lineTo((39*30)+15, (14*30)+15);
    path.lineTo((40*30)+15, (15*30)+15);
    path.lineTo((40*30)+15, (24*30)+15);
    path.lineTo((38*30)+15, (27*30));
    path.lineTo((25*30)+15, (27*30));
    path.lineTo((23*30)+15, (29*30));
    path.lineTo((23*30)+15, (36*30));
    

    graphics.lineStyle(3, 0xffffff, 1);
    // visualize the path
    path.draw(graphics);
    enemies = this.physics.add.group({ classType: Enemy, runChildUpdate: true });
    this.nextEnemy = 0;
    turrets = this.add.group({ classType: Turret, runChildUpdate: true });
    // this.input.on('pointerdown', placeTurret);
    bullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });
    HudItems = this.physics.add.group({ classType: HudItem, runChildUpdate: true });
    HudStructures = this.physics.add.group({ classType: HudStructure, runChildUpdate: true });

    //Colisio bala - enemic
    this.physics.add.overlap(enemies, bullets, damageEnemy);

    generarHud(this.add.graphics()); 

    
    this.input.on('drag', (pointer, gameObject, dragX, dragY) =>
    {
        gameObject.x = dragX;
        gameObject.y = dragY;
    });
    this.input.on('dragend', (pointer, gameObject, dragX, dragY) =>
    {
        gameObject.reset()
        try{
            placeTurret(pointer,gameObject.type,this,turrets)
        }catch{

        }
    });
    this.input.on('pointerdown', (pointer, gameObject) =>
    {
        if(gameObject[0] == undefined || gameObject[0].type != "Turret"){
            focus.clearTarget()
            
        }else{
            focus.newTarget(gameObject[0])
        }
        // try{
        // if(gameObject[0].type === "Turret"){
        //     console.log("aa")
            
        // }else{
            
        // }}catch{

        // }
    });

    this.healthBar = scene.add.graphics();
    this.healthBar.fillStyle(0x141414);
    this.healthBar.fillRect(0, 0, 1920-300, 100);
    
}

function update(time, delta) {  
    let scene = game.scene.scenes[0];
    rondaActual = rounds[ronda]
    moneyText.text = "Diners: "+player.money;
    // healthText.text = "HP: "+health.value;
    
    // if its time for the next enemy
    if (time > this.nextEnemy && hasEnemy(rondaActual) && player.checkAlive())
    {        
        let type = nextEnemy(rondaActual);
        rounds[ronda][type]--
        let enemy = new Enemy(scene,type)
        enemies.add(enemy,true);
        
        // place the enemy at the start of the path
        enemy.startOnPath();
        
        this.nextEnemy = time + ENEMY_SPAWN_COOLDOWN;     
    }
    if(!hasEnemy(rondaActual) && enemies.countActive() == 0  && player.checkAlive()){
        ronda++;
        enemies.clear(true,true)
        this.nextEnemy = time + 1000;
    }

    this.healthBar.setActive(false);
    this.healthBar.setVisible(false);
    this.healthBar = scene.add.graphics();
    this.healthBar.fillStyle(0x141414);
    this.healthBar.fillRect(0, 0, 1920-300, 100);
    this.healthBar.fillStyle(0xFF0000);
    this.healthBar.fillRect(0, 0, ( player.health/100) * ( 1920-300), 100);

    if(!player.checkAlive()){
        finishGame();
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