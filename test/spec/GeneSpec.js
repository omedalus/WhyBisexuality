/* global describe */
/* global expect */
/* global _ */

/* global Gene */


describe('Gene', function() {
  
  describe('expression', function() {
    it('should express the only allele it has when given only one.', function() {
      let genes = [
        new Gene('OCA2', 'brown eyes', 1)
      ];
      
      let expressed = Gene.getExpressions(genes);
      expect(_.size(expressed)).toBe(1);
      expect(expressed['OCA2']).toEqual(['brown eyes']);
    });
  
  
    it('should express the only allele per locus when given only one per locus.', function() {
      let genes = [
        new Gene('OCA2', 'brown eyes', 1),
        new Gene('GLI3', 'six fingers', 1)
      ];
      
      let expressed = Gene.getExpressions(genes);
      expect(_.size(expressed)).toBe(2);
      expect(expressed['OCA2']).toEqual(['brown eyes']);
      expect(expressed['GLI3']).toEqual(['six fingers']);
    });
  
  
    it('should only express each variant once (i.e. "collapse" variants).', function() {
      let genes = [
        new Gene('OCA2', 'brown eyes', 1),
        new Gene('OCA2', 'brown eyes', 1),
        new Gene('OCA2', 'brown eyes', 1),
        new Gene('GLI3', 'six fingers', 1),
        new Gene('GLI3', 'six fingers', 1),
        new Gene('MCR1', 'black coat', 1)
      ];
      
      let expressed = Gene.getExpressions(genes);
      expect(_.size(expressed)).toBe(3);
      expect(expressed['OCA2']).toEqual(['brown eyes']);
      expect(expressed['GLI3']).toEqual(['six fingers']);
      expect(expressed['MCR1']).toEqual(['black coat']);
    });
  
  
    it('should express recessive variants when they\'re all that\'s available.', function() {
      let genes = [
        new Gene('OCA2', 'blue eyes', 2),
        new Gene('GLI3', 'five fingers', 2),
        new Gene('MCR1', 'white coat', 2)
      ];
      
      let expressed = Gene.getExpressions(genes);
      expect(_.size(expressed)).toBe(3);
      expect(expressed['OCA2']).toEqual(['blue eyes']);
      expect(expressed['GLI3']).toEqual(['five fingers']);
      expect(expressed['MCR1']).toEqual(['white coat']);
    });
  
  
    it('should collapse recessive variants.', function() {
      let genes = [
        new Gene('OCA2', 'blue eyes', 2),
        new Gene('OCA2', 'blue eyes', 2),
        new Gene('OCA2', 'blue eyes', 2),
        new Gene('GLI3', 'five fingers', 2),
        new Gene('GLI3', 'five fingers', 2),
        new Gene('MCR1', 'white coat', 2)
      ];
      
      let expressed = Gene.getExpressions(genes);
      expect(_.size(expressed)).toBe(3);
      expect(expressed['OCA2']).toEqual(['blue eyes']);
      expect(expressed['GLI3']).toEqual(['five fingers']);
      expect(expressed['MCR1']).toEqual(['white coat']);
    });
  
  
    it('should express dominant variants over recessive ones.', function() {
      let genes = [
        new Gene('OCA2', 'brown eyes', 1),
        new Gene('GLI3', 'six fingers', 1),
        new Gene('MCR1', 'black coat', 1),
        new Gene('OCA2', 'blue eyes', 2),
        new Gene('GLI3', 'five fingers', 2),
        new Gene('MCR1', 'white coat', 2)
      ];
      
      let expressed = Gene.getExpressions(genes);
      expect(_.size(expressed)).toBe(3);
      expect(expressed['OCA2']).toEqual(['brown eyes']);
      expect(expressed['GLI3']).toEqual(['six fingers']);
      expect(expressed['MCR1']).toEqual(['black coat']);
    });
  
  
    it('should let some features be dominant and others be recessive.', function() {
      let genes = [
        new Gene('OCA2', 'blue eyes', 2),
        new Gene('GLI3', 'five fingers', 2),
        new Gene('MCR1', 'black coat', 1),
        new Gene('OCA2', 'blue eyes', 2),
        new Gene('GLI3', 'five fingers', 2),
        new Gene('MCR1', 'white coat', 2)
      ];
      
      let expressed = Gene.getExpressions(genes);
      expect(_.size(expressed)).toBe(3);
      expect(expressed['OCA2']).toEqual(['blue eyes']);
      expect(expressed['GLI3']).toEqual(['five fingers']);
      expect(expressed['MCR1']).toEqual(['black coat']);
    });
  
  
    it ('should exhibit co-dominance.', function() {
      let genes = [
        new Gene('ABO', 'blood protein A', 1),
        new Gene('ABO', 'blood protein B', 1)
      ];
      
      let expressed = Gene.getExpressions(genes);
      expect(_.size(expressed)).toBe(1);
      expect(expressed['ABO'].length).toBe(2);
      expect(expressed['ABO'].includes('blood protein A')).toBe(true);
      expect(expressed['ABO'].includes('blood protein B')).toBe(true);
    });
  
  
    it ('should exhibit co-dominance over a recessive variant.', function() {
      let genes = [
        new Gene('ABO', 'blood protein A', 1),
        new Gene('ABO', 'blood protein B', 1),
        new Gene('ABO', 'blood protein O', 2)
      ];
      
      let expressed = Gene.getExpressions(genes);
      expect(_.size(expressed)).toBe(1);
      expect(expressed['ABO'].length).toBe(2);
      expect(expressed['ABO'].includes('blood protein A')).toBe(true);
      expect(expressed['ABO'].includes('blood protein B')).toBe(true);
    });
  
  
    it ('should exhibit only the most dominant variant out of many.', function() {
      let genes = [
        new Gene('SGR', 'green', 1),
        new Gene('SGR', 'yellow', 2),
        new Gene('SGR', 'brown', 2),
        new Gene('SGR', 'white', 3)
      ];
      
      let expressed = Gene.getExpressions(genes);
      expect(_.size(expressed)).toBe(1);
      expect(expressed['SGR'].length).toBe(1);
      expect(expressed['SGR']).toEqual(['green']);
    });
  
  
    it ('should not care about the order in which the genes are presented.', function() {
      let genes = [
        new Gene('SGR', 'green', 1),
        new Gene('SGR', 'yellow', 2),
        new Gene('SGR', 'brown', 2),
        new Gene('SGR', 'white', 3),
        new Gene('OCA2', 'blue eyes', 2),
        new Gene('GLI3', 'five fingers', 2),
        new Gene('MCR1', 'black coat', 1),
        new Gene('OCA2', 'blue eyes', 2),
        new Gene('GLI3', 'five fingers', 2),
        new Gene('MCR1', 'white coat', 2)
      ];
  
      _.times(100, function() {
        let genesScrambled = _.shuffle(genes);
        
        let expressed = Gene.getExpressions(genesScrambled);
    
        expect(_.size(expressed)).toBe(4);
        
        expect(expressed['SGR'].length).toBe(1);
        expect(expressed['SGR']).toEqual(['green']);
        
        expect(expressed['OCA2']).toEqual(['blue eyes']);
        expect(expressed['GLI3']).toEqual(['five fingers']);
        expect(expressed['MCR1']).toEqual(['black coat']);
      });
    });
  });
  
  
  describe('pool', function() {
    it('should contain the requested number of genes.', function() {
      let pool = Gene.createPool(125, 1, 1);
      expect(_.size(pool)).toBe(125);
      _.each(pool, function(genes, locus) {
        expect(genes.length).toBe(1);
      });
    });
    
    
    it('should contain the requested number of variants.', function() {
      let pool = Gene.createPool(125, 5, 5);
      expect(_.size(pool)).toBe(125);
      _.each(pool, function(genes, locus) {
        expect(genes.length).toBe(5);
      });
    });
    
    
    it('should have a uniform range of variants.', function() {
      let pool = Gene.createPool(1000, 1, 5);

      expect(_.size(pool)).toBe(1000);

      let numGenesWithThisManyVariants = [0, 0, 0, 0, 0];
      _.each(pool, function(genes, locus) {
        expect(genes.length).not.toBeLessThan(1);
        expect(genes.length).not.toBeGreaterThan(5);
        numGenesWithThisManyVariants[genes.length - 1]++;
      });
      
      numGenesWithThisManyVariants.forEach(function(genecount) {
        // We're working with probabilities, so this isn't exact.
        // But in 1000 trials of a uniform discrete distribution of 1-5,
        // the odds of getting less than 150 in any given bucket should
        // be extraordinarily small.
        expect(genecount).toBeGreaterThan(150);
      });
    });
    
    
    it('should have a uniform range of dominances.', function() {
      let pool = Gene.createPool(1000, 5, 5);

      expect(_.size(pool)).toBe(1000);

      let numVariantsWithThisDominance = [0, 0, 0, 0, 0];
      _.each(pool, function(genes, locus) {
        genes.forEach(function(variant) {
          expect(variant.dominance).not.toBeLessThan(1);
          expect(variant.dominance).not.toBeGreaterThan(5);
          numVariantsWithThisDominance[variant.dominance - 1]++;
        });
      });
      
      numVariantsWithThisDominance.forEach(function(variantcount, dominance) {
        // We're working with probabilities, so this isn't exact.
        // But in 5000 trials of a uniform discrete distribution of 1-5,
        // the odds of getting less than 900 in any given bucket should
        // be extraordinarily small.
        expect(variantcount).toBeGreaterThan(900);
      });
    });


    describe('names', function() {
      it('should be keyed by gene locus.', function() {
        let pool = Gene.createPool(1000, 1, 5);
        expect(_.size(pool)).toBe(1000);
        _.each(pool, function(genearray, genekey) {
          genearray.forEach(function(gene) {
            expect(gene.locus).toBe(genekey);
          });
        });
      });

      
      it('should uniquely identify each variant.', function() {
        let pool = Gene.createPool(1000, 5, 5);
        let variantNames = {};
        
        _.each(pool, function(genearray, genekey) {
          genearray.forEach(function(gene) {
            variantNames[gene.variant] = true;
          });
        });
        
        expect(_.size(variantNames)).toBe(5 * 1000);
      });

      
      it ('should be human readable.', function() {
        let pool = Gene.createPool(1000, 1, 5);

        let genekeyTotal = 0;
        _.each(pool, function(genearray, genekey) {
          let genekeyNum = parseInt(genekey.substr(genekey.length - 4), 10);
          genekeyTotal += genekeyNum;
          
          let variantTotal = 0;
          let variantTotalExpected = 0;
          genearray.forEach(function(gene, index) {
            expect(gene.variant.includes('' + genekeyNum)).toBe(true);
            
            let variantNum = parseInt(gene.variant.substr(gene.variant.length - 1), 10);
            variantTotal += variantNum;
            
            variantTotalExpected += index + 1;
          });
          
          // Let's make sure all numbers were represented in these variants.
          expect(variantTotal).toBe(variantTotalExpected);
        });

        // Let's make sure all numbers were represented in the gene keys.
        // Per Gauss's Addition Trick, the sum of all numbers from 1 to 1000
        // is 1001 * 500.
        expect(genekeyTotal).toBe(500500);
      });

    });
  });

});

