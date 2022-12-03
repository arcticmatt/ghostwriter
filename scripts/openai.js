const { Configuration, OpenAIApi } = require("openai");

async function run() {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  const response = await openai.listEngines();
  console.log(response.data);
}

run();
