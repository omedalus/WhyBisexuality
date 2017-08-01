/* global describe */
/* global expect */
/* global _ */

/* global Organism */
/* global Gene */


describe('Organism', function() {
  
  /**
   * Helper function to grab gene variants and assemble them into an array.
   * @param {Object.<string, Array.<Gene> >} genepool Dictionary of arrays of Gene objects, 
   *     keyed by locus.
   * @param {number} iVariant Which element to grab from each gene, 1-indexed.
   * @returns {Array.<Gene>} The iVariant-th variant of each gene.
   */
  let grabGeneVariant = function(genepool, iVariant) {
    let retval = [];
    _.each(genepool, function(genearray, genekey) {
      retval.push(genearray[iVariant - 1]);
    });
    return retval;
  };


  it('should be able to inherit at least one set of genes.', function() {
    let genepool = Gene.createPool(100, 1, 1);
    let firstVariants = grabGeneVariant(genepool, 1);
    
    let dude = new Organism();
    dude.inheritGenes(firstVariants);
    
    expect(_.size(dude.genes)).toBe(100);
    _.each(dude.genes, function(genearray) {
      expect(genearray.length).toBe(1);
    });
  });


  it('should be able to inherit at least two sets of genes.', function() {
    let genepool = Gene.createPool(100, 2, 2);
    let firstVariants = grabGeneVariant(genepool, 1);
    let secondVariants = grabGeneVariant(genepool, 2);
    
    let dude = new Organism();
    dude.inheritGenes(firstVariants);
    dude.inheritGenes(secondVariants);
    
    expect(_.size(dude.genes)).toBe(100);
    _.each(dude.genes, function(genearray) {
      expect(genearray.length).toBe(2);
    });
  });


  it('should be able to inherit copies of the same allele.', function() {
    let genepool = Gene.createPool(100, 1, 1);
    let firstVariants = grabGeneVariant(genepool, 1);

    let dude = new Organism();
    dude.inheritGenes(firstVariants);
    dude.inheritGenes(firstVariants);
    
    expect(_.size(dude.genes)).toBe(100);
    _.each(dude.genes, function(genearray) {
      expect(genearray.length).toBe(2);
    });
  });


  it('should produce gametes that are clones of itself, if it is haploid.', function() {
    let genepool = Gene.createPool(100, 1, 1);
    let firstVariants = grabGeneVariant(genepool, 1);

    let dude = new Organism();
    dude.inheritGenes(firstVariants);

    let gameteGenes = dude.produceGamete();

    expect(_.size(gameteGenes)).toBe(100);
    _.each(gameteGenes, function(gene, genekey) {
      let dudefirstallele = dude.genes[genekey][0];
      expect(dudefirstallele.variant).toBe(gene.variant);
    });
  });


  it('should produce gametes that are uniform mix of both genomes, if diploid.', function() {
    let genepool = Gene.createPool(1000, 2, 2);
    let firstVariants = grabGeneVariant(genepool, 1);
    let secondVariants = grabGeneVariant(genepool, 2);
    
    let dude = new Organism();
    dude.inheritGenes(firstVariants);
    dude.inheritGenes(secondVariants);
    
    let gameteGenes = dude.produceGamete();

    expect(_.size(gameteGenes)).toBe(1000);

    let firstVariantCount = 0;
    _.each(gameteGenes, function(gene, genekey) {
      let dudefirstallele = dude.genes[genekey][0];
      if (gene.variant === dudefirstallele.variant) {
        firstVariantCount++;
      }
    });
    
    // Probabilistic, but in 1000 fair binomial trials, 
    // getting less than 400 should be incredibly unlikely.
    expect(firstVariantCount).toBeGreaterThan(400);
  });


  it('should produce gametes that are uniform mix of all genomes, if polyploid.', function() {
    let genepool = Gene.createPool(1000, 5, 5);
    let dude = new Organism();
    _.times(5, function(iVariant) {
      dude.inheritGenes(grabGeneVariant(genepool, iVariant + 1));
    });

    let gameteGenes = dude.produceGamete();

    expect(_.size(gameteGenes)).toBe(1000);

    let nVariantCount = [0, 0, 0, 0, 0];
    _.each(gameteGenes, function(gene, genekey) {
      let dudegenes = dude.genes[genekey];
      _.each(dudegenes, function(dudegene, iVariant) {
        if (dudegene.variant === gene.variant) {
          nVariantCount[iVariant]++;
        }
      });
    });
    
    // Probabilistic, but in 1000 fair trials of 5 buckets, 
    // getting less than 150 should be incredibly unlikely.
    _.each(nVariantCount, function(c) {
      expect(c).toBeGreaterThan(150);
    });
  });
});

