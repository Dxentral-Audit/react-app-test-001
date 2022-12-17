```js
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();

app.use(bodyParser.json());

app.post('/chat', (req, res) => {
  const { message } = req.body;

  axios.post('https://api.openai.com/v1/engines/davinci/completions', {
    prompt: message,
    max_tokens: 50,
    temperature: 0.9,
    top_p: 0.9,
    stream: false,
    logprobs: null,
    stop: ['\n']
  }, {
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    }
  })
  .then(function (response) {
    res.json({
      message: response.data.choices[0].text
    });
  })
  .catch(function (error) {
    console.log(error);
  });
});

app.listen(3000, () => console.log('Server running on port 3000'));
```
