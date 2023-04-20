class Turret extends Phaser.GameObjects.Image{
    constructor (scene,type)
    {
        super(scene,0, 0, 'sprites',type)
        this.nextTic = 0;
        this.type = 'Turret'
        this.turretType = type;
        this.graphics = scene.add.graphics()
        this.depth = 2;
        this.depth = 1;
        this.stats = turretStats[this.turretType];
    }
    // we will place the turret according to the grid
    place(i, j) {            
        this.y = i * 60 + 60/2;
        this.x = j * 60 + 60/2;
        map[i][j] = 2;
        this.circle = new Phaser.Geom.Circle(this.x, this.y, (this.stats.range+1)*60)   
        // this.graphics.fillStyle(0xFF0000);
        // this.graphics.lineStyle(1, "#FFFFFF", 1)
        // this.graphics.fillRect(460, 880, 1000, 400);
        // this.graphics.strokeRect(460, 880, 1000, 400);  
        console.log(this.graphics)
        this.graphics.fillStyle(0X0000FF,0.3)
        this.graphics.fillCircle(this.x, this.y, (this.stats.range+1)*60)
        this.graphics.lineStyle(3,0x00FF00, 1)
        this.graphics.strokeCircleShape(this.circle)
        this.setInteractive()
        this.hideRange()
        // this.on('pointerdown',()=>{
        //     this.showRange()
        // })
    }
    update(time, delta)
    {   
        let enemy = getEnemy(this.circle);
        if(enemy && this.circle.contains(enemy.x,enemy.y)){
            let angle = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);
            this.angle = (angle + Math.PI/2) * Phaser.Math.RAD_TO_DEG;
        }
        if(time > this.nextTic) {
            this.fire(enemy);
            this.nextTic = time + this.stats.reload;
        }
    }
    fire(enemy) {
        if(enemy && this.circle.contains(enemy.x,enemy.y)) {
            addBullet(this.x, this.y, this.angle,enemy,this.circle,this.stats.damage);
        }
    }
    showRange(){
        this.graphics.setVisible(true)
        this.depth = 5
    }
    hideRange(){
        this.graphics.setVisible(false)
        this.depth = 1
    }
    toggleRange(){
        this.graphics.setVisible(!this.graphics.visible)
        this.graphics.visible?this.depth=5:this.depth=1;
    }
}
