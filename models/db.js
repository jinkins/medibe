var mysql      = require('mysql');

var parameters = require('../params');

var connection = mysql.createPool(parameters.dbParams);

module.exports = {
    connection: connection
}
