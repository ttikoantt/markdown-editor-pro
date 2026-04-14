// Markdown Editor Pro - MVP v2 Step 1
// Updated: 2026-04-14T05:11:57.489Z

class MarkdownEditor {
    constructor() {
        this.preview = document.getElementById("preview");
        this.saveStatus = document.getElementById("saveStatus");
        this.wordCount = document.getElementById("wordCount");
        this.init();
    }

    init() {
        this.setupToolbar();
        this.setupEditorEvents();
        this.setupButtonEvents();
        
        this.loadFromStorage();
        this.updatePreview();
        this.updateWordCount();
        
        console.log("Markdown Editor Pro initialized");
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
        editor.addEventListener("input", () => {
            this.updatePreview();
            this.updateWordCount();
            this.autoSave();
        });
    }

    setupButtonEvents() {
        document.getElementById("saveBtn").addEventListener("click", () => this.saveToStorage());
        document.getElementById("clearBtn").addEventListener("click", () => this.clearEditor());
        document.getElementById("downloadBtn").addEventListener("click", () => this.downloadMarkdown());
    }

    executeAction(action) {
        const editor = document.getElementById("editor");
        
        switch (action) {
            case "bold":
                this.wrapSelection("**", "**");
                break;
            case "italic":
                this.wrapSelection("*", "*");
                break;
            case "strike":
                this.wrapSelection("~~", "~~");
                break;
            case "code":
                this.wrapSelection("`", "`");
                break;
            case "heading":
                this.insertLine("## ");
                break;
            case "bullet-list":
                this.insertLine("- ");
                break;
            case "code-block":
                this.insertBlock("```\n", "\n```");
                break;
        }
        
        this.updatePreview();
        this.autoSave();
    }

    wrapSelection(before, after) {
        const editor = document.getElementById("editor");
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        const text = editor.value;
        
        const selectedText = text.substring(start, end);
        const replacement = before + selectedText + after;
        
        editor.value = text.substring(0, start) + replacement + text.substring(end);
        editor.focus();
        editor.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }

    insertLine(prefix) {
        const editor = document.getElementById("editor");
        const start = editor.selectionStart;
        const text = editor.value;
        
        const lineStart = text.lastIndexOf("\n", start - 1) + 1;
        editor.value = text.substring(0, lineStart) + prefix + text.substring(lineStart);
        editor.focus();
        editor.setSelectionRange(lineStart + prefix.length, lineStart + prefix.length);
    }

    insertBlock(before, after) {
        const editor = document.getElementById("editor");
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
        const markdown = editor.value;
        
        if (typeof marked !== "undefined") {
            this.preview.innerHTML = marked.parse(markdown);
        } else {
            this.preview.textContent = markdown;
        }
    }

    updateWordCount() {
        const editor = document.getElementById("editor");
        const text = editor.value;
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        this.wordCount.textContent = words.length + " words";
    }

    autoSave() {
        const editor = document.getElementById("editor");
        localStorage.setItem("markdown-editor-pro-content", editor.value);
        this.saveStatus.textContent = "✅ Saved";
        setTimeout(() => {
            this.saveStatus.textContent = "";
        }, 2000);
    }

    saveToStorage() {
        const editor = document.getElementById("editor");
        localStorage.setItem("markdown-editor-pro-content", editor.value);
        this.saveStatus.textContent = "✅ Saved";
        setTimeout(() => {
            this.saveStatus.textContent = "";
        }, 2000);
    }

    loadFromStorage() {
        const saved = localStorage.getItem("markdown-editor-pro-content");
        if (saved) {
            const editor = document.getElementById("editor");
            editor.value = saved;
        }
    }

    clearEditor() {
        if (confirm("Are you sure?")) {
            const editor = document.getElementById("editor");
            editor.value = "";
            this.updatePreview();
            this.updateWordCount();
            this.saveToStorage();
        }
    }

    downloadMarkdown() {
        const editor = document.getElementById("editor");
        const markdown = editor.value;
        const blob = new Blob([markdown], { type: "text/markdown" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "document.md";
        a.click();
        URL.revokeObjectURL(url);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new MarkdownEditor();
});