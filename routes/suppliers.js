var express = require('express');
var router = express.Router();

var db = require('../models/db');
var mysql = require('mysql');
var _ = require('underscore');
var validators = require('../models/validators');

var parameters = require('../params');

var jwt = require('jsonwebtoken');

router.use('/', function (req, res, next) {
    jwt.verify(req.query.token, parameters.code, function (err, decoded) {
        if (err) {
            return res.status(401).json({
                status: 'KO',
                error: err
            })
        } else {
            next();
        }
    })
})

router.get('/', function (req, res, next) {

    const sql = 'SELECT * FROM suppliers';

    db.connection.getConnection(function (errCon, con) {
        if (errCon) {
            console.log(errCon);
            return res.status(500).json({
                status: 'KO',
                reason: 'La connexion a la base de données a échouée.',
                error: errCon
            })
        } else {
            db.connection.query(sql, function (errData, results, fields) {
                if (errData) {
                    con.release();
                    console.log(errData);
                    return res.status(500).json({
                        status: 'KO',
                        reason: 'Erreur lors de la récupération des données',
                        error: errData

                    })
                } else {
                    con.release();
                    return res.status(200).json(results)
                }
            })
        }
    });
});

router.post('/search', function (req, res, next) {

    let sql = 'SELECT * FROM suppliers' // where lifnr = + mysql.escape(req.params.id);
    let i = 0;

    if (req.body.lifnr) {
        if (i == 0) {
            sql = sql + " WHERE lifnr = " + req.body.lifnr / 1;
            i++;
        } else {
            sql = sql + " AND lifnr = " + req.body.lifnr / 1;
            i++;
        }
    }

    if (req.body.name) {
        if (i == 0) {
            sql = sql + " WHERE name LIKE '%" + req.body.name + "%'";
            i++;
        } else {
            sql = sql + " AND name LIKE '%" + req.body.name + "%'";
            i++;
        }
    }

    if (req.body.gln) {
        if (i == 0) {
            sql = sql + " WHERE gln = " + mysql.escape(req.body.gln);
            i++;
        } else {
            sql = sql + " AND gln = " + mysql.escape(req.body.gln);
            i++;
        }
    }

    if (req.body.tva) {
        if (i == 0) {
            sql = sql + " WHERE tva = " + mysql.escape(req.body.tva);
            i++;
        } else {
            sql = sql + " AND tva = " + mysql.escape(req.body.tva);
            i++;
        }
    }

    if (req.body.lang) {
        if (i == 0) {
            sql = sql + " WHERE lang = " + mysql.escape(req.body.lang);
            i++;
        } else {
            sql = sql + " AND lang = " + mysql.escape(req.body.lang);
            i++;
        }
    }

    db.connection.getConnection(function (errCon, con) {
        if (errCon) {
            console.log(errCon);
            return res.status(500).json({
                status: 'KO',
                reason: 'La connexion a la base de données a échouée.',
                error: errCon
            })
        } else {
            db.connection.query(sql, function (errData, results, fields) {
                if (errData) {
                    con.release();
                    console.log(errData);
                    return res.status(500).json({
                        status: 'KO',
                        reason: 'Erreur lors de la récupération des données du client',
                        error: errData

                    })
                } else {
                    con.release();
                    if (results.length == 0) {
                        return res.status(200).json([{}]) // Return an empty array due to no results     

                    } else {
                        return res.status(200).json(results);
                    }

                }
            })
        }
    });
})

module.exports = router;