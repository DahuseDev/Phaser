class Enemy extends Phaser.GameObjects.Image{
    constructor (scene,type)
    {
        super(scene,0, 0, 'sprites',type)
        this.stats = enemyStats[type];
        this.depth = 3
        // Phaser.GameObjects.Image.call(this, scene, 0, 0, 'sprites', 'tank');
        this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
        this.displayHeight=100;
        this.displayWidth=100
        this.scene = scene;
        this.healtBar = this.scene.add.graphics();
        // this.healtBar.save()
    }
    update(time, delta)
    {
        this.follower.t += ENEMY_SPEED * delta * this.stats.speed;
        path.getPoint(this.follower.t, this.follower.vec);
        let angle = Phaser.Math.Angle.Between(this.x, this.y, this.follower.vec.x, this.follower.vec.y);
        this.angle = (angle + Math.PI/2) * Phaser.Math.RAD_TO_DEG;
        this.setPosition(this.follower.vec.x, this.follower.vec.y);

        // Quan l'enemic arriba al final del camí
        if (this.follower.t >= 1)
        {   
            this.die()
            player.decrease(this.stats.dmg)
        }

        if(this.hp<this.stats.hp && this.follower.t<1){
            this.healtBar.setVisible(false)
            this.healtBar.setActive(false)
            this.healtBar = this.scene.add.graphics();
            this.healtBar.fillStyle(0x141414);
            this.healtBar.fillRect(this.x-50, this.y+60, 100, 10);
            this.healtBar.fillStyle(0xFF0000);
            this.healtBar.fillRect(this.x-50, this.y+60, (this.hp /this.stats.hp) *100, 10);
            this.healtBar.lineStyle(1, 0xEEEEE)
            this.healtBar.strokeRect(this.x-50, this.y+60, 100, 10);
        }
    }
    startOnPath()
    {
        // set the t parameter at the start of the path
        this.follower.t = 0;
        
        // get x and y of the given t point            
        path.getPoint(this.follower.t, this.follower.vec);
        
        // Estableix la posició d'aquest enemic al principi del camí
        this.setPosition(this.follower.vec.x, this.follower.vec.y);
        this.hp = this.stats.hp;
    }
    receiveDamage(damage) {
        this.hp -= damage;           
        
        // if hp drops below 0 we deactivate this enemy
        if(this.hp <= 0) 
        {
            this.die()
            player.add(this.stats.points)
        }
    }
    die(){
        this.healtBar.setVisible(false)
        this.healtBar.setActive(false)
        this.setActive(false);
        this.setVisible(false);  
    }
};
