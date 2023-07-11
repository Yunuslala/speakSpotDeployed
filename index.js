const express = require('express');
require("dotenv").config();
const path = require('path');
const cors = require("cors");
require("dotenv").config()
const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

const { Configuration, OpenAIApi } = require("openai");


async function generateCompletion(input) {
  try {
    const prompt = input;
    const maxTokens = 1000;
    const n = 1;

    const configuration = new Configuration({
      apiKey:process.env.apikey
    });

    const openai = new OpenAIApi(configuration);
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: maxTokens,
      n: n
    });

    const { choices } = response.data;
    if (choices && choices.length > 0) {
      const completion = choices[0].text.trim();
      return completion;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

app.post('/content', async (req, res) => {
  try {
    const { content, language, input } = req.body;
    const response = await generateCompletion(`Give me a ${content} in ${language} of ${input}`);
    console.log(response)
    res.json({ response });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});


app.get("/hello",async(req,res)=>{
  res.send({"msg":"deployed"})
})


app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});