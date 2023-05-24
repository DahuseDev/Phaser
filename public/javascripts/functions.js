
// Dibuixa una graella que permet veure les caselles on es poden colocar turrets
function drawGrid(graphics) {

    graphics.lineStyle(1, 0x0000ff, 0.8);
    for(let i = 0; i < 37; i++) {
        graphics.moveTo(0, i * 30);
        graphics.lineTo(1600, i * 30);
    }
    for(let j = 0; j < 54; j++) {
        graphics.moveTo(j * 30, 100);
        graphics.lineTo(j * 30, 1080);
    }
    graphics.strokePath();
}

// Retorna les coords d'un esdeveniment
// function coords(event){
//     let x = event.clientX; 
//     let y = event.clientY; 
// }

// Genera el HUD del joc
function generarHud(graphics){
    let scene = game.scene.scenes[0];

    // Pinta hud dret
    HudItems.add(new HudItem(scene,1920-150, 200,'turret') ,true)
    HudItems.add(new HudItem(scene,1920-150, 400,'cannon') ,true)
    HudItems.add(new HudItem(scene,1920-150, 600,'sniper') ,true)
    graphics.fillStyle(0x00AA00);
    graphics.lineStyle(40, 0x55DD55, 1)
    graphics.fillRect(1920-300, 0, 290, 1080);
    graphics.strokeRect(1920-300, 20, 280, 1040);
    graphics.depth=10;


    // Mostra els diners
    this.moneyText = scene.add.text(1667, 900);
    moneyText.depth=15;
    moneyText.setFont("30px Arial")
    moneyText.setColor('#000000');
}

// Coloca la turret a la posició on s'ha fet drop
function placeTurret(pointer,type,scene,turrets) {
    let i = Math.floor(pointer.y/30);
    let j = Math.floor(pointer.x/30);
    if(canPlaceTurret(i, j)) {
        let turret = new Turret(scene,type);
        if(player.pay(turret.stats.price) == null){
            console.log("Can't afford")
            return;
        }
        turrets.add(turret,true);
        if (turret)
        {
            turret.setActive(true);
            turret.setVisible(true);
            turret.place(i, j);
        }   
    }
}

// Comprova si es pot colocar la turret a la posició on s'ha fet drop
function canPlaceTurret(i, j) {
    return map[i][j] === 0;
}

// Genera una bala i li estableix un objectiu
function addBullet(x, y, angle,enemy,range,damage) {
    let bullet = bullets.get();
    if (bullet)
    {
        bullet.damage=damage
        bullet.range = range;
        bullet.fire(x, y, angle,enemy);
    }
}

//Retorna el primer enemic que es trobi dintre del range establert
function getEnemy(range) {
    // Endreça els enemics per la distancia que porten recorreguda.
    let enemyUnits = enemies.getChildren().sort((a,b)=>b.follower.t-a.follower.t)
    for(let i = 0; i < enemyUnits.length; i++) {
        let enemy = enemyUnits[i]
        // Si hi ha algun enemic que s'hi trobi dintre del range, el retorna
        if(enemy.active && range.contains(enemy.x,enemy.y)){
            return enemy;
        }
    }
}

// Treu vida a un enemic
function damageEnemy(enemy, bullet) {  
    // Si l'enemic i la bala estan actius
    if (enemy.active === true && bullet.active === true) {
        // desactivem la bala
        bullet.setActive(false);
        bullet.setVisible(false);    
        
        // Treiem vida al enemic en base al damage que té la bala
        enemy.receiveDamage(bullet.damage);
    }
}

// Comprova si queda algún enemic per a apareixer en aquesta ronda
function hasEnemy(ronda){
    for(let type in ronda) {
        if(ronda[type]>0){
            return 1;
        }
    }
    return 0;
}

// Retorna el proper enemic de la ronda
function nextEnemy(ronda){
    for(let type in ronda) {
        if(ronda[type]>0){
            return type;
        }
    }
    return 0;
}

// Final del joc
function finishGame(){
    let scene = game.scene.scenes[0];
    let endText = scene.add.text(1920, 0);
    endText.text = "";
    endText.setFont("100px Arial")
    endText.setColor('#ffffff');
    document.getElementById("popup").style.display = "flex"; 
    document.getElementById('button').addEventListener('click',player.save)
}

// Genera una quantitat d'enemics en base a la ronda en que estem
function generateRound(ronda){
    // Numero de la ronda dividit en digits
    let digits = ronda.toString().split('');

    // Ultim digit
    let lastDigit = digits.splice(-1)*1+1;
    
    // Dificultat
    let dificultat = digits.join("") * 1;

    ENEMY_SPAWN_COOLDOWN = 1000 / (dificultat+1);

    // Plantilla d'una ronda
    let enemies = {
        'tank':0,
        'tankred':0,
        'tankyellow':0,
        'tankblue':0
    };

    // Itera ultim digit
    for(let i = 0 ; i <= lastDigit ; i++ ){

        //Afegeix tank verd
        enemies['tank']+= 3 * (dificultat*dificultat)+1;

        //Afegeix tank vermell
        dificultat >= 1 ? enemies['tankred'] +=2 * Math.floor(dificultat*dificultat): '';

        //Afegeix tank groc
        dificultat >= 2 ? enemies['tankyellow'] +=1 * Math.floor(dificultat*dificultat): '';

        //Afegeix tank blau
        dificultat >= 3 ? enemies['tankblue'] +=0.5 * Math.floor(dificultat*dificultat): '';
    }
    // Arrodoneix el numero d'enemics per a que no hi hagi decimals
    enemies['tankyellow'] = Math.floor(enemies['tankyellow'])
    enemies['tankblue'] = Math.floor(enemies['tankblue'])
    return enemies;
}