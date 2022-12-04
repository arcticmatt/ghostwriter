import { prisma } from "~/db.server";

import type { GeneratedContent, Prompt } from "@prisma/client";
import type { MaybeUndef } from "~/types/UtilityTypes";
import invariant from "tiny-invariant";

export type GeneratedContentForClient = {
  createdAt: string;
  id: string;
  name: MaybeUndef<string>;
  prompt: {
    about: string;
    contentType: string;
    personality: string;
  };
};

const GENERATED_CONTENT_INCLUDE = { prompt: true };

function convertGeneratedContent(
  prismaGeneratedContent: GeneratedContent & { prompt: Prompt }
): GeneratedContentForClient {
  const prismaPrompt = prismaGeneratedContent.prompt;
  return {
    createdAt: prismaGeneratedContent.createdAt.toString(),
    id: prismaGeneratedContent.id,
    name: prismaGeneratedContent.name,
    prompt: {
      about: prismaPrompt.about,
      contentType: prismaPrompt.contentType,
      personality: prismaPrompt.personality,
    },
  };
}

export async function getFavorite(
  id: string
): Promise<GeneratedContentForClient> {
  const prismaGeneratedContent = await prisma.generatedContent.findUnique({
    include: GENERATED_CONTENT_INCLUDE,
    where: {
      id,
    },
  });
  invariant(prismaGeneratedContent != null);
  return convertGeneratedContent(prismaGeneratedContent);
}

export async function getFavorites(
  userId: string
): Promise<Array<GeneratedContentForClient>> {
  const prismaGeneratedContent = await prisma.generatedContent.findMany({
    include: GENERATED_CONTENT_INCLUDE,
    where: {
      isFavorite: true,
      userId,
    },
  });
  return prismaGeneratedContent.map((val) => convertGeneratedContent(val));
}
