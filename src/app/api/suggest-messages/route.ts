import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { NextResponse } from "next/server";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });
const openai = new OpenAI({
  apiKey: process.env.CLOUDFLARE_API_KEY,
  baseURL: `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/ai/v1`,
});

export async function POST(request: Request) {
  try {
    // const prompt =
    //   "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with an historical figure, who would it be?||What's a simple thing that makes you happy?'. Ensure the question are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";
    // const response = await openai.completions.create({
    //   model: "gpt-3.5-turbo-instruct",
    //   max_tokens: 400,
    //   stream: true,
    //   prompt,
    // });
    // const stream = OpenAIStream(response);
    // return new StreamingTextResponse(stream);

    const prompt = `Create a list of three open-ended and engaging questions formatted as a single string. Each question should end with '?' and separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. Your output should only include the questions in the specified format, without any additional text.`;
    const response = await openai.chat.completions.create({
      model: "@cf/meta/llama-3-8b-instruct",
      messages: [{ role: "user", content: prompt }],
    });
    const responseString = response.choices[0].message.content;
    console.log(responseString);
    const suggestions = responseString
      ?.split("||")
      .map((suggestion) => suggestion.trim());

    return NextResponse.json({ suggestions }, { status: 200 });
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      const { name, status, headers, message } = error;
      return NextResponse.json(
        {
          name,
          status,
          headers,
          message,
        },
        { status: 500 }
      );
    } else {
      console.error("Error generating suggestion", error);
      throw error;
    }
  }
}
