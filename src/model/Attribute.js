/**
 * A class that represents a single Mendelian attribute.
 * @param {bool} boolean Paul will have to explain what this is. Dominance, I presume? Then it should be called dominant or isDominant.
 * @param {number} index Which attribute in the attribute set this attribute is.
 */
var Attribute = function(boolean, index){
  this.boolean = !!boolean;
  this.index = index;
};

Attribute.prototype.getIndex = function() {
  return this.index;
};

Attribute.prototype.mutate = function() {
  this.boolean = !this.boolean;
};

Attribute.prototype.getBoolean = function() {
  return this.boolean;
};

