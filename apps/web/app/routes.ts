import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route("sign-in", "routes/auth/sign-in.tsx"),
  route("sign-up", "routes/auth/sign-up.tsx"),
  route("/", "routes/app/layout.tsx", [
    index("routes/app/feed.tsx"),
    route("onboarding", "routes/app/onboarding.tsx"),
    route("u/:username", "routes/app/profile.tsx"),
    route("settings", "routes/app/settings.tsx"),
  ]),
] satisfies RouteConfig;
