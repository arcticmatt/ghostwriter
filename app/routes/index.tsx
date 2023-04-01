import ResponsiveContainer from "~/components/containers/ResponsiveContainer";

import mixpanel from "mixpanel-browser";

import ContentTypeSelect from "~/components/select/ContentTypeSelect";
import { useEffect, useState } from "react";
import type { Maybe } from "~/types/UtilityTypes";
import PersonalitySelect from "~/components/select/PersonalitySelect";
import type { ActionFunction } from "@remix-run/node";
import { Form, useActionData, useTransition } from "@remix-run/react";
import getGeneratedContent from "~/api/getGeneratedContent";
import invariant from "tiny-invariant";
import squiggle from "../assets/images/squiggle.svg";
import Typewriter from "~/components/Typewriter";
import { Mixpanel, trackSubmission } from "~/mixPanel";

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
    contentType: contentType ? null : "Required",
    about: about ? null : "Required",
    personality: personality ? null : "Required",
  };
  const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
  if (hasErrors) {
    return { errors };
  }

  try {
    const response = await getGeneratedContent(contentType, about, personality);

    return { data: response };
  } catch (err) {
    return null;
  }
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const response = await submitFormAction(formData);

  return response;
};

export default function Index() {
  useEffect(() => {
    mixpanel.track("page_view", { page: "home_page" });
  }, []);
  const [contentType, setContentType] = useState<Maybe<string>>(null);
  const [personality, setPersonality] = useState<Maybe<string>>(null);
  const actionData = useActionData();

  const transition = useTransition();
  const isSubmitting = Boolean(transition.submission);

  return (
    <ResponsiveContainer className="p-8 md:p-12 ">
      <h3 className="text-center font-bakbak-one text-xl text-ghost-green">
        GHOSTWRITER
      </h3>
      <h1 className="mt-8 text-center font-bakbak-one text-4xl text-ghost-green ">
        Write a{" "}
        {
          <Typewriter
            cursorType="title"
            options={["poem", "haiku", "riddle", "song"]}
          />
        }{" "}
        <br className="md:hidden" /> in seconds
      </h1>
      <div className="mt-8 flex w-full justify-center ">
        <p className="mr-2 text-center font-inter text-lg text-ghost-green">
          Select options or type your own.
        </p>
        <img src={squiggle} alt="squiggly line" className="mt-2 h-8" />
      </div>
      <div className="flex w-full justify-center">
        <div className="mt-6 inline-block rounded-3xl bg-white p-8">
          <Form
            className="flex flex-col items-center justify-center gap-y-2 md:flex-row"
            method="post"
          >
            <p className="mr-4 whitespace-nowrap text-start text-lg text-ghost-green">
              Write a
            </p>
            <ContentTypeSelect
              hasError={!!actionData?.errors?.contentType}
              contentType={contentType}
              setContentType={setContentType}
            />
            <p className="mx-4 whitespace-nowrap text-lg text-ghost-green">
              about
            </p>
            <input
              className={`focus:ring-3 h-9 w-full rounded-lg border border-solid px-2 focus:ring-ghost-green md:w-40 ${
                actionData?.errors?.about
                  ? "border-red-500"
                  : "border-ghost-green"
              }`}
              type="text"
              id="about"
              name="about"
            />
            <p className="mx-4 whitespace-nowrap text-lg text-ghost-green">
              in the style of
            </p>
            <PersonalitySelect
              hasError={!!actionData?.errors?.personality}
              personality={personality}
              setPersonality={setPersonality}
            />
            <input type="hidden" name="contentType" value={contentType ?? ""} />
            <input type="hidden" name="personality" value={personality ?? ""} />
            <button
              className="mt-4 w-48 rounded-lg bg-ghost-green px-8 py-2 text-white md:ml-8 md:mt-0"
              type="submit"
              disabled={isSubmitting}
              onClick={() =>
                trackSubmission({
                  contentType,
                  personality,
                })
              }
            >
              {isSubmitting ? (
                <Typewriter
                  cursorType="loading"
                  options={[
                    "Loading...",
                    "Considering the prompt...",
                    "Embodying the character...",
                    "Writing it out...",
                    "Almost there...",
                    "It's worth the wait...",
                    "Still thinking...",
                    "We're close, I promise...",
                    "This is way too long...",
                    "I give up...not really...",
                    "Seriously?! Still!?",
                    "I'm not even trying anymore...",
                  ]}
                />
              ) : (
                "GO!"
              )}
            </button>
          </Form>
          {actionData?.data ? (
            <div className="mt-12 whitespace-pre-line">
              {actionData.data.trim()}
            </div>
          ) : null}
        </div>
      </div>
    </ResponsiveContainer>
  );
}
