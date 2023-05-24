class Enemy extends Phaser.GameObjects.Image{
    constructor (scene,type)
    {
        super(scene,0, 0, 'sprites',type)
        this.stats = enemyStats[type];
        this.depth = 3
        this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
        this.displayHeight=100;
        this.displayWidth=100
        this.scene = scene;
        this.healtBar = this.scene.add.graphics();
    }
    update(time, delta)
    {
        // Desplaça l'enemic a la posició adient dintre del camí
        this.follower.t += ENEMY_SPEED * delta * this.stats.speed;
        path.getPoint(this.follower.t, this.follower.vec);
        let angle = Phaser.Math.Angle.Between(this.x, this.y, this.follower.vec.x, this.follower.vec.y);
        this.angle = (angle + Math.PI/2) * Phaser.Math.RAD_TO_DEG;
        this.setPosition(this.follower.vec.x, this.follower.vec.y);

        // Quan l'enemic arriba al final del camí treu vida al jugador
        if (this.follower.t >= 1)
        {   
            this.die()
            player.decrease(this.stats.dmg)
        }

        // Si l'enemic té menys vida de la seva vida máxima i encara no a arribat al final del camí
        if(this.hp<this.stats.hp && this.follower.t<1){
            // Esborra la barra de vida anterior
            this.healtBar.setVisible(false)
            this.healtBar.setActive(false)
            this.healtBar = this.scene.add.graphics();

            // Genera una nova barra de vida amb el % i la posició actualitzada
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
        // 0 es el principi del camí
        this.follower.t = 0;
        
        // Estableix la posició d'aquest enemic al principi del camí
        path.getPoint(this.follower.t, this.follower.vec);
        this.setPosition(this.follower.vec.x, this.follower.vec.y);
        this.hp = this.stats.hp;
    }
    receiveDamage(damage) {
        // Resta vida segons el damage que té la turret
        this.hp -= damage;           
        
        // Quan el jugador mata al enemic, el jugador rep una recompensa
        if(this.hp <= 0) 
        {
            this.die()
            player.add(this.stats.points)
        }
    }
    die(){
        //Desactiva la barra de vida
        this.healtBar.setVisible(false)
        this.healtBar.setActive(false)

        // Desactiva el objecte
        this.setActive(false);
        this.setVisible(false);  
    }
};
