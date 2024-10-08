import express from 'express'
import passport from 'passport'
import { Strategy as FacebookStrategy } from 'passport-facebook'
import jwt from 'jsonwebtoken'
import User from '../models/Tourists/User.js'

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
  async (req, res) => {
    // Generate jwt token for successful login
    const token = jwt.sign(
      { id: req.user.id, name: req.user.displayName },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )

    // Retrieve Facebook user ID
    const fbId = req.user.id

    try {
      // get user from the database
      const socialUser = await User.findOne({ social_id: fbId })

      if (socialUser == null) {
        // If user is not found in the system
        return res
          .status(404)
          .json({
            user: 'User Facebook account is not registered in the system',
          })
      }

      // If user is found redirect to frontend with token as query parameter
      const frontendUrl = `http://localhost:3000?token=${token}`
      return res.redirect(frontendUrl)
    } catch (error) {
      // Handle any database errors
      return res.status(500).json({ error: 'Internal server error' })
    }
  }
)

export default router
