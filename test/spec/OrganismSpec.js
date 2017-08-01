/* global describe */
/* global expect */
/* global _ */

/* global Organism */
/* global Gene */
/* global FitnessTemplate */


describe('Organism', function() {
  
  /**
   * Helper function to grab gene variants and assemble them into an array.
   * @param {Object.<string, Array.<Gene> >} genepool Dictionary of arrays of Gene objects, 
   *     keyed by locus.
   * @param {number=} iVariant Which element to grab from each gene, 1-indexed. If null,
   *     then picks a gene at random for each locus.
   * @returns {Array.<Gene>} The iVariant-th variant of each gene.
   */
  let grabGeneVariant = function(genepool, iVariant) {
    let retval = [];
    _.each(genepool, function(genearray, genekey) {
      if (_.isNumber(iVariant)) {
        retval.push(genearray[iVariant - 1]);
      } else {
        retval.push(genearray[Math.floor(Math.random() * genearray.length)]);
      }
    });
    return retval;
  };
  
  // Pre-create the gene pools because the creation process is arguably a bit expensive.
  let genepoolOneVariant = Gene.createPool(100, 1, 1);
  let genepoolTwoVariant = Gene.createPool(100, 2, 2);
  
  let genepoolSortedDominance = Gene.createPool(1000, 2, 2);
  // Override the random dominances to make them well-sorted.
  _.each(genepoolSortedDominance, function(variants, locus) {
    _.each(variants, function(variant, iVariant) {
      variant.dominance = iVariant;
    });
  });  


  it('should be able to inherit at least one set of genes.', function() {
    let dude = new Organism();
    dude.inheritGenes(grabGeneVariant(genepoolOneVariant, 1));
    
    expect(_.size(dude.genes)).toBe(100);
    _.each(dude.genes, function(genearray) {
      expect(genearray.length).toBe(1);
    });
  });


  it('should be able to inherit at least two sets of genes.', function() {
    let dude = new Organism();
    dude.inheritGenes(grabGeneVariant(genepoolTwoVariant, 1));
    dude.inheritGenes(grabGeneVariant(genepoolTwoVariant, 2));
    
    expect(_.size(dude.genes)).toBe(100);
    _.each(dude.genes, function(genearray) {
      expect(genearray.length).toBe(2);
    });
  });


  it('should be able to inherit copies of the same allele.', function() {
    let firstVariants = grabGeneVariant(genepoolOneVariant, 1);

    let dude = new Organism();
    dude.inheritGenes(firstVariants);
    dude.inheritGenes(firstVariants);
    
    expect(_.size(dude.genes)).toBe(100);
    _.each(dude.genes, function(genearray) {
      expect(genearray.length).toBe(2);
    });
  });


  it('should produce gametes that are clones of itself, if it is haploid.', function() {
    let dude = new Organism();
    dude.inheritGenes(grabGeneVariant(genepoolOneVariant, 1));

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
  
  
  describe('phenotype and fitness', function() {

    it('should express its only variant when haploid.', function() {
      let genepool = Gene.createPool(100, 5, 5);
      let dude = new Organism();
      dude.inheritGenes(grabGeneVariant(genepool, null));
      
      // Each gene has five variants, but the dude only has one allele apiece,
      // so that's the one that should be getting expressed.
      let phenotype = dude.getPhenotype();
      
      _.each(phenotype, function(variants, locus) {
        expect(variants.length).toBe(1);
        expect(locus in dude.genes).toBe(true);
        expect(dude.genes[locus].length).toBe(1);
        expect(variants[0]).toBe(dude.genes[locus][0].variant);
      });
    });


    it('should express dominant variant when diploid.', function() {
      let dude = new Organism();
      dude.inheritGenes(grabGeneVariant(genepoolSortedDominance, null));

      // The dude is haploid.      
      // The dude should be expressing the dominant allele in about half of his genes.
      let firstVariantCount = 0;
      _.each(dude.getPhenotype(), function(expressedVariants, locus) {
        expect(expressedVariants.length).toBe(1);
        if (expressedVariants[0] === genepoolSortedDominance[locus][0].variant) {
          firstVariantCount++;
        }
      });
      expect(firstVariantCount).toBeGreaterThan(400);
      expect(firstVariantCount).toBeLessThan(600);
      
      // Give the dude a second random genome, making him diploid.
      dude.inheritGenes(grabGeneVariant(genepoolSortedDominance, null));
      
      // The dude should now be expressing the dominant allele in about 3/4 of his genes.
      firstVariantCount = 0;
      _.each(dude.getPhenotype(), function(expressedVariants, locus) {
        expect(expressedVariants.length).toBe(1);
        if (expressedVariants[0] === genepoolSortedDominance[locus][0].variant) {
          firstVariantCount++;
        }
      });
      expect(firstVariantCount).toBeGreaterThan(650);
      expect(firstVariantCount).toBeLessThan(850);
    });


    it('should co-express co-dominant alleles.', function() {
      let genepool = Gene.createPool(1000, 2, 2);
      // Override the random dominances to make them co-dominant.
      _.each(genepool, function(variants, locus) {
        _.each(variants, function(variant, iVariant) {
          variant.dominance = 1;
        });
      });
      
      let dude = new Organism();
      
      dude.inheritGenes(grabGeneVariant(genepool, 1));
      dude.inheritGenes(grabGeneVariant(genepool, 2));
      
      _.each(dude.getPhenotype(), function(expressedVariants, locus) {
        expect(expressedVariants.length).toBe(2);
      });
    });


    it('should compute fitness score by summing matching templates.', function() {
      let dude = new Organism();
      dude.inheritGenes(grabGeneVariant(genepoolOneVariant, 1));
      
      // Set up three degenerate one-gene templates.
      let templates = _.chain(genepoolOneVariant).
          values().
          first(3).
          map(function(variants) {
            let requiredExpressions = {};
            requiredExpressions[variants[0].locus] = variants[0].variant; 
            return new FitnessTemplate(requiredExpressions, 1);
          }). 
          value();

      let score = dude.getFitnessScore(templates);
      expect(score).toBe(3);
    });
    
    
    it('should compute fitness score from only templates that match.', function() {
      let dude = new Organism();
      dude.inheritGenes(grabGeneVariant(genepoolTwoVariant, null));
      
      // Set up 100 degenerate one-gene templates, all requiring the first variant.
      let templates = _.chain(genepoolTwoVariant).
          values().
          map(function(variants) {
            let requiredExpressions = {};
            requiredExpressions[variants[0].locus] = variants[0].variant; 
            return new FitnessTemplate(requiredExpressions, 1);
          }). 
          value();

      let score = dude.getFitnessScore(templates);
      
      // The dude should have grabbed about half (give or take) of the first-variant
      // genes. This is probabilistic, but we expect 50, so <35 or >65 would be
      // exceptionally unlikely.
      expect(score).not.toBeLessThan(35);
      expect(score).not.toBeGreaterThan(65);
    });


    it('should be computing fitness by phenotype, not genotype.', function() {
      let dude = new Organism();
      dude.inheritGenes(grabGeneVariant(genepoolSortedDominance, null));
      dude.inheritGenes(grabGeneVariant(genepoolSortedDominance, null));
      
      // The dude is now diploid, and should have about 75% expression of dominant alleles.
      
      // Set up 1000 degenerate one-gene templates, all requiring the first (dominant) variant.
      let templates = _.chain(genepoolSortedDominance).
          values().
          map(function(variants) {
            let requiredExpressions = {};
            requiredExpressions[variants[0].locus] = variants[0].variant; 
            return new FitnessTemplate(requiredExpressions, 1);
          }). 
          value();

      let score = dude.getFitnessScore(templates);
      
      // The dude should match about 750 of the templates. This is probabilistic, but
      // a match of <700 or >800 would be very odd.
      expect(score).not.toBeLessThan(700);
      expect(score).not.toBeGreaterThan(800);
    });


    it('should be computing fitness by phenotype with non-degenerate templates.', function() {
      let dude = new Organism();
      dude.inheritGenes(grabGeneVariant(genepoolSortedDominance, null));
      dude.inheritGenes(grabGeneVariant(genepoolSortedDominance, null));
      
      // The dude is now diploid, and should have about 75% expression of dominant alleles.
      
      // Set up 100 non-overlapping three-gene templates.
      let loci = _.keys(genepoolSortedDominance);
      let templates = [];
      _.times(100, function() {
        let locus1 = loci.shift();
        let locus2 = loci.shift();
        let locus3 = loci.shift();
        
        let requiredExpressions = {};
        requiredExpressions[locus1] = genepoolSortedDominance[locus1][0].variant;
        requiredExpressions[locus2] = genepoolSortedDominance[locus2][0].variant;
        requiredExpressions[locus3] = genepoolSortedDominance[locus3][1].variant;
        templates.push(new FitnessTemplate(requiredExpressions, 1));
      });

      let score = dude.getFitnessScore(templates);
      
      // Each template requires two dominant and one recessive expressions.
      // The dominant ones have a 75% chance of being matched, and the recessive one
      // has a 25% chance. 75%*75%*25% = 14%. 
      // So we expect about 14% of the templates to match.
      expect(score).not.toBeLessThan(7);
      expect(score).not.toBeGreaterThan(21);
    });    
  });
});

