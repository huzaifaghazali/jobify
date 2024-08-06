import multer from 'multer';
import DataParser from 'datauri/parser.js';
import path from 'path';

/*
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // set the directory where uploaded files will be stored
    cb(null, 'public/uploads');
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname;
    // set the name of the uploaded file
    cb(null, fileName);
  },
});

const upload = multer({ storage });
*/

/**
 * The multer package is used to handle multipart/form-data, which is primarily used for uploading files.
 * In this case, we are using it to handle file uploads for the avatar field on the user update form.
 * 
 * The multer.memoryStorage() function creates a storage engine that stores the files in memory.
 * This is useful when you want to handle the file data in your application without writing it to disk.
 */
const storage = multer.memoryStorage();

/**
 * The multer function creates a middleware that will handle the file upload.
 * It takes an options object as a parameter, which in this case is an empty object.
 * The options object can be used to configure various aspects of the multer middleware.
 * 
 * The storage option is used to specify the storage engine for multer.
 * We are using the memoryStorage() engine which stores the files in memory.
 */
const upload = multer({ storage });

/**
 * The DataParser class is used to parse binary data into a data URL.
 * In this case, we are using it to convert the uploaded file into a data URL.
 * The format() method takes two parameters: the file extension and the binary data.
 * It returns an object with a dataURL property which is the data URL of the file.
 */
const parser = new DataParser();

/**
 * This function takes a file object as a parameter and returns the data URL of the file.
 * It uses the DataParser class to parse the file into a data URL.
 * The path.extname() function is used to get the file extension of the file.
 * The toString() method is used to convert the extension to a string.
 * The parser.format() method is used to convert the file into a data URL.
 * The content property of the returned object is the data URL of the file.
 */
export const formatImage = (file) => {
  const fileExtension = path.extname(file.originalname).toString();
  return parser.format(fileExtension, file.buffer).content;
};



export default upload;
