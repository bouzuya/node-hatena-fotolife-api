var Fotolife;

Fotolife = require('./fotolife');

module.exports = function(options) {
  return new Fotolife(options);
};

module.exports.Fotolife = Fotolife;
