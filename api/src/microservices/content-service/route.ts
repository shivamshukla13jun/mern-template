import { Router } from 'express';
import {
  getAllContent,
  getContentById,
  getTrendingContent,
  getContentByGenre,
} from './content.controller';

const router = Router();

// Public routes
router.get('/', getAllContent);
router.get('/trending', getTrendingContent);
router.get('/genre/:genre', getContentByGenre);
router.get('/:id', getContentById);

export default router;
