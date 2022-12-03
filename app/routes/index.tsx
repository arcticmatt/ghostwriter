import ResponsiveContainer from "~/components/containers/ResponsiveContainer";
import styles from "~/styles/pages/home/HomePage.css";
import styled from "@emotion/styled";

import { useOptionalUser } from "~/utils";
import ContentTypeSelect from "~/components/select/ContentTypeSelect";
import { useState } from "react";
import type { Maybe } from "~/types/UtilityTypes";
import PersonalitySelect from "~/components/select/PersonalitySelect";
import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";

export const action: ActionFunction = async ({ request }) => {
  console.log("in remix action");
  const formData = await request.formData();
  console.log("formData", ...formData);

  return json({ test: "hello world" });
};

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

const MyStyledH1 = styled.h1`
  font-size: 5rem;
  color: green;
`;

export default function Index() {
  const user = useOptionalUser();
  const [contentType, setContentType] = useState<Maybe<string>>(null);
  const [personality, setPersonality] = useState<Maybe<string>>(null);
  const data = useActionData();

  console.log("data", data);

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
    </ResponsiveContainer>
  );
}
