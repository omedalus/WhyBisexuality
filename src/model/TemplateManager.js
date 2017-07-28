/**
 * Created by Paul Bogdan on 7/25/2017.
 */

 function TemplateManager(){

    this.templates = new Array();

    this.randomize = function(templateCount, averageWeight, weightStd, averageSize, sizeDistribution, dominancePredisposition, phenotypeCount){
        for (var i = 0; i < templateCount; i++){
            var newTemplate = new Template(averageWeight + randn_bm() * weightStd, Math.floor(averageSize + .5 + sizeDistribution * Math.random() * 2 - sizeDistribution), dominancePredisposition, phenotypeCount);
            this.templates.push(newTemplate);
        }
    }

    this.assessTemplateFitness = function (organism){
        
        var total = 0;
        for (each of this.templates){
            const ea = each;
            if (ea.isTrue(organism)){
                total += ea.getWeight();
            }
        }
        return total;
    }
 }