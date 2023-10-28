const TelegramBot = require('node-telegram-bot-api');
const OpenAi = require('openai').OpenAI;
require('dotenv').config();

exports.ai = {
  token: process.env.AI_KEY,
  endpoints: {
    apibase: 'https://api.openai.com/v1/',
    audiorecognition: 'https://api.openai.com/v1/audio/transcriptions',
  },
  auth_headers: {
    headers: {
      'Authorization': `Bearer ${process.env.AI_KEY}`,
      'Content-Type': 'multipart/form-data'
    }
  },
  organization: 'vkhodzinsky',
  model: 'gpt-3.5-turbo',
  audioModel: 'whisper-1',
  CHAT_ERROR: 'Error chatting with AI:',
  openai: new OpenAi({ apiKey: process.env.AI_KEY, organization: this.organization })
};

exports.tg = {
  token: process.env.TG_KEY,
  base_url: `https://api.telegram.org/bot${process.env.TG_KEY}/`,
  voice_url: `https://api.telegram.org/bot${process.env.TG_KEY}/sendVoice`,
  message_url: `https://api.telegram.org/bot${process.env.TG_KEY}/sendMessage`,
  files_url: `https://api.telegram.org/file/bot${process.env.TG_KEY}/`,
  bot: new TelegramBot(process.env.TG_KEY, { polling: true })
};

exports.labs = {
  url: 'https://api.elevenlabs.io/v1/text-to-speech/g5CIjZEefAph4nQFvHAz',
  token: process.env.LABS_KEY,
  headers: {
    'accept': 'audio/mpeg',
    'xi-api-key': process.env.LABS_KEY,
    'Content-Type': 'application/json'
  }, 
  responseType: 'arraybuffer',
  data: {
    "text": '',
    "model_id": "eleven_monolingual_v1",
    "voice_settings": {
      "stability": 0.3,
      "similarity_boost": 0.7,
      "use_speaker_boost": true
    }
  }
};