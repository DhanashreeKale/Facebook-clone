import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path = require('path');
export const storage = {
  storage: diskStorage({
    destination: './profileImages',
    filename: (req, file, cb) => {
      const filename: string =
        path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4(); //to attatch a unique string that uniquely identifies the image file
      const extension: string = path.parse(file.originalname).ext;
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
      }
      cb(null, `${filename}${extension}`);
    },
  }),
};
