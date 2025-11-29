import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TurndownService from "turndown";
import apiClient from "../api";
import "./TipTapEditor.css";

// Convert incoming markdown -> HTML for editor (simple; rely on marked already in project)
import { marked } from "marked";

const turndown = new TurndownService({ headingStyle: "atx" });

/**
 * @param {{value: string, setValue: (val:string)=>void}} props
 * RichEditor: WYSIWYG (Tiptap) that stores markdown externally.
 */
export default function RichEditor({ value, setValue }) {
  const initialHTMLRef = useRef(null);
  const fileInputRef = useRef();
  if (initialHTMLRef.current === null) {
    try {
      initialHTMLRef.current = value ? marked.parse(value) : "";
    } catch {
      initialHTMLRef.current = value || "";
    }
  }

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image.configure({
        HTMLAttributes: {
          class:
            "rounded-xl max-h-96 object-cover my-4 ring-1 ring-gray-700/50",
        },
      }),
      Placeholder.configure({ placeholder: "Write your story..." }),
    ],
    content: initialHTMLRef.current,
    editorProps: {
      attributes: {
        class: "prose prose-gray max-w-none min-h-[320px] focus:outline-none text-gray-900",
      },
    },
    onUpdate({ editor }) {
      // Debounced by RAF minimal; immediate convert
      const html = editor.getHTML();
      const md = turndown.turndown(html);
      setValue(md);
    },
  });

  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, [editor]);

  if (!editor)
    return (
      <div className="w-full rounded-xl border border-gray-300/60 bg-gray-100/50 p-4 text-gray-600">
        Loading editor...
      </div>
    );

  const addImage = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await apiClient.post("/upload", formData);
      editor.chain().focus().setImage({ src: res.data.data.imageUrl }).run();
    } catch (e) {
      console.error("Image upload failed", e);
    }
  };

  const handlePaste = async (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        await addImage(file);
      }
    }
  };

  const triggerFile = () => fileInputRef.current?.click();

  const buttonBase =
    "px-2 py-1 text-xs md:text-sm rounded-lg font-medium transition-colors";
  const activeBtn = "bg-blue-500 text-white";
  const inactiveBtn = "bg-gray-200 text-gray-700 hover:bg-gray-300";

  const BarButton = (
    { cmd, isActive, label } // eslint-disable-line react/prop-types
  ) => (
    <button
      type="button"
      onClick={cmd}
      className={`${buttonBase} ${isActive ? activeBtn : inactiveBtn}`}
    >
      {label}
    </button>
  );

  return (
    <div
      onPaste={handlePaste}
      className="w-full rounded-xl border border-gray-300/60 bg-white/90 shadow-inner shadow-gray-300/30"
    >
      <div className="flex flex-wrap gap-1 border-b border-gray-300/60 p-2">
        <BarButton
          label="B"
          isActive={editor.isActive("bold")}
          cmd={() => editor.chain().focus().toggleBold().run()}
        />
        <BarButton
          label="I"
          isActive={editor.isActive("italic")}
          cmd={() => editor.chain().focus().toggleItalic().run()}
        />
        <BarButton
          label="H1"
          isActive={editor.isActive("heading", { level: 1 })}
          cmd={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        />
        <BarButton
          label=">"
          isActive={editor.isActive("blockquote")}
          cmd={() => editor.chain().focus().toggleBlockquote().run()}
        />
        <BarButton
          label="{ }"
          isActive={editor.isActive("codeBlock")}
          cmd={() => editor.chain().focus().toggleCodeBlock().run()}
        />
        <BarButton
          label="•"
          isActive={editor.isActive("bulletList")}
          cmd={() => editor.chain().focus().toggleBulletList().run()}
        />
        <BarButton
          label="1."
          isActive={editor.isActive("orderedList")}
          cmd={() => editor.chain().focus().toggleOrderedList().run()}
        />
        <button
          type="button"
          onClick={() => {
            const url = prompt("Enter URL");
            if (!url) return;
            editor.chain().focus().setLink({ href: url }).run();
          }}
          className={`${buttonBase} ${editor.isActive("link") ? activeBtn : inactiveBtn}`}
        >
          Link
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().unsetLink().run()}
          className={`${buttonBase} ${inactiveBtn}`}
        >
          Unlink
        </button>
        <button
          type="button"
          onClick={triggerFile}
          className={`${buttonBase} ${inactiveBtn}`}
        >
          Image
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          className={`${buttonBase} ${inactiveBtn}`}
        >
          Undo
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          className={`${buttonBase} ${inactiveBtn}`}
        >
          Redo
        </button>
      </div>
      <div className="p-4">
        <div className="min-h-[320px] text-gray-900">
          <EditorContent editor={editor} />
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => addImage(e.target.files?.[0])}
      />
    </div>
  );
}

RichEditor.propTypes = {
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
};
