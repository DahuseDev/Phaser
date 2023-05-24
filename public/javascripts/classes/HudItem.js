class HudItem extends Phaser.GameObjects.Image {

    constructor (scene, x, y,type)
    {
        super(scene, x, y,'sprites',type);
        this.start = [x,y]  
        this.depth = 12;
        this.type = type;
        this.stats = turretStats[this.type];
        this.displayHeight=100;
        this.setPosition(x, y);
        
        // Permet que aquest objecte sigui arrossegable
        this.setInteractive({ draggable: true })
        scene.input.setDraggable(this)
        
        // Mostra el preu del objecte sota seu.
        let preuTorreta = this.stats.price; 
        this.text = scene.add.text(x-40,y+(this.displayHeight/2)+7); 
        this.text.text=preuTorreta;
        this.text.depth=20;
        this.text.setFont("25px Arial")
        this.text.setColor('#000000');

        // Mostra una imatge d'una moneda al costat del preu
        this.image = scene.add.image(x+30,y+(this.displayHeight/2)+20,"moneda"); 
        this.image.depth=20;
        this.image.displayHeight=40;
        this.image.displayWidth = 40; 
    }

    // Retorna el objecte a la seva posició inicial
    reset(){
        this.setPosition(this.start[0],this.start[1])
    }


}