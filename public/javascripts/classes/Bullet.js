class Bullet extends Phaser.GameObjects.Image{
    constructor(scene)
    {
        super(scene,0, 0, 'bullet')
        this.dx = 0;
        this.dy = 0;
        this.speed = Phaser.Math.GetSpeed(BULLET_SPEED, 1);
    }
    update(time, delta)
    {
        if(!this.range.contains(this.x,this.y)){
            this.setActive(false);
            this.setVisible(false);
        }
        this.angle = Phaser.Math.Angle.Between(this.x, this.y, this.enemy.x, this.enemy.y);
        this.dx = Math.cos(this.angle);
        this.dy = Math.sin(this.angle);
        this.lifespan -= delta;
        this.x += this.dx * (this.speed * delta);
        this.y += this.dy * (this.speed * delta);
    }
    fire(x, y, angle,enemy)
    {   
        this.setActive(true);
        this.setVisible(true);
        this.setPosition(x, y);
        // this.setRotation(angle);
        this.enemy = enemy
    }
}