export const serverIO = {
  cors: {
    origin: (origin, callback) => {
      if (!origin || origin.startsWith(process.env.ORIGIN) || origin.startsWith(process.env.DEV)) {
        callback(null, true)
      } else {
        callback(new Error('Origin not permitted'))
      }
    },
    methods: ['GET', 'POST']
  }
}
