/* global _ */

/**
 * A specifier for a set of gene variants that, when expressed by an organism, grant the organism
 * an increase or decrease to a total fitness score. Conceptually, this represents certain
 * phenotypic attributes that, when exhibited together by an individual, confer some advantage
 * or disadvantage to their survival in their environment. From the standpoint of algorithmic
 * complexity, the purpose of a FitnessTemplate system is to convolute the solution space
 * with ravines, ridges, local minima, etc., thus thwarting simple hill-climbing approaches.
 * @param {Object.<string, string>} requiredExpressions A collection of gene variants that need
 *     to be expressed by an organism in order to match this template. Keyed by gene locus.
 * @param {number} scoreValue The increase (or decrease, if negative) in an organism's total
 *     fitness score that the organism receives by matching this template.
 * @constructor
 */
var FitnessTemplate = function(requiredExpressions, scoreValue) {
  let self = this;
  self.requiredExpressions = requiredExpressions;
  self.scoreValue = scoreValue;
};


/**
 * Tests the collection of expressions against this template. If all of the expressions required
 * by this template are present in the expressions collection, then the collection matches this
 * template.
 * @param {Object.<string, Array.<string> >} expressions A collection of "variant" values,
 *     keyed by the gene that they're a variant of. The values are gathered into arrays in order
 *     to permit co-expression, such as the case with co-dominance.
 * @returns {boolean} True if all of this template's required expressions are present in the
 *     expressions collection, false otherwise.
 */
FitnessTemplate.prototype.match = function(expressions) {
  
};


/**
 * Creates a random FitnessTemplate by selecting variants from genes in a gene pool.
 * @param {number} sizeMin The smallest number of gene variants to select from the gene pool, to
 *     make into a template.
 * @param {number} sizeMax The largest number of gene variants to select from the gene pool, to
 *     make into a template.
 * @param {number} scoreMin The lowest possibility for the fitness points an organism will 
 *     receive for matching the template. Can be negative, meaning that the template represents
 *     a deleterious phenotype.
 * @param {number} scoreMax The highest possibility for the fitness points an organism will 
 *     receive for matching the template.
 * @param {Object.<string, Array.<Gene> >} genepool A dictionary of arrays of Gene objects, keyed 
 *     by locus.
 * @returns {FitnessTemplate} A newly created FitnessTemplate object.
 */
FitnessTemplate.createRandom = function(sizeMin, sizeMax, scoreMin, scoreMax, genepool) {
  let count = _.random(sizeMin, sizeMax);
  let lociSelected = _.chain(genepool).
      keys().
      shuffle().
      first(count).
      value();
      
  let requiredExpressions = {};
  _.each(lociSelected, function(locus) {
    let genesAtLocus = genepool[locus];
    let variantsAtLocus = _.pluck(genesAtLocus, 'variant');
    let variantSelected = variantsAtLocus[Math.floor(Math.random() * variantsAtLocus.length)];
    requiredExpressions[locus] = variantSelected;
  });
  
  let scoreValue = scoreMin + Math.floor(Math.random() * (scoreMax - scoreMin + 1));
  
  let fitnessTemplate = new FitnessTemplate(requiredExpressions, scoreValue);
  return fitnessTemplate;
};


