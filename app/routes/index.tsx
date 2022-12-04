import ResponsiveContainer from "~/components/containers/ResponsiveContainer";
import styles from "~/styles/pages/home/HomePage.css";
import styled from "@emotion/styled";

import ContentTypeSelect from "~/components/select/ContentTypeSelect";
import { useState } from "react";
import type { Maybe } from "~/types/UtilityTypes";
import PersonalitySelect from "~/components/select/PersonalitySelect";
import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import getGeneratedContent from "~/api/getGeneratedContent";
import invariant from "tiny-invariant";

type ActionData = {
  contentType: null | string;
  about: null | string;
  personality: null | string;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const contentType = formData.get("contentType");
  const about = formData.get("about");
  const personality = formData.get("personality");

  invariant(typeof contentType === "string", "contentType must be a string");
  invariant(typeof about === "string", "about must be a string");
  invariant(typeof personality === "string", "personality must be a string");

  const errors: ActionData = {
    contentType: contentType ? null : "Content type is required",
    about: about ? null : "Topic is required",
    personality: personality ? null : "Personality is required",
  };
  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
  if (hasErrors) {
    return json<ActionData>(errors);
  }

  const response = await getGeneratedContent(contentType, about, personality);

  return json({ response });
};

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

const MyStyledH1 = styled.h1`
  font-size: 5rem;
  color: green;
`;

export default function Index() {
  const [contentType, setContentType] = useState<Maybe<string>>(null);
  const [personality, setPersonality] = useState<Maybe<string>>(null);
  const data = useActionData();

  return (
    <ResponsiveContainer>
      <MyStyledH1>Welcome to Ghostwriter</MyStyledH1>
      <Form className="homePage-inputs" method="post">
        <div>Write a</div>
        <ContentTypeSelect
          contentType={contentType}
          setContentType={setContentType}
        />
        <div>about</div>
        <input
          className="global-textInput"
          type="text"
          id="about"
          name="about"
          required
        />
        <div>in the style of</div>
        <PersonalitySelect
          personality={personality}
          setPersonality={setPersonality}
        />
        <input type="hidden" name="contentType" value={contentType ?? ""} />
        <input type="hidden" name="personality" value={personality ?? ""} />
        <button className="global-button" type="submit">
          Submit!
        </button>
      </Form>
      {data?.response ? <div>{data.response}</div> : null}
    </ResponsiveContainer>
  );
}
