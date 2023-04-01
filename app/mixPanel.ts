import mixpanel from "mixpanel-browser";

const IS_DEBUG_MODE = process.env.NODE_ENV !== "production";

mixpanel.init("61699a5cbb2877d74cf3e1c3d90d8e9e", {
  debug: IS_DEBUG_MODE,
});

let actions = {
  track: (name: string, props: any) => {
    mixpanel.track(name, props);
  },
};

export function trackSubmission(props: any) {
  actions.track("Successful submission", props);
}

export let Mixpanel = actions;
