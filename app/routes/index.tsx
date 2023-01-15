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
import Typewriter from "~/components/Typewriter";

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
    <ResponsiveContainer className="p-8 sm:p-12">
      <h3 className="text-center font-bakbak-one text-xl text-ghost-green">
        GHOSTWRITER
      </h3>
      <h1 className="mt-8 text-center font-bakbak-one text-4xl text-ghost-green">
        Write a {<Typewriter />} in seconds
      </h1>
      <div className="mt-8 flex w-full justify-center">
        <p className="text-md mr-2 text-center font-inter text-ghost-green">
          Try it out
        </p>
        <img src={squiggle} alt="squiggly line" className="mt-2 h-8" />
      </div>
      <div className="mt-6 rounded-3xl bg-white p-8">
        <Form
          className="flex flex-col items-start items-center justify-center gap-y-2 md:flex-row"
          method="post"
        >
          <p className="mr-4 whitespace-nowrap text-ghost-green">Write a</p>
          <ContentTypeSelect
            contentType={contentType}
            setContentType={setContentType}
          />
          {actionData?.errors?.contentType ? (
            <em className="text-red-600">{actionData.errors.contentType}</em>
          ) : null}
          <p className="mx-4 whitespace-nowrap text-ghost-green">about</p>
          <input
            className="h-8 w-40 rounded-lg border border-solid border-ghost-green p-2"
            type="text"
            id="about"
            name="about"
          />
          {actionData?.errors?.about ? (
            <em className="text-red-600">{actionData.errors.about}</em>
          ) : null}
          <p className="mx-4 whitespace-nowrap text-ghost-green">
            in the style of
          </p>
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
            className="mt-4 w-36 rounded-lg bg-ghost-green px-8 py-2 text-white md:ml-8 md:mt-0"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Loading" : "GO!"}
          </button>
        </Form>
        {actionData?.data ? (
          <div className="mt-12 whitespace-pre-line">
            {actionData.data.trim()}
          </div>
        ) : null}
      </div>
    </ResponsiveContainer>
  );
}
