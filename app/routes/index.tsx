import ResponsiveContainer from "~/components/containers/ResponsiveContainer";
import styles from "~/styles/pages/home/HomePage.css";
import styled from "@emotion/styled";

import { useOptionalUser } from "~/utils";
import Select from "react-select";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

const MyStyledH1 = styled.h1`
  font-size: 5rem;
  color: green;
`;

const options = [
  { value: "chocolate", label: "Chocolate" },
  { value: "strawberry", label: "Strawberry" },
  { value: "vanilla", label: "Vanilla" },
];

export default function Index() {
  const user = useOptionalUser();
  return (
    <ResponsiveContainer>
      <MyStyledH1>Welcome to Remix</MyStyledH1>
      <Select options={options} />
    </ResponsiveContainer>
  );
}
