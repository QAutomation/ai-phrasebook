const ai = require('./config.js').ai;
const ERROR_MESSAGE = 'Error chatting with OpenAI:';
const openai = ai.openai;

async function generateImage(prompt, n = 1) {
  const image = await openai.images.generate({ prompt, n, size: '256x256' });
  console.log(image.data);
}

async function chatWithOpenAI(message) {
  try {
    return await openai.chat.completions.create({
      model: ai.model,
      messages: await createMessages(message)
    });
  } catch (error) {
    console.error(ERROR_MESSAGE, error);
    throw error;
  }
}

async function createMessages(content, systemContent = `You will be provided with a sentence in German or not in German,
and your task is to translate it into German if it is not in German, 
and if it is in German - then to Ukrainian.`) {
  return [
    { role: 'system', content: systemContent },
    { role: 'user', content }
  ];
}

module.exports = { generateImage, chatWithOpenAI };