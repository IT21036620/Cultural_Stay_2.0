import Food from '../../models/food/Foods.js'
import asyncWrapper from '../../middleware/food/async.js'
import cloudinary from '../../config/cloudinary.js'
import { createCustomError } from '../../errors/Food/custom-error.js'

//hotfix: validation and sanitization library
import validator from 'validator';
const { escape } = validator;

// create a new product with checking image file
export const createFood = asyncWrapper(async (req, res) => {
  // if (req.file) {
  //   const result = await cloudinary.uploader.upload(file.path, {
  //     folder: 'afFood',
  //   })
  //   req.body.image = result.secure_url
  // } else {
  //   req.body.image =
  //     'https://res.cloudinary.com/dbcmklrpv/image/upload/v1684347215/default-food_cojibz.jpg'
  // }
  // const food = await Food.create(req.body)
  // res.status(201).json({ food })

  const { name, sinhala_name, description, ingrediants, method, restaurants } =
    req.body
  const file = req.file

  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'afFood',
    })
    const image = result.secure_url

    const newFood = new Food({
      name,
      description,
      sinhala_name,
      ingrediants,
      method,
      restaurants,
      image: image, // Assign the single image URL directly
    })

    await newFood.save()
    res.json(newFood)
  } catch (error) {
    console.error(error)
    res.status(500).send('Server error')
  }
})

//using errors custom-error.js for createCustomError
//get a food item by id
export const getFood = asyncWrapper(async (req, res, next) => {
  const { id: foodID } = req.params
  const food = await Food.findOne({ _id: foodID })

  if (!food) {
    return next(createCustomError(`No food item with id: ${foodID}`, 404))
  }
  res.status(200).json({ food })
})

//using errors custom-error.js for createCustomError
//delete a food item by id
export const deleteFood = asyncWrapper(async (req, res, next) => {
  const { id: foodID } = req.params
  const food = await Food.findOneAndDelete({ _id: foodID })
  if (!food) {
    return next(createCustomError(`No product with id: ${foodID}`, 404))
  }
  res.status(200).json({ food })
})

//using errors custom-error.js for createCustomError
//update a food item by id
export const updateFood = asyncWrapper(async (req, res, next) => {
  const { id: foodID } = req.params
  const newRest = req.body.restaurants // pushing new arrays without overwritting
  const newIngr = req.body.ingrediants
  const newMet = req.body.method

  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'afFood',
    })
    req.body.image = result.secure_url
  }
  const food = await Food.findByIdAndUpdate(
    { _id: foodID },
    { $push: { restaurants: newRest, ingrediants: newIngr, method: newMet } },
    req.body,
    {
      new: true,
    }
  )
  if (!food) {
    return next(createCustomError(`No food item with id: ${foodID}`, 404))
  }
  res.status(200).json({ food })
})

// get all food items with search and sort options passed as a query in the req
export const getAllFood = async (req, res) => {
  const { name, sinhala_name, restaurants, sort, fields } = req.query
  const queryObject = {}

  //hotfix: ReDoS vulnerability by limitting lenth of user input
  //hotfix: sanitizing user inputs
  if (name && name.length <= 30) {
    const sanitizedName = escape(name.toString());
    queryObject.name = { $regex: sanitizedName, $options: 'i' };
  }

  if (sinhala_name && sinhala_name.length <= 30) {
    const sanitizedSinhalaName = escape(sinhala_name.toString());
    queryObject.sinhala_name = { $regex: sanitizedSinhalaName, $options: 'i' };
  }

  if (restaurants && restaurants.length <= 30) {
    const sanitizedRestaurants = escape(restaurants.toString());
    queryObject.restaurants = { $regex: sanitizedRestaurants, $options: 'i' };
  }

  let result = Food.find(queryObject) // (req.query)
  // sort
  if (sort) {
    const sortList = sort.split(',').join(' ')
    result = result.sort(sortList)
  } else {
    result = result.sort('createdAt')
  }

  if (fields) {
    const fieldList = fields.split(',').join(' ')
    result = result.select(fieldList)
  }

  const food = await result

  res.status(200).json({ food, nbHits: food.length }) //
}
