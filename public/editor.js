// Markdown Editor Pro - MVP v3-2 Step 1
// Updated: 2026-04-17T18:26:00.000Z
// File System Integration
if (document.getElementById("editor")) {
    class MarkdownEditor {
        constructor() {
            this.preview = document.getElementById("preview");
            this.saveStatus = document.getElementById("saveStatus");
            this.wordCount = document.getElementById("wordCount");
            this.fileNameEl = document.getElementById("fileName");
            this.fileManager = typeof FileManager !== "undefined" ? new FileManager() : null;
            this.currentFileName = "Untitled.md";
            this.init();
        }

        init() {
            try {
                this.setupToolbar();
                this.setupEditorEvents();
                this.setupButtonEvents();
                this.setupFileOperations();
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

        setupFileOperations() {
            const newFileBtn = document.getElementById("newFileBtn");
            const openFileBtn = document.getElementById("openFileBtn");
            const saveFileBtn = document.getElementById("saveFileBtn");
            if (newFileBtn) newFileBtn.addEventListener("click", () => this.newFile());
            if (openFileBtn) openFileBtn.addEventListener("click", () => this.openFile());
            if (saveFileBtn) saveFileBtn.addEventListener("click", () => this.saveFile());
            this.updateFileName(this.currentFileName);
        }

        async newFile() {
            if (!this.fileManager) {
                console.warn("FileManager not available");
                return;
            }
            try {
                if (await this.fileManager.newFile()) {
                    const editor = document.getElementById("editor");
                    if (editor) editor.value = "";
                    this.currentFileName = "Untitled.md";
                    this.updateFileName(this.currentFileName);
                    this.updatePreview();
                    this.updateWordCount();
                    this.showStatus("✅ New file created");
                }
            } catch (e) {
                console.error("New file error:", e);
                this.showStatus("❌ Failed to create new file");
            }
        }

        async openFile() {
            if (!this.fileManager) {
                console.warn("FileManager not available");
                return;
            }
            try {
                const content = await this.fileManager.openFile();
                if (content !== null) {
                    const editor = document.getElementById("editor");
                    if (editor) editor.value = content;
                    this.currentFileName = this.fileManager.currentFile || "Untitled.md";
                    this.updateFileName(this.currentFileName);
                    this.updatePreview();
                    this.updateWordCount();
                    this.showStatus("✅ File opened");
                }
            } catch (e) {
                console.error("Open file error:", e);
                this.showStatus("❌ Failed to open file");
            }
        }

        async saveFile() {
            if (!this.fileManager) {
                console.warn("FileManager not available");
                return;
            }
            try {
                const editor = document.getElementById("editor");
                if (!editor) return;
                const content = editor.value;
                if (await this.fileManager.saveFile(content)) {
                    this.showStatus("✅ File saved");
                } else {
                    this.showStatus("⚠️ File not saved (no file selected)");
                }
            } catch (e) {
                console.error("Save file error:", e);
                this.showStatus("❌ Failed to save file");
            }
        }

        updateFileName(filename) {
            this.currentFileName = filename;
            if (this.fileNameEl) {
                this.fileNameEl.textContent = filename;
            }
        }

        showStatus(message) {
            if (this.saveStatus) {
                this.saveStatus.textContent = message;
                setTimeout(() => { this.saveStatus.textContent = ""; }, 3000);
            }
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
