var express = require('express');
var router = express.Router();

var db = require('../models/db');
var mysql = require('mysql');
var _ = require('underscore');
var validators = require('../models/validators');

var parameters = require('../params');

var jwt = require('jsonwebtoken');

router.use('/', function (req, res, next) {
    jwt.verify(req.query.token, parameters.code , function (err, decoded) {
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

    const sql = 'SELECT id, name, tpType as type, as2id, as2url FROM tp';

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

    let sql = 'SELECT id, name, tpType as type, as2id, as2url FROM tp' // where lifnr = + mysql.escape(req.params.id);
    let i = 0;

    if (req.body.id) {
        if (i == 0) {
            sql = sql + " WHERE id = " + req.body.gln;
            i++;
        } else {
            sql = sql + " AND id = " + req.body.gln;
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

    if (req.body.type) {
        if (i == 0) {
            sql = sql + " WHERE type = " + mysql.escape(req.body.type);
            i++;
        } else {
            sql = sql + " AND type = " + mysql.escape(req.body.type);
            i++;
        }
    }

    if (req.body.as2id) {
        if (i == 0) {
            sql = sql + " WHERE as2id = " + mysql.escape(req.body.as2id);
            i++;
        } else {
            sql = sql + " AND as2id = " + mysql.escape(req.body.as2id);
            i++;
        }
    }

    if (req.body.prmd) {
        if (i == 0) {
            sql = sql + " WHERE prmd = " + mysql.escape(req.body.prmd);
            i++;
        } else {
            sql = sql + " AND prmd = " + mysql.escape(req.body.prmd);
            i++;
        }
    }

    if (req.body.as2url) {
        if (i == 0) {
            sql = sql + " WHERE as2url = " + mysql.escape(req.body.as2url);
            i++;
        } else {
            sql = sql + " AND as2url = " + mysql.escape(req.body.as2url);
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