class HudItem extends Phaser.GameObjects.Image {

    constructor (scene, x, y,type)
    {
        super(scene, x, y,'sprites',type);
        this.start = [x,y]
        this.type = type;
        this.setInteractive({ draggable: true })
        scene.input.setDraggable(this)
        this.setPosition(x, y);
        this.displayHeight=100;
        
    }
    reset(){
        this.setPosition(this.start[0],this.start[1])
    }


}