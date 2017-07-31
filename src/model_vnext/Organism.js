/* global _ */
/* global Gene */

/**
 * An individual in a population. Consists of one or more sets of genes that, working together,
 * produce a phenotype. Can reproduce, which involves a recombination of one or more
 * of its gene sets.
 * @constructor
 */
var Organism = function() {
  let self = this;
  
  // A dictionary of arrays of genes, keyed by locus.
  self.genes = {};
};


/**
 * Adds the genes in the array to the organism's genome. Used in the initial
 * creation of the organism.
 * @param {Gene[]} genes An array of Gene objects.
 * @returns {Organism} This object.
 */
Organism.prototype.inheritGenes = function(genes) {
  let self = this;
  genes.forEach(function(gene) {
    if (!(gene.locus in self.genes)) {
      self.genes[gene.locus] = [];
    }
    self.genes[gene.locus].push(gene);
  });
  return self;
};


/**
 * For the locus of every gene in the organism's genome, outputs one gene at that locus,
 * selected at random from the organism's genome.
 * @returns {Object} A dictionary of Gene objects, keyed by locus.
 */
Organism.prototype.produceGamete = function() {
  let self = this;
  let selectedGenes = _.map(self.genes, function() {
    
  });
  return selectedGenes;
};





