const multer = require('multer');
const env = require('../config/env');
const AppError = require('../utils/AppError');
const { ALLOWED_MEDIA_TYPES } = require('../constants/complaint.constants');

const MAX_FILES = 5;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: env.maxUploadMb * 1024 * 1024, files: MAX_FILES },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MEDIA_TYPES.includes(file.mimetype)) {
      return cb(new AppError('Only JPG, PNG, WEBP and MP4 files are allowed', 400));
    }
    cb(null, true);
  },
});

// Wraps multer so upload problems return a clean 400 response
const uploadComplaintMedia = (req, res, next) => {
  upload.array('media', MAX_FILES)(req, res, (err) => {
    if (!err) return next();

    if (err instanceof multer.MulterError) {
      const messages = {
        LIMIT_FILE_SIZE: `Each file must be ${env.maxUploadMb} MB or smaller`,
        LIMIT_FILE_COUNT: `You can upload up to ${MAX_FILES} files`,
        LIMIT_UNEXPECTED_FILE: 'Unexpected file field. Use "media"',
      };
      return next(new AppError(messages[err.code] || 'File upload failed', 400));
    }

    if (err instanceof AppError) return next(err);
    next(err);
  });
};

module.exports = { uploadComplaintMedia };
