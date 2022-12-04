import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import ResponsiveContainer from "~/components/containers/ResponsiveContainer";

import type { GeneratedContentForClient } from "~/models/generatedContent.server";
import { getFavorite } from "~/models/generatedContent.server";

type LoaderData = { favorite: GeneratedContentForClient };

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.id, `params.id is required`);

  const favorite = await getFavorite(params.id);
  invariant(favorite != null, `Favorite not found: ${params.id}`);

  return json<LoaderData>({ favorite });
};

export default function FavoriteId() {
  const { favorite } = useLoaderData() as LoaderData;
  console.log(favorite.generatedContent);
  return (
    <ResponsiveContainer>
      <h1 className="my-6 border-b-2 text-center text-3xl">{favorite.name}</h1>
      <div>
        <b>Prompt</b>: write a{" "}
        <i>{favorite.prompt.contentType.toLocaleLowerCase()}</i> about{" "}
        <i>{favorite.prompt.about.toLocaleLowerCase()}</i> in the style of{" "}
        <i>{favorite.prompt.personality}</i>
      </div>
      <div>
        <b>Result</b>:{" "}
        <div style={{ whiteSpace: "pre-line" }}>
          {favorite.generatedContent}
        </div>
      </div>
    </ResponsiveContainer>
  );
}
