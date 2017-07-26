

function PhenotypeRequirement(dominancePredisposition, phenotypeCount){

    this.index = Math.floor(Math.random() * phenotypeCount);
    this.dominance = Math.random() < dominancePredisposition;

    this.getIndex = function (){
        return this.index;
    }

    this.getDominance = function (){
        return this.dominance;
    }

}