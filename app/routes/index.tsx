import ResponsiveContainer from "~/components/containers/ResponsiveContainer";
import styles from "~/styles/pages/home/HomePage.css";
import styled from "@emotion/styled";

import { useOptionalUser } from "~/utils";
import ContentTypeSelect from "~/components/select/ContentTypeSelect";
import { useState } from "react";
import type { Maybe } from "~/types/UtilityTypes";

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

  return (
    <ResponsiveContainer>
      <MyStyledH1>Welcome to Ghostwriter</MyStyledH1>
      <ContentTypeSelect
        contentType={contentType}
        setContentType={setContentType}
      />
    </ResponsiveContainer>
  );
}
