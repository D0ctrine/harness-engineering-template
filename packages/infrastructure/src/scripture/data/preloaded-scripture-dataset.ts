import type {
  BibleVersion,
  Book,
  Chapter,
  CommunityPreview,
  ReadingHome,
  ReadingNoteReference,
  ReadingNoteWorkspace,
  ReflectionHome,
  ReflectionQuestion,
  SavedReadingNote,
  Verse
} from "@harness/domain";

const defaultVersion: BibleVersion = {
  id: "qt-kor",
  name: "오늘의 본문",
  languageCode: "ko",
  isDefault: true
};

const joshua: Book = {
  id: "joshua",
  name: "여호수아",
  testament: "old",
  order: 6
};

const chapterOne: Chapter = {
  bookId: joshua.id,
  chapterNumber: 1
};

const verses: Verse[] = [
  {
    versionId: defaultVersion.id,
    bookId: joshua.id,
    bookName: joshua.name,
    chapterNumber: chapterOne.chapterNumber,
    verseNumber: 1,
    text:
      "여호와의 종 모세가 죽은 후에 여호와께서 모세의 수종자 눈의 아들 여호수아에게 말씀하여 이르시되"
  },
  {
    versionId: defaultVersion.id,
    bookId: joshua.id,
    bookName: joshua.name,
    chapterNumber: chapterOne.chapterNumber,
    verseNumber: 2,
    text:
      "내 종 모세가 죽었으니 이제 너는 이 모든 백성과 더불어 일어나 이 요단을 건너 내가 그들 곧 이스라엘 자손에게 주는 그 땅으로 가라"
  },
  {
    versionId: defaultVersion.id,
    bookId: joshua.id,
    bookName: joshua.name,
    chapterNumber: chapterOne.chapterNumber,
    verseNumber: 3,
    text:
      "내가 모세에게 말한 바와 같이 너희 발바닥으로 밟는 곳은 모두 내가 너희에게 주었노니"
  },
  {
    versionId: defaultVersion.id,
    bookId: joshua.id,
    bookName: joshua.name,
    chapterNumber: chapterOne.chapterNumber,
    verseNumber: 4,
    text:
      "곧 광야와 이 레바논에서부터 큰 강 곧 유브라데 강까지 헷 족속의 온 땅과 또 해 지는 쪽 대해까지 너희의 영토가 되리라"
  },
  {
    versionId: defaultVersion.id,
    bookId: joshua.id,
    bookName: joshua.name,
    chapterNumber: chapterOne.chapterNumber,
    verseNumber: 5,
    text:
      "네 평생에 너를 능히 대적할 자가 없으리니 내가 모세와 함께 있었던 것 같이 너와 함께 있을 것임이니라 내가 너를 떠나지 아니하며 버리지 아니하리니"
  },
  {
    versionId: defaultVersion.id,
    bookId: joshua.id,
    bookName: joshua.name,
    chapterNumber: chapterOne.chapterNumber,
    verseNumber: 6,
    text:
      "강하고 담대하라 너는 내가 그들의 조상에게 맹세하여 그들에게 주리라 한 땅을 이 백성에게 차지하게 하리라"
  },
  {
    versionId: defaultVersion.id,
    bookId: joshua.id,
    bookName: joshua.name,
    chapterNumber: chapterOne.chapterNumber,
    verseNumber: 7,
    text:
      "오직 강하고 극히 담대하여 나의 종 모세가 네게 명령한 그 율법을 다 지켜 행하고 우로나 좌로나 치우치지 말라 그리하면 어디로 가든지 형통하리니"
  },
  {
    versionId: defaultVersion.id,
    bookId: joshua.id,
    bookName: joshua.name,
    chapterNumber: chapterOne.chapterNumber,
    verseNumber: 8,
    text:
      "이 율법책을 네 입에서 떠나지 말게 하며 주야로 그것을 묵상하여 그 안에 기록된 대로 다 지켜 행하라 그리하면 네 길이 평탄하게 될 것이며 네가 형통하리라"
  }
];

export const readingNoteReference: ReadingNoteReference = {
  readingPlanId: "qt-joshua-1-1-8-meditation",
  passageReference: "여호수아 1:1-8"
};

