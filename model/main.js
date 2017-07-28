/**
 * Created by Paul Bogdan on 7/25/2017.
 */
 
/* global BreedingPit */
/* global Constants */

var breedingPit = new BreedingPit();

breedingPit.initialize();

for (let i = 0; i < Constants.SIMULATION_COUNT; i++) {
  for (let j = 0; j < Constants.GENERATION_CYCLES; j++) {
    breedingPit.step(j);
  }
}

breedingPit.printAverageFitnessReport();


