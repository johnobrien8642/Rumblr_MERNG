import mongoose from 'mongoose';
import express from 'express';
const router = express.Router();
import multer from 'multer';
import { v4 } from 'uuid';
import register from '../../validations/register.js';

// const DIR = './public/'

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, DIR);
//   },
//   filename: (req, file, cb) => {
//     const fileName = file.originalname.toLowerCase().split(' ').join('-');
//     cb(null, v4() + '-' + fileName)
    
//   }
// })

// var upload = multer({
//   storage: storage,
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
//       cb(null, true);
//     } else {
//       cb(null, false);
//       return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
//     }
//   }
// })

var upload = multer({ dest: 'uploads/' })

const Image = mongoose.model('Image')

router.post('/', upload.any(), async (req, res, next) => {
  const url = req.protocol + '://' + req.get('host')
  
  function createImg(f) {
    let img = new Image({
      url: url + '/uploads/' + f.filename,
      created: Date.now()
    })
    return img.save()
  }

  const promises = req.files.map(f => createImg(f))

  Promise
    .all(promises)
    .then(data => res.send(data))
    .catch(err => {
      console.log(err)
    })
})

export default router;