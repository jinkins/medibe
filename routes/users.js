var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var db = require('../models/db');
var mysql = require('mysql');
var _ = require('underscore');
var validators = require('../models/validators');

router.get('/', function(req, res, next){
    return res.status(200).json({
        status: 'OK',
        result: 'Hello strange thing'
    })
})

router.post('/register', function (req, res, next) {

    let username = req.body.username;
    let email = req.body.email;
    let displayName = req.body.displayName;
    let password = bcrypt.hashSync(req.body.password, 10);

    values = [
        username,
        email,
        password,        
        displayName,
    ];

    sql = 'INSERT INTO users(username, email, password, displayName) VALUES(?,?,?,?)';

    db.connection.getConnection(function (errCon, con) {
        if (errCon) {
            console.error(errCon);
            return res.status(500).json({
                status: 'KO',
                reason: 'La connexion a la base de données a échouée.',
                error: errCon
            })
        } else {
            con.query(sql, values, function (errData, results, fields) {
                if (errData) {
                    con.release();
                    console.error(errData);
                    return res.status(500).json({
                        status: 'KO',
                        reason: 'No. Just No.',
                        error: errData
                    })
                } else {
                    con.release();
                    return res.status(201).json({
                        status: 'OK',
                        result: results
                    })
                }
            })
        }
    });
    
})

router.post('/login', (req, res, next) => {
    
    let sql = 'SELECT * FROM users WHERE username = ?';

    let values = [req.body.username];

    db.connection.getConnection(function (errCon, con) {
        if (errCon) {
            console.error(errCon);
            return res.status(500).json({
                status: 'KO',
                reason: 'La connexion a la base de données a échouée.',
                error: errCon
            })
        } else {
            con.query(sql, values, function (errData, results, fields) {
                if (errData) {
                    con.release();
                    console.error(errData);
                    return res.status(500).json({
                        status: 'KO',
                        reason: 'Erreur lors de la récupération des données des clients',
                        error: errData
                    })
                } else {
                    con.release();
                    if(results.length == 0) {
                        return res.status(401).json({
                            message: 'KO',
                            error: 'Email ou mot de passe incorrect'
                        })
                    }
                    else if (!bcrypt.compareSync(req.body.password, results[0].password)) {
                        // If password is not valide
                        return res.status(401).json({
                            message: 'KO',
                            error: 'Email ou mot de passe incorrect'
                        })
                    } else {
                        var token = jwt.sign({user: results[0]}, 'medi4C@rr3f00r', {expiresIn: 7200});
                        console.log('User : ' + results[0].username + ' is now connected.');
                        let r = results[0];
                        r.password = null; 
                        r.token = token; 
                        res.status(200).json(r);
                    }
                }
            })
        }
    });
});

module.exports = router;