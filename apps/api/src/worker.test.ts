import assert from "node:assert/strict";
import test from "node:test";
import { handleApiRequest } from "./worker";

const bindings = {
  NODE_ENV: "test",
  LOG_LEVEL: "info",
  API_PORT: "4000",
  API_PREFIX: "/api",
  CORS_ORIGIN: "http://localhost:3000",
  SCRIPTURE_ASSET_BASE_URL: "https://scripture.test/scripture",
  DATABASE_URL: "postgres://postgres:postgres@localhost:5432/harness_template",
  JWT_SECRET: "test-secret"
};

test("GET /api/reading/home returns the reading home payload", async () => {
  const response = await handleApiRequest(
    new Request("http://localhost:4000/api/reading/home", { method: "GET" }),
    bindings
  );

  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.title, "오늘의 말씀");
  assert.equal(body.passage.reference, "여호수아 1:1-8");
  assert.equal(body.passage.verses.length, 8);
});

test("GET /api/reading/home allows local network origins during development", async () => {
  const origin = "http://192.168.0.28:3000";
  const response = await handleApiRequest(
    new Request("http://localhost:4000/api/reading/home", {
      method: "GET",
      headers: { Origin: origin }
    }),
    {
      ...bindings,
      NODE_ENV: "development"
    }
  );

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("Access-Control-Allow-Origin"), origin);
});

test("GET /api/health keeps the health route available", async () => {
  const response = await handleApiRequest(
    new Request("http://localhost:4000/api/health", { method: "GET" }),
    bindings
  );

  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.service, "harness-api");
});

test("GET /api/notes/workspace returns the note workspace payload", async () => {
  const response = await handleApiRequest(
    new Request("http://localhost:4000/api/notes/workspace", { method: "GET" }),
    bindings
  );

  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.title, "묵상 노트");
  assert.equal(body.savedNote.reference.passageReference, "여호수아 1:1-8");
});

test("GET /api/reflection/home returns the reflection payload", async () => {
  const response = await handleApiRequest(
    new Request("http://localhost:4000/api/reflection/home", { method: "GET" }),
    bindings
  );

  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.title, "묵상 질문");
  assert.equal(body.question.prompt, "오늘 내 삶에서 말씀을 가까이 두어야 할 자리는 어디인가요?");
});

test("GET /api/community/preview returns the community preview payload", async () => {
  const response = await handleApiRequest(
    new Request("http://localhost:4000/api/community/preview", { method: "GET" }),
    bindings
  );

  const body = await response.json();

  assert.equal(response.status, 200);
  assert.equal(body.group.name, "데일리 라이트 룸");
  assert.equal(body.posts.length, 2);
});

test("GET /api/scripture endpoints return scripture data from the service layer", async () => {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = (async (input) => {
    const url = String(input);

    if (url.endsWith("/index.json")) {
      return new Response(
        JSON.stringify({
          versions: [{ id: "kor-revised", name: "개역개정", languageCode: "ko", isDefault: true }],
          books: [{ id: "joshua", name: "여호수아", testament: "old", order: 6, chapterCount: 24 }]
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    if (url.endsWith("/books/kor-revised/joshua.json")) {
      return new Response(
        JSON.stringify({
          versionId: "kor-revised",
          book: { id: "joshua", name: "여호수아", testament: "old", order: 6, chapterCount: 24 },
          chapters: {
            "1": {
              chapterNumber: 1,
              heading: "가나안 입성을 준비함",
              verses: [{ verseNumber: 8, text: "이 율법책을 네 입에서 떠나지 말게 하며" }]
            }
          }
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ message: "Not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" }
    });
  }) as typeof fetch;

  try {
    const versionsResponse = await handleApiRequest(
      new Request("http://localhost:4000/api/scripture/versions", { method: "GET" }),
      bindings
    );
    const booksResponse = await handleApiRequest(
      new Request("http://localhost:4000/api/scripture/books?versionId=kor-revised", { method: "GET" }),
      bindings
    );
    const chapterResponse = await handleApiRequest(
      new Request(
        "http://localhost:4000/api/scripture/chapter?versionId=kor-revised&bookId=joshua&chapter=1",
        { method: "GET" }
      ),
      bindings
    );

    const versions = await versionsResponse.json();
    const books = await booksResponse.json();
    const chapter = await chapterResponse.json();

    assert.equal(versionsResponse.status, 200);
    assert.equal(versions[0].name, "개역개정");
    assert.equal(booksResponse.status, 200);
    assert.equal(books[0].id, "joshua");
    assert.equal(chapterResponse.status, 200);
    assert.equal(chapter.book.name, "여호수아");
    assert.equal(chapter.verses[0].verseNumber, 8);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("GET /api/scripture/versions prefers the Cloudflare ASSETS binding when available", async () => {
  const originalFetch = globalThis.fetch;
  let globalFetchCalled = false;

  globalThis.fetch = (async () => {
    globalFetchCalled = true;
    throw new Error("global fetch should not be used when ASSETS binding is available");
  }) as typeof fetch;

  const bindingFetchCalls: string[] = [];

  const response = await handleApiRequest(
    new Request("http://localhost:4000/api/scripture/versions", { method: "GET" }),
    {
      ...bindings,
      ASSETS: {
        fetch: async (input) => {
          bindingFetchCalls.push(String(input));

          return new Response(
            JSON.stringify({
              versions: [{ id: "kor-revised", name: "개역개정", languageCode: "ko", isDefault: true }],
              books: []
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" }
            }
          );
        }
      }
    }
  );

  const body = await response.json();

  globalThis.fetch = originalFetch;

  assert.equal(response.status, 200);
  assert.equal(globalFetchCalled, false);
  assert.equal(bindingFetchCalls.length, 1);
  assert.equal(bindingFetchCalls[0], "https://assets.local/scripture/index.json");
  assert.equal(body[0].name, "개역개정");
});

test("GET /api/scripture/versions uses the request origin for local scripture assets when no explicit asset base is set", async () => {
  const originalFetch = globalThis.fetch;
  const fetchCalls: string[] = [];

  globalThis.fetch = (async (input) => {
    const url = String(input);
    fetchCalls.push(url);

    return new Response(
      JSON.stringify({
        versions: [{ id: "kor-revised", name: "개역개정", languageCode: "ko", isDefault: true }],
        books: []
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  }) as typeof fetch;

  try {
    const response = await handleApiRequest(
      new Request("http://localhost:4000/api/scripture/versions", {
        method: "GET",
        headers: {
          Origin: "http://localhost:3002"
        }
      }),
      {
        ...bindings,
        SCRIPTURE_ASSET_BASE_URL: undefined
      }
    );

    const body = await response.json();

    assert.equal(response.status, 200);
    assert.equal(fetchCalls[0], "http://localhost:3002/scripture/index.json");
    assert.equal(body[0].name, "개역개정");
  } finally {
    globalThis.fetch = originalFetch;
  }
});
