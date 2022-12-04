import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getFavorites } from "~/models/generatedContent.server";
import { requireUserId } from "~/session.server";

type LoaderData = {
  favorites: Awaited<ReturnType<typeof getFavorites>>;
};

export const loader = async ({ request }: LoaderArgs) => {
  console.log("loader");
  const userId = await requireUserId(request);
  console.log("userId", userId);
  invariant(userId != null, "User must be logged in to view favorites");
  return json<LoaderData>({
    favorites: await getFavorites(userId),
  });
};

export default function Favorites() {
  const { favorites } = useLoaderData() as LoaderData;
  return (
    <main>
      <h1>Favorites</h1>
      <ul>
        {favorites.map((favorite) => (
          <li key={favorite.id}>{favorite.prompt.about}</li>
        ))}
      </ul>
    </main>
  );
}
