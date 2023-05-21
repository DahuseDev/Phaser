let mongoose = require('mongoose'); 

class Database{
    constructor(){
        mongoose.set('strictQuery', false); 
        this.connect().catch(err => console.log(err)); 
        let playerSchema = new mongoose.Schema ({
            username: String,
            score: String, 
            date: Date
        })
        this.playerModel = mongoose.model('Players', playerSchema); 
    }

    async connect(){
        try{
            await mongoose.connect('mongodb://127.0.0.1:27017/gp3'); 
            console.log("S'ha conectat a la base de dades correctament"); 
        }catch(err){
            throw new err("No s'ha pogut conectar a la base de dades"); 
        }
    }

    async afegirJugador(username, score){
        await this.playerModel.collection.insertOne({username: username, score: score, date: new Date()}); 
    }

    async getPlayers(){
        return await this.playerModel.find({})
    }
}
module.exports = Database; 
