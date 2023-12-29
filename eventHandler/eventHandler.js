import { sendingRoutes } from '../events/sendingRoutes.js'
import { updatingRoutes } from '../events/updatingRoutes.js'
import { readJSON } from '../utils/utils.js'
const { routesJSON } = readJSON('../data/routes.json')
const positionUpdates = {}

export default function eventHandler (externalWebsocketClient, websocketServer) {
  // Position event handler from model
  Object.keys(routesJSON).forEach((routeId) => {
    externalWebsocketClient.on(`${routeId}/position`, (data) => {
      positionUpdates[routeId] = data
      websocketServer.emit('updatingPositions', updatingRoutes(routeId, data))
    })
  })

  websocketServer.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`)

    socket.on('sendingRoutes', (routesId) => sendingRoutes(socket, routesId, routesJSON, positionUpdates))

    socket.on('disconnect', () => { console.log(`Client disconnected: ${socket.id}`) })
  })
}
