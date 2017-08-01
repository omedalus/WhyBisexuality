/* global describe */
/* global expect */
/* global _ */

/* global Gene */
/* global FitnessTemplate */


describe('FitnessTemplate', function() {
  
  // Create genepools once, because it's a somewhat expensive operation and there's no
  // point in repeating it.
  let genepoolSmall = Gene.createPool(100, 1, 5);
  let genepoolLarge = Gene.createPool(1000, 1, 5);
  let genepoolConstVariantCount = Gene.createPool(100, 5, 5);
  
  describe('createRandom', function() {

    it('should contain the requested specific quantity of constraints.', function() {
      for (let numConstraintsRequested = 1; 
          numConstraintsRequested < 100; 
          numConstraintsRequested++) {
        let fitnessTemplate = FitnessTemplate.createRandom(
            numConstraintsRequested, 
            numConstraintsRequested, 
            10,
            10,
            genepoolLarge);
        
        expect(_.size(fitnessTemplate.requiredExpressions)).toBe(numConstraintsRequested);
      }
    });


    it('should contain the requested range quantity of constraints.', function() {
      for (let numConstraintsRequested = 1; 
          numConstraintsRequested < 100; 
          numConstraintsRequested++) {
        let fitnessTemplate = FitnessTemplate.createRandom(
            1, 
            numConstraintsRequested, 
            10,
            10,
            genepoolLarge);
        
        let templateSize = _.size(fitnessTemplate.requiredExpressions);
        expect(templateSize).not.toBeLessThan(1);
        expect(templateSize).not.toBeGreaterThan(numConstraintsRequested);
      }
    });


    it('should contain requested constraint quantity even if close to genepool size.', function() {
      let fitnessTemplate = FitnessTemplate.createRandom(100, 100, 10, 10, genepoolSmall);
      expect(_.size(fitnessTemplate.requiredExpressions)).toBe(100);
    });


    it('should contain all genes if requested size is greater than genepool size.', function() {
      let fitnessTemplate = FitnessTemplate.createRandom(1000, 1000, 10, 10, genepoolSmall);
      expect(_.size(fitnessTemplate.requiredExpressions)).toBe(100);
    });
    
    
    it('should specify a required variant for each selected gene.', function() {
      let fitnessTemplate = FitnessTemplate.createRandom(100, 100, 10, 10, genepoolLarge);
      _.each(fitnessTemplate.requiredExpressions, function(variant, locus) {
        let genesAtLocus = genepoolLarge[locus];
        let variantsAtLocus = _.pluck(genesAtLocus, 'variant');
        expect(variantsAtLocus).toContain(variant);
      });
    });

    describe('randomness', function() {
      it('should choose genes with a uniform distribution.', function() {
        let geneChosenCount = _.mapObject(genepoolSmall, function() { return 0; });
        
        _.times(1000, function() {
          let fitnessTemplate = FitnessTemplate.createRandom(5, 5, 10, 10, genepoolSmall);
          _.each(fitnessTemplate.requiredExpressions, function(variant, locus) {
            geneChosenCount[locus]++;
          });
        });
        
        // Probabilistic, but with 5000 iid selections from 100 buckets, we expect
        // 50 selections per bucket. The odds of getting fewer than 20 in any bucket
        // are very low.
        _.each(geneChosenCount, function(count) {
          expect(count).toBeGreaterThan(20);
        });
      });
  
  
      it('should choose variants with a uniform distribution.', function() {
        let variantChosenCount = [0, 0, 0, 0, 0];
        
        _.times(1000, function() {
          let fitnessTemplate = 
              FitnessTemplate.createRandom(5, 5, 10, 10, genepoolConstVariantCount);
              
          _.each(fitnessTemplate.requiredExpressions, function(variant, locus) {
            let genesAtLocus = genepoolConstVariantCount[locus];
            let variantsAtLocus = _.pluck(genesAtLocus, 'variant');
            
            // We've already expected the variant to be one of the gene's variants in a
            // previous test, but it doesn't hurt to still make sure of it here.
            expect(variantsAtLocus).toContain(variant);
            
            let iVariant = variantsAtLocus.indexOf(variant);
            expect(iVariant).not.toBeLessThan(0);
            expect(iVariant).toBeLessThan(5);
            
            variantChosenCount[iVariant]++;
          });
        });
        
        // Probabilistic, but with 5000 iid selections from 5 buckets, we expect
        // 1000 selections per bucket. The odds of getting fewer than 900 in any bucket
        // are very low.
        _.each(variantChosenCount, function(count) {
          expect(count).toBeGreaterThan(900);
        });
      });
      
      
      it('should set the score with a uniform distribution.', function() {
        let scoreBucketCount = [0, 0, 0, 0, 0];
        
        _.times(1000, function() {
          let fitnessTemplate = FitnessTemplate.createRandom(1, 1, 1, 5, genepoolSmall);
          expect(fitnessTemplate.scoreValue).not.toBeLessThan(1);
          expect(fitnessTemplate.scoreValue).not.toBeGreaterThan(5);
          
          let scoreBucket = Math.floor(fitnessTemplate.scoreValue) - 1;
          scoreBucketCount[scoreBucket]++;
        });
        
        // Probabilistic, but with 1000 iid selections from 5 buckets, we expect
        // 200 selections per bucket. The odds of getting fewer than 150 in any bucket
        // are very low.
        _.each(scoreBucketCount, function(count) {
          expect(count).toBeGreaterThan(150);
        });
      });
      
      
      it('should set score with uniform distribution even when negative.', function() {
        let scoreBucketCount = [0, 0, 0, 0, 0];
        
        _.times(1000, function() {
          let fitnessTemplate = FitnessTemplate.createRandom(1, 1, -2, 2, genepoolSmall);
          expect(fitnessTemplate.scoreValue).not.toBeLessThan(-2);
          expect(fitnessTemplate.scoreValue).not.toBeGreaterThan(2);
          
          let scoreBucket = Math.floor(fitnessTemplate.scoreValue) + 2;
          scoreBucketCount[scoreBucket]++;
        });
        
        // Probabilistic, but with 1000 iid selections from 5 buckets, we expect
        // 200 selections per bucket. The odds of getting fewer than 150 in any bucket
        // are very low.
        _.each(scoreBucketCount, function(count) {
          expect(count).toBeGreaterThan(150);
        });
      });
      
    });
  

  });

  
  
});

