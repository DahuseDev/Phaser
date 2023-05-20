class Health{
    value = 100;
    constructor(){
    }
    decrease(quantity){
        this.value-=50;
    }
    checkAlive(){
        return this.value > 0 ? true : false
    }
}