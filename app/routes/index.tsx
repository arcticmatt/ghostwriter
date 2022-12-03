import ResponsiveContainer from "~/components/containers/ResponsiveContainer";
import styles from "~/styles/pages/home/HomePage.css";
import styled from "@emotion/styled";

import { useOptionalUser } from "~/utils";
import ContentTypeSelect from "~/components/select/ContentTypeSelect";
import { useState } from "react";
import type { Maybe } from "~/types/UtilityTypes";
import PersonalitySelect from "~/components/select/PersonalitySelect";

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

  return (
    <ResponsiveContainer>
      <MyStyledH1>Welcome to Ghostwriter</MyStyledH1>
      <div className="homePage-inputs">
        <div>Write a</div>
        <ContentTypeSelect
          contentType={contentType}
          setContentType={setContentType}
        />
        <div>about</div>
        <input
          className="global-textInput"
          type="text"
          id="name"
          name="name"
          required
        />
        <div>in the style of</div>
        <PersonalitySelect
          personality={personality}
          setPersonality={setPersonality}
        />
      </div>
    </ResponsiveContainer>
  );
}
