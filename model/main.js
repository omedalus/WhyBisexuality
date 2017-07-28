/**
 * Created by Paul Bogdan on 7/25/2017.
 */

//maximum fitness is equal to the number of attributes if a cap is set
var attributeCount = 100;
var populationCount = 100;
var mutationLikelihood = .25;

var phenotypeWeightAvg = 0;
var phenotypeWeightStd = 10;
var dominancePredispositionAttributes = 0.5;
var dominancePredispositionTemplate = 0.50;

var templateWeightAvg = 0;
var templateWeightStd = 25;

var templateAverageSize = 4;
var templateSizeDistribution = 1.5;

var generationCycles = 50;
var simulationCount = 1;

var templateCount = 100;

var reproductionCutoff = .5;

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
ctx.font = "12px Arial";        


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

var M1Pop2 = [];
var F2Pop2 = [];

var templateManager = new TemplateManager();

var phenotypeWeights;

// creates templateManager, creates phenotypeWeights array, creates populations (could be generalized better?)
function initialize(){
    function getDiploidPopulation(count){
        var population = new Array();
        for (var i = 0; i < count; i++){
            var newOrgo = new Organism(false, templateManager);
            newOrgo.randomizeAttributes(attributeCount, dominancePredispositionAttributes, phenotypeWeights);
            population.push(newOrgo);
        }
        return population;
    }

    function getHaploidPopulation(count){
        var population = new Array();
        for (var i = 0; i < count; i++){
            var newOrgo = new Organism(true, templateManager);
            newOrgo.randomizeAttributes(attributeCount, dominancePredispositionAttributes, phenotypeWeights);
            population.push(newOrgo);
        }
        return population;
    }

    phenotypeWeights = createPhenotypeWeights();
    templateManager.randomize(templateCount, templateWeightAvg, templateWeightStd, templateAverageSize, templateSizeDistribution, dominancePredispositionTemplate, attributeCount);
    H1Pop = getHaploidPopulation(populationCount);
    H2Pop = getDiploidPopulation(populationCount);
    M1Pop1 = getHaploidPopulation(Math.floor(populationCount/2));
    F2Pop1 = getDiploidPopulation(Math.floor(populationCount/2));
    M1Pop2 = getHaploidPopulation(Math.floor(populationCount/2));
    F2Pop2 = getDiploidPopulation(Math.floor(populationCount/2));
    
}

// calculates average fitness of population
function getAverageFitness(population){
    var total = 0;
    for (each of population){
        total += each.getFitness(templateManager);
    }
    total = total/population.length
    return total;
}

// calculates average fitness of population considering only template related fitness gains
function getAverageNonTemplateFitness(population){
    var total = 0;
    for (each of population){
        total += each.getNonTemplateFitness(templateManager);
    }
    total = total/population.length
    return total;
}

// calculates average fitness of population considering only non-template fitnesses
function getAverageTemplateFitness(population){
    var total = 0;
    for (each of population){
        total += each.getTemplateFitness(templateManager);
    }
    total = total/population.length
    return total;
}

// returns the top (cutoff) portion of a population
function getReproducingPop(population, cutoff){
    var tupleList = new Array ();
    for (let each of population){
        var tuple = [each, each.getFitness()];
        tupleList.push(tuple);
    }

    // From stackoverflow. I dont understand why it works. Its meant to sort by the second item, fitness of organism
    // https://stackoverflow.com/questions/3524827/sort-a-2d-array-by-the-second-value
    tupleList.sort(function(a,b){
        return a[1] - b[1];
    });

    for (var i = 0; i < tupleList.length; i++){
       //console.log(tupleList[i][0].getFitness(templateManager));
    }
    //const topList = tupleList.slice(tupleList.length - Math.floor(tupleList.length * cutoff), tupleList.length);
    const topList = tupleList.slice(tupleList.length - Math.floor(tupleList.length * cutoff), );
    var finalList = new Array();
    //console.log("EH");
    for (let each of topList){
        var temp = each[0];
        finalList.push(temp);
        //console.log(temp.getFitness());
    }

    return finalList;
}

// creates a deep copy of an attributes list
function copyAttributes(attributes){
    var newList = new Array();

    for (each of attributes){
        var newAttribute = new Attribute(each.getBoolean(), each.getIndex());
        newList.push(newAttribute);
    }
    return newList;
}

