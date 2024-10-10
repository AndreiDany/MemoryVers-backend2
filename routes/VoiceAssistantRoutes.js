import {Router} from 'express';

import authenticate from '../middleware/authenticate.js';

import {speechToSpeech, textToSpeech, speechThePassage} from '../controllers/VoiceAssistantController.js';

import multer from 'multer';


const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//
router.post('/speechToSpeech', authenticate, upload.single('audio'), speechToSpeech);

//
router.post('/textToSpeech', authenticate, textToSpeech);

//
router.post('/speechThePassage', authenticate, speechThePassage);


export default router;