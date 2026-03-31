import { createGetReadingNoteWorkspaceUseCase } from "@harness/application";
import { createPreloadedReadingNoteWorkspaceRepository } from "@harness/infrastructure";
import type { RouteDefinition } from "../../http/router";
import { createGetReadingNoteWorkspaceHandler } from "./handlers/get-reading-note-workspace-handler";

const getReadingNoteWorkspaceHandler = createGetReadingNoteWorkspaceHandler(
  createGetReadingNoteWorkspaceUseCase(createPreloadedReadingNoteWorkspaceRepository())
);

export const notesRoutes: RouteDefinition[] = [
  {
    method: "GET",
    path: "/notes/workspace",
    handler: getReadingNoteWorkspaceHandler
  }
];
