import http from 'http'
import dotenv from 'dotenv'
import express from 'express'

dotenv.config()

const app = express()

app.use(require('./app').default)

const PORT = process.env.PORT || 8080
const server = http.createServer(app)

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
