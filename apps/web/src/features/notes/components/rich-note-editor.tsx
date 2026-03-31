"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  type MouseEvent,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent
} from "react";
import {
  applyBoldAtSelection,
  applyColorAtSelection,
  buildInitialEditorHtml,
  buildScriptureEmbedHtml,
  clearColorAtSelection,
  type EditorFormattingState,
  insertHtmlAtSelection,
  insertTextAtSelection,
  restoreEditorSelection,
  saveEditorSelection
} from "../lib/editor-commands";
import { NoteCommandSidebar } from "./note-command-sidebar";
import { ScriptureReferencePicker } from "./scripture-reference-picker";

type EditorPanel = "none" | "slash" | "scripture";

interface PopoverPosition {
  top: number;
  left: number;
}

interface RichNoteEditorProps {
  initialBody: string;
  placeholder: string;
  onFormattingStateChange?: (state: EditorFormattingState) => void;
}

export interface RichNoteEditorHandle {
  clearBold: () => void;
  clearColor: () => void;
}

const PANEL_WIDTH = 304;
const DEFAULT_PANEL_POSITION: PopoverPosition = {
  top: 18,
  left: 18
};

const clamp = (value: number, minimum: number, maximum: number) => {
  return Math.min(Math.max(value, minimum), maximum);
};

