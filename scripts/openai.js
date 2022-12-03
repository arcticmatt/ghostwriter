const { Configuration, OpenAIApi } = require("openai");

async function run() {
  const configuration = new Configuration({
    apiKey: "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",
  });
  const openai = new OpenAIApi(configuration);

  const contentType = "haiku";
  const about = "pickles";
  const personality = "Sylvia Plath";

  const prompt = `Write a ${contentType} about ${about} in the style of ${personality}`;

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      // safety check so we don't get billed like crazy
      max_tokens: 50,
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
