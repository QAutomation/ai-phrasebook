const tg = require('./config.js').tg;
const ffmpeg = require('fluent-ffmpeg');
const axios = require('axios');
const bot = tg.bot;
const streamToBlob = require('stream-to-blob');
const fs = require('fs');

const AUDIO_ERROR_MESSAGE = 'Error sending audio to Telegram:';
const MESSAGE_ERROR_MESSAGE = 'Error sending message to Telegram:';

async function saveVoiceChat(outputPath, fileId) {
  const file = await bot.getFile(fileId);

  const fileLink = `${tg.files_url}${file.file_path}`;
  const response = await axios.get(fileLink, { responseType: 'stream' });

  const input = response.data; 
  ffmpeg(input)
    .toFormat('mp3')
    .on('end', async () => {
      console.log(`Audio saved to ${outputPath}`);
    }).save(outputPath);
}

async function sendTelegramAudio(chatId, outputFile) {
  try {
    const audio = fs.createReadStream(outputFile);
    const audioBlob = await streamToBlob(audio);
    const formData = new FormData();
    formData.append('chat_id', chatId);
    formData.append('voice', audioBlob);

    const responseAudio = await axios.post(tg.voice_url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    console.log(responseAudio.data);
  } catch (error) {
    console.error(AUDIO_ERROR_MESSAGE, error);
  }
}

async function sendTelegramMessage(chat_id, text) {
  try {
    const response = await axios.post(tg.message_url, { chat_id, text });
    console.log(response.data);
  } catch (error) {
    console.error(MESSAGE_ERROR_MESSAGE, error);
  }
}

module.exports = {
  saveVoiceChat,
  sendTelegramAudio,
  sendTelegramMessage,
  bot
}