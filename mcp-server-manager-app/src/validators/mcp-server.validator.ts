import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const validateMcpServer = [
  body('name')
    .isString()
    .notEmpty()
    .withMessage('Server name is required'),
  
  body('command')
    .isString()
    .notEmpty()
    .withMessage('Command is required'),
  
  body('args')
    .isArray()
    .withMessage('Args must be an array of strings'),
  
  body('args.*')
    .isString()
    .withMessage('Each arg must be a string'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    next();
  },
]; 