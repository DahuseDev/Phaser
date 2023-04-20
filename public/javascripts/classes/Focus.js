class Focus{
    target
    newTarget(turret){
        if(turret == this.target){
            this.target.toggleRange()
            return;
        }
        try{
            this.target.hideRange()
            this.target.depth = 1;
        }catch{}
        this.target = turret
        this.target.showRange()
    }
    clearTarget(){
        try{
            this.target.hideRange()
        }catch{}
    }
}