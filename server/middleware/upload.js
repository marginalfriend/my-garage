import multer, { diskStorage } from 'multer';
import { extname as _extname } from 'path';

// Set storage engine
const storage = diskStorage({
	destination: './uploads/', // Folder to store images
	filename: function (req, file, cb) {
		cb(null, file.fieldname + '-' + Date.now() + _extname(file.originalname));
	}
});

// Init upload
const upload = multer({
	storage: storage,
	limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit per file
	fileFilter: function (req, file, cb) {
		checkFileType(file, cb);
	}
}).array('images', 10); // Allow up to 10 images to be uploaded


// Check file type
function checkFileType(file, cb) {
	// Allowed ext
	const filetypes = /jpeg|jpg|png/;
	// Check ext
	const extname = filetypes.test(_extname(file.originalname).toLowerCase());
	// Check mime
	const mimetype = filetypes.test(file.mimetype);

	if (mimetype && extname) {
		return cb(null, true);
	} else {
		cb('Error: Images Only!');
	}
}

export default upload;
