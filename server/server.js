import express from 'express';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';
import fs from 'fs';

import dotenv from 'dotenv';
dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Halo, Saya adalah BOT...',
  });
});

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;
    let backgroundInfo = '';
    try {
      backgroundInfo = fs.readFileSync('info.txt', 'utf-8');
    } catch (err) {
      console.error(err);
      backgroundInfo = 'Default background information';
    }
    const fullPrompt = `${backgroundInfo}\n\n${prompt}`;

    const response = await openai.createCompletion({
      model: 'text-davinci-002',
      prompt: fullPrompt,
      temperature: 0.5,
      max_tokens: 1024,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });

    res.status(200).send({
      bot: response.data.choices[0].text,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`AI server started on http://localhost:${PORT}`));
