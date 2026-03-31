const presetColors = ["#0f7668", "#c2410c", "#be185d", "#4338ca", "#4d7c0f"];
const presetEmojis = ["🙏", "✨", "📖", "🕊️", "🌿", "🔥", "🤍", "🙌", "☀️", "🌙"];

interface NoteCommandSidebarProps {
  customColor: string;
  onBold: () => void;
  onColorSelect: (color: string) => void;
  onCustomColorChange: (color: string) => void;
  onEmojiInsert: (emoji: string) => void;
  onClose: () => void;
}

export const NoteCommandSidebar = ({
  customColor,
  onBold,
  onColorSelect,
  onCustomColorChange,
  onEmojiInsert,
  onClose
}: NoteCommandSidebarProps) => {
  return (
    <aside className="note-sidebar" aria-label="노트 명령 패널">
      <div className="note-sidebar__header">
        <strong>/ 서식</strong>
        <button className="note-sidebar__close" type="button" onClick={onClose}>
          닫기
        </button>
      </div>

      <div className="note-sidebar__section">
        <p className="note-sidebar__label">텍스트</p>
        <button className="note-sidebar__action" type="button" onClick={onBold}>
          굵게 처리
        </button>
      </div>

      <div className="note-sidebar__section">
        <p className="note-sidebar__label">색상</p>
        <div className="note-sidebar__color-grid">
          {presetColors.map((color) => (
            <button
              key={color}
              className="note-sidebar__color"
              type="button"
              style={{ backgroundColor: color }}
              onClick={() => onColorSelect(color)}
              aria-label={`색상 ${color}`}
            />
          ))}
        </div>
        <label className="note-sidebar__custom-color">
          <span>기타</span>
          <input
            type="color"
            value={customColor}
            onChange={(event) => onCustomColorChange(event.target.value)}
            onInput={(event) => onColorSelect((event.target as HTMLInputElement).value)}
          />
        </label>
      </div>

      <div className="note-sidebar__section">
        <p className="note-sidebar__label">이모티콘</p>
        <div className="note-sidebar__emoji-grid">
          {presetEmojis.map((emoji) => (
            <button
              key={emoji}
              className="note-sidebar__emoji"
              type="button"
              onClick={() => onEmojiInsert(emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};
