import OpenAI from "openai";

import fs from "fs";

import dotenv from 'dotenv';
dotenv.config();


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});


export const speechToSpeech =  async(req, res) => {

    var audioBuffer;
    var textBiblic;

    try {
        // Obținerea datele audio
        audioBuffer = req.file.buffer;

        textBiblic = req.body.text;
        
    } catch (error) {
        console.error('Eroare la procesarea datelor pe server:', error);
        res.status(500).send('Internal Server Error');
    }

    //Salvarea datelor audio sub forma de fișier WAV
    const wavFilePath = 'clientAudio.wav';
    fs.writeFileSync(wavFilePath, audioBuffer);

    //Transformarea datelor WAV in text
    const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(wavFilePath),
        model: "whisper-1",
        language: "ro",
    });
    
    //Textul trimis catre Chat
    var content = contentForChat(textBiblic, transcription.text);
    console.log(content);

    //Chat
    const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: content }],
        model: "GPT-4o",
    });
    
    //Transforarea raspunsului din text in vocal
    const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: "onyx",
        input: completion.choices[0].message.content,
        language: "ro",
    });
    
    // trimiterea datelor audio
    const buffer = Buffer.from(await mp3.arrayBuffer());
    res.send(buffer);

};


export const textToSpeech = async(req, res) => {

    var bibleText;
    var spokenPassage;

    try {
        bibleText = req.body.bibleText;
        spokenPassage = req.body.transcribedText;
        
    } catch (error) {
        console.error('Eroare la procesarea datelor pe server:', error);
        res.status(500).send('Internal Server Error');
    }
    
    //Textul trimis catre Chat
    var content = contentForChat(bibleText, spokenPassage);
    console.log(content);

    //Chat
    const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: content }],
        model: "gpt-4o",
    });
    
    //Transforarea raspunsului din text in vocal
    const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: "onyx",
        input: completion.choices[0].message.content,
        language: "ro",
    });
    
    // trimiterea datelor audio
    const buffer = Buffer.from(await mp3.arrayBuffer());
    res.send(buffer);

};


export const speechThePassage = async(req, res) => {

    var text;

    try {
        text = req.body.text;
        
    } catch (error) {
        console.error('Eroare la procesarea datelor pe server:', error);
        res.status(500).send('Internal Server Error');
    }
    
    //Transforarea raspunsului din text in vocal
    const mp3 = await openai.audio.speech.create({
        model: "tts-1",
        voice: "onyx",
        input: text,
        language: "ro",
    });
    
    // trimiterea datelor audio
    const buffer = Buffer.from(await mp3.arrayBuffer());
    res.send(buffer);

};


function contentForChat(textBiblic, transcriptionText) {

    var content = "Enumeră, dacă există, diferențele literale dintre frazele: \"" + textBiblic +
    "\" și \"" + transcriptionText + "\". Având următoarea introducere: " + 
    "\"Diferențele dintre pasajul biblic și textul rostit sunt: 1. În pasajul biblic ... \"." +
    " Nu preciza diferentele dintre semnele de punctuație, diacritice sau spații goale! " +
    "Dacă nu există diferențe, doar felicită utilizatorul, fără vre-o altă menținue.";

    // var content = "Enumeră, pe scurt, doar diferențele literale dintre frazele: \"" + textBiblic +
    // "\" și \"" + transcriptionText + "\". Având următoarea introducere: " + 
    // "\"Diferențele dintre pasajul biblic și textul rostit sunt: ... \"."+
    // " Nu lua în considerare semnele de punctuație sau diacriticele.";

    // var content = "Compară: \"" + transcription.text +
    // "\" și \"" + textBiblic + "\"";

    // var content = "Enumeră, pe scurt, deosebirile literale dintre textele: \"" + textBiblic +
    // "\" și \"" + transcription.text + "\". Nu lua în considerare semnele de punctuațiile.";

    return content
}