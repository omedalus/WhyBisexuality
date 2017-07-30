/* global describe */
/* global expect */

/* global Organism */


describe("Organism", function() {

  beforeEach(function() {
    // Per-test setup/reset, if needed.
  });

  afterEach(function() {
    // Per-test release resources, if needed.
  });
  
  describe("haploid", function() {
    it("should only have one genome.", function() {
      var organism = new Organism(true, templateManager);
      organism.setAttributes(seedAttributesAllRecessive1, seedAttributesAllDominant1, phenotypeWeights);
      
      expect(organism.attributes1.length).toEqual(numAttributes);
      expect(organism.attributes2.length).toEqual(0);
    });
  });
  
  describe("diploid", function() {
    it("should have two genomes.", function() {
      var organism = new Organism(false, templateManager);
      organism.setAttributes(seedAttributesAllRecessive1, seedAttributesAllDominant1, phenotypeWeights);
      
      expect(organism.attributes1.length).toEqual(numAttributes);
      expect(organism.attributes2.length).toEqual(numAttributes);
    });
    
    it("should exhibit dominant phenotype when heterozygous.", function() {
      var organism = new Organism(false, templateManager);
      organism.setAttributes(seedAttributesAllRecessive1, seedAttributesAllDominant1, phenotypeWeights);
      
      var phenotypes = organism.getPhenotypes();
      for (var iPheno = 0; iPheno < numAttributes; iPheno++) {
        expect(phenotypes[iPheno].getBoolean()).toBeTruthy();
      }
    });

    it("should exhibit dominant phenotype when homozygous dominant.", function() {
      var organism = new Organism(false, templateManager);
      organism.setAttributes(seedAttributesAllDominant1, seedAttributesAllDominant2, phenotypeWeights);
      
      var phenotypes = organism.getPhenotypes();
      expect(phenotypes[0].getBoolean()).toBeTruthy();
    });
    
    it("should exhibit recessive phenotype when homozygous recessive.", function() {
      var organism = new Organism(false, templateManager);
      organism.setAttributes(seedAttributesAllRecessive1, seedAttributesAllRecessive2, phenotypeWeights);
      
      var phenotypes = organism.getPhenotypes();
      expect(phenotypes[0].getBoolean()).toBeFalsy();
    });
  });
  
});

