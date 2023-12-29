export const sendingRoutes = (socket, routesId, routesJSON, positionUpdates) => {
  if (routesId[0] === 10) return

  socket.emit('gettingInfo', routesId.map(routeId => {
    return {
      routeid: routeId,
      outwardStops: routesJSON[routeId][0],
      returnStops: routesJSON[routeId][1],
      outwardPath: routesJSON[routeId][2],
      returnPath: routesJSON[routeId][3],
      color: routesJSON[routeId][4]
    }
  }))

  socket.emit('gettingPositions', positionUpdates)
}
