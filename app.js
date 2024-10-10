import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import AuthRoutes from "./routes/authRoutes.js";
import VoiceAssistantRoutes from "./routes/VoiceAssistantRoutes.js";
import BiblePassageRoutes from "./routes/biblePassageRoutes.js";

const app = express();

dotenv.config();
const port = 3000;

app.use(express.json());
app.use(cors());


app.use("/auth", AuthRoutes);
app.use("/voiceAssistantAI", VoiceAssistantRoutes);
app.use("/biblePassages", BiblePassageRoutes);


app.listen(port, () => {
    console.log('Aplication listening on port ' + port);
});