export const reflectionQuestion: ReflectionQuestion = {
  id: "rq-joshua-1-1-8-meditation",
  readingPlanId: readingNoteReference.readingPlanId,
  prompt: "오늘 내 삶에서 말씀을 가까이 두어야 할 자리는 어디인가요?"
};

const savedReadingNote: SavedReadingNote = {
  id: "note-joshua-1-1-8-meditation",
  reference: readingNoteReference,
  body:
    "",
  updatedAt: "2026-03-28T06:00:00.000Z"
};

export const preloadedReadingHome: ReadingHome = {
  planId: readingNoteReference.readingPlanId,
  title: "오늘의 말씀",
  summary: "여호수아 1장 1절부터 8절까지 차분히 읽고 오늘의 묵상을 정리해 보세요.",
  theme: "매일 말씀을 가까이 두는 삶",
  passage: {
    reference: readingNoteReference.passageReference,
    version: defaultVersion,
    verses,
    companionNote:
      "한 번에 많이 읽기보다 한 구절을 오래 붙드는 흐름으로 읽어 보세요. 입술과 마음, 하루의 선택 안에 말씀이 머무는 모습을 떠올리면 좋습니다."
  },
  reflectionQuestion: reflectionQuestion.prompt,
  nextSteps: [
    {
      title: "메모 남기기",
      description: "오른쪽 노트에 오늘 오래 남은 문장과 마음의 반응을 적어 보세요."
    },
    {
      title: "묵상 질문에 답하기",
      description: "말씀을 가까이 두는 삶이 오늘 어디에서 필요했는지 정리해 보세요."
    }
  ]
};

export const preloadedReadingNoteWorkspace: ReadingNoteWorkspace = {
  title: "묵상 노트",
  summary: "본문을 읽는 동안 떠오른 문장과 기도를 바로 적을 수 있는 작업 공간입니다.",
  placeholder: "",
  savedNote: savedReadingNote
};

export const preloadedReflectionHome: ReflectionHome = {
  title: "묵상 질문",
  summary: "나눔으로 넘어가기 전에 한 번 더 멈춰 마음을 정리해 보세요.",
  question: reflectionQuestion,
  answerPlaceholder: "오늘의 질문에 대한 짧은 개인 응답을 적어 보세요.",
  answerPreview:
    "오늘은 분주함 속에서 말씀을 가까이 두는 태도가 필요합니다. 빨리 끝내려는 마음보다, 한 구절을 천천히 붙드는 연습이 먼저여야 합니다."
};

export const preloadedCommunityPreview: CommunityPreview = {
  title: "그룹 나눔 미리보기",
  summary: "나눔은 선택이지만, 오늘의 묵상을 안전한 공동체 안으로 자연스럽게 가져갈 수 있어야 합니다.",
  group: {
    id: "group-daily-light",
    name: "데일리 라이트 룸",
    description: "짧은 일상 QT 묵상을 나누는 비공개 공간입니다.",
    visibility: "private"
  },
  membership: {
    groupId: "group-daily-light",
    userId: "user-demo",
    role: "member"
  },
  posts: [
    {
      id: "post-001",
      authorName: "민아",
      title: "여호수아 1장 1절부터 8절을 붙들고 하루를 시작한 메모",
      body:
        "말씀을 많이 읽는 것보다 가까이 두는 삶이 먼저라는 점이 크게 남았어요. 오늘은 일정표보다 말씀 한 구절을 먼저 펼치고 시작해 보려고 합니다.",
      imageHint: "첨부된 이미지는 없습니다.",
      createdAt: "2026-03-28T05:10:00.000Z",
      comments: [
        {
          id: "comment-001",
          authorName: "다니엘",
          body: "저도 오늘은 속도를 줄이고 말씀을 먼저 가까이 두는 연습이 필요하다고 느꼈어요.",
          createdAt: "2026-03-28T05:30:00.000Z"
        }
      ]
    },
    {
      id: "post-002",
      authorName: "은혜",
      title: "밤낮으로 묵상한다는 말이 오늘 더 현실적으로 들렸어요",
      body:
        "짧은 구절인데도 하루의 기준을 다시 세워 줬어요. 자꾸 흩어지는 마음을 말씀으로 붙드는 것이 실제 순종이라는 생각이 들었습니다.",
      createdAt: "2026-03-28T05:45:00.000Z",
      comments: []
    }
  ]
};
