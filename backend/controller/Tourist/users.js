// const User = require('../../models/Tourists/User')
import User from '../../models/Tourists/User.js'
import asyncWrapper from '../../middleware/food/async.js'
import bcrypt from 'bcrypt'

import validator from 'validator'
const { escape } = validator

export const createUser = asyncWrapper(async (req, res) => {
  req.body.password = await bcrypt.hashSync(req.body.password, 10)
  const user = await User.create(req.body)
  res.status(201).json({ user })
  // res.send('create delivery')
})

export const loginUser = asyncWrapper(async (req, res) => {
  const { user, pwd } = req.body
  if (!user || !pwd)
    return res.status(400).json({ msg: 'The username and password required' })

  //hotfix: Sanitize user input and find the user in the database
  const sanitizedUser = escape(user.toString())
  const foundUser = await User.findOne({ user_email: sanitizedUser })

  if (!foundUser) return res.status(401).json({ msg: 'user not found' })

  // password comparison
  const match = await bcrypt.compare(pwd, foundUser.password)
  // const match = pwd === foundUser.password

  if (match) {
    const role = foundUser.role
    const username = foundUser.username
    const useremail = foundUser.user_email
    res.json({ username, useremail, role })
  } else {
    res.sendStatus(401)
  }
  // const user = await User.create(req.body)
  // res.status(201).json({ user })
  // res.send('create delivery')
})

// const User = require('../../models/Tourists/User')
// import User from '../../models/Tourists/User.js'
// import asyncWrapper from '../../middleware/food/async.js'
// import bcrypt from 'bcrypt'
// import { jwtDecode } from 'jwt-decode'
// import { OAuth2Client } from 'google-auth-library'
// const client = new OAuth2Client(
//   '386387920374-f4o6ce6vptqemse6s5sa64t7s59c77st.apps.googleusercontent.com'
// )

// export const loginUser = asyncWrapper(async (req, res) => {
//   const { googleToken } = req.body

//   if (googleToken) {
//     try {
//       // Verify the token with Google
//       const ticket = await client.verifyIdToken({
//         idToken: googleToken,
//         audience: 'YOUR_GOOGLE_CLIENT_ID', // Ensure this matches your client ID
//       })

//       const payload = ticket.getPayload() // Get user info from token
//       const email = payload.email

//       // Check if the user exists in your database
//       let foundUser = await User.findOne({ user_email: email })

//       if (!foundUser) {
//         // If user doesn't exist, create new user
//         const newUser = {
//           user_email: email,
//           username: payload.name, // Extract name from the payload
//           role: 'tourist', // You can set a default role for Google users
//         }
//         foundUser = await User.create(newUser)
//       }

//       const { username, user_email, role } = foundUser
//       res.json({ username, user_email, role })
//     } catch (error) {
//       return res.status(401).json({ msg: 'Google token is invalid or expired' })
//     }
//   } else {
//     return res.status(400).json({ msg: 'Google token is missing' })
//   }
// })

// export const createUser = asyncWrapper(async (req, res) => {
//   req.body.password = await bcrypt.hashSync(req.body.password, 10)
//   const user = await User.create(req.body)
//   res.status(201).json({ user })
//   // res.send('create delivery')
// })

// export const loginUser = asyncWrapper(async (req, res) => {
//   const { user, pwd, googleToken } = req.body

//   if (googleToken) {
//     try {
//       const decodedToken = jwtDecode(googleToken)
//       const email = decodedToken.email

//       let foundUser = await User.findOne({ user_email: email })

//       if (!foundUser) {
//         const newUser = {
//           user_email: email,
//           username: decodedToken.name,
//           role: 'tourist',
//         }
//         foundUser = await User.create(newUser)
//       }

//       const { username, user_email, role } = foundUser
//       res.json({ username, user_email, role })
//     } catch (err) {
//       return res.status(401).json({ msg: 'Google token invalid' })
//     }
//   } else {
//     if (!user || !pwd)
//       return res
//         .status(400)
//         .json({ msg: 'The username and password are required' })

//     const foundUser = await User.findOne({ user_email: user })
//     if (!foundUser) return res.status(401).json({ msg: 'User not found' })

//     const match = await bcrypt.compare(pwd, foundUser.password)
//     if (match) {
//       const { username, user_email, role } = foundUser
//       res.json({ username, user_email, role })
//     } else {
//       res.status(401).json({ msg: 'Invalid credentials' })
//     }
//   }
// })

// export const loginUser = asyncWrapper(async (req, res) => {
//   const { user, pwd } = req.body
//   if (!user || !pwd)
//     return res.status(400).json({ msg: 'The username and password required' })

//   const foundUser = await User.findOne({ user_email: user })
//   if (!foundUser) return res.status(401).json({ msg: 'user not found' })

//   // password comparison
//   const match = await bcrypt.compare(pwd, foundUser.password)
//   // const match = pwd === foundUser.password

//   if (match) {
//     const role = foundUser.role
//     const username = foundUser.username
//     const useremail = foundUser.user_email
//     res.json({ username, useremail, role })
//   } else {
//     res.sendStatus(401)
//   }
//   // const user = await User.create(req.body)
//   // res.status(201).json({ user })
//   // res.send('create delivery')
// })
