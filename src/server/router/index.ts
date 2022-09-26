// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { exampleRouter } from "./example";
import { protectedExampleRouter } from "./protected-example-router";
import { quizRouter } from "./quiz";
import { notitRouter } from "./notit";

export const appRouter = createRouter()
    .transformer(superjson)
    .merge("example.", exampleRouter)
    .merge("auth.", protectedExampleRouter)
    .merge("quiz.", quizRouter)
    .merge("notit.", notitRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
