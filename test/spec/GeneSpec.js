/* global describe */
/* global expect */
/* global _ */

/* global Gene */


describe('Gene', function() {

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

