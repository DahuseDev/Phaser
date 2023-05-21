class Player{
    money = 0;
    score = 0;
    health = 100;
    username;
    constructor(start_money){
        this.money+=start_money;
    }

    // S'executa quan un es mata a un enemic, s'afegeix score i diners
    add(quantity){
        this.money+=quantity;
        this.score+=quantity;
    }

    // S'executa quan es compra una torreta
    pay(quantity){
        if(this.money-quantity<0){
            return null;
        }
        this.money-=quantity
        return this.money;
    }

    // S'executa quan un enemic arriba al final del camí
    decrease(quantity){
        this.health-=quantity;
    }

    // Comprova si el jugador segueix viu
    checkAlive(){
        return this.health > 0 ? true : false       
    }

    // S'executa quan s'acaba la partida
    save(){
        this.username = document.getElementById('username').value; 
        var cap = new Headers();
        cap.append("Content-Type", "application/json");
        let peticio = {
            method: 'POST',
            headers: cap, 
            body: JSON.stringify({
                username: this.username,
                score: player.score
            })
        }
        fetch(`/guardar`,peticio)
        document.getElementById('popup').style.display="none"; 
    }
}
