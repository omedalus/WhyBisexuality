/**
 * Created by Paul Bogdan on 7/25/2017.
 */
 
/* global Attribute */
/* global Constants */
/* global Organism */
/* global TemplateManager */
/* global randn_bm */


function createPhenotypeWeights(){
    var phenotypeWeightsNew = new Array();
    for (var i = 0; i < Constants.ATTRIBUTE_COUNT; i++){
        phenotypeWeightsNew.push(Constants.PHENOTYPE_WEIGHT_AVG + Constants.PHENOTYPE_WEIGHT_STD * randn_bm());
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
            newOrgo.randomizeAttributes(Constants.ATTRIBUTE_COUNT, Constants.DOMINANCE_PREDISPOSITION_ATTRIBUTES, phenotypeWeights);
            population.push(newOrgo);
        }
        return population;
    }

    function getHaploidPopulation(count){
        var population = new Array();
        for (var i = 0; i < count; i++){
            var newOrgo = new Organism(true, templateManager);
            newOrgo.randomizeAttributes(Constants.ATTRIBUTE_COUNT, Constants.DOMINANCE_PREDISPOSITION_ATTRIBUTES, phenotypeWeights);
            population.push(newOrgo);
        }
        return population;
    }

    phenotypeWeights = createPhenotypeWeights();
    templateManager.randomize(
        Constants.TEMPLATE_COUNT, 
        Constants.TEMPLATE_WEIGHT_AVG, 
        Constants.TEMPLATE_WEIGHT_STD, 
        Constants.TEMPLATE_AVERAGE_SIZE, 
        Constants.TEMPLATE_SIZE_DISTRIBUTION, 
        Constants.DOMINANCE_PREDISPOSITION_TEMPLATE, 
        Constants.ATTRIBUTE_COUNT);
    H1Pop = getHaploidPopulation(Constants.POPULATION_COUNT);
    H2Pop = getDiploidPopulation(Constants.POPULATION_COUNT);
    M1Pop1 = getHaploidPopulation(Math.floor(Constants.POPULATION_COUNT/2));
    F2Pop1 = getDiploidPopulation(Math.floor(Constants.POPULATION_COUNT/2));
    M1Pop2 = getHaploidPopulation(Math.floor(Constants.POPULATION_COUNT/2));
    F2Pop2 = getDiploidPopulation(Math.floor(Constants.POPULATION_COUNT/2));
    
}

// calculates average fitness of population
function getAverageFitness(population){
    var total = 0;
    for (var each of population){
        total += each.getFitness(templateManager);
    }
    total = total/population.length;
    return total;
}

// calculates average fitness of population considering only template related fitness gains
function getAverageNonTemplateFitness(population){
    var total = 0;
    for (var each of population){
        total += each.getNonTemplateFitness(templateManager);
    }
    total = total/population.length;
    return total;
}

// calculates average fitness of population considering only non-template fitnesses
function getAverageTemplateFitness(population){
    var total = 0;
    for (var each of population){
        total += each.getTemplateFitness(templateManager);
    }
    total = total/population.length;
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
    // mvol -- It works because "sort" uses a ternary comparison function to understand the sort order. 
    // "sort" doesn't inherently know how to sort tuples, so it wants you to provide a function that tells it 
    // how to tell if one tuple is greater, lesser, or equal to another. Sort expects this comparison function (comparator)
    // to produce positive output if a>b, negative output if a<b, and zero of a==b. Which is what this does.
    // Anyway, we're gonna refactor a lot of this with UnderscoreJS later.
    // https://stackoverflow.com/questions/3524827/sort-a-2d-array-by-the-second-value
    tupleList.sort(function(a,b){
        return a[1] - b[1];
    });

    for (var i = 0; i < tupleList.length; i++){
       //console.log(tupleList[i][0].getFitness(templateManager));
    }
    //const topList = tupleList.slice(tupleList.length - Math.floor(tupleList.length * cutoff), tupleList.length);
    const topList = tupleList.slice(tupleList.length - Math.floor(tupleList.length * cutoff));
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

    for (var each of attributes){
        var newAttribute = new Attribute(each.getBoolean(), each.getIndex());
        newList.push(newAttribute);
    }
    return newList;
}

// reproduces hermaphrodite population (list of organisms), works for both haploids and diploids
function reproduceHerm(population){
    var newPopulation = Array();
    var j = 0;
    while (newPopulation.length < Constants.POPULATION_COUNT){
        for (var each of population){
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

            newOrgo.mutate(Constants.MUTATION_LIKELIHOOD);
            newPopulation.push(newOrgo);
        }
    }
    return newPopulation;
}

// reproduces bisexual populations, returns [new male population, new female population]
function reproduceBisexual(malePopulation, femalePopulation){
    var newMales = Array();
    var newFemales = Array();
    let male = true;
    while (newMales.length * 2 < Constants.POPULATION_COUNT){
        for (let each of femalePopulation){
            if (male){

                //console.log("MALE MAKER: " + each.getFitness());
                let newOrgo = new Organism(male, templateManager);
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
                newOrgo.mutate(Constants.MUTATION_LIKELIHOOD);
                newMales.push(newOrgo);
                //console.log(male + "New Male Fitness: " + newOrgo.getFitness());
                male = false;
            } else {
                let newOrgo = new Organism(male,templateManager);              

                var temp2 = copyAttributes(malePopulation[Math.floor(Math.random() * malePopulation.length)].getAttributes1());
                if (Math.random() < .5) {
                    temp2 = copyAttributes(each.getAttributes1());
                } else {
                    temp2 = copyAttributes(each.getAttributes2());
                }
                newOrgo.setAttributes(temp1, temp2, phenotypeWeights);
                newOrgo.mutate(Constants.MUTATION_LIKELIHOOD);
                newFemales.push(newOrgo);
                male = true;
            }
        }
    }

    return [newMales, newFemales];
}


initialize();


for (let i = 0; i < Constants.SIMULATION_COUNT; i++){
    for (let j = 0; j < Constants.GENERATION_CYCLES; j++){
        console.log("Av Fitness HERM1: " + getAverageFitness(H1Pop));
        H1Pop = reproduceHerm(getReproducingPop(H1Pop, Constants.REPRODUCTION_CUTOFF, j), j);

        console.log("Av Fitness HERM2: " + getAverageFitness(H2Pop));
        H2Pop = reproduceHerm(getReproducingPop(H2Pop, Constants.REPRODUCTION_CUTOFF, j), j);

        //var temp = M1Pop1.concat(F2Pop1);
        console.log("Av Fitness M: " + getAverageFitness(M1Pop1));
        console.log("Av Fitness F " + getAverageFitness(F2Pop1));
        var temp = reproduceBisexual(getReproducingPop(M1Pop1, Constants.REPRODUCTION_CUTOFF), getReproducingPop(F2Pop1, Constants.REPRODUCTION_CUTOFF));
        M1Pop1 = temp[0];
        F2Pop1 = temp[1];

        console.log("Av Fitness M IMBALANCE: " + getAverageFitness(M1Pop2));
        console.log("Av Fitness F IMBALANCE: " + getAverageFitness(F2Pop1));
        var temp2 = reproduceBisexual(getReproducingPop(M1Pop2, Constants.REPRODUCTION_CUTOFF * .5), getReproducingPop(F2Pop2, Constants.REPRODUCTION_CUTOFF * 1.5));
        M1Pop2 = temp2[0];
        F2Pop2 = temp2[1];


    }
}


getAverageFitness(H1Pop, 10);
getAverageNonTemplateFitness(H1Pop, 20);
getAverageTemplateFitness(H1Pop, 30);


