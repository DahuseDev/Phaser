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
    }
    update(time, delta)
    {
        // move the t point along the path, 0 is the start and 0 is the end
        this.follower.t += ENEMY_SPEED * delta * this.stats.speed;
        
        // get the new x and y coordinates in vec
        path.getPoint(this.follower.t, this.follower.vec);
        let angle = Phaser.Math.Angle.Between(this.x, this.y, this.follower.vec.x, this.follower.vec.y);
        this.angle = (angle + Math.PI/2) * Phaser.Math.RAD_TO_DEG;
        // update enemy x and y to the newly obtained x and y
        this.setPosition(this.follower.vec.x, this.follower.vec.y);
        // if we have reached the end of the path, remove the enemy
        if (this.follower.t >= 1)
        {   
            this.setActive(false);
            this.setVisible(false);
        }
    }
    startOnPath()
    {
        // set the t parameter at the start of the path
        this.follower.t = 0;
        
        // get x and y of the given t point            
        path.getPoint(this.follower.t, this.follower.vec);
        
        // set the x and y of our enemy to the received from the previous step
        this.setPosition(this.follower.vec.x, this.follower.vec.y);
        this.hp = this.stats.hp;
    }
    receiveDamage(damage) {
        this.hp -= damage;           
        
        // if hp drops below 0 we deactivate this enemy
        if(this.hp <= 0) {
            money.add(this.stats.points)
            this.setActive(false);
            this.setVisible(false);      
        }
    }
};
