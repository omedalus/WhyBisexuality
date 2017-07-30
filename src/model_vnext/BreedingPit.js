/**
 * BreedingPit.js
 * Holds and runs a simulation of breeding of haploid, diploid, or mixed
 * populations of a sample species, and evaluates their fitness.
 * NOTE: BreedingPit depends on Constants for now, but most Constants will be
 * replaced by passable parameters.
 */

/* global Attribute */
/* global Constants */
/* global Organism */
/* global TemplateManager */
/* global randn_bm */


var BreedingPit = function() {
  this.H1Pop = [];
  this.H2Pop = [];
  
  this.M1Pop1 = [];
  this.F2Pop1 = [];
  
  this.M1Pop2 = [];
  this.F2Pop2 = [];
  
  this.templateManager = new TemplateManager();
  this.phenotypeWeights = [];
};


BreedingPit.prototype.createPhenotypeWeights = function() {
  var phenotypeWeightsNew = new Array();
  for (var i = 0; i < Constants.ATTRIBUTE_COUNT; i++) {
      phenotypeWeightsNew.push(Constants.PHENOTYPE_WEIGHT_AVG + Constants.PHENOTYPE_WEIGHT_STD * randn_bm());
  }
  return phenotypeWeightsNew;
};





// creates templateManager, creates phenotypeWeights array, creates populations (could be generalized better?)
BreedingPit.prototype.initialize = function() {
  var self = this;
  function getDiploidPopulation(count){
    var population = new Array();
    for (var i = 0; i < count; i++){
      var newOrgo = new Organism(false, self.templateManager);
      newOrgo.randomizeAttributes(Constants.ATTRIBUTE_COUNT, Constants.DOMINANCE_PREDISPOSITION_ATTRIBUTES, self.phenotypeWeights);
      population.push(newOrgo);
    }
    return population;
  }

  function getHaploidPopulation(count){
    var population = new Array();
    for (var i = 0; i < count; i++){
      var newOrgo = new Organism(true, self.templateManager);
      newOrgo.randomizeAttributes(Constants.ATTRIBUTE_COUNT, Constants.DOMINANCE_PREDISPOSITION_ATTRIBUTES, self.phenotypeWeights);
      population.push(newOrgo);
    }
    return population;
  }

  this.phenotypeWeights = this.createPhenotypeWeights();
  this.templateManager.randomize(
      Constants.TEMPLATE_COUNT, 
      Constants.TEMPLATE_WEIGHT_AVG, 
      Constants.TEMPLATE_WEIGHT_STD, 
      Constants.TEMPLATE_AVERAGE_SIZE, 
      Constants.TEMPLATE_SIZE_DISTRIBUTION, 
      Constants.DOMINANCE_PREDISPOSITION_TEMPLATE, 
      Constants.ATTRIBUTE_COUNT);
  this.H1Pop = getHaploidPopulation(Constants.POPULATION_COUNT);
  this.H2Pop = getDiploidPopulation(Constants.POPULATION_COUNT);
  this.M1Pop1 = getHaploidPopulation(Math.floor(Constants.POPULATION_COUNT/2));
  this.F2Pop1 = getDiploidPopulation(Math.floor(Constants.POPULATION_COUNT/2));
  this.M1Pop2 = getHaploidPopulation(Math.floor(Constants.POPULATION_COUNT/2));
  this.F2Pop2 = getDiploidPopulation(Math.floor(Constants.POPULATION_COUNT/2));
};

// calculates average fitness of population
BreedingPit.prototype.getAverageFitness = function(population){
    var total = 0;
    for (var each of population){
        total += each.getFitness(this.templateManager);
    }
    total = total/population.length;
    return total;
};

// calculates average fitness of population considering only template related fitness gains
BreedingPit.prototype.getAverageNonTemplateFitness = function(population) {
    var total = 0;
    for (var each of population){
        total += each.getNonTemplateFitness(this.templateManager);
    }
    total = total/population.length;
    return total;
};

// calculates average fitness of population considering only non-template fitnesses
BreedingPit.prototype.getAverageTemplateFitness = function(population) {
    var total = 0;
    for (var each of population){
        total += each.getTemplateFitness(this.templateManager);
    }
    total = total/population.length;
    return total;
};

// returns the top (cutoff) portion of a population
BreedingPit.prototype.getReproducingPop = function(population, cutoff){
    var tupleList = new Array ();
    for (let each of population){
        var tuple = [each, each.getFitness()];
        tupleList.push(tuple);
    }

    // From stackoverflow. I dont understand why it works. Its meant to sort by the second item, fitness of organism
    // https://stackoverflow.com/questions/3524827/sort-a-2d-array-by-the-second-value
    // NOTE (mvol): It works because "sort" uses a ternary comparison function to understand the sort order. 
    // "sort" doesn't inherently know how to sort tuples, so it wants you to provide a function that tells it 
    // how to tell if one tuple is greater, lesser, or equal to another. Sort expects this comparison function (comparator)
    // to produce positive output if a>b, negative output if a<b, and zero of a==b. Which is what this does.
    // Anyway, we're gonna refactor a lot of this with UnderscoreJS later.
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
};

