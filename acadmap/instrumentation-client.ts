import * as Sentry from "@sentry/nextjs";

import { initSentry } from "@/lib/sentry-config";

initSentry();

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
