class Money{
    value = 0;
    constructor(startingMoney){
        this.value+=startingMoney;
    }
    add(quantity){
        this.value+=quantity;
    }
    pay(quantity){
        console.log(this.value)
        if(this.value-quantity<0){
            return null;
        }
        this.value-=quantity
        return this.value;
    }
}