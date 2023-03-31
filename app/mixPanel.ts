import mixpanel from "mixpanel-browser";
mixpanel.init("61699a5cbb2877d74cf3e1c3d90d8e9e");

let env_check = process.env.NODE_ENV === "production";

let actions = {
  track: (name: string, props: any) => {
    if (env_check) mixpanel.track(name, props);
  },
};

export let Mixpanel = actions;
