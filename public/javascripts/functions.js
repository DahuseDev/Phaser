function drawGrid(graphics) {
    graphics.lineStyle(1, 0x0000ff, 0.8);
    for(let i = 0; i < 8; i++) {
        graphics.moveTo(0, i * 64);
        graphics.lineTo(640, i * 64);
    }
    for(let j = 0; j < 10; j++) {
        graphics.moveTo(j * 64, 0);
        graphics.lineTo(j * 64, 512);
    }
    graphics.strokePath();
}
function placeTurret(pointer) {
    let i = Math.floor(pointer.y/64);
    let j = Math.floor(pointer.x/64);
    if(canPlaceTurret(i, j)) {
        let turret = turrets.get();
        if (turret)
        {
            turret.setActive(true);
            turret.setVisible(true);
            turret.place(i, j);
        }   
    }
}
function canPlaceTurret(i, j) {
    return map[i][j] === 0;
}
function addBullet(x, y, angle,enemy,range) {
    let bullet = bullets.get();
    if (bullet)
    {
        bullet.range = range;
        bullet.fire(x, y, angle,enemy);
    }
}
function getEnemy(x, y, distance) {
    let enemyUnits = enemies.getChildren();
    
    for(let i = 0; i < enemyUnits.length; i++) {
    }
    let firstEnemy = enemies.getFirstAlive()
    return firstEnemy;
}
function damageEnemy(enemy, bullet) {  
    // only if both enemy and bullet are alive
    if (enemy.active === true && bullet.active === true) {
        // we remove the bullet right away
        bullet.setActive(false);
        bullet.setVisible(false);    
        
        // decrease the enemy hp with BULLET_DAMAGE 
        enemy.receiveDamage(BULLET_DAMAGE);
    }
}