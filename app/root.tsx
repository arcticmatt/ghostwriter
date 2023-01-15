import type { LinksFunction, LoaderArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from "@remix-run/react";

import tailwindStylesheetUrl from "./styles/tailwind.css";
import globalStyles from "./styles/global.css";
import { getUser } from "./session.server";

import { withEmotionCache } from "@emotion/react";
import styled from "@emotion/styled";
import { useContext, useEffect } from "react";

import ServerStyleContext from "./styles/server.context";
import ClientStyleContext from "./styles/client.context";

export const links: LinksFunction = () => {
  return [
    {
      rel: "icon",
      href: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>👻</text></svg>",
    },
    { rel: "stylesheet", href: globalStyles },
    { rel: "stylesheet", href: tailwindStylesheetUrl },
    { rel: "preconnect", href: "https://fonts.gstatic.com" },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Bakbak+One&family=Inter&display=swap",
    },
  ];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  description: "Write a poem in seconds",
  title: "Ghostwriter",
  viewport: "width=device-width,initial-scale=1",
});

export async function loader({ request }: LoaderArgs) {
  return json({
    user: await getUser(request),
  });
}

interface DocumentProps {
  children: React.ReactNode;
  title?: string;
}

const Container = styled("div")`
  background-color: #ff0000;
  padding: 1em;
`;

const Document = withEmotionCache(
  ({ children, title }: DocumentProps, emotionCache) => {
    const serverStyleData = useContext(ServerStyleContext);
    const clientStyleData = useContext(ClientStyleContext);

    // Only executed on client
    useEffect(() => {
      // re-link sheet container
      emotionCache.sheet.container = document.head;

      // re-inject tags
      const tags = emotionCache.sheet.tags;
      emotionCache.sheet.flush();
      tags.forEach((tag) => {
        (emotionCache.sheet as any)._insertTag(tag);
      });

      // reset cache to re-apply global styles
      clientStyleData.reset();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <html lang="en">
        <head>
          {title ? <title>{title}</title> : null}
          <Meta />
          <Links />
          {serverStyleData?.map(({ key, ids, css }) => (
            <style
              key={key}
              data-emotion={`${key} ${ids.join(" ")}`}
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: css }}
            />
          ))}
        </head>
        <body style={{ backgroundColor: "#F5F5F5" }}>
          {children}
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </body>
      </html>
    );
  }
);

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <Container>
        <p>
          [CatchBoundary]: {caught.status} {caught.statusText}
        </p>
      </Container>
    </Document>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document title="Error!">
      <Container>
        <p>[ErrorBoundary]: There was an error: {error.message}</p>
      </Container>
    </Document>
  );
}
