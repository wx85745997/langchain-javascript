"use client";
import React, { use, useState } from "react";
import PageHeader from "../components/PageHeader";
import PromtBox from "../components/PromptBox";
import Title from "../components/Title";
import TwoColumnLayout from "../components/TwoColumnLayout";
import ResultWithSources from "../components/ResultWithSources";
import "../globals.css";
import PromptBox from "../components/PromptBox";

const Memory = () => {
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState([
    {
      text: "Hi three! Wat's your name and favourite food?",
      type: "bot",
    },
  ]);
  const [firstMsg, setFirstMsg] = useState(true);
  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };
  const handleSubmitPrompt = async () => {
    console.log("send", prompt);
    try {
      setMessage((prevMessages) => [
        ...prevMessages,
        {
          text: prompt,
          type: "user",
          sourceDocuments: null,
        },
      ]);
      const response = await fetch("/api/memory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: prompt, firstMsg }),
      });

      if (!response.ok) {
        throw new Error(`HTTP Error! Status:${response.statuse}`);
      }
      setPrompt("");
      setFirstMsg(false);

      const searchRes = await response.json();

      setMessage((prevMessages) => [
        ...prevMessages,
        {
          text: searchRes.output.response,
          type: "bot",
          sourceDocuments: null,
        },
      ]);

      console.log({ searchRes });
    } catch (err) {
      console.error(err);
      setError(err);
    }
  };

  return (
    <>
      <Title headingText={"Memory"} emoji="🧠"></Title>

      <TwoColumnLayout
        leftChildren={
          <>
            <PageHeader
              heading="I remember everything"
              boldText="Lets see if it can remember your name and favourite food. This tool will let you  ask  anything  contained in a PDF document."
              description="This tool uses Buffer Memory and Conversation Chain. Head over to Moule X to get started "
            />
          </>
        }
        rightChildren={
          <>
            <ResultWithSources messages={message} pngFile="brain" />
            <PromptBox
              prompt={prompt}
              handleSubmit={handleSubmitPrompt}
              handlePromptChange={handlePromptChange}
              error={error}
            />
          </>
        }
      />
    </>
  );
};

export default Memory;
