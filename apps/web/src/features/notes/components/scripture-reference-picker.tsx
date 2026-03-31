"use client";

import { useEffect, useMemo, useState } from "react";
import type { BibleVersion, ScriptureBookSummary, ScriptureChapter } from "@harness/shared";
import { mapApiErrorToUserMessage } from "../../../lib/error-handler";
import { scriptureService } from "../../scripture/services/scripture-service";

interface ScriptureReferencePickerProps {
  initialReference: string;
  onInsert: (payload: {
    reference: string;
    verses: Array<{
      verseNumber: number;
      text: string;
    }>;
  }) => void;
  onClose: () => void;
}

const getInitialChapterFromReference = (reference: string) => {
  const match = reference.match(/(\d+):/);
  return match ? Number(match[1]) : 1;
};

export const ScriptureReferencePicker = ({
  initialReference,
  onInsert,
  onClose
}: ScriptureReferencePickerProps) => {
  const [versions, setVersions] = useState<BibleVersion[]>([]);
  const [books, setBooks] = useState<ScriptureBookSummary[]>([]);
  const [chapterData, setChapterData] = useState<ScriptureChapter | null>(null);
  const [versionId, setVersionId] = useState("");
  const [bookId, setBookId] = useState("joshua");
  const [chapterNumber, setChapterNumber] = useState(getInitialChapterFromReference(initialReference));
  const [startVerse, setStartVerse] = useState(1);
  const [endVerse, setEndVerse] = useState(1);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const loadVersions = async () => {
      try {
        const response = await scriptureService.getVersions();

        if (!isActive) {
          return;
        }

        setVersions(response);
        setVersionId(response.find((version) => version.isDefault)?.id ?? response[0]?.id ?? "");
      } catch (error) {
        if (isActive) {
          setErrorMessage(mapApiErrorToUserMessage(error).message);
        }
      }
    };

    void loadVersions();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (!versionId) {
      return;
    }

    let isActive = true;

    const loadBooks = async () => {
      try {
        const response = await scriptureService.getBooks(versionId);

        if (!isActive) {
          return;
        }

        setBooks(response);
        setBookId((current) => {
          if (response.some((book) => book.id === current)) {
            return current;
          }

          return response[0]?.id ?? "";
        });
      } catch (error) {
        if (isActive) {
          setErrorMessage(mapApiErrorToUserMessage(error).message);
        }
      }
    };

    void loadBooks();

    return () => {
      isActive = false;
    };
  }, [versionId]);

  useEffect(() => {
    if (!versionId || !bookId || !chapterNumber) {
      return;
    }

    let isActive = true;

    const loadChapter = async () => {
      try {
        const response = await scriptureService.getChapter({
          versionId,
          bookId,
          chapter: chapterNumber
        });

        if (!isActive) {
          return;
        }

        setChapterData(response);
        const firstVerse = response.verses[0]?.verseNumber ?? 1;
        setStartVerse(firstVerse);
        setEndVerse(firstVerse);
        setErrorMessage(null);
      } catch (error) {
        if (isActive) {
          setErrorMessage(mapApiErrorToUserMessage(error).message);
          setChapterData(null);
        }
      }
    };

    void loadChapter();

    return () => {
      isActive = false;
    };
  }, [versionId, bookId, chapterNumber]);

  const verseOptions = chapterData?.verses ?? [];

  useEffect(() => {
    if (endVerse < startVerse) {
      setEndVerse(startVerse);
    }
  }, [startVerse, endVerse]);

  const selectedVerses = useMemo(() => {
    return verseOptions.filter(
      (verse) => verse.verseNumber >= startVerse && verse.verseNumber <= endVerse
    );
  }, [endVerse, startVerse, verseOptions]);

  const activeBook = books.find((book) => book.id === bookId);
  const referenceLabel =
    activeBook && chapterData
      ? `${activeBook.name} ${chapterData.chapterNumber}:${startVerse}${endVerse > startVerse ? `-${endVerse}` : ""}`
      : initialReference;

  const chapterOptions = activeBook
    ? Array.from({ length: activeBook.chapterCount }, (_, index) => index + 1)
    : [];

  return (
    <aside className="note-sidebar" aria-label="말씀 찾기 패널">
      <div className="note-sidebar__header">
        <strong>@ 말씀 찾기</strong>
        <button className="note-sidebar__close" type="button" onClick={onClose}>
          닫기
        </button>
      </div>

      <div className="note-sidebar__section">
        <p className="note-sidebar__label">번역본</p>
        <select value={versionId} onChange={(event) => setVersionId(event.target.value)}>
          {versions.map((version) => (
            <option key={version.id} value={version.id}>
              {version.name}
            </option>
          ))}
        </select>
      </div>

      <div className="note-sidebar__section">
        <p className="note-sidebar__label">책</p>
        <select value={bookId} onChange={(event) => setBookId(event.target.value)}>
          {books.map((book) => (
            <option key={book.id} value={book.id}>
              {book.name}
            </option>
          ))}
        </select>
      </div>

      <div className="note-sidebar__section note-sidebar__range-grid">
        <label>
          <span>장</span>
          <select
            value={chapterNumber}
            onChange={(event) => setChapterNumber(Number(event.target.value))}
          >
            {chapterOptions.map((chapter) => (
              <option key={chapter} value={chapter}>
                {chapter}장
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>시작 절</span>
          <select value={startVerse} onChange={(event) => setStartVerse(Number(event.target.value))}>
            {verseOptions.map((verse) => (
              <option key={verse.verseNumber} value={verse.verseNumber}>
                {verse.verseNumber}절
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>끝 절</span>
          <select value={endVerse} onChange={(event) => setEndVerse(Number(event.target.value))}>
            {verseOptions
              .filter((verse) => verse.verseNumber >= startVerse)
              .map((verse) => (
                <option key={verse.verseNumber} value={verse.verseNumber}>
                  {verse.verseNumber}절
                </option>
              ))}
          </select>
        </label>
      </div>

      <div className="note-sidebar__section">
        <p className="note-sidebar__label">선택 본문</p>
        <strong className="note-sidebar__reference">{referenceLabel}</strong>
        {errorMessage ? (
          <p className="note-sidebar__error">{errorMessage}</p>
        ) : (
          <div className="note-sidebar__preview">
            {selectedVerses.map((verse) => (
              <p key={verse.verseNumber}>
                <span>{verse.verseNumber}</span>
                {verse.text}
              </p>
            ))}
          </div>
        )}
      </div>

      <button
        className="button-primary note-sidebar__submit"
        type="button"
        disabled={selectedVerses.length === 0}
        onClick={() =>
          onInsert({
            reference: referenceLabel,
            verses: selectedVerses.map((verse) => ({
              verseNumber: verse.verseNumber,
              text: verse.text
            }))
          })
        }
      >
        본문 넣기
      </button>
    </aside>
  );
};
