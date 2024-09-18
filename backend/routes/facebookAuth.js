import express from 'express'
import passport from 'passport'
import { Strategy as FacebookStrategy } from 'passport-facebook'
import jwt from 'jsonwebtoken'

const router = express.Router()

// Configure Passport Facebook Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ['id', 'displayName', 'email'],
    },
    (accessToken, refreshToken, profile, done) => {
      // Handle storing the user in your database or processing
      return done(null, profile)
    }
  )
)

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user)
})

// Deserialize user
passport.deserializeUser((obj, done) => {
  done(null, obj)
})

// Facebook login route
router.get('/auth/facebook', passport.authenticate('facebook'))

// Facebook callback route
router.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  (req, res) => {
    // On successful login, generate JWT token
    const token = jwt.sign(
      { id: req.user.id, name: req.user.displayName },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )

    // Respond with the JWT token
    res.json({ result: [token] })
  }
)

export default router
