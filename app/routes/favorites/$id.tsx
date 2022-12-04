import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useSubmit } from "@remix-run/react";
import invariant from "tiny-invariant";
import ResponsiveContainer from "~/components/containers/ResponsiveContainer";

import type { GeneratedContentForClient } from "~/models/generatedContent.server";
import { deleteFavorite } from "~/models/generatedContent.server";
import { getFavorite } from "~/models/generatedContent.server";
import { requireUserId } from "~/session.server";

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  invariant(userId != null, "User must be logged in to delete favorite");
  const formData = await request.formData();
  const id = formData.get("id");
  invariant(typeof id === "string", "id must be a string");

  const favorite = await getFavorite(id);
  invariant(favorite != null, "Favorite must exist");
  invariant(favorite.userId !== userId, "User must own favorite to delete it");

  await deleteFavorite(id);

  return redirect("/favorites");
};

type LoaderData = { favorite: GeneratedContentForClient };

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.id, `params.id is required`);

  const favorite = await getFavorite(params.id);
  invariant(favorite != null, `Favorite not found: ${params.id}`);

  return json<LoaderData>({ favorite });
};

export default function FavoriteId() {
  const { favorite } = useLoaderData() as LoaderData;
  const submit = useSubmit();
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
      <button
        className="global-button"
        onClick={() => submit({ test: "foo" }, { method: "post" })}
        style={{ marginTop: 16 }}
      >
        Delete
      </button>
    </ResponsiveContainer>
  );
}
