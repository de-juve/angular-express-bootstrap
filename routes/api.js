/*
 * Serve JSON to our AngularJS client
 */

exports.name = function (req, res) {
  res.json({
  	name: 'Boby'
  });
};

exports.data = function (req, res) {
    res.json([
        { name: 'Boby', sname: 'Fisher'},
        { name: 'Boby2', sname: 'Clain'},
        { name: 'Boby3', sname: 'Brown'},
        { name: 'Boby4', sname: 'Adams'}]);
};
