import handlebars from 'express-handlebars'
import { __dirname } from './utils.js'
import { errorHandler } from './middlewares/errorHandler.js'
import { Server } from 'socket.io'
import viewsRouter from './routes/viewsRouter.js'
import MessageManager from './managers/messageManager.js'
const express = require('express')

const app = express()
const messageManager = new MessageManager(`${__dirname}/data/messages.json`)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))

app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars')
app.set('views', __dirname + '/views')

app.use('/chat', viewsRouter)

const PORT = 8080

app.use(errorHandler)

const httpServer = app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`)
})

const socketServer = new Server(httpServer)

socketServer.on('connection', async (socket) => {
  console.log(`🟢 New connection! ${socket.id}`)
  socket.emit('messages', await messageManager.getAllMsgs())

  socket.on('disconnect', () => {
    console.log(`🔴 User ${socket.id} disconnect`)
  })

  socket.on('newUser', (user) => {
    console.log(`> ${user} ha iniciado sesion`)
    socket.broadcast.emit('newUser', user)
  })

  socket.on('chat:message', async (msg) => {
    await messageManager.createMsg(msg)
    socketServer.emit('messages', await messageManager.getAllMsgs())
  })

  socket.on('chat:typing', (data) => {
    socket.broadcast.emit('chat:typing', data)
  })
})
