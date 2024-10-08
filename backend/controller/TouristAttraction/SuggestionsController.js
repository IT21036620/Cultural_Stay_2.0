import Suggestions from '../../models/TouristAttraction/Suggestions.js'
import cloudinary from '../../config/cloudinary.js'
import validator from 'validator';
const { escape } = validator;

//hotfix: user input validation and sanitization
// get all tourist attraction Suggestions with search and sort options passed as a query in the req
export const getAllSuggestions = async (req, res) => {
  const { name, address, area, status, sort, fields } = req.query;
  const queryObject = {};

  // Sanitize and validate inputs
  if (name) {
    const sanitizedName = escape(name.toString());
    queryObject.name = { $regex: sanitizedName, $options: 'i' };
  }
  if (address) {
    const sanitizedAddress = escape(address.toString());
    queryObject.address = { $regex: sanitizedAddress, $options: 'i' };
  }
  if (area) {
    const sanitizedArea = escape(area.toString());
    queryObject.area = { $regex: sanitizedArea, $options: 'i' };
  }
  if (status) {
    const sanitizedStatus = escape(status.toString());
    queryObject.status = { $regex: sanitizedStatus, $options: 'i' };
  }

  let result = Suggestions.find(queryObject);

  // Sort validation
  if (sort) {
    const allowedSortFields = ['name', 'address', 'area', 'status', 'createdAt'];
    const sortList = sort.split(',').filter(field => allowedSortFields.includes(field)).join(' ');
    if (sortList) {
      result = result.sort(sortList);
    }
  } else {
    result = result.sort('createdAt');
  }

  // Fields validation
  if (fields) {
    const allowedFields = ['name', 'address', 'area', 'status', 'createdAt'];
    const fieldList = fields.split(',').filter(field => allowedFields.includes(field)).join(' ');
    if (fieldList) {
      result = result.select(fieldList);
    }
  }

  const suggestions = await result;

  res.status(200).json({ suggestions, nbHits: suggestions.length });
};


// Get single tourists attraction Suggestions by Id
export const getSuggestionsById = async (req, res) => {
  const id = req.params.id
  try {
    const Suggestionss = await Suggestions.findById(id).exec()
    res.json(Suggestionss)
  } catch (error) {
    console.error(error)
    res.status(500).send('Server error')
  }
}

// Create a new tourits attraction Suggestion site with uploading an image
export const createSuggestions = async (req, res) => {
  const { name, description, address, status, area } = req.body

  const files = req.files
  let imagesArray = []

  for (let i = 0; i < files.length; i++) {
    const result = await cloudinary.uploader.upload(files[i].path, {
      folder: 'afSuggestionForm',
    })
    imagesArray.push(result.secure_url)
  }
  try {
    const newSuggestions = new Suggestions({
      name,
      description,
      address,
      images: imagesArray,
      status: false,
      area,
    })
    await newSuggestions.save()
    res.json(newSuggestions)
  } catch (error) {
    console.error(error)
    res.status(500).send('Server error')
  }
}

// Update a tourist attraction Suggestions by Id
export const updateSuggestions = async (req, res) => {
  const { id } = req.params
  const { name, description, address, image, status, area } = req.body
  try {
    const Suggestions = await Suggestions.findByIdAndUpdate(
      id,
      { name, description, address, image, status, area },
      { new: true }
    ).exec()
    res.json(Suggestions)
  } catch (error) {
    console.error(error)
    res.status(500).send('Server error')
  }
}

// Delete a tourist attraction Suggestion by Id
export const deleteSuggestions = async (req, res) => {
  const { id } = req.params
  try {
    await Suggestions.findByIdAndDelete(id).exec()
    res.json({ message: 'Tourist attraction Suggestion deleted' })
  } catch (error) {
    console.error(error)
    res.status(500).send('Server error')
  }
}
