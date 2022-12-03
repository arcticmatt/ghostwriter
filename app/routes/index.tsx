import ResponsiveContainer from "~/components/containers/ResponsiveContainer";
import styles from "~/styles/pages/home/HomePage.css";

import { useOptionalUser } from "~/utils";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

export default function Index() {
  const user = useOptionalUser();
  return <ResponsiveContainer>Hello world</ResponsiveContainer>;
}
