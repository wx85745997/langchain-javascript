import { OpenAI } from "langchain/llms/openai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { SerpAPI } from "langchain/tools";
import { Calculator } from "langchain/tools/calculator";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import { PlanAndExecuteAgentExecutor } from "langchain/experimental/plan_and_execute";
import { exec } from "child_process";

// export OPENAI_API_KEY=<>
// export SERPAPI_API_KEY=<>
// Replace with your API keys!

// to run, go to terminal and enter: cd playground
// then enter: node quickstart.mjs
const template =
  "Please give me some ideas for content I should write about regarding {topic}? The content is for {socialplatform}. Translate to {language}.";
const prompt = new PromptTemplate({
  template: template,
  inputVariables: ["topic", "socialplatform", "language"],
});

const formattedPromptTemplate = await prompt.format({
  topic: "artifical intelligience",
  socialplatform: "twitter",
  language: "spanish",
});

console.log({ formattedPromptTemplate });
const model = new OpenAI({ temperature: 0.9 });

const chain = new LLMChain({ prompt: prompt, llm: model });

const resChain = await chain.call({
  topic: "artifical intelligience",
  socialplatform: "twitter",
  language: "engilsh",
});

console.log({ resChain });

const agentModel = new OpenAI({
  temperature: 0,
  modelName: "gpt-3.5-turbo",
});

const tools = [
  new SerpAPI(process.env.SERPAPI_API_KEY, {
    location: "",
    hl: "en",
    gl: "us",
  }),
  new Calculator(),
];

const executor = await initializeAgentExecutorWithOptions(tools, agentModel, {
  agentType: "zero-shot-react-description",
  verbose: true,
  maxIterations: 5,
});

const input = "what is langchain?";

const result = await executor.call({ input });
console.log({ result });
