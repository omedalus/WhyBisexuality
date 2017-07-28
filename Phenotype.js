


function Phenotype(weight, boolean, index){
    this.boolean = boolean;
    this.weight = weight;
    this.index = index;

    // True corresponds to dominant
    this.getBoolean = function (){
        return this.boolean;
    }

    this.setBoolean = function (boolean){
        this.boolean = boolean;
    }
    
    this.getWeight = function(){
        return this.weight;
    }
 }