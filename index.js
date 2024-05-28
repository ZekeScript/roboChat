import express from 'express'
import handlebars from 'express-handlebars'
import { __dirname } from './src/utils.js'
import { errorHandler } from './src/middlewares/errorHandler.js'
import { Server } from 'socket.io'
import viewsRouter from './src/routes/viewsRouter.js'

const app = express()

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
})
