/**
 * Created by Paul Bogdan on 7/25/2017.
 */

//maximum fitness is equal to the number of attributes if a cap is set
var attributeCount = 100;
var populationCount = 100;
var mutationLikelihood = .03;

var phenotypeWeightAvg = 40;
var phenotypeWeightStd = 4;
var dominancePredispositionAttributes = 0.75;
var dominancePredispositionTemplate = 0.75;

var templateWeightAvg = 25;
var templateWeightStd = 5;

var templateAverageSize = 4;
var templateSizeDistribution = 1.5;

var generationCycles = 25;
var simulationCount = 1;

var templateCount = 100;

var reproductionCutoff = .05;

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
ctx.font = "12px Arial";        


function createPhenotypeWeights(){
    var phenotypeWeights = new Array();
    for (var i = 0; i < attributeCount; i++){
        phenotypeWeights.push(phenotypeWeightAvg + phenotypeWeightStd * randn_bm());
    }
    return phenotypeWeights;
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

function getAverageFitness(population, spot){
    var total = 0;
    for (each of population){
        total += each.getFitness(templateManager);
    }
    total = total/population.length
    ctx.fillText(total,10,spot);
}

function getAverageNonTemplateFitness(population, spot){
    var total = 0;
    for (each of population){
        total += each.getNonTemplateFitness(templateManager);
    }
    total = total/population.length
    ctx.fillText("Normal: " +  total,10,spot);
}

function getAverageTemplateFitness(population, spot){
    var total = 0;
    for (each of population){
        total += each.getTemplateFitness(templateManager);
    }
    total = total/population.length
    ctx.fillText("Template: " + total,10,spot);
}

function getReproducingPop(population, cutoff){
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

    //const topList = tupleList.slice(tupleList.length - Math.floor(tupleList.length * cutoff), tupleList.length);
    const topList = tupleList.slice(0, Math.floor(tupleList.length * cutoff));
    var finalList = new Array();

    ctx.fillText("TEST", 200, 200);

    for (each of topList){
        finalList.push(each[0]);
    }
    return finalList;
}

// Can implement asexual recombination. Not currently
function reproduceHerm(population){
    var newPopulation = Array();
    while (newPopulation.length < populationCount){
        for (each of population){
            const ea = each;
            var newOrgo = new Organism(ea.getHaploid());
            if (ea.getHaploid()){
                newOrgo.setAttributes(each.getAttributes1(), each.getAttributes1(), phenotypeWeights);
            } else {
                newOrgo.setAttributes(each.getAttributes1(), each.getAttributes2(), phenotypeWeights);
            }
            newOrgo.mutate(mutationLikelihood);
            newPopulation.push(newOrgo);
        }
    }
    return newPopulation;
}


initialize();
getAverageFitness(H1Pop, 50);
getAverageNonTemplateFitness(H1Pop, 60);
getAverageTemplateFitness(H1Pop, 70);

getAverageFitness(H2Pop, 80);
getAverageNonTemplateFitness(H2Pop, 90);
getAverageTemplateFitness(H2Pop, 100);

for (var i = 0; i < simulationCount; i++){
    for (var j = 2; j < generationCycles + 2; j++){
        getAverageFitness(H1Pop, 50 + j * 30);
        getAverageNonTemplateFitness(H1Pop, 60 + j * 30);
        getAverageTemplateFitness(H1Pop, 70 + j * 30);
        H1Pop = reproduceHerm(getReproducingPop(H1Pop, reproductionCutoff));

    }
}

getAverageFitness(H1Pop, 10);
getAverageNonTemplateFitness(H1Pop, 20);
getAverageTemplateFitness(H1Pop, 30);


    // Creates normal distribution between -1 and 1. From: https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
function randn_bm() {
    var u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}
