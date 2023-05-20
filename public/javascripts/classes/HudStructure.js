class HudStructure extends Phaser.GameObjects.TileSprite {

    constructor (scene, x, y,type)
    {
        super(scene, x, y,1920,300,type);
        this.setPosition(x, y);
        // this.displayWidth=300;
        // this.displayHeight=1000;
        // this.angle = 90
        this.setTilePosition(325,80)
        this.angle = 180;
        
    }


}