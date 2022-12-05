import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useSubmit, useTransition } from "@remix-run/react";
import { useState } from "react";
import invariant from "tiny-invariant";
import ResponsiveContainer from "~/components/containers/ResponsiveContainer";

import type { GeneratedContentForClient } from "~/models/generatedContent.server";
import { updateFavoriteName } from "~/models/generatedContent.server";
import { deleteFavorite } from "~/models/generatedContent.server";
import { getFavorite } from "~/models/generatedContent.server";
import { requireUserId } from "~/session.server";

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  invariant(userId != null, "User must be logged in");
  const formData = await request.formData();
  const id = formData.get("id");
  const type = formData.get("type");
  invariant(typeof id === "string", "id must be a string");
  invariant(typeof type === "string", "type must be a string");

  const favorite = await getFavorite(id);
  invariant(favorite != null, "Favorite must exist");
  invariant(favorite.userId === userId, "User must own favorite");

  switch (type) {
    case "delete": {
      await deleteFavorite(id);
      return redirect("/favorites");
    }
    case "update_name": {
      await updateFavoriteName(id, formData.get("name") as string);
      return redirect("/favorites");
    }
    default:
      throw new Error("Unsupported type");
  }
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
  const transition = useTransition();
  const isSubmitting = Boolean(transition.submission);
  const [newName, setNewName] = useState("");

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
        disabled={isSubmitting}
        onClick={() =>
          submit({ id: favorite.id, type: "delete" }, { method: "post" })
        }
        style={{ marginTop: 16 }}
      >
        {isSubmitting &&
        transition.submission?.formData.get("type") === "delete"
          ? "Deleting..."
          : "Delete"}
      </button>
      <div style={{ columnGap: 16, display: "flex", marginTop: 24 }}>
        <input
          className="global-textInput"
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New name"
          type="text"
          value={newName}
        />
        <button
          className="global-button"
          disabled={isSubmitting}
          onClick={() =>
            submit(
              { id: favorite.id, name: newName, type: "update_name" },
              { method: "post" }
            )
          }
          style={{ marginTop: 16 }}
        >
          {isSubmitting &&
          transition.submission?.formData.get("type") === "update_name"
            ? "Updating..."
            : "Update Name"}
        </button>
      </div>
    </ResponsiveContainer>
  );
}
