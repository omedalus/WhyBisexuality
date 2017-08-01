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
  
  /**
   * The organism's genes, keyed by locus.
   * @type {Object.<string, Array<Gene> >}
   */
  self.genes = {};
  
  
  /**
   * The organism's index in the Breeding Pit collection. Not used directly by the organism
   * itself, but handy for letting the Breeding Pit track this individual.
   * @type {number=}
   */
  self.index = null;
  
  
  /**
   * The organism's sex, which is assignable independently of its genome for purposes of this
   * simulation. This is just a designator used by the BreedingPit to select a mate for 
   * this organism, and has no intrinsic function to the organism itself. However, we will
   * use the following convention: null=unassigned, 'H'=hermaphroditic, 'M'=male, 'F'=female.
   * Hermaphrodites can mate with anybody. Males cannot mate with males and females cannot
   * mate with females.
   * @type {string=}
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


/**
 * Returns the gene variants expressed by this individual.
 * @returns {Object.<string, Array.<string> >} A dictionary of arrays of "variant" values,
 *     keyed by locus.
 */
Organism.prototype.getPhenotype = function() {
  let self = this;
  let allMyGenes = _.chain(self.genes).
      values().
      reduce(function(memo, variants) {
        return memo.concat(variants);
      }, []). 
      value();
      
  let phenotype = Gene.getExpressions(allMyGenes);
  return phenotype;
};


/**
 * Determines an organism's net fitness based on which templates are matched by its phenotype.
 * @param {Array.<FitnessTemplate>} fitnessTemplates The templates that determine the 
 *     organism's fitness in this environment.
 * @returns {number} The organism's fitness score.
 */
Organism.prototype.getFitnessScore = function(fitnessTemplates) {
  let self = this;
  let phenotype = self.getPhenotype();
  
  let score = _.reduce(fitnessTemplates, function(memo, fitnessTemplate) {
    if (fitnessTemplate.match(phenotype)) {
      memo += fitnessTemplate.scoreValue;
    }
    return memo;
  }, 0);
  
  return score;
};



