const express = require('express')
const jwtAuth = require('../middleware/jwt-auth')
const MessagesService = require('./messages-service')

const bodyParser = express.json()
const messagesRouter = express.Router()


messagesRouter
    .route('/')
    .all(jwtAuth, (req, res, next) => {
        const db = req.app.get('db')
        const id = req.user.id
        MessagesService.getNewMessages(db, id)
            .then(messages => {
                if(!messages){
                    res.status(404).json({
                        error: 'messages not found'
                    })
                }
                res.messages = messages
                next()
            })
            .catch(next)
    })
    .post(bodyParser, (req, res, next) => {
        const db = req.app.get('db')
        const id = req.user.id
        const { subject, body, read, reciever_id } = req.body
        const newMessage = { subject, body, read, reciever_id }
        newMessage.sender_id = id

        MessagesService.postMessage(db, newMessage)
            .then(message => {
                res.status(201).end()
            })
            .catch(next)
    })


messagesRouter
    .route('/new')
    .all(jwtAuth, (req, res, next) => {
        const db = req.app.get('db')
        const id = req.user.id
        MessagesService.getNewMessages(db, id)
            .then(messages => {
                if(!messages){
                    res.status(404).json({
                        error: 'No new messages'
                    })
                }
                res.messages = messages
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.send(res.messages)
    })

messagesRouter
    .route('/sent')
    .all(jwtAuth, (req, res, next) => {
        const db = req.app.get('db')
        const id = req.user.id
        MessagesService.getSentMessages(db, id)
            .then(messages => {
                if(!messages){
                    res.status(404).json({
                        error: 'No sent messages'
                    })
                }
                res.messages = messages
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.send(res.messages)
    })


messagesRouter
    .route('/:id')
    .all(jwtAuth, (req, res, next) => {
        const db = req.app.get('db')
        const id = req.params.id
        MessagesService.getMessageById(db, id)
            .then(message => {
                if(!message){
                    res.status(404).json({
                        error: 'Message not found'
                    })
                }
                res.message = message
                next()
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json(res.message)
    })
    .patch(bodyParser, (req, res, next) => {
        const db = req.app.get('db')
        const id = req.params.id
        const { read } = req.body
        const updatedMessage = { read }

        for (const [key, num] of Object.entries(updatedMessage))
            if (num == 0)
                return res.status(400).json({
                    error: { message: `Body must contain updated content` }
            })
        
        MessagesService.updateMessage(db, id, updatedMessage)
            .then(message => {  
                res.status(204).end()
            })
            .catch(next)
    })
    .delete((req, res, next) => {
        const db = req.app.get('db')
        const id = req.params.id
        MessagesService.deleteMessage(db, id)
            .then(message => {
                res.status(204).end()
            })
    })


module.exports = messagesRouter