export const RichNoteEditor = forwardRef<RichNoteEditorHandle, RichNoteEditorProps>(
  function RichNoteEditor({ initialBody, placeholder, onFormattingStateChange }, ref) {
  const layoutRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const selectionRef = useRef<Range | null>(null);
  const formattingStateRef = useRef<EditorFormattingState>({ isBold: false, color: null });
  const hasInitializedRef = useRef(false);
  const [activePanel, setActivePanel] = useState<EditorPanel>("none");
  const [panelPosition, setPanelPosition] = useState<PopoverPosition>(DEFAULT_PANEL_POSITION);
  const [customColor, setCustomColor] = useState("#0f7668");

  useEffect(() => {
    if (!editorRef.current || hasInitializedRef.current) {
      return;
    }

    editorRef.current.innerHTML = buildInitialEditorHtml(initialBody);
    hasInitializedRef.current = true;
  }, [initialBody]);

  const emitFormattingState = (state: EditorFormattingState) => {
    formattingStateRef.current = state;
    onFormattingStateChange?.(state);
  };

  const rememberSelection = () => {
    selectionRef.current = saveEditorSelection(editorRef.current);
  };

  const focusEditor = () => {
    editorRef.current?.focus();
  };

  const updatePanelPosition = () => {
    const layoutElement = layoutRef.current;
    const sheetElement = sheetRef.current;
    const range = selectionRef.current;

    if (!layoutElement || !sheetElement || !range) {
      setPanelPosition(DEFAULT_PANEL_POSITION);
      return;
    }

    const layoutRect = layoutElement.getBoundingClientRect();
    const rects = Array.from(range.getClientRects());
    const anchorRect =
      rects.at(-1) ??
      (() => {
        const rangeRect = range.getBoundingClientRect();

        if (rangeRect.width > 0 || rangeRect.height > 0) {
          return rangeRect;
        }

        const anchorNode =
          range.startContainer.nodeType === Node.ELEMENT_NODE
            ? (range.startContainer as Element)
            : range.startContainer.parentElement;

        return anchorNode?.getBoundingClientRect() ?? null;
      })();

    if (!anchorRect) {
      setPanelPosition(DEFAULT_PANEL_POSITION);
      return;
    }

    const top = clamp(
      anchorRect.bottom - layoutRect.top + 12,
      14,
      Math.max(14, layoutRect.height - 120)
    );
    const left = clamp(
      anchorRect.left - layoutRect.left - 10,
      14,
      Math.max(14, layoutRect.width - PANEL_WIDTH - 14)
    );

    setPanelPosition({ top, left });
  };

  const runEditorCommand = (callback: () => void) => {
    focusEditor();
    restoreEditorSelection(selectionRef.current);
    callback();
    rememberSelection();
  };

  const closePanel = () => {
    setActivePanel("none");
    focusEditor();
  };

  const openPanel = (panel: Exclude<EditorPanel, "none">) => {
    rememberSelection();
    updatePanelPosition();
    setActivePanel(panel);
  };

  const handleBoldCommand = () => {
    const nextIsBold = !formattingStateRef.current.isBold;
    runEditorCommand(() => applyBoldAtSelection());
    emitFormattingState({ ...formattingStateRef.current, isBold: nextIsBold });
    closePanel();
  };

  const handleColorCommand = (color: string) => {
    runEditorCommand(() => applyColorAtSelection(color));
    emitFormattingState({ ...formattingStateRef.current, color });
    closePanel();
  };

  const handleEmojiCommand = (emoji: string) => {
    runEditorCommand(() => insertTextAtSelection(emoji));
    closePanel();
  };

  const moveCaretToEditorEnd = () => {
    const root = editorRef.current;

    if (!root) {
      return;
    }

    const range = document.createRange();
    range.selectNodeContents(root);
    range.collapse(false);

    const selection = window.getSelection();

    if (!selection) {
      return;
    }

    selection.removeAllRanges();
    selection.addRange(range);
    selectionRef.current = range.cloneRange();
  };

  const handleEmbeddedScriptureRemove = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target;

    if (!(target instanceof HTMLElement)) {
      return;
    }

    const removeTrigger = target.closest("[data-note-scripture-remove]");

    if (!removeTrigger) {
      return;
    }

    const root = editorRef.current;
    const embed = removeTrigger.closest("[data-note-scripture-embed]");

    if (!root || !embed) {
      return;
    }

    event.preventDefault();
    embed.remove();

    if (!root.textContent?.trim()) {
      root.innerHTML = "<p><br></p>";
    }

    focusEditor();
    moveCaretToEditorEnd();
  };

  const clearBold = () => {
    if (!formattingStateRef.current.isBold) {
      return;
    }

    runEditorCommand(() => applyBoldAtSelection());
    emitFormattingState({ ...formattingStateRef.current, isBold: false });
  };

  const clearColor = () => {
    if (!formattingStateRef.current.color) {
      return;
    }

    runEditorCommand(() => clearColorAtSelection());
    emitFormattingState({ ...formattingStateRef.current, color: null });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "/") {
      event.preventDefault();
      openPanel("slash");
      return;
    }

    if (event.key === "@") {
      event.preventDefault();
      openPanel("scripture");
      return;
    }

    if (event.key === "Escape") {
      setActivePanel("none");
    }
  };

  useEffect(() => {
    if (activePanel === "none") {
      return;
    }

    const handleViewportChange = () => {
      updatePanelPosition();
    };

    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);

    return () => {
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
    };
  }, [activePanel]);

  useEffect(() => {
    const handleSelectionChange = () => {
      const root = editorRef.current;

      if (!root) {
        return;
      }

      const selection = window.getSelection();

      if (!selection || selection.rangeCount === 0) {
        return;
      }

      const range = selection.getRangeAt(0);

      if (!root.contains(range.commonAncestorContainer)) {
        return;
      }

      selectionRef.current = range.cloneRange();
    };

    document.addEventListener("selectionchange", handleSelectionChange);

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, [onFormattingStateChange]);

  const popoverStyle: CSSProperties = {
    top: `${panelPosition.top}px`,
    left: `${panelPosition.left}px`
  };

  useImperativeHandle(
    ref,
    () => ({
      clearBold,
      clearColor
    }),
    []
  );

  return (
    <div ref={layoutRef} className="note-editor__layout">
      <div ref={sheetRef} className="note-editor__sheet">
        <div
          ref={editorRef}
          className="note-editor__content"
          contentEditable
          suppressContentEditableWarning
          data-placeholder={placeholder}
          onClick={handleEmbeddedScriptureRemove}
          onInput={rememberSelection}
          onKeyUp={rememberSelection}
          onMouseUp={rememberSelection}
          onFocus={rememberSelection}
          onKeyDown={handleKeyDown}
        />
      </div>

      {activePanel === "slash" ? (
        <div className="note-editor__popover" style={popoverStyle}>
          <NoteCommandSidebar
            customColor={customColor}
            onBold={handleBoldCommand}
            onColorSelect={handleColorCommand}
            onCustomColorChange={setCustomColor}
            onEmojiInsert={handleEmojiCommand}
            onClose={closePanel}
          />
        </div>
      ) : null}

      {activePanel === "scripture" ? (
        <div className="note-editor__popover" style={popoverStyle}>
          <ScriptureReferencePicker
            initialReference="여호수아 1:1-8"
            onInsert={(payload) => {
              runEditorCommand(() => insertHtmlAtSelection(buildScriptureEmbedHtml(payload)));
              setActivePanel("none");
            }}
            onClose={closePanel}
          />
        </div>
      ) : null}
    </div>
  );
});