// creates a deep copy of an attributes list
// NOTE (mvol): There are plenty of utilities for this. :-) Will refactor with UnderscoreJS later.
BreedingPit.prototype.copyAttributes = function(attributes) {
    var newList = new Array();

    for (var each of attributes){
        var newAttribute = new Attribute(each.getBoolean(), each.getIndex());
        newList.push(newAttribute);
    }
    return newList;
};

// reproduces hermaphrodite population (list of organisms), works for both haploids and diploids
BreedingPit.prototype.reproduceHerm = function(population){
    var newPopulation = Array();
    var j = 0;
    while (newPopulation.length < Constants.POPULATION_COUNT){
        for (var each of population){
            j++;
            const ea = each;
            const haploid = each.getHaploid();
            var newOrgo = new Organism(haploid, this.templateManager);
            var temp = this.copyAttributes(each.getAttributes1());
            if (haploid){
                newOrgo.setAttributes(temp, temp, this.phenotypeWeights); 
            } else {
               newOrgo.setAttributes(temp, this.copyAttributes(ea.getAttributes2()), this.phenotypeWeights);
            }

            newOrgo.mutate(Constants.MUTATION_LIKELIHOOD);
            newPopulation.push(newOrgo);
        }
    }
    return newPopulation;
};

// reproduces bisexual populations, returns [new male population, new female population]
BreedingPit.prototype.reproduceBisexual = function(malePopulation, femalePopulation){
    var newMales = Array();
    var newFemales = Array();
    let male = true;
    while (newMales.length * 2 < Constants.POPULATION_COUNT){
        for (let each of femalePopulation){
            if (male){

                //console.log("MALE MAKER: " + each.getFitness());
                let newOrgo = new Organism(male, this.templateManager);
                var temp1;
                if (Math.random() < .5) {
                    if (Math.random() < .5) {
                        temp1 = this.copyAttributes(each.getAttributes1());
                    } else {
                        temp1 = this.copyAttributes(each.getAttributes2());
                    }
                } else {
                    var tempM = malePopulation[Math.floor(Math.random() * malePopulation.length)];
                    temp1 = this.copyAttributes(tempM.getAttributes1());
                    //console.log("MALE BREEDER FITNESS: " + tempM.getFitness());
                }
                newOrgo.setAttributes(temp1, temp1, this.phenotypeWeights);
                newOrgo.mutate(Constants.MUTATION_LIKELIHOOD);
                newMales.push(newOrgo);
                //console.log(male + "New Male Fitness: " + newOrgo.getFitness());
                male = false;
            } else {
                let newOrgo = new Organism(male, this.templateManager);              

                var temp2 = this.copyAttributes(malePopulation[Math.floor(Math.random() * malePopulation.length)].getAttributes1());
                if (Math.random() < .5) {
                    temp2 = this.copyAttributes(each.getAttributes1());
                } else {
                    temp2 = this.copyAttributes(each.getAttributes2());
                }
                newOrgo.setAttributes(temp1, temp2, this.phenotypeWeights);
                newOrgo.mutate(Constants.MUTATION_LIKELIHOOD);
                newFemales.push(newOrgo);
                male = true;
            }
        }
    }

    return [newMales, newFemales];
};



/**
 * Runs the breeding simulation for one generation cycle.
 * @param {number} generationCycle Which generation cycle this step is occuring on.
 *    I (mvol) don't really know why it requires this info.
 */
BreedingPit.prototype.step = function(generationCycle) {
  console.log("Av Fitness HERM1: " + this.getAverageFitness(this.H1Pop));
  this.H1Pop = this.reproduceHerm(this.getReproducingPop(this.H1Pop, Constants.REPRODUCTION_CUTOFF, generationCycle), generationCycle);

  console.log("Av Fitness HERM2: " + this.getAverageFitness(this.H2Pop));
  this.H2Pop = this.reproduceHerm(this.getReproducingPop(this.H2Pop, Constants.REPRODUCTION_CUTOFF, generationCycle), generationCycle);

  //var temp = M1Pop1.concat(F2Pop1);
  console.log("Av Fitness M: " + this.getAverageFitness(this.M1Pop1));
  console.log("Av Fitness F " + this.getAverageFitness(this.F2Pop1));
  var temp = this.reproduceBisexual(this.getReproducingPop(this.M1Pop1, Constants.REPRODUCTION_CUTOFF), this.getReproducingPop(this.F2Pop1, Constants.REPRODUCTION_CUTOFF));
  this.M1Pop1 = temp[0];
  this.F2Pop1 = temp[1];

  console.log("Av Fitness M IMBALANCE: " + this.getAverageFitness(this.M1Pop2));
  console.log("Av Fitness F IMBALANCE: " + this.getAverageFitness(this.F2Pop1));
  var temp2 = this.reproduceBisexual(this.getReproducingPop(this.M1Pop2, Constants.REPRODUCTION_CUTOFF * .5), this.getReproducingPop(this.F2Pop2, Constants.REPRODUCTION_CUTOFF * 1.5));
  this.M1Pop2 = temp2[0];
  this.F2Pop2 = temp2[1];
};



BreedingPit.prototype.printAverageFitnessReport = function() {
  this.getAverageFitness(this.H1Pop, 10);
  this.getAverageNonTemplateFitness(this.H1Pop, 20);
  this.getAverageTemplateFitness(this.H1Pop, 30);
};

