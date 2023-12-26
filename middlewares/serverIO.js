export const serverIO = {
  cors: {
    origin: (origin, callback) => {
      if (!origin || origin.startsWith(process.env.ORIGIN)) {
        callback(null, true)
      } else {
        callback(new Error('Origin not permitted'))
      }
    },
    methods: ['GET', 'POST']
  }
}
