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

    const sql = 'SELECT * FROM connections';

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
                        reason: 'Erreur lors de la récupération des données des clients',
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

router.get('/find', function (req, res, next) {

    var sql = "SELECT connections.id as idCon, connections.gln as gln, connections.message, connections.copy, connections.modate, connections.actif, connections.credat, tp.tpName as tpName, tp.id as idTP, tp.as2id, tp.as2url, tp.tpType, x400.c, x400.admd, x400.prmd, x400.s, x400.g, x400.o, suppliers.lifnr, suppliers.name as supName, suppliers.tva, suppliers.lang FROM connections INNER JOIN tp on tp.tpName = connections.tp LEFT JOIN suppliers on suppliers.gln = connections.gln LEFT JOIN x400 on x400.gln = connections.gln";

    var queryCompt = 0;
    let val = [];
    for (key in req.query) {
        if (key !== 'token') {
            val.push(req.query[key]);
            if (queryCompt == 0) {
                if (key == "suppliers.name") {
                    sql += " WHERE " + key + " LIKE CONCAT('%',?,'%') ";
                } else {
                    sql += " WHERE " + key + " = ? ";
                }
            } else {
                if (key == "name") {
                    sql += " AND " + key + " LIKE CONCAT('%',?,'%')";
                } else {
                    sql += " AND " + key + " = ?";
                }
            }
            queryCompt++;
        }
    }
    console.log(sql);

    db.connection.getConnection(function (errCon, con) {
        if (errCon) {
            console.log(errCon);
            return res.status(500).json({
                status: 'KO',
                reason: 'La connexion a la base de données a échouée.',
                error: errCon
            })
        } else {
            db.connection.query(sql, val, function (errData, results, fields) {
                if (errData) {
                    con.release();
                    console.log(errData);
                    return res.status(500).json({
                        status: 'KO',
                        reason: 'Erreur lors de la récupération des données des clients',
                        error: errData

                    })
                } else {
                    con.release();
                    var rs = {};
                    var t = [];
                    results.forEach(e => {

                        if (!rs[e['idCon']]) {

                            rs[e['idCon']] = {
                                id: e['idCon'],
                                gln: e['gln'],
                                message: e['message'],
                                actif: e['actif'],
                                modate: e['modate'],
                                credat: e['credat'],
                                tp: {
                                    id: e['idTP'],
                                    type: e['tpType'],
                                    as2url: e['as2url'],
                                    as2id: e['as2url'],
                                    name: e['tpName'],
                                },
                                x400: {
                                    admd: e['admd'],
                                    prmd: e['prmd'],
                                    c: e['c'],
                                    s: e['s'],
                                    o: e['o'],
                                },
                                suppliers: []
                            }
                        }
                        if (e['supName']) {
                            rs[e['idCon']].suppliers.push({
                                lifnr: e['lifnr'],
                                gln: e['gln'],
                                tva: e['tva'],
                                lang: e['lang'],
                                name: e['supName']
                            });
                        }


                        /*
                        let r = {
                            id: e['idCon'],
                            gln: e['gln'],
                            message: e['message'],
                            tp: {
                                id: e['idTP'],
                                type: e['tpType'],
                                as2url: e['as2url'],
                                as2id: e['as2url'],
                                name: e['tpName']
                            },
                            x400: {
                                admd: e['admd'],
                                prmd: e['prmd'],
                                c: e['c'],
                                s: e['s'],
                                g: e['g'],
                                o: e['o']
                            },
                            modate: e['modate'],
                            credat: e['credat'],
                            actif: e['actif'],
                            copy: e['copy'],
                            suppliers: {
                                lifnr: e['lifnr'],
                                name: e['supName'],
                                tva: e['tva'],
                                lang: e['lang'],
                                gln: e['gln']
                            }
                        };*/
                        
                        
                    });

                    for (index in rs) {
                        console.log(rs[index]);
                        t.push(rs[index]);
                    }

                    return res.status(200).json(t)
                }
            })
        }
    });
});

router.post('/search', function (req, res, next) {

    let sql = 'SELECT * FROM connections' // where lifnr = + mysql.escape(req.params.id);
    let i = 0;

    if (req.body.tp) {
        if (i == 0) {
            sql = sql + " WHERE tp LIKE '%" + req.body.tp + "%'";
            i++;
        } else {
            sql = sql + " AND tp LIKE '%" + req.body.tp + "%'";
            i++;
        }
    }

    if (req.body.message) {
        if (i == 0) {
            sql = sql + " WHERE message LIKE '%" + req.body.message + "%'";
            i++;
        } else {
            sql = sql + " AND message LIKE '%" + req.body.message + "%'";
            i++;
        }
    }

    if (req.body.copy) {
        if (i == 0) {
            sql = sql + " WHERE copy LIKE '%" + req.body.copy + "%'";
            i++;
        } else {
            sql = sql + " AND copy LIKE '%" + req.body.copy + "%'";
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
    console.log(sql);


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