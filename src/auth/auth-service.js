const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const knex = require('knex')
const config = require('../config')

const AuthService = {
    getUserName(db, username){
        return db('users')
            .where({ username })
            .first()
    },
    comparePasswords(password, dbPass){
        return bcrypt.compare(password, dbPass)
    },
    generateJwt(subject, payload){
        return jwt.sign(payload, config.JWT_SECRET, {
            subject,
            algorithm: 'HS256'
        })
    },
    verifyJwt(token){
        return jwt.verify(token, config.JWT_SECRET, {
            algorithms: ['HS256']
        })
    }
}


module.exports = AuthService