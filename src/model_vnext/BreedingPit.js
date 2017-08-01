/* global _ */

/* global Gene */
/* global Organism */
/* global FitnessTemplate */


/**
 * Holds and runs a simulation of breeding of haploid, diploid, or mixed
 * populations of a sample species, and evaluates their fitness.
 * @param {number} popSize The number of individuals that this Breeding Pit holds. Each generation
 *     retains exactly this many Organism objects.
 * @constructor
 */
var BreedingPit = function(popSize) {
  let self = this;

  /**
   * The number of individuals that this Breeding Pit holds. 
   * @type {number}
   */
  self.popSize = popSize;
  
  /**
   * A collection of organisms whose fitness scores we're trying to improve.
   * @type {Array.<Organism>}
   */
  self.population = [];
  
  // Create the initial population!
  _.times(popSize, function() {
    let organism = new Organism();
    organism.index = self.population.length;
    self.population.push(organism);
  });
};


/**
 * For each organism in the population, for each gene locus in the genepool, picks a 
 * gene variant at random and adds it to the organism. Each call to this method is
 * cumulative, so the organisms will have a ploidity consistent with the number of
 * times it's been called.
 * @param {Object.<string, Array.<Gene> >} genepool The genes to assign to the
 *     organisms in the population, keyed by locus. Each organism will receive one
 *     gene from the variants available at each locus.
 */
BreedingPit.prototype.addGenes = function(genepool) {
  let self = this;
  _.each(self.population, function(organism) {
    let genesForThisIndividual = [];
    _.each(genepool, function(variants, locus) {
      let iVariant = Math.floor(Math.random() * variants.length);
      genesForThisIndividual.push(variants[iVariant]);
    });
    organism.inheritGenes(genesForThisIndividual);
  });
};


/**
 * Equally distributes sex markers to all organisms in the population who don't already
 * have a sex. Guarantees as equal a distribution as whole numbers will allow.
 * @param {Array.<string>} sexes A list of sex markers. Each organism gets one marker, pulled
 *     randomly from the list.
 */
BreedingPit.prototype.assignSexes = function(sexes) {
  // Shuffle the sex array to avoid aliasing if it's called in a loop and
  // isn't perfectly divisible by the population size.
  sexes = _.shuffle(sexes);
  
  let self = this;
  let unassignedOrganisms = _.chain(self.population).
      filter(function(organism) {
        return _.isNull(organism.sex);
      }). 
      shuffle(). 
      value();

  let iSex = 0;
  _.each(unassignedOrganisms, function(organism) {
    organism.sex = sexes[iSex];
    iSex++;
    iSex %= sexes.length;
  });
};




