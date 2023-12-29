export const authenticateRequest = (req, res, next) => {
  const apiKey = req.headers['api-key']

  if (apiKey && apiKey === process.env.API_KEY) {
    next()
  } else {
    res.status(401).send('<h1>Unauthorized</h1>')
  }
}
