const axios = require('axios');
const fs = require('fs');
const { labs, ai } = require('./config');
const ERROR_MESSAGE = 'Error generating audio:';
const OUT_PATH = './data/audio/';
const openai = ai.openai;

async function transcribeAudio(filename) {
  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream(filename),
    model: ai.audioModel,
  });
  console.log(transcription.text);
  return transcription.text;
}

async function textToSpeech(text) {
  const path = OUT_PATH + Date.now() + '.mp3';
  const headers = labs.headers;
  const responseType = labs.responseType;
  labs.data.text = text;
  try {
    const response = await axios.post(labs.url, labs.data, { headers, responseType });
    await fs.promises.writeFile(path, response.data);
    return { response: response.data, path: path };
  } catch (error) {
    console.error(ERROR_MESSAGE, error);
  }
}

module.exports = { transcribeAudio, textToSpeech };
