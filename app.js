// For API
import express from 'express'
import { Server } from 'socket.io'
import { io as clientIO } from 'socket.io-client'
import http from 'http'

// Middlewares
import { corsMiddleware } from './middlewares/cors.js'
import { serverIO } from './middlewares/serverIO.js'
import { authenticateSocket } from './middlewares/authenticateSocket.js'
import { authenticateRequest } from './middlewares/authenticateRequest.js'

// Event Handlers
import eventHandler from './eventHandler/eventHandler.js'

const PORT = process.env.PORT ?? 1234
const app = express()

// Here we iniziate our internalServer
const httpServer = http.createServer(app)
const websocketServer = new Server(httpServer, serverIO)

// Here we connect to our model
const headers = { Origin: process.env.HEADER }
const externalWebsocketClient = clientIO(process.env.SERVER_URL, { extraHeaders: headers })

app.disable('x-powered-by')
app.use(corsMiddleware())
app.use(express.json())

app.use(authenticateRequest)
websocketServer.use(authenticateSocket)

eventHandler(externalWebsocketClient, websocketServer)

app.use((req, res) => {
  res.status(404).send('<h1>Page not found</h1>')
})

httpServer.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`)
})
