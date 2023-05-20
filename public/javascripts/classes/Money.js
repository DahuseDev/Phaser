class Money{
    value = 10000;
    constructor(startingMoney){
        this.value+=startingMoney;
    }
    add(quantity){
        this.value+=quantity;
    }
    pay(quantity){
        if(this.value-quantity<0){
            return null;
        }
        this.value-=quantity
        return this.value;
    }
}