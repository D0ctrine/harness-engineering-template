import type { RouteDefinition } from "../../http/router";
import { createGetScriptureBooksController } from "./controllers/get-scripture-books-controller";
import { createGetScriptureChapterController } from "./controllers/get-scripture-chapter-controller";
import { createGetScriptureVersionsController } from "./controllers/get-scripture-versions-controller";

export const scriptureRoutes: RouteDefinition[] = [
  {
    method: "GET",
    path: "/scripture/versions",
    handler: createGetScriptureVersionsController()
  },
  {
    method: "GET",
    path: "/scripture/books",
    handler: createGetScriptureBooksController()
  },
  {
    method: "GET",
    path: "/scripture/chapter",
    handler: createGetScriptureChapterController()
  }
];
