import {Router} from 'express';

import {insertBiblePassage, getMemorizedPassages, getUnfinishedPassages, progress} from '../controllers/biblePassageController.js';

import authenticate from '../middleware/authenticate.js';


const router = Router();

//
router.post('/', authenticate, insertBiblePassage);

//
router.post('/memorizedPassages', authenticate, getMemorizedPassages);

//
router.post('/unfinishedPassages', authenticate, getUnfinishedPassages);

//
router.post('/progress', authenticate, progress);

export default router;