/**
 * Created by Paul Bogdan on 7/25/2017.
 */

/* global PhenotypeRequirement */

var Template = function(weight, size, dominancePredisposition, phenotypeCount) {
  this.phenotypes = new Array();
  this.weight = weight;

  if (size < 2) {
    size = 2;
  }

  for (var i = 0; i < size; i++) {
    const newPhenotype = new PhenotypeRequirement(dominancePredisposition, phenotypeCount);
    this.phenotypes.push(newPhenotype);
  }


  this.isTrue = function(organism) {
    for (let each of this.phenotypes) {
      // why storing the index is key for complexity reasons
      if (organism.getPhenotypes()[each.getIndex()].getBoolean() != each.getDominance()){
        return false;
       }
    }
    return true;
  };

  this.getWeight = function () {
    return this.weight;
  };
};
