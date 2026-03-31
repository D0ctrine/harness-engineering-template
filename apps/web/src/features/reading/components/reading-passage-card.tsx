import type { ReadingPassage } from "@harness/shared";

interface ReadingPassageCardProps {
  passage: ReadingPassage;
}

export const ReadingPassageCard = ({ passage }: ReadingPassageCardProps) => {
  return (
    <article className="reading-passage-card" id="today-passage">
      <div className="reading-passage-card__header">
        <h2>{passage.reference}</h2>
        <span className="reading-version-pill">{passage.version.name}</span>
      </div>

      <div className="reading-verse-list">
        {passage.verses.map((verse) => (
          <p key={`${verse.chapterNumber}-${verse.verseNumber}`} className="reading-verse">
            <span>{verse.verseNumber}</span>
            {verse.text}
          </p>
        ))}
      </div>
    </article>
  );
};
