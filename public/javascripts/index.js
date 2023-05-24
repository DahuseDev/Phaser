const socket = io();
socket.on('nou tank',async function(data){
    data = JSON.parse(data);
    if(enemyStats[data.color]){
        generaEnemic(data.color)
    }
})




let config = {  
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'phaser-example',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1920,
        height: 1080
    },
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
let rondaActual = generateRound(ronda);
let focus = new Focus();

// Càrrega del joc
function preload ()
{
    this.load.atlas('sprites', 'sprite/sprite.png', 'sprite/sprite_atlas.json'); 
    this.load.image('background', 'images/background.png');
    this.load.image("moneda", "images/moneda.png"); 
    this.load.audio("music","audio/music.mp3")
    this.load.audio("bullet","audio/bullet.mp3")
    this.load.audio("cannon","audio/cannon.mp3")
    this.load.audio("sniper","audio/sniper.mp3")
    // this.load.audio("shoot","audio/shoot.mp3")
    
}

// Creació del joc
function create ()
{
    let graphics = this.add.graphics();    
    let scene = game.scene.scenes[0];
    let bg = this.add.image(800, 590, 'background');
    let music = this.sound.add("music",{loop:true})
    music.volume = 0.6;
    // music.volume = 0.3
    music.play()

    bg.displayWidth=1600;
    bg.displayHeight = 980;
    drawGrid(graphics);

    if(TESTMODE){
        graphics.depth=100
    }

    // Genera el camí que seguiràn els enemics
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
    path.draw(graphics);

    // Crea els grups d'entitats
    enemies = this.physics.add.group({ classType: Enemy, runChildUpdate: true });
    turrets = this.add.group({ classType: Turret, runChildUpdate: true });
    bullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });
    HudItems = this.physics.add.group({ classType: HudItem, runChildUpdate: true });
    this.nextEnemy = 0;

    // Colisió bala - enemic
    this.physics.add.overlap(enemies, bullets, damageEnemy);

    // Generem el HUD
    generarHud(this.add.graphics()); 

    // Afegim els listeners
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
    });
}


// Bucle del joc
function update(time, delta) {  
    let scene = game.scene.scenes[0];
    // Actualitzem els valors que es mostren en el HUD
    moneyText.text = "Diners: "+player.money+"\nPuntuació: "+player.score+"\nRonda: "+ronda;
    
    // Genera el seguent enemic
    if (time > this.nextEnemy && hasEnemy(rondaActual) && player.checkAlive())
    {        
        let type = nextEnemy(rondaActual);
        rondaActual[type]--
        let enemy = new Enemy(scene,type)
        enemies.add(enemy,true);
        enemy.startOnPath();
        this.nextEnemy = time + ENEMY_SPAWN_COOLDOWN;     
    }

    // Si s'acaba la ronda, es passa de ronda
    if(!hasEnemy(rondaActual) && enemies.countActive() == 0  && player.checkAlive()){
        // Esborrem les entitats que s'han utilitzat en la ronda anterior per a millorar el rendiment.
        enemies.clear(true,true)
        bullets.clear(true,true)

        ronda++;
        rondaActual = generateRound(ronda);
        this.nextEnemy = time + 1000;
    }

    //Reset de la barra de vida
    if(this.healthBar){
        this.healthBar.setActive(false);
        this.healthBar.setVisible(false);
    }
    this.healthBar = scene.add.graphics();

    //Mostra la barra de vida actualitzada
    this.healthBar.fillStyle(0x141414);
    this.healthBar.fillRect(0, 0, 1920-300, 100);
    this.healthBar.fillStyle(0xFF0000);
    this.healthBar.fillRect(0, 0, ( player.health/100) * ( 1920-300), 100);
    
    // Si el jugador ha perdut tota la vida, s'acaba el joc
    if(!player.checkAlive()){
        finishGame();
        game.destroy();
    }
}

function generaEnemic(type){
    let scene = game.scene.scenes[0];
    let enemy = new Enemy(scene,type)
    enemies.add(enemy,true);
    enemy.startOnPath();
}