/* global describe */
/* global expect */

/* global Attribute */
/* global Organism */


describe("Organism", function() {

  var seedAttributesAllRecessive1 = [];
  var seedAttributesAllRecessive2 = [];
  var seedAttributesAllDominant1 = [];
  var seedAttributesAllDominant2 = [];
  var phenotypeWeights = [];

  var numAttributes = 10;
  
  var templateManager = null; // We're going to refactor this so it doesn't need a template manager here.
  
  // Attribute arrays only need to be created once because we don't modify them.
  for (var iAttribute = 0; iAttribute < numAttributes; iAttribute++) {
    seedAttributesAllRecessive1.push(new Attribute(false, iAttribute));
    seedAttributesAllRecessive2.push(new Attribute(false, iAttribute));
    seedAttributesAllDominant1.push(new Attribute(true, iAttribute));
    seedAttributesAllDominant2.push(new Attribute(true, iAttribute));
    phenotypeWeights.push(1);
  }

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

