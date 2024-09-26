import multer from 'multer'

// Multer configuration
const storage = multer.diskStorage({})

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // Maximum file size is 2MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Please upload an image'))
    }

    cb(undefined, true)
  },
})

export default upload

//hotfix: unrescricted file upload destination
// import multer from 'multer';
// import path from 'path';

// // Set the destination to a specific directory
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     // Specify a safe directory where files will be saved
//     cb(null, path.join(__dirname, '../uploads/'));
//   },
//   filename: function (req, file, cb) {
//     // Ensure that the filename is unique to avoid overwriting
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
//   }
// });

// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 2 * 1024 * 1024, // 2MB max file size
//   },
//   fileFilter: function (req, file, cb) {
//     if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
//       return cb(new Error('Please upload an image'));
//     }
//     cb(null, true);
//   }
// });

// export default upload;
