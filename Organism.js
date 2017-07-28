/**
 * Created by Paul Bogdan on 7/25/2017.
 */

function Organism(haploidBool, templateManager){

    this.haploid = haploidBool;
    this.templateManager = templateManager;
    this.attributes1 = new Array();
    this.attributes2 = new Array();
    this.phenotypes = new Array();

    this.setAttributes = function (attList1, attList2, phenotypeWeights){
        if (this.haploid) {
            if (Math.random() > .5){
                this.attributes1 = attList1;
            } else {
                this.attributes1 = attList2;
            }
        } else {
            this.attributes1 = attList1;
            this.attributes2 = attList2;
        }
        this.phenotypes = [];
        this.setPhenotypes(phenotypeWeights);
    }

    this.randomizeAttributes = function (count, dominancePredisposition, phenotypeWeights){
        var attributeList1 = new Array();
        for (var i = 0; i < count; i++){
            var newAttribute = new Attribute(Math.random() < dominancePredisposition, i);
            attributeList1.push(newAttribute);
        }
        if (this.haploid){
            this.setAttributes(attributeList1, attributeList1, phenotypeWeights);
        } else {
            var attributeList2 = new Array();
            for (var i = 0; i < count; i++){
                var newAttribute = new Attribute(Math.random() < dominancePredisposition, i);
                attributeList2.push(newAttribute);
            }
            this.setAttributes(attributeList1, attributeList2, phenotypeWeights);
        }
    }

    this.setPhenotypes = function (phenotypeWeights){
        for (var i = 0; i < phenotypeWeights.length; i++){
            var newPhenotype;
            if (this.haploid){
                newPhenotype = new Phenotype(phenotypeWeights[i], this.attributes1[i].getBoolean());
            } else {
                newPhenotype = new Phenotype(phenotypeWeights[i], this.attributes1[i].getBoolean() || this.attributes2[i].getBoolean());
            }
            this.phenotypes.push(newPhenotype);
        }
    }

    // Could be optimized
    // not currently used
    this.resetPhenotypes = function (){
        for (var i = 0; i < this.phenotypes.length; i++){
            this.phenotypes[i].setBoolean(this.attributes1[i].getBoolean());
        }
    }

    this.getPhenotypes = function (){
        return this.phenotypes;
    }

    this.mutate = function (mutationLikelihood){
        for (var i = 0; i < this.attributes1.length; i++){
            if (Math.random() < mutationLikelihood){
                this.attributes1[i].mutate(); 
                this.phenotypes[i].setBoolean(this.attributes1[i].getBoolean());
                if (this.haploid){
                    this.phenotypes[i].setBoolean(this.attributes1[i].getBoolean());
                } else {
                    this.phenotypes[i].setBoolean(this.attributes1[i].getBoolean() || this.attributes2[i].getBoolean());
                }
                
            }
        }
        if (!this.haploid){
            for (var i = 0; i < this.attributes2.length; i++){
                if (Math.random() < mutationLikelihood){
                    this.attributes2[i].mutate(); 
                    this.phenotypes[i].setBoolean(this.attributes1[i].getBoolean() || this.attributes2[i].getBoolean());
                }
            }
        }

    }

    // returns fitness directly based off of phenotypes and phenotype fitness weights
    // does not use templates
    this.getNonTemplateFitness = function(){
        total = 0;
        for (each of this.phenotypes){
            if (each.getBoolean()) {
                total += each.getWeight();
            }
        }
        return total
    }

    // returns fitness directly based off of template fitness effects
    this.getTemplateFitness = function(){
        return this.templateManager.assessTemplateFitness(this);
    }

    // returns fitness usins both template and non-template effects
    this.getFitness = function (){
        return this.getNonTemplateFitness() + this.getTemplateFitness();
    }

    this.getHaploid = function () {
        return this.haploid;
    }

    this.getPhenotypes = function () {
        return this.phenotypes;
    }

    this.getAttributes1 = function (){
        return this.attributes1;
    }

    this.getAttributes2 = function (){
        return this.attributes2;
    }

    this.print = function (pretext){
        console.log(pretext + this.getFitness() );
    }

    this.getRandoAttribute = function (){
        if (this.haploid){
            return this.attributes1;
        } else {
            if (Math.random > .5){
                return this.attributes1;
            } else {
                return this.attributes2;
            }
        }
    }
}