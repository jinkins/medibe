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

    const sql = 'SELECT * FROM x400';

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

    let sql = 'SELECT * FROM x400' // where lifnr = + mysql.escape(req.params.id);
    let i = 0;

    if (req.body.gln) {
        if (i == 0) {
            sql = sql + " WHERE gln = " + mysql.escape(req.body.gln);
            i++;
        } else {
            sql = sql + " AND gln = " + mysql.escape(req.body.gln);
            i++;
        }
    }

    if (req.body.c) {
        if (i == 0) {
            sql = sql + " WHERE c = " + mysql.escape(req.body.c);
            i++;
        } else {
            sql = sql + " AND c = " + mysql.escape(req.body.c);
            i++;
        }
    }

    if (req.body.admd) {
        if (i == 0) {
            sql = sql + " WHERE admd = " + mysql.escape(req.body.admd);
            i++;
        } else {
            sql = sql + " AND admd = " + mysql.escape(req.body.admd);
            i++;
        }
    }

    if (req.body.o) {
        if (i == 0) {
            sql = sql + " WHERE o = " + mysql.escape(req.body.o);
            i++;
        } else {
            sql = sql + " AND o = " + mysql.escape(req.body.o);
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

    if (req.body.s) {
        if (i == 0) {
            sql = sql + " WHERE s = " + mysql.escape(req.body.s);
            i++;
        } else {
            sql = sql + " AND s = " + mysql.escape(req.body.s);
            i++;
        }
    }

    if (req.body.g) {
        if (i == 0) {
            sql = sql + " WHERE g = " + mysql.escape(req.body.g);
            i++;
        } else {
            sql = sql + " AND g = " + mysql.escape(req.body.g);
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