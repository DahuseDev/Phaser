class Focus{
    target
    newTarget(turret){
        // Comprova si el target actual es el mateix que ja es tenia
        if(turret == this.target){
            this.target.toggleRange()
            return;
        }

        
        try{
            //Amaga el range de la torreta seleccionada anteriorment
            this.target.hideRange()
            this.target.depth = 1;
        }catch{}

        // Mostra el range de la nova torreta
        this.target = turret
        this.target.showRange()
    }
    clearTarget(){
        // Amaga el range de la torreta seleccionada anteriorment
        try{
            this.target.hideRange()
        }catch{}
    }
}