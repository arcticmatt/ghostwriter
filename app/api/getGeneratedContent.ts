const { Configuration, OpenAIApi } = require("openai");

function configureOpenAI() {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  return new OpenAIApi(configuration);
}

async function getGeneratedContent(
  contentType: string,
  about: string,
  personality: string
) {
  const openAI = configureOpenAI();

  const prompt = `Write a ${contentType} about ${about} in the style of ${personality}`;

  let response: string = "";

  try {
    // Parameters taken from https://beta.openai.com/playground/p/default-chat
    const completion = await openAI.createCompletion({
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
    response = completion.data.choices[0].text;
  } catch (error) {
    if (error.response) {
      console.log(error.response.status);
      console.log(error.response.data);
    } else {
      console.log(error.message);
    }
  }

  return response;
}

export default getGeneratedContent;
