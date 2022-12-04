import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { getFavorites } from "~/models/generatedContent.server";
import { requireUserId } from "~/session.server";

type LoaderData = {
  favorites: Awaited<ReturnType<typeof getFavorites>>;
};

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await requireUserId(request);
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
          <Link
            key={favorite.id}
            to={favorite.id}
            className="text-blue-600 underline"
          >
            <li>{favorite.prompt.about}</li>
          </Link>
        ))}
      </ul>
    </main>
  );
}
