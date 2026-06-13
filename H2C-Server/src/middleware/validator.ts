import { body } from 'express-validator';
import type { ExamType } from '../types/index.js';

const VALID_EXAM_TYPES: ExamType[] = ['JEE', 'NEET', 'UPSC', 'GATE', 'CAT', 'CUET'];

export const validateJournal = [
  body('userId')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('userId is required'),
  body('content')
    .isString()
    .trim()
    .isLength({ min: 5, max: 5000 })
    .withMessage('Content must be between 5 and 5000 characters'),
];

export const validateChat = [
  body('userId')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('userId is required'),
  body('message')
    .isString()
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Message must be between 1 and 2000 characters'),
  body('sessionId')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('sessionId is required'),
];

export const validateUser = [
  body('name')
    .isString()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('examType')
    .isString()
    .trim()
    .isIn(VALID_EXAM_TYPES)
    .withMessage(`examType must be one of: ${VALID_EXAM_TYPES.join(', ')}`),
];
