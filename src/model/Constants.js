/**
 * Constants.js
 * Stores simulation-wide hard-coded values.
 * These are hard-coded for now, but we may migrate some of them into
 * parameters for the BreedingPit as we experiment.
 */

var Constants = {};

//maximum fitness is equal to the number of attributes if a cap is set
Constants.ATTRIBUTE_COUNT = 100;
Constants.POPULATION_COUNT = 100;
Constants.MUTATION_LIKELIHOOD = .25;

Constants.PHENOTYPE_WEIGHT_AVG = 0;
Constants.PHENOTYPE_WEIGHT_STD = 10;
Constants.DOMINANCE_PREDISPOSITION_ATTRIBUTES = 0.5;
Constants.DOMINANCE_PREDISPOSITION_TEMPLATE = 0.50;

Constants.TEMPLATE_WEIGHT_AVG = 0;
Constants.TEMPLATE_WEIGHT_STD = 25;

Constants.TEMPLATE_AVERAGE_SIZE = 4;
Constants.TEMPLATE_SIZE_DISTRIBUTION = 1.5;

Constants.GENERATION_CYCLES = 50;
Constants.SIMULATION_COUNT = 1;

Constants.TEMPLATE_COUNT = 100;

Constants.REPRODUCTION_CUTOFF = .5;

