/* global _ */

/**
 * An individual in a population. Consists of one or more sets of genes that, working together,
 * produce a phenotype. Can reproduce, which involves a recombination of one or more
 * of its gene sets.
 * @constructor
 */
var Organism = function() {
  let self = this;
  
  /**
   * The organism's genes, keyed by locus.
   * @type {Object.<string, Array<Gene> >}
   */
  self.genes = {};
  
  /**
   * The organism's sex, which is assignable independently of its genome for purposes of this
   * simulation. This is just a designator used by the BreedingPit to select a mate for 
   * this organism, and has no intrinsic function to the organism itself. However, we will
   * use the following convention: null means hermaphroditic (can mate with any other 
   * hermaphrodite), 'M' means male (can mate with any female), and 'F' means female (can mate 
   * with any male).
   */
  self.sex = null;
};


/**
 * Adds the genes in the array to the organism's genome. Used in the initial
 * creation of the organism.
 * @param {Array.<Gene>} genes An array of Gene objects.
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
 * @returns {Object.<string, Gene>} A dictionary of Gene objects, keyed by locus.
 */
Organism.prototype.produceGamete = function() {
  let self = this;
  let selectedGenes = _.mapObject(self.genes, function(genearray) {
    return genearray[Math.floor(Math.random() * genearray.length)];
  });
  return selectedGenes;
};