// reproduces hermaphrodite population (list of organisms), works for both haploids and diploids
function reproduceHerm(population){
    var newPopulation = Array();
    var j = 0;
    while (newPopulation.length < populationCount){
        for (each of population){
            j++;
            const ea = each;
            const haploid = each.getHaploid();
            var newOrgo = new Organism(haploid, templateManager);
            var temp = copyAttributes(each.getAttributes1());
            if (haploid){
                newOrgo.setAttributes(temp, temp, phenotypeWeights); 
            } else {
               newOrgo.setAttributes(temp, copyAttributes(ea.getAttributes2()), phenotypeWeights);
            }

            newOrgo.mutate(mutationLikelihood);
            newPopulation.push(newOrgo);
        }
    }
    return newPopulation;
}

// reproduces bisexual populations, returns [new male population, new female population]
function reproduceBisexual(malePopulation, femalePopulation){
    var newMales = Array();
    var newFemales = Array();
    var j = 0;
    let male = true;
    while (newMales.length * 2 < populationCount){
        for (let each of femalePopulation){
            if (male){

                //console.log("MALE MAKER: " + each.getFitness());
                var newOrgo = new Organism(male, templateManager);
                var temp1;
                if (Math.random() < .5) {
                    if (Math.random() < .5) {
                        temp1 = copyAttributes(each.getAttributes1());
                    } else {
                        temp1 = copyAttributes(each.getAttributes2());
                    }
                } else {
                    var tempM = malePopulation[Math.floor(Math.random() * malePopulation.length)];
                    temp1 = copyAttributes(tempM.getAttributes1());
                    //console.log("MALE BREEDER FITNESS: " + tempM.getFitness());
                }
                newOrgo.setAttributes(temp1, temp1, phenotypeWeights);
                newOrgo.mutate(mutationLikelihood);
                newMales.push(newOrgo);
                //console.log(male + "New Male Fitness: " + newOrgo.getFitness());
                male = false;
            } else {
                var newOrgo = new Organism(male,templateManager);
                var temp1;
                var temp2 = copyAttributes(malePopulation[Math.floor(Math.random() * malePopulation.length)].getAttributes1());
                if (Math.random() < .5) {
                    temp2 = copyAttributes(each.getAttributes1());
                } else {
                    temp2 = copyAttributes(each.getAttributes2());
                }
                newOrgo.setAttributes(temp1, temp2, phenotypeWeights);
                newOrgo.mutate(mutationLikelihood);
                newFemales.push(newOrgo);
                male = true;
            }
        }
    }

    return [newMales, newFemales];
}


initialize();


for (let i = 0; i < simulationCount; i++){
    for (let j = 0; j < generationCycles; j++){
        /*ctx.fillText(getAverageFitness(H1Pop), 200 * j, 30);
        ctx.fillText(getAverageNonTemplateFitness(H1Pop), 200 * j, 40);
        ctx.fillText(getAverageTemplateFitness(H1Pop), 200 * j, 50);*/
        console.log("Av Fitness HERM1: " + getAverageFitness(H1Pop));
        H1Pop = reproduceHerm(getReproducingPop(H1Pop, reproductionCutoff, j), j);

        console.log("Av Fitness HERM2: " + getAverageFitness(H2Pop));
        H2Pop = reproduceHerm(getReproducingPop(H2Pop, reproductionCutoff, j), j);

        /*ctx.fillText(getAverageFitness(H2Pop), 200 * j, 70);
        ctx.fillText(getAverageNonTemplateFitness(H2Pop), 200 * j, 80);
        ctx.fillText(getAverageTemplateFitness(H2Pop), 200 * j, 90);
        H2Pop = reproduceHerm(getReproducingPop(H2Pop, reproductionCutoff, j), j);*/
        //var temp = M1Pop1.concat(F2Pop1);
        console.log("Av Fitness M: " + getAverageFitness(M1Pop1));
        console.log("Av Fitness F " + getAverageFitness(F2Pop1));
        var temp = reproduceBisexual(getReproducingPop(M1Pop1, reproductionCutoff), getReproducingPop(F2Pop1, reproductionCutoff));
        M1Pop1 = temp[0];
        F2Pop1 = temp[1];

        console.log("Av Fitness M IMBALANCE: " + getAverageFitness(M1Pop2));
        console.log("Av Fitness F IMBALANCE: " + getAverageFitness(F2Pop1));
        var temp2 = reproduceBisexual(getReproducingPop(M1Pop2, reproductionCutoff * .5), getReproducingPop(F2Pop2, reproductionCutoff * 1.5));
        M1Pop2 = temp2[0];
        F2Pop2 = temp2[1];


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
