/* global describe */
/* global expect */
/* global spyOn */
/* global _ */

/* global BreedingPit */
/* global FitnessTemplate */
/* global Gene */


describe('BreedingPit', function() {
  
  describe('constructor', function() {
    it('should set the population to the specified size.', function() {
      for (let popSize = 10; popSize < 100000; popSize *= 10) {
        let pit = new BreedingPit(popSize);
        expect(pit.population.length).toBe(popSize);
        expect(pit.popSize).toBe(popSize);
      }
    });
    
    it('should assign the right index for each organism.', function() {
      let pit = new BreedingPit(1000);
      _.each(pit.population, function(organism, index) {
        expect(organism.index).toBe(index);
      });
    });
  });
  
  
  describe('addGenes', function() {
    it('should add genes uniformly to make a haploid population.', function() {
      let genepool = Gene.createPool(10, 5, 5);
      let pit = new BreedingPit(1000);
      pit.addGenes(genepool);

      _.each(pit.population, function(organism) {
        // Every organism should have exactly one variant for each gene in the genepool.
        expect(_.size(organism.genes)).toBe(10);
        _.each(organism.gene, function(genearray, locus) {
          expect(genearray.length).toBe(1);
        });
      });
      
      // Each of the genes should have each of its variants selected a roughly equal
      // number of times.
      _.each(genepool, function(genearray, locus) {
        let variants = _.pluck(genearray, 'variant');
        let variantCounts = [0, 0, 0, 0, 0];
        
        _.each(pit.population, function(organism) {
          let variant = organism.genes[locus][0].variant;
          let iVariant = variants.indexOf(variant);
          
          expect(iVariant).not.toBeLessThan(0);
          expect(iVariant).toBeLessThan(5);
          variantCounts[iVariant]++;
        });
        
        // With 1,000 trials across 5 buckets, we expect 200 per bucket.
        // Allowing for #trials=#genes, we can at least say that <100 or >300
        // would be unusual.
        _.each(variantCounts, function(count) {
          expect(count).toBeGreaterThan(100);
          expect(count).toBeLessThan(300);
        });
      });
    });
    

    it('should add genes uniformly to make a diploid population.', function() {
      let genepool = Gene.createPool(10, 5, 5);
      let pit = new BreedingPit(1000);
      
      pit.addGenes(genepool);
      pit.addGenes(genepool);

      _.each(pit.population, function(organism) {
        // Every organism should have exactly two variants for each gene in the genepool.
        // They could well be the same variant, but that's okay.
        expect(_.size(organism.genes)).toBe(10);
        _.each(organism.gene, function(genearray, locus) {
          expect(genearray.length).toBe(2);
        });
      });
      
      // Each of the genes should have each of its variants selected a roughly equal
      // number of times.
      _.each(genepool, function(genearray, locus) {
        let variants = _.pluck(genearray, 'variant');
        let variantCounts = [0, 0, 0, 0, 0];
        
        _.each(pit.population, function(organism) {
          _.each(organism.genes[locus], function(gene) {
            let variant = gene.variant;
            let iVariant = variants.indexOf(variant);
            
            expect(iVariant).not.toBeLessThan(0);
            expect(iVariant).toBeLessThan(5);
            variantCounts[iVariant]++;
          });
        });
        
        // With 2*1,000 trials across 5 buckets, we expect 400 per bucket.
        // Allowing for #trials=#genes, we can at least say that <300 or >500
        // would be unusual.
        _.each(variantCounts, function(count) {
          expect(count).toBeGreaterThan(300);
          expect(count).toBeLessThan(500);
        });
      });
    });
    
    
    it('should add genes uniformly to make a triploid population.', function() {
      let genepool = Gene.createPool(10, 5, 5);
      let pit = new BreedingPit(1000);
      
      pit.addGenes(genepool);
      pit.addGenes(genepool);
      pit.addGenes(genepool);

      _.each(pit.population, function(organism) {
        // Every organism should have exactly two variants for each gene in the genepool.
        // They could well be the same variant, but that's okay.
        expect(_.size(organism.genes)).toBe(10);
        _.each(organism.gene, function(genearray, locus) {
          expect(genearray.length).toBe(3);
        });
      });
      
      // Each of the genes should have each of its variants selected a roughly equal
      // number of times.
      _.each(genepool, function(genearray, locus) {
        let variants = _.pluck(genearray, 'variant');
        let variantCounts = [0, 0, 0, 0, 0];
        
        _.each(pit.population, function(organism) {
          _.each(organism.genes[locus], function(gene) {
            let variant = gene.variant;
            let iVariant = variants.indexOf(variant);
            
            expect(iVariant).not.toBeLessThan(0);
            expect(iVariant).toBeLessThan(5);
            variantCounts[iVariant]++;
          });
        });
        
        // With 3*1,000 trials across 5 buckets, we expect 600 per bucket.
        // Allowing for #trials=#genes, we can at least say that <500 or >700
        // would be unusual.
        _.each(variantCounts, function(count) {
          expect(count).toBeGreaterThan(500);
          expect(count).toBeLessThan(700);
        });
      });
    });
  });


  describe('assignSexes', function() {
    it('should initially have no sex assignments.', function() {
      let pit = new BreedingPit(100);
      _.each(pit.population, function(organism) {
        expect(organism.sex).toBeNull();
      });
    });

    
    it('should be able to assign at least one sex.', function() {
      let pit = new BreedingPit(100);
      pit.assignSexes(['H']);
      _.each(pit.population, function(organism) {
        expect(organism.sex).toBe('H');
      });
    });


    it('should only assign sex to organisms that don\'t already have one.', function() {
      let pit = new BreedingPit(100);
      pit.population[0].sex = 'Attack Helicopter';
      pit.assignSexes(['H']);
      
      let sexgroups = _.groupBy(pit.population, 'sex');
      expect(_.size(sexgroups)).toBe(2);
      expect(sexgroups['H'].length).toBe(99);
      expect(sexgroups['Attack Helicopter'].length).toBe(1);
      expect(sexgroups['Attack Helicopter'][0].index).toBe(0);
    });


    it('should assign sexes equally if perfectly divisible.', function() {
      let pit = new BreedingPit(100);
      pit.assignSexes(['M', 'F']);
      
      let sexgroups = _.groupBy(pit.population, 'sex');
      expect(_.size(sexgroups)).toBe(2);
      expect(sexgroups['M'].length).toBe(50);
      expect(sexgroups['F'].length).toBe(50);
    });


    it('should assign sexes equally, at most off-by-one if not perfectly divisible.', function() {
      let pit = new BreedingPit(100);
      pit.assignSexes(['M', 'F', 'H']);
      
      let sexgroups = _.groupBy(pit.population, 'sex');
      expect(_.size(sexgroups)).toBe(3);
      _.each(sexgroups, function(sexgroup) {
        expect(sexgroup.length).not.toBeLessThan(33);
        expect(sexgroup.length).not.toBeGreaterThan(34);
      });
    });


    it('should avoid sex-assignment aliasing if not perfectly divisible.', function() {
      let timesGotThe34 = {
        'M': 0,
        'F': 0,
        'H': 0
      };
      
      _.times(100, function() {
        let pit = new BreedingPit(100);
        pit.assignSexes(['M', 'F', 'H']);
        
        let sexgroups = _.groupBy(pit.population, 'sex');
        _.each(sexgroups, function(sexgroup, sexmarker) {
          if (sexgroup.length >= 34) {
            timesGotThe34[sexmarker]++;
          }
        });
      });
      
      // Expect each one to get the 34 about 1/3 of the time.
      _.each(timesGotThe34, function(count) {
        expect(count).toBeGreaterThan(20);
        expect(count).toBeLessThan(45);
      });
    });
    
    
    it('should assign sexes at random.', function() {
      let timesMale = [0, 0, 0, 0, 0];
      _.times(100, function() {
        let pit = new BreedingPit(5);
        pit.assignSexes(['M', 'F']);
        _.each(pit.population, function(organism, index) {
          if (organism.sex === 'M') {
            timesMale[index]++;
          }
        });
      });
      
      // Each one should have gotten a chance to be male about half the time.
      _.each(timesMale, function(count) {
        expect(count).toBeGreaterThan(35);
        expect(count).toBeLessThan(65);
      });
    });
  });
  

  describe('getFitnessScores and cullLeastFitIndividuals', function() {
    it('should compute fitness scores en masse.', function() {
      let pit = new BreedingPit(100);
      let genepool = {
        'EYES': [new Gene('EYES', 'brown', 1), new Gene('EYES', 'blue', 2)],
        'HAIR': [new Gene('HAIR', 'black', 1), new Gene('HAIR', 'blond', 2)]
      };

      pit.addGenes(genepool);
      
      // We now have a population of haploid individuals.
      // Half the population have brown eyes and half have blue.
      // Half have black hair and half have blond.
      
      // Make blond hair be better than black.
      // Make blue eyes be better than brown.
      // Make the combination of blond hair and blue eyes best of all.
      // Make the combination of brown eyes and black hair deleterious.
      let fitnessTemplates = [
        new FitnessTemplate({'HAIR': 'blond'}, 80),
        new FitnessTemplate({'EYES': 'blue'}, 40),
        new FitnessTemplate({'HAIR': 'black'}, 20),
        new FitnessTemplate({'EYES': 'brown'}, 10),
        new FitnessTemplate({'HAIR': 'blond', 'EYES': 'blue'}, 50),
        new FitnessTemplate({'HAIR': 'black', 'EYES': 'brown'}, -50)
      ];
      
      let scores = pit.getFitnessScores(fitnessTemplates);
      
      let numOrganismsWithFitnessScore = _.countBy(scores, _.identity);
      
      // At this point, we expect the following:
      // ~25 individuals will have black hair (+20) and brown eyes (+10) (-50) = -20.
      // ~25 individuals will have blond hair (+80) and brown eyes (+10) = 90.
      // ~25 individuals will have black hair (+20) and blue eyes (+40) = 60.
      // ~25 individuals will have blond hair (+80) and blue eyes (+40) (+50) = 170.
      expect(_.size(numOrganismsWithFitnessScore)).toBe(4);
      expect(numOrganismsWithFitnessScore[-20]).toBeDefined();
      expect(numOrganismsWithFitnessScore[90]).toBeDefined();
      expect(numOrganismsWithFitnessScore[60]).toBeDefined();
      expect(numOrganismsWithFitnessScore[170]).toBeDefined();

      _.each(numOrganismsWithFitnessScore, function(numOrganisms) {
        // They should be approximately 25 each.
        // Falling outside the range [12,38] is very unlikely.
        expect(numOrganisms).toBeGreaterThan(12);
        expect(numOrganisms).toBeLessThan(38);
      });
    });

    
    it('should cull the lowest performers.', function() {
      let pit = new BreedingPit(100);
      _.each(pit.population, function(organism, index) {
        spyOn(organism, 'getFitnessScore').and.returnValue(index);
      });
      
      // Before the cull, see that we have everybody.
      // Sum of all integers from 0 to 99 is 50*99=4950.
      let fitnessSumBefore = _.reduce(pit.population, function(sum, organism) {
        return sum + organism.getFitnessScore();
      }, 0);
      expect(fitnessSumBefore).toBe(4950);
      expect(pit.population.length).toBe(100);
      
      pit.cullLeastFitIndividuals([], .2);
      
      // After the cull, make sure we lost the bottom 20%.
      // Sum of all integers from 20 to 99 is 40*119=4760.
      let fitnessSumAfter = _.reduce(pit.population, function(sum, organism) {
        return sum + organism.getFitnessScore();
      }, 0);
      expect(fitnessSumAfter).toBe(4760);
      expect(pit.population.length).toBe(80);
    });
  });
});

