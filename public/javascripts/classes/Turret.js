class Turret extends Phaser.GameObjects.Image{
    constructor (scene,type)
    {
        super(scene,0, 0, 'sprites',type)
        this.nextTic = 0;
        this.type = 'Turret'
        this.turretType = type;
        this.graphics = scene.add.graphics()
        this.depth = 1;
        this.stats = turretStats[this.turretType];
        this.sound = scene.sound.add(this.stats.audio,{loop:false})
    }
    
    // Colocarem la turret a la casella de la graella corresponent
    place(i, j) {            
        this.y = i * 30 + 30/2;
        this.x = j * 30 + 30/2;

        // Marquem aquesta casella com a ocupada per a que no es pugui ficar mes turrets
        map[i][j] = 2;
          

        // Fem el cercle que mostra el range
        this.circle = new Phaser.Geom.Circle(this.x, this.y, (this.stats.range+1)*30) 
        this.graphics.fillStyle(0X0000FF,0.3)
        this.graphics.fillCircle(this.x, this.y, (this.stats.range+1)*30)
        this.graphics.lineStyle(3,0x00FF00, 1)
        this.graphics.strokeCircleShape(this.circle)
        this.setInteractive()
        this.hideRange()
    }
    update(time, delta)
    {   
        let enemy = getEnemy(this.circle);

        // Si hi ha un enemic i aquest es troba dintre del range de la turret, la turret apunta cap a ell
        if(enemy && this.circle.contains(enemy.x,enemy.y)){
            let angle = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);
            this.angle = (angle + Math.PI/2) * Phaser.Math.RAD_TO_DEG;
        }

        // Dispara cada x temps
        if(time > this.nextTic) {
            this.fire(enemy);
            this.nextTic = time + this.stats.reload;
        }
    }
    fire(enemy) {

        // Si l'enemic es troba dintre del range, dispara
        if(enemy && this.circle.contains(enemy.x,enemy.y)) {
            addBullet(this.x, this.y, this.angle,enemy,this.circle,this.stats.damage);
            this.sound.stop();
            this.sound.play();
        }

    }

    // Mostra el range
    showRange(){
        this.graphics.setVisible(true)
        this.depth = 5
    }

    // Amaga el range
    hideRange(){
        this.graphics.setVisible(false)
        this.depth = 1
    }

    // Alterna el range
    toggleRange(){
        this.graphics.setVisible(!this.graphics.visible)
        this.graphics.visible?this.depth=5:this.depth=1;
    }
}
