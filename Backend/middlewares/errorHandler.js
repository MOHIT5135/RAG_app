import multer from 'multer';

export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';

  // Explicit handling for specific Multer exceptions
  if (err instanceof multer.MulterError) {
    statusCode = 400;
    if (err.code === 'LIMIT_FILE_SIZE') message = 'File is too large. Maximum allowed size is 10MB.';
    if (err.code === 'LIMIT_UNEXPECTED_FILE') message = 'Unexpected field key or maximum file threshold crossed.';
  }

  // Adjust standard type responses when running under development profiles
  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};
