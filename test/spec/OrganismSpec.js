/* global describe */
/* global expect */

/* global Organism */
/* global Gene */


describe("Organism", function() {
  // Create a gene pool that we'll be drawing genes from.
  let genepool = {
    'OCA2': {
      'brown eyes': new Gene('OCA2', 'brown eyes', 1),
      'blue eyes': new Gene('OCA2', 'blue eyes', 2)
    },
    'GLI3': {
      'six fingers': new Gene('GLI3', 'six fingers', 1) ,   
      'five fingers': new Gene('GLI3', 'five fingers', 2)    
    },
    'MCR2': {
      'black coat': new Gene('MCR1', 'black coat', 1),
      'orange coat': new Gene('MCR1', 'orange coat', 1),
      'white coat': new Gene('MCR1', 'white coat', 2)
    }
  };
  
  it('should be able to inherit at least one set of genes', function() {
    
  });
});

