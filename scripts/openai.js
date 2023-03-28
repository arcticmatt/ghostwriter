const { Configuration, OpenAIApi } = require("openai");

async function run() {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const contentType = "rap song";
  const about = "pickles";
  const personality = "Snoop Dog";

  const prompt = `Write a ${contentType} about ${about} in the style of ${personality}`;

  try {
    // Parameters taken from https://beta.openai.com/playground/p/default-chat
    const response = await openai.createCompletion(
      {
        best_of: 1,
        frequency_penalty: 0,
        model: "ada",
        presence_penalty: 0.6,
        prompt,
        // safety check so we don't get billed like crazy
        max_tokens: 20,
        temperature: 0.9,
        stream: true,
        top_p: 1,
      },
      { responseType: "stream" }
    );

    const stream = response.data;

    stream.on("data", (data) => {
      console.log(data.toString());
      const strData = data.toString();

      if (!strData.includes("[DONE]")) {
        const jsonData = JSON.parse(strData.slice(5));
        console.log(jsonData.choices[0].text);
      }
    });

    stream.on("end", () => {
      console.log("stream done");
    });
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
