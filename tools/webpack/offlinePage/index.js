// We create this wrapper because the HtmlWebpackPlugin doesn't pass the given
// template through the babel-loader first.  Therefore we use babel-register and
// in this way we can use the same JS syntax in our generateTemplate script
// as we use everywhere else.  This also allows the script to safely import and
// use any of our other existing scripts.
require('babel-register');
module.exports = require('./generate').default;
