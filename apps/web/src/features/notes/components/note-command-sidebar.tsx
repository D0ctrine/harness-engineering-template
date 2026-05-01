import { useEffect, useState } from "react";

const presetColors = [
  "#111827",
  "#6b7280",
  "#dc2626",
  "#f97316",
  "#eab308",
  "#16a34a",
  "#0f766e",
  "#0891b2",
  "#2563eb",
  "#7c3aed",
  "#db2777",
  "#be123c"
];
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
  const [isCustomColorOpen, setIsCustomColorOpen] = useState(false);
  const [pendingCustomColor, setPendingCustomColor] = useState(customColor);

  useEffect(() => {
    if (isCustomColorOpen) {
      setPendingCustomColor(customColor);
    }
  }, [customColor, isCustomColorOpen]);

  const handleCustomColorConfirm = () => {
    onCustomColorChange(pendingCustomColor);
    onColorSelect(pendingCustomColor);
  };

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
        <div className="note-sidebar__custom-color">
          <button
            className="note-sidebar__custom-color-trigger"
            type="button"
            onClick={() => setIsCustomColorOpen((isOpen) => !isOpen)}
          >
            기타
          </button>
          <span
            className="note-sidebar__custom-color-preview"
            style={{ backgroundColor: pendingCustomColor }}
            aria-hidden="true"
          />
        </div>
        {isCustomColorOpen ? (
          <div className="note-sidebar__custom-color-popover">
            <label className="note-sidebar__custom-color-picker">
              <span>직접 선택</span>
              <input
                type="color"
                value={pendingCustomColor}
                onChange={(event) => setPendingCustomColor(event.target.value)}
              />
            </label>
            <div className="note-sidebar__custom-color-actions">
              <button
                className="note-sidebar__mini-button"
                type="button"
                onClick={() => setIsCustomColorOpen(false)}
              >
                취소
              </button>
              <button
                className="note-sidebar__mini-button note-sidebar__mini-button--primary"
                type="button"
                onClick={handleCustomColorConfirm}
              >
                확인
              </button>
            </div>
          </div>
        ) : null}
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
