export const authenticateSocket = (socket, next) => {
  const token = socket.handshake.query.token
  if (token === process.env.API_KEY) {
    next()
  } else {
    next(new Error('Failed authentication'))
  }
}
