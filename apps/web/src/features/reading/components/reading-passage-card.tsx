import type { ReadingPassage, ReadingStepPreview } from "@harness/shared";

interface ReadingPassageCardProps {
  passage: ReadingPassage;
  reflectionQuestion: string;
  applicationSteps: ReadingStepPreview[];
}

export const ReadingPassageCard = ({
  passage,
  reflectionQuestion,
  applicationSteps
}: ReadingPassageCardProps) => {
  return (
    <article className="reading-passage-card" id="today-passage">
      <div className="reading-content-stack">
        <section className="reading-content-section" aria-labelledby="reading-section-scripture">
          <div className="reading-content-section__header reading-content-section__header--with-reference">
            <h3 id="reading-section-scripture">말씀</h3>
            <span className="reading-content-section__reference">{passage.reference}</span>
          </div>
          <div className="reading-verse-list">
            {passage.verses.map((verse) => (
              <p key={`${verse.chapterNumber}-${verse.verseNumber}`} className="reading-verse">
                <span>{verse.verseNumber}</span>
                {verse.text}
              </p>
            ))}
          </div>
        </section>

        <section className="reading-content-section" aria-labelledby="reading-section-background">
          <div className="reading-content-section__header">
            <h3 id="reading-section-background">성경적 배경</h3>
          </div>
          <p className="reading-content-section__body">{passage.companionNote}</p>
        </section>

        <section className="reading-content-section" aria-labelledby="reading-section-application">
          <div className="reading-content-section__header">
            <h3 id="reading-section-application">적용</h3>
          </div>
          <div className="reading-application-list">
            <p>{reflectionQuestion}</p>
            {applicationSteps.map((step) => (
              <p key={step.title}>{step.description}</p>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
};
