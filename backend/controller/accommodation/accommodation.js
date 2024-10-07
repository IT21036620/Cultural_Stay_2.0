import Accommodation from '../../models/Accommodation/Accommodation.js'
import asyncWrapper from '../../middleware/Host/async.js'
import cloudinary from '../../config/cloudinary.js'
import { createCustomError } from '../../errors/Host/custom-error.js'
import { body, validationResult } from 'express-validator'
import fs from 'fs'

// Register a new accommodation
// export const createaccommodation = asyncWrapper(async (req, res) => {
//   const { name, description, address, area } = req.body
//   const files = req.files
//   let imagesArray = []

//   for (let i = 0; i < files.length; i++) {
//     const result = await cloudinary.uploader.upload(files[i].path, {
//       folder: 'afAccommodation',
//     })
//     imagesArray.push(result.secure_url)
//   }

//   try {
//     const newAccommodation = new Accommodation({
//       name,
//       description,
//       address,
//       images: imagesArray,
//       area,
//     })
//     await newAccommodation.save()
//     res.json(newAccommodation)
//   } catch (error) {
//     console.error(error)
//     res.status(500).send('Server error')
//   }

//   // const accommodation = await Accommodation.create(req.body)

//   // res.status(201).json({ accommodation })
// })

// modified code to fix the vulnerability

export const createaccommodation = [
  // Validate fields
  body('name').notEmpty().withMessage('Name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('address').notEmpty().withMessage('Address is required'),

  asyncWrapper(async (req, res, next) => {
    const files = req.files

    // Validate that files exist
    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No images uploaded' })
    }

    const allowedExtensions = ['image/jpeg', 'image/png']
    const maxFileSize = 5 * 1024 * 1024 // 5MB

    // Validate files
    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Check file type
      if (!allowedExtensions.includes(file.mimetype)) {
        return res.status(400).json({
          message: 'Invalid file type. Only JPEG and PNG are allowed.',
        })
      }

      // Check file size
      if (file.size > maxFileSize) {
        return res.status(400).json({
          message: `File size too large. Maximum allowed size is 5MB.`,
        })
      }
    }

    next()
  }),

  // Upload images to Cloudinary and save accommodation
  asyncWrapper(async (req, res) => {
    const { name, description, address, area } = req.body
    const files = req.files
    let imagesArray = []

    // Upload files to Cloudinary
    for (let i = 0; i < files.length; i++) {
      const result = await cloudinary.uploader.upload(files[i].path, {
        folder: 'afAccommodation',
      })
      imagesArray.push(result.secure_url)

      // Delete the temporary file from the server after upload
      fs.unlinkSync(files[i].path)
    }

    try {
      const newAccommodation = new Accommodation({
        name,
        description,
        address,
        images: imagesArray,
        area,
      })
      await newAccommodation.save()
      res.status(201).json(newAccommodation)
    } catch (error) {
      console.error(error)
      res.status(500).send('Server error')
    }
  }),
]

//using errors custom-error.js for createCustomError
//get a accommodation by id
export const getAccommodation = asyncWrapper(async (req, res, next) => {
  const { id: accommodationID } = req.params
  const accommodation = await Accommodation.findOne({ _id: accommodationID })

  if (!accommodation) {
    return next(
      createCustomError(
        `No Accommodation with this id: ${accommodationID}`,
        404
      )
    )
  }
  res.status(200).json({ accommodation })
})

//using errors custom-error.js for createCustomError
//delete a accommodation by id
export const deleteaccommodation = asyncWrapper(async (req, res, next) => {
  const { id: accommodationID } = req.params
  const accommodation = await Accommodation.findOneAndDelete({
    _id: accommodationID,
  })
  if (!accommodation) {
    return next(
      createCustomError(
        `No accommodation with this id: ${accommodationID}`,
        404
      )
    )
  }
  res.status(200).json({ accommodation })
})

//using errors custom-error.js for createCustomError

export const getAccommodationByHost = asyncWrapper(async (req, res, next) => {
  const { id: hostID } = req.params
  const accommodation = await Accommodation.find({ createdBy: hostID }).exec()
  if (!accommodation) {
    return next(
      createCustomError(`No accommodation with category: ${hostID}`, 404)
    )
  }
  res.status(200).json({ accommodation })
})

// This is used to retriew all Accommodation Details-----------------------------------------------------
export const getAllAccommodation = asyncWrapper(async (req, res) => {
  const accommodation = await Accommodation.find({})
  // const accommodation = await Accommodation.find({}).populate('host')
  res.status(200).json({ accommodation })
})

//using errors custom-error.js for createCustomError
//update a Accommodation by id
export const updateAccommodation = asyncWrapper(async (req, res, next) => {
  const { id: accommodationID } = req.params
  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'afAccommodation',
    })
    req.body.image = result.secure_url
  }

  const accommodation = await Accommodation.findOneAndUpdate(
    { _id: accommodationID },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  )
  if (!accommodation) {
    return next(
      createCustomError(`No accommodation with id: ${accommodationID}`, 404)
    )
  }
  res.status(200).json({ accommodation })
})

// change the availability of the accommodation

export const changeAvailability = async (req, res, next) => {
  try {
    const { id: hostID } = req.params
    const { availability } = req.body

    const updatedaccommodation = await Accommodation.findOneAndUpdate(
      { createdBy: hostID },
      { availability },
      { new: true, runValidators: true }
    )

    if (!updatedaccommodation) {
      return res.status(404).json({ message: 'Accommodation not found' })
    }

    res.status(200).json(updatedaccommodation)
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ message: 'Error updating accommodation availability' })
  }
}
