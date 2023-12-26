import express from 'express'
import { Server } from 'socket.io'
import { io as clientIO } from 'socket.io-client'
import http from 'http'
import { corsMiddleware } from './middlewares/cors.js'
import { serverIO } from './middlewares/serverIO.js'
import { readJSON } from './utils/utils.js'
const { routes } = readJSON('../routes.json')
const positionUpdates = {}

const PORT = process.env.PORT ?? 1234
const app = express()

// Here we iniziate our internalServer
const httpServer = http.createServer(app)
const websocketServer = new Server(httpServer, serverIO)

// Para crear nuestro cliente WS para estar en espera del modelo
const headers = { Origin: process.env.HEADER }
const externalWebsocketClient = clientIO(process.env.SERVER_URL, { extraHeaders: headers })

app.disable('x-powered-by')
app.use(corsMiddleware())
app.use(express.json())

// Manejo de eventos de posición y fecha para cada ruta
Object.keys(routes).forEach((routeId) => {
  externalWebsocketClient.on(`${routeId}/position`, (data) => {
    positionUpdates[routeId] = data
  })
})

websocketServer.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`)

  socket.on('sendingRoutes', (routesId) => {
    if (routesId[0] === 10) return

    websocketServer.to(socket.id).emit('gettingInfo', routesId.map(routeId => {
      return {
        routeid: routeId,
        outwardStops: routes[routeId][0],
        returnStops: routes[routeId][1],
        outwardPath: routes[routeId][2],
        returnPath: routes[routeId][3],
        color: routes[routeId][4]
      }
    }))

    websocketServer.to(socket.id).emit('gettingPositions', positionUpdates)
  })

  Object.keys(routes).forEach((routeId) => {
    externalWebsocketClient.on(`${routeId}/position`, (data) => {
      websocketServer.to(socket.id).emit('updatingPositions', { routeid: routeId, position: data })
    })
  })

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`)
  })
})
app.use((req, res) => {
  res.status(404).send('<h1>Page not found</h1>')
})
httpServer.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`)
})
