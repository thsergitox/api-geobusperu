import cors from 'cors'

export const corsMiddleware = () => cors({
  origin: (origin, callback) => {
    if (!origin || origin.startsWith(process.env.ORIGIN) || origin.startsWith(process.env.DEV)) {
      return callback(null, true)
    }

    if (!origin) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  }
})
