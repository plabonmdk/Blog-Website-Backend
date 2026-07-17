import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() + "_" + file.fieldname + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

export default upload;