const { saveVoiceChat, sendTelegramAudio, sendTelegramMessage, bot } = require('./telegram.js');
const { chatWithOpenAI } = require('./ai');
const fs = require('fs');
const { transcribeAudio, textToSpeech } = require('./audio.js');
const FILE_NOT_FOUND_ERROR = 'File not found after maximum attempts';

bot.on('text', async (message) => {
  try {
    const response = await chatWithOpenAI(message.text);
    await sendTelegramMessage(message.chat.id, response.choices[0].message.content);
    const speech = await textToSpeech(response.choices[0].message.content);
    await waitPersistence(speech.path).then(async () => {
      await sendTelegramAudio(message.chat.id, speech.path);
    })
  } catch (error) {
    console.error('Error:', error);
  }
});

bot.on('voice', async (message) => {
  const outputPath = `./data/audio/${Date.now()}.mp3`;
  try {
    await saveVoiceChat(outputPath, message.voice.file_id);
    await waitPersistence(outputPath).then(async () => {
      const audioresponse = await transcribeAudio(outputPath);
      const translations = await chatWithOpenAI(audioresponse);
      await sendTelegramMessage(message.chat.id, translations.choices[0].message.content);
    })
  } catch (error) {
    console.error('Error:', error);
  }
});

async function waitPersistence( outputPath, maxAttempts=10, delayBetweenAttempts=500) {
  return await (async () => {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      console.log(`Attempt ${attempt} of ${maxAttempts} to locate file ${outputPath}...`);
      try {
        await fs.promises.access(outputPath, fs.constants.F_OK); break;
      } catch {
        if (attempt === maxAttempts) {
          throw new Error(FILE_NOT_FOUND_ERROR + '\n' + outputPath);
        }
        await new Promise((resolve) => setTimeout(resolve, delayBetweenAttempts));
      }
    }
  })();
}
