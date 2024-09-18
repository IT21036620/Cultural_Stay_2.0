import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import passport from 'passport'
import session from 'express-session'

import connectDB from './config/dbconnect.js'
import Router from './routes/index.js'
import facebookAuthRouter from './routes/facebookAuth.js'

dotenv.config()

const app = express()
app.use(express.json({ limit: '1mb' }))

app.use(cors())

// Session Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
)

// Initialize passport
app.use(passport.initialize())
app.use(passport.session())

connectDB()

app.use('/api', Router)
app.use('/api', facebookAuthRouter) // Add the Facebook auth route

const port = process.env.PORT || 4000

app.listen(port, () => {
  console.log(`Server runing on port ${port}`)
})
