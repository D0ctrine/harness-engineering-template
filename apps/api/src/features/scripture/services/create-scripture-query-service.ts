import type { ApiRuntimeConfig } from "@harness/shared";
import {
  createGetScriptureBooksUseCase,
  createGetScriptureChapterUseCase,
  createGetScriptureVersionsUseCase
} from "@harness/application";
import { createStaticAssetScriptureRepository } from "@harness/infrastructure";
import type { ApiBindings, AssetBinding } from "../../../config/env";

export class ScriptureServiceError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ScriptureServiceError";
    this.status = status;
  }
}

const normalizeBookId = (value: string) => value.trim().toLowerCase();

const isLocalDevelopmentOrigin = (value: string) => {
  try {
    const url = new URL(value);
    return ["localhost", "127.0.0.1"].includes(url.hostname);
  } catch {
    return false;
  }
};

const resolveRequestAssetBaseUrl = (request: Request) => {
  const origin = request.headers.get("origin");

  if (origin && isLocalDevelopmentOrigin(origin)) {
    return `${origin.replace(/\/+$/, "")}/scripture`;
  }

  const referer = request.headers.get("referer");

  if (!referer) {
    return null;
  }

  try {
    const url = new URL(referer);

    if (isLocalDevelopmentOrigin(url.origin)) {
      return `${url.origin.replace(/\/+$/, "")}/scripture`;
    }
  } catch {
    return null;
  }

  return null;
};

const resolveAssetBaseUrl = (
  bindings: ApiBindings,
  config: ApiRuntimeConfig,
  request?: Request
) => {
  const configured =
    typeof bindings.SCRIPTURE_ASSET_BASE_URL === "string"
      ? bindings.SCRIPTURE_ASSET_BASE_URL.trim()
      : undefined;

  if (configured) {
    return configured.replace(/\/+$/, "");
  }

  const requestAssetBaseUrl = request ? resolveRequestAssetBaseUrl(request) : null;

  if (requestAssetBaseUrl) {
    return requestAssetBaseUrl;
  }

  return config.scriptureAssetBaseUrl.replace(/\/+$/, "");
};

const repositoryCache = new Map<string, ReturnType<typeof createStaticAssetScriptureRepository>>();

const createAssetsBindingFetcher = (assets: AssetBinding): typeof fetch => {
  return (input, init) => {
    return assets.fetch(input, init);
  };
};

const getRepository = (bindings: ApiBindings, config: ApiRuntimeConfig, request?: Request) => {
  const assetsBinding = bindings.ASSETS;

  if (assetsBinding) {
    const cacheKey = "assets-binding";
    const cached = repositoryCache.get(cacheKey);

    if (cached) {
      return cached;
    }

    const repository = createStaticAssetScriptureRepository({
      baseUrl: "https://assets.local/scripture",
      fetcher: createAssetsBindingFetcher(assetsBinding)
    });

    repositoryCache.set(cacheKey, repository);
    return repository;
  }

  const baseUrl = resolveAssetBaseUrl(bindings, config, request);
  const cached = repositoryCache.get(`url:${baseUrl}`);

  if (cached) {
    return cached;
  }

  const repository = createStaticAssetScriptureRepository({ baseUrl });
  repositoryCache.set(`url:${baseUrl}`, repository);

  return repository;
};

export interface ScriptureQueryService {
  getVersions: () => Promise<Awaited<ReturnType<ReturnType<typeof createGetScriptureVersionsUseCase>["execute"]>>>;
  getBooks: (versionId: string | null) => Promise<Awaited<ReturnType<ReturnType<typeof createGetScriptureBooksUseCase>["execute"]>>>;
  getChapter: (params: {
    versionId: string | null;
    bookId: string | null;
    chapter: string | null;
  }) => Promise<Awaited<ReturnType<ReturnType<typeof createGetScriptureChapterUseCase>["execute"]>>>;
}

export const createScriptureQueryService = (
  bindings: ApiBindings,
  config: ApiRuntimeConfig,
  request?: Request
): ScriptureQueryService => {
  const repository = getRepository(bindings, config, request);
  const getVersionsUseCase = createGetScriptureVersionsUseCase(repository);
  const getBooksUseCase = createGetScriptureBooksUseCase(repository);
  const getChapterUseCase = createGetScriptureChapterUseCase(repository);

  return {
    getVersions: () => getVersionsUseCase.execute(),
    getBooks: async (versionId) => {
      if (!versionId || versionId.trim().length === 0) {
        throw new ScriptureServiceError(400, "Missing required query parameter: versionId");
      }

      try {
        return await getBooksUseCase.execute(versionId.trim());
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to load scripture books";
        const status = message.startsWith("Unknown scripture version") ? 404 : 500;
        throw new ScriptureServiceError(status, message);
      }
    },
    getChapter: async ({ versionId, bookId, chapter }) => {
      if (!versionId || versionId.trim().length === 0) {
        throw new ScriptureServiceError(400, "Missing required query parameter: versionId");
      }

      if (!bookId || bookId.trim().length === 0) {
        throw new ScriptureServiceError(400, "Missing required query parameter: bookId");
      }

      if (!chapter || chapter.trim().length === 0) {
        throw new ScriptureServiceError(400, "Missing required query parameter: chapter");
      }

      const chapterNumber = Number(chapter);

      if (!Number.isInteger(chapterNumber) || chapterNumber < 1) {
        throw new ScriptureServiceError(400, "Invalid chapter number");
      }

      try {
        return await getChapterUseCase.execute({
          versionId: versionId.trim(),
          bookId: normalizeBookId(bookId),
          chapterNumber
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to load scripture chapter";
        const isNotFound =
          message.startsWith("Unknown scripture version") ||
          message.startsWith("Unknown scripture book") ||
          message.startsWith("Unknown scripture chapter");

        throw new ScriptureServiceError(isNotFound ? 404 : 500, message);
      }
    }
  };
};
