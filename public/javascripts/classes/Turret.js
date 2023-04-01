class Turret extends Phaser.GameObjects.Image{
    constructor (scene)
    {
        super(scene,0, 0, 'turret')
        this.nextTic = 0;
        console.log(this)
        this.graphics = new Phaser.GameObjects.Graphics(scene)
        console.log(this.graphics)
    }
    // we will place the turret according to the grid
    place(i, j) {            
        this.y = i * 64 + 64/2;
        this.x = j * 64 + 64/2;
        map[i][j] = 1;
        this.circle = new Phaser.Geom.Circle(this.x, this.y, TURRET_RANGE)     
        this.graphics.fillCircleShape(this.circle);
    }
    update(time, delta)
    {   
        let enemy = getEnemy();
        if(enemy && this.circle.contains(enemy.x,enemy.y)){
            let angle = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);
            this.angle = (angle + Math.PI/2) * Phaser.Math.RAD_TO_DEG;
        }
        if(time > this.nextTic) {
            this.fire(enemy);
            this.nextTic = time + TURRET_RELOAD;
        }
    }
    fire(enemy) {
        if(enemy && this.circle.contains(enemy.x,enemy.y)) {
            addBullet(this.x, this.y, this.angle,enemy,this.circle);
        }
    }
}
