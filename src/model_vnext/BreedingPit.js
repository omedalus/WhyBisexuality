/* global _ */

/* global Gene */
/* global Organism */
/* global FitnessTemplate */


/**
 * Holds and runs a simulation of breeding of haploid, diploid, or mixed
 * populations of a sample species, and evaluates their fitness.
 * @param {Object.<string, Array.<Gene> >} genepool The canonical set of genes 
 *     to be used by the population being bred.
 * @param {Array.<FitnessTemplate>} fitnessTemplates The canonical set of fitness templates
 *     to be used for evaluating the population being bred.
 * @constructor
 */
var BreedingPit = function(genepool, fitnessTemplates) {
  let self = this;

  /**
   * Genes used by the population.
   * @type {Object.<string, Array.<Gene> >} 
   */
  self.genepool = genepool;
  
  /**
   * Fitness templates for evaluating the population.
   * @type {Array.<FitnessTemplate>} 
   */
  self.fitnessTemplates = fitnessTemplates;
  
  
  /**
   * A collection of organisms whose fitness scores we're trying to improve.
   * @type {Array.<Organism>}
   */
  self.population = [];
};


BreedingPit.prototype.createPopulation = function(popSize) {
  
};
