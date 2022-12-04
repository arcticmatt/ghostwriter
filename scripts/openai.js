const { Configuration, OpenAIApi } = require("openai");

async function run() {
  const configuration = new Configuration({
    apiKey: "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",
  });
  const openai = new OpenAIApi(configuration);

  const contentType = "rap song";
  const about = "pickles";
  const personality = "Snoop Dog";

  const prompt = `Write a ${contentType} about ${about} in the style of ${personality}`;

  try {
    // Parameters taken from https://beta.openai.com/playground/p/default-chat
    const completion = await openai.createCompletion({
      best_of: 1,
      frequency_penalty: 0,
      model: "text-davinci-003",
      presence_penalty: 0.6,
      prompt,
      // safety check so we don't get billed like crazy
      max_tokens: 500,
      temperature: 0.9,
      top_p: 1,
    });
    console.log(completion.data.choices[0].text);
  } catch (error) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }
  }
}

run();
