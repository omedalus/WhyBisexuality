/**
 * Created by Paul Bogdan on 7/25/2017.
 */


// Creates normal distribution between -1 and 1. From: https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
function randn_bm() {
    var u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}



$(document).ready(function() {

/* global $ */

//maximum fitness is equal to the number of attributes if a cap is set
var attributeCount = 100;
var populationCount = 25;
var mutationLikelihood = .01;

var phenotypeWeightAvg = 5;
var phenotypeWeightStd = 0;
var dominancePredispositionAttributes = 0.50;
var dominancePredispositionTemplate = 0.50;

var templateWeightAvg = 0;
var templateWeightStd = 0;

var templateAverageSize = 4;
var templateSizeDistribution = 1.5;

var generationCycles = 250;
var simulationCount = 1;

var templateCount = 0;

var reproductionCutoff = .2;



function createPhenotypeWeights(){
    var phenotypeWeightsNew = new Array();
    for (var i = 0; i < attributeCount; i++){
        phenotypeWeightsNew.push(phenotypeWeightAvg + phenotypeWeightStd * randn_bm());
    }
    return phenotypeWeightsNew;
}

var H1Pop = [];
var H2Pop = [];

var M1Pop1 = [];
var F2Pop1 = [];

var templateManager = new TemplateManager();
var phenotypeWeights;

function initialize(){
    function getDiploidPopulation(count){
        var population = new Array();
        for (var i = 0; i < count; i++){
            var newOrgo = new Organism(false);
            newOrgo.randomizeAttributes(attributeCount, dominancePredispositionAttributes, phenotypeWeights);
            population.push(newOrgo);
        }
        return population;
    }

    function getHaploidPopulation(count){
        var population = new Array();
        for (var i = 0; i < count; i++){
            var newOrgo = new Organism(true);
            newOrgo.randomizeAttributes(attributeCount, dominancePredispositionAttributes, phenotypeWeights);
            population.push(newOrgo);
        }
        return population;
    }

    phenotypeWeights = createPhenotypeWeights();
    H1Pop = getHaploidPopulation(populationCount);
    H2Pop = getDiploidPopulation(populationCount);
    M1Pop1 = getHaploidPopulation(Math.floor(populationCount/2));
    F2Pop1 = getHaploidPopulation(Math.floor(populationCount/2));
    templateManager.randomize(templateCount, templateWeightAvg, templateWeightStd, templateAverageSize, templateSizeDistribution, dominancePredispositionTemplate, attributeCount);
}

function getAverageFitness(population){
    var total = 0;
    for (each of population){
        total += each.getFitness(templateManager);
    }
    total = total/population.length;
    $('#console').append(`Average fitness: ${total}\n`);
    return total;
}

function getAverageNonTemplateFitness(population){
    var total = 0;
    for (each of population){
        total += each.getNonTemplateFitness(templateManager);
    }
    total = total/population.length;
    $('#console').append(`Normal: ${total}\n`);
    return total;
}

function getAverageTemplateFitness(population){
    var total = 0;
    for (each of population){
        total += each.getTemplateFitness(templateManager);
    }
    total = total/population.length;
    $('#console').append(`Template: ${total}\n`);
    return total;
}

function getReproducingPop(population, cutoff, spot){
    var tupleList = new Array ();
    for (each of population){
        var tuple = [each, each.getFitness(templateManager)];
        tupleList.push(tuple);
    }

    // From stackoverflow. I dont understand why it works. Its meant to sort by the second item, fitness of organism
    // https://stackoverflow.com/questions/3524827/sort-a-2d-array-by-the-second-value
    tupleList.sort(function(a,b){
        return a[1] - b[1];
    });

    for (var i = 0; i < tupleList.length; i++){
       ctx.fillText(tupleList[i][0].getFitness(templateManager),100 + 200 * spot,150 + i * 10);
    }

    //const topList = tupleList.slice(tupleList.length - Math.floor(tupleList.length * cutoff), tupleList.length);
    const topList = tupleList.slice(tupleList.length - Math.floor(tupleList.length * cutoff));
    var finalList = new Array();

    for (each of topList){
        finalList.push(each[0]);
    }

    return finalList;
}

function resetPhenotypes(){

}

function copyAttributes(attributes){
    var newList = new Array();

    for (each of attributes){
        var newAttribute = new Attribute(each.getBoolean(), each.getIndex());
        newList.push(newAttribute);
    }
    return newList;
}

// spot is used for writing to the canvas when debugging 
function reproduceHerm(population, spot){
    var newPopulation = Array();
    var j = 0;
    while (newPopulation.length < populationCount){
        for (each of population){
            const ea = each;
            const haploid = each.getHaploid();
            var newOrgo = new Organism(haploid);
            var temp = copyAttributes(each.getAttributes1());
            if (haploid){
                newOrgo.setAttributes(temp, temp, phenotypeWeights); 
            } else {
               newOrgo.setAttributes(temp, copyAttributes(ea.getAttributes2()), phenotypeWeights);
            }

            ctx.fillText(newOrgo.getFitness(templateManager), 330 + 250 * spot, 300 + 10 * j);
            newOrgo.mutate(mutationLikelihood);
            ctx.fillText(newOrgo.getFitness(templateManager), 330 + 250 * spot, 300 + 10 * j);
            newPopulation.push(newOrgo);
        }
    }
    return newPopulation;
}

function reproduceBisexual(malePopulation, femalePopulation, spot){
    var newPopulation = Array();
    var j = 0;
    var male = true;
    while (newPopulation.length < populationCount){
        for (each of femalePopulation){

        }
    }
    return newPopulation;
}

function displayPhenotypeWeights(spot){
    for (var i = 0; i < phenotypeWeights.length; i++){
        ctx.fillText( phenotypeWeights[i], 100 + 150 * spot, 800 + 10 * i);
    }
}


initialize();

for (var i = 0; i < simulationCount; i++){
    for (var j = 0; j < generationCycles; j++){
        ctx.fillText(getAverageFitness(H1Pop), 200 * j, 30);
        ctx.fillText(getAverageNonTemplateFitness(H1Pop), 200 * j, 40);
        ctx.fillText(getAverageTemplateFitness(H1Pop), 200 * j, 50);
        //displayPhenotypeWeights(j);
        H1Pop = reproduceHerm(getReproducingPop(H1Pop, reproductionCutoff, j), j);

        ctx.fillText(getAverageFitness(H1Pop), 200 * j, 70);
        ctx.fillText(getAverageNonTemplateFitness(H1Pop), 200 * j, 80);
        ctx.fillText(getAverageTemplateFitness(H1Pop), 200 * j, 90);
        H2Pop = reproduceHerm(getReproducingPop(H2Pop, reproductionCutoff, j), j);
    }
}


getAverageFitness(H1Pop, 10);
getAverageNonTemplateFitness(H1Pop, 20);
getAverageTemplateFitness(H1Pop, 30);



}); // document ready