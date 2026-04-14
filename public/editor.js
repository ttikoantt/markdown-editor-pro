// Markdown Editor Pro - MVP v2 Step 1
// Updated: 2026-04-14T21:06:25.508Z
if (document.getElementById("editor")) {
    class MarkdownEditor {
        constructor() {
            this.preview = document.getElementById("preview");
            this.saveStatus = document.getElementById("saveStatus");
            this.wordCount = document.getElementById("wordCount");
            this.init();
        }

        init() {
            try {
                this.setupToolbar();
                this.setupEditorEvents();
                this.setupButtonEvents();
                this.loadFromStorage();
                this.updatePreview();
                this.updateWordCount();
                console.log("Markdown Editor Pro initialized");
            } catch (e) {
                console.error("Init error:", e);
            }
        }

        setupToolbar() {
            document.querySelectorAll(".tool-btn").forEach(btn => {
                btn.addEventListener("click", () => {
                    const action = btn.dataset.action;
                    this.executeAction(action);
                });
            });
        }

        setupEditorEvents() {
            const editor = document.getElementById("editor");
            if (editor) {
                editor.addEventListener("input", () => {
                    this.updatePreview();
                    this.updateWordCount();
                    this.autoSave();
                });
            }
        }

        setupButtonEvents() {
            const saveBtn = document.getElementById("saveBtn");
            const clearBtn = document.getElementById("clearBtn");
            const downloadBtn = document.getElementById("downloadBtn");
            if (saveBtn) saveBtn.addEventListener("click", () => this.saveToStorage());
            if (clearBtn) clearBtn.addEventListener("click", () => this.clearEditor());
            if (downloadBtn) downloadBtn.addEventListener("click", () => this.downloadMarkdown());
        }

        executeAction(action) {
            try {
                const editor = document.getElementById("editor");
                if (!editor) return;
                
                switch (action) {
                    case "bold": this.wrapSelection(editor, "**", "**"); break;
                    case "italic": this.wrapSelection(editor, "*", "*"); break;
                    case "strike": this.wrapSelection(editor, "~~", "~~"); break;
                    case "code": this.wrapSelection(editor, "`", "`"); break;
                    case "heading": this.insertLine(editor, "## "); break;
                    case "bullet-list": this.insertLine(editor, "- "); break;
                    case "code-block": this.insertBlock(editor, "```\n", "\n```"); break;
                }
                this.updatePreview();
                this.autoSave();
            } catch (e) {
                console.error("Execute action error:", e);
            }
        }

        wrapSelection(editor, before, after) {
            const start = editor.selectionStart;
            const end = editor.selectionEnd;
            const text = editor.value;
            const selectedText = text.substring(start, end);
            const replacement = before + selectedText + after;
            editor.value = text.substring(0, start) + replacement + text.substring(end);
            editor.focus();
            editor.setSelectionRange(start + before.length, start + before.length + selectedText.length);
        }

        insertLine(editor, prefix) {
            const start = editor.selectionStart;
            const text = editor.value;
            const lineStart = text.lastIndexOf("\n", start - 1) + 1;
            editor.value = text.substring(0, lineStart) + prefix + text.substring(lineStart);
            editor.focus();
            editor.setSelectionRange(lineStart + prefix.length, lineStart + prefix.length);
        }

        insertBlock(editor, before, after) {
            const start = editor.selectionStart;
            const end = editor.selectionEnd;
            const text = editor.value;
            const selectedText = text.substring(start, end) || "";
            const replacement = before + selectedText + after;
            editor.value = text.substring(0, start) + replacement + text.substring(end);
            editor.focus();
        }

        updatePreview() {
            const editor = document.getElementById("editor");
            if (!editor || !this.preview) return;
            const markdown = editor.value;
            if (typeof marked !== "undefined") {
                try {
                    this.preview.innerHTML = marked.parse(markdown);
                } catch (e) {
                    this.preview.textContent = markdown;
                }
            } else {
                this.preview.textContent = markdown;
            }
        }

        updateWordCount() {
            const editor = document.getElementById("editor");
            if (!editor || !this.wordCount) return;
            const text = editor.value;
            const words = text.trim().split(/\s+/).filter(word => word.length > 0);
            this.wordCount.textContent = words.length + " words";
        }

        autoSave() {
            const editor = document.getElementById("editor");
            if (!editor || !this.saveStatus) return;
            try {
                localStorage.setItem("markdown-editor-pro-content", editor.value);
                this.saveStatus.textContent = "✅ Saved";
                setTimeout(() => { this.saveStatus.textContent = ""; }, 2000);
            } catch (e) {}
        }

        saveToStorage() {
            const editor = document.getElementById("editor");
            if (!editor || !this.saveStatus) return;
            try {
                localStorage.setItem("markdown-editor-pro-content", editor.value);
                this.saveStatus.textContent = "✅ Saved";
                setTimeout(() => { this.saveStatus.textContent = ""; }, 2000);
            } catch (e) {}
        }

        loadFromStorage() {
            try {
                const saved = localStorage.getItem("markdown-editor-pro-content");
                if (saved) {
                    const editor = document.getElementById("editor");
                    if (editor) editor.value = saved;
                }
            } catch (e) {}
        }

        clearEditor() {
            if (confirm("Are you sure?")) {
                const editor = document.getElementById("editor");
                if (editor) {
                    editor.value = "";
                    this.updatePreview();
                    this.updateWordCount();
                    this.saveToStorage();
                }
            }
        }

        downloadMarkdown() {
            const editor = document.getElementById("editor");
            if (!editor) return;
            try {
                const markdown = editor.value;
                const blob = new Blob([markdown], { type: "text/markdown" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "document.md";
                a.click();
                URL.revokeObjectURL(url);
            } catch (e) {
                console.error("Download error:", e);
            }
        }
    }

    document.addEventListener("DOMContentLoaded", () => {
        try {
            new MarkdownEditor();
        } catch (e) {
            console.error("Editor initialization error:", e);
        }
    });
}