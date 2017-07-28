
// Creates normal distribution between -1 and 1. 
// From: https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
var randn_bm = function() {
  var u = 0;
  var v = 0;

  while (u === 0) {
    u = Math.random(); //Converting [0,1) to (0,1)
  }

  while (v === 0) {
    v = Math.random();
  }

  return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
};
