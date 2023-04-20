class Turret extends Phaser.GameObjects.Image{
    constructor (scene,type)
    {
        super(scene,0, 0, 'sprites',type)
        this.nextTic = 0;
        this.type = type;
        this.graphics = new Phaser.GameObjects.Graphics(scene)
        this.stats = turretStats[this.type];
    }
    // we will place the turret according to the grid
    place(i, j) {            
        this.y = i * 60 + 60/2;
        this.x = j * 60 + 60/2;
        map[i][j] = 2;
        this.circle = new Phaser.Geom.Circle(this.x, this.y, (this.stats.range+1)*60)     
        this.graphics.fillCircleShape(this.circle);
        this.graphics.lineStyle(3, "#FFFFFF", 1)
        this.graphics.strokeCircle(this.x,this.y,this.stats.range)
        this.on('pointerover',()=>{
            console.log(this.graphics)
        })
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
}
