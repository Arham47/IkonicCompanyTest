import multer from "multer"
import path from 'path';
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
},

  filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix+"-"+file.originalname);
  },
});
const upload = multer({
storage: storage,
fileFilter: function (req, file, callback) {
  var ext = path.extname(file.originalname);

  if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg'&& ext !== '.doc'&& ext !== '.docx'&& ext !== '.rft'&& ext !== '.xls'&& ext !== '.xlsx'&& ext !== '.ppt'&& ext !== '.pptx'&& ext !== '.txt'&& ext !== '.pdf') {
      return callback(new Error('Invalid file extension'))
  }
  callback(null, true)
},
});
export {upload}