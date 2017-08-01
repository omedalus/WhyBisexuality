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



