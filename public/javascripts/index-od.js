var map =      [[ 0,-1, 0, 0, 0, 0, 0, 0, 0, 0],
[ 0,-1, 0, 0, 0, 0, 0, 0, 0, 0],
[ 0,-1,-1,-1,-1,-1,-1,-1, 0, 0],
[ 0, 0, 0, 0, 0, 0, 0,-1, 0, 0],
[ 0, 0, 0, 0, 0, 0, 0,-1, 0, 0],
[ 0, 0, 0, 0, 0, 0, 0,-1, 0, 0],
[ 0, 0, 0, 0, 0, 0, 0,-1, 0, 0],
[ 0, 0, 0, 0, 0, 0, 0,-1, 0, 0]];
    var config = {
        type: Phaser.AUTO,
        width: window.innerWidth,
        height: window.innerHeight,
        physics: {
            default: 'arcade'
            // ,
            // arcade: {
            //     gravity: { y: 300 },
            //     debug: false
            // }
        },
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    };
    var ENEMY_NUMBER = 5;
    var ENEMY_SPEED = 1/10000;
    var BULLET_DAMAGE = 50;
    var game = new Phaser.Game(config);

    function preload ()
    {
        this.load.setBaseURL('https://labs.phaser.io');
        this.load.image('terrain', 'assets/textures/soil.png');
    }
    function create ()
    {
        var graphics = this.add.graphics();    
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
            var enemy = enemies.get();
            if (enemy)
            {
                
                enemy.setActive(true);
                enemy.setVisible(true);
                
                // place the enemy at the start of the path
                enemy.startOnPath();
                
                this.nextEnemy = time + 2000;
            }       
        }
    }
    function drawGrid(graphics) {
        graphics.lineStyle(1, 0x0000ff, 0.8);
        for(var i = 0; i < 8; i++) {
            graphics.moveTo(0, i * 64);
            graphics.lineTo(640, i * 64);
        }
        for(var j = 0; j < 10; j++) {
            graphics.moveTo(j * 64, 0);
            graphics.lineTo(j * 64, 512);
        }
        graphics.strokePath();
    }
    function placeTurret(pointer) {
        var i = Math.floor(pointer.y/64);
        var j = Math.floor(pointer.x/64);
        if(canPlaceTurret(i, j)) {
            var turret = turrets.get();
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
        var bullet = bullets.get();
        if (bullet)
        {
            bullet.fire(x, y, angle,enemy);
        }
    }
    function getEnemy(x, y, distance) {
        var enemyUnits = enemies.getChildren();
        
        for(var i = 0; i < enemyUnits.length; i++) {       
            enemyUnits[i].displayWidth =30;
        }
        let firstEnemy = enemies.getFirstAlive()
        if(firstEnemy){
            firstEnemy.displayWidth = 100;
        }
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

let Enemy = new Phaser.Class({
        Extends: Phaser.GameObjects.Image,
        initialize:
        function Enemy (scene)
        {
            Phaser.GameObjects.Image.call(this, scene, 0, 0, 'sprites', 'enemy');
            this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
        },
        update: function (time, delta)
        {
            // move the t point along the path, 0 is the start and 0 is the end
            this.follower.t += ENEMY_SPEED * delta;
            
            // get the new x and y coordinates in vec
            path.getPoint(this.follower.t, this.follower.vec);
            
            // update enemy x and y to the newly obtained x and y
            this.setPosition(this.follower.vec.x, this.follower.vec.y);
            // if we have reached the end of the path, remove the enemy
            if (this.follower.t >= 1)
            {
                this.setActive(false);
                this.setVisible(false);
            }
        },
        startOnPath: function ()
        {
            // set the t parameter at the start of the path
            this.follower.t = 0;
            
            // get x and y of the given t point            
            path.getPoint(this.follower.t, this.follower.vec);
            
            // set the x and y of our enemy to the received from the previous step
            this.setPosition(this.follower.vec.x, this.follower.vec.y);
            this.hp = 100;
        },
        receiveDamage: function(damage) {
            this.hp -= damage;           
            
            // if hp drops below 0 we deactivate this enemy
            if(this.hp <= 0) {
                this.setActive(false);
                this.setVisible(false);      
            }
        },
});
var Turret = new Phaser.Class({
    Extends: Phaser.GameObjects.Image,
    initialize:
    function Turret (scene)
    {
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'sprites', 'turret');
        this.nextTic = 0;
    },
    // we will place the turret according to the grid
    place: function(i, j) {            
        this.y = i * 64 + 64/2;
        this.x = j * 64 + 64/2;
        map[i][j] = 1;            
    },
    update: function (time, delta)
    {   
        var enemy = getEnemy(this.x, this.y, 300);
        if(enemy){
            var angle = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);
            this.angle = (angle + Math.PI/2) * Phaser.Math.RAD_TO_DEG;
        }
        if(time > this.nextTic) {
            this.fire(enemy);
            this.nextTic = time + 300;
        }
    },
    fire: function(enemy) {
        if(enemy) {
            enemy.displayHeight=100
            addBullet(this.x, this.y, this.angle,enemy);
            
        }
    },
    
});

var Bullet = new Phaser.Class({
    Extends: Phaser.GameObjects.Image,
    initialize:
    function Bullet (scene)
    {
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');
        this.dx = 0;
        this.dy = 0;
        this.lifespan = 0;
        this.speed = Phaser.Math.GetSpeed(600, 1);
    },
    update: function (time, delta)
    {
        console.log(this.enemy.x)
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
    },
    fire: function (x, y, angle,enemy)
    {
        this.setActive(true);
        this.setVisible(true);
        //  Bullets fire from the middle of the screen to the given x/y
        this.setPosition(x, y);
    //  we don't need to rotate the bullets as they are round
        // this.setRotation(angle);
        this.lifespan = 300;
        this.enemy = enemy
    }
});