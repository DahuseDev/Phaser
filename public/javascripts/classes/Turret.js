class Turret extends Phaser.GameObjects.Image{
    constructor (scene)
    {
        super(scene,0, 0, 'turret')
        this.nextTic = 0;
    }
    // we will place the turret according to the grid
    place(i, j) {            
        this.y = i * 64 + 64/2;
        this.x = j * 64 + 64/2;
        map[i][j] = 1;            
    }
    update(time, delta)
    {   
        let enemy = getEnemy();
        if(enemy){
            let angle = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);
            this.angle = (angle + Math.PI/2) * Phaser.Math.RAD_TO_DEG;
        }
        if(time > this.nextTic) {
            this.fire(enemy);
            this.nextTic = time + TURRET_RELOAD;
        }
    }
    fire(enemy) {
        if(enemy) {
            addBullet(this.x, this.y, this.angle,enemy);
            
        }
    }
}
