import ResponsiveContainer from "~/components/containers/ResponsiveContainer";

import ContentTypeSelect from "~/components/select/ContentTypeSelect";
import { useState } from "react";
import type { Maybe } from "~/types/UtilityTypes";
import PersonalitySelect from "~/components/select/PersonalitySelect";
import type { ActionFunction } from "@remix-run/node";
import { Form, useActionData, useTransition } from "@remix-run/react";
import getGeneratedContent from "~/api/getGeneratedContent";
import invariant from "tiny-invariant";
import squiggle from "../assets/images/squiggle.svg";

type ActionData = {
  contentType: null | string;
  about: null | string;
  personality: null | string;
};

const submitFormAction = async (formData: FormData) => {
  const contentType = formData.get("contentType");
  const about = formData.get("about");
  const personality = formData.get("personality");

  invariant(typeof contentType === "string", "contentType must be a string");
  invariant(typeof about === "string", "about must be a string");
  invariant(typeof personality === "string", "personality must be a string");

  const errors: ActionData = {
    contentType: contentType ? null : "Content type is required",
    about: about ? null : "Topic is required",
    personality: personality ? null : "Personality is required",
  };
  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
  if (hasErrors) {
    return { errors };
  }

  const response = await getGeneratedContent(contentType, about, personality);

  return { data: response };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const response = await submitFormAction(formData);

  return response;
};

export default function Index() {
  const [contentType, setContentType] = useState<Maybe<string>>(null);
  const [personality, setPersonality] = useState<Maybe<string>>(null);
  const actionData = useActionData();

  const transition = useTransition();
  const isSubmitting = Boolean(transition.submission);

  return (
    <ResponsiveContainer className="h-screen p-8 border-4 border-solid min-w-min border-ghost-green bg-ghost-gray sm:p-12">
      <h3 className="text-xl text-center font-bakbak-one text-ghost-green">
        GHOSTWRITER
      </h3>
      <h1 className="mt-8 text-4xl text-center font-bakbak-one text-ghost-green">
        Write a poem in seconds
      </h1>
      <div className="flex justify-center w-full mt-8 ">
        <p className="mr-2 text-center text-md font-inter text-ghost-green">
          Try it out
        </p>
        <img src={squiggle} alt="squiggly line" className="h-8 mt-2" />
      </div>
      <Form
        className="flex flex-col items-start items-center justify-between p-8 mt-6 bg-white gap-y-2 rounded-3xl md:flex-row"
        method="post"
      >
        <div>Write a</div>
        <ContentTypeSelect
          contentType={contentType}
          setContentType={setContentType}
        />
        {actionData?.errors?.contentType ? (
          <em className="text-red-600">{actionData.errors.contentType}</em>
        ) : null}
        <div>about</div>
        <input
          className="w-40 h-8 border border-solid rounded-lg border-ghost-green"
          type="text"
          id="about"
          name="about"
        />
        {actionData?.errors?.about ? (
          <em className="text-red-600">{actionData.errors.about}</em>
        ) : null}
        <div>in the style of</div>
        <PersonalitySelect
          personality={personality}
          setPersonality={setPersonality}
        />
        {actionData?.errors?.personality ? (
          <em className="text-red-600">{actionData.errors.personality}</em>
        ) : null}
        <input type="hidden" name="contentType" value={contentType ?? ""} />
        <input type="hidden" name="personality" value={personality ?? ""} />
        <button
          className="px-8 py-2 mt-4 text-white rounded-lg bg-ghost-green md:mt-0"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Loading..." : "GO!"}
        </button>
      </Form>
      {actionData?.data ? (
        <div className="mt-4 whitespace-pre-line">{actionData.data.trim()}</div>
      ) : null}
    </ResponsiveContainer>
  );
}
