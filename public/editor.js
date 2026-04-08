// Markdown Editor Mira - MVP v2 (TipTap WYSIWYG)

class MarkdownEditor {
    constructor() {
        this.editor = null;
        this.preview = document.getElementById('preview');
        this.saveStatus = document.getElementById('saveStatus');
        this.wordCount = document.getElementById('wordCount');
        this.saveBtn = document.getElementById('saveBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.downloadHtmlBtn = document.getElementById('downloadHtmlBtn');
        this.syncPreviewBtn = document.getElementById('syncPreview');
        
        this.init();
    }

    init() {
        // For MVP v2, we'll use contenteditable for now
        // Full TipTap integration in next update
        this.initContentEditable();
        
        // Event listeners
        this.saveBtn.addEventListener('click', () => this.saveToStorage());
        this.clearBtn.addEventListener('click', () => this.clearEditor());
        this.downloadBtn.addEventListener('click', () => this.downloadMarkdown());
        this.downloadHtmlBtn.addEventListener('click', () => this.downloadHTML());
        this.syncPreviewBtn.addEventListener('click', () => this.syncPreview());

        // Initial render
        this.updatePreview();
        this.updateWordCount();
        this.autoSave();
    }

    initContentEditable() {
        // Simple contenteditable for MVP v2
        const editor = document.getElementById('editor');
        editor.contentEditable = true;
        editor.dataset.placeholder = 'Start writing your Markdown here...';

        editor.addEventListener('input', () => {
            this.handleUpdate();
        });

        // Load from storage
        const saved = this.loadFromStorage();
        if (saved) {
            editor.textContent = saved;
        }
    }

    handleUpdate() {
        this.updatePreview();
        this.updateWordCount();
        this.autoSave();
    }

    getMarkdown() {
        const editor = document.getElementById('editor');
        return editor.textContent;
    }

    updatePreview() {
        const markdown = this.getMarkdown();
        this.preview.innerHTML = marked.parse(markdown);
    }

    updateWordCount() {
        const text = this.getMarkdown();
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        this.wordCount.textContent = \`\${words.length} words\`;
    }

    autoSave() {
        const markdown = this.getMarkdown();
        localStorage.setItem('markdown-editor-mira-content', markdown);
        this.saveStatus.textContent = '✅ Saved';
        setTimeout(() => {
            this.saveStatus.textContent = '';
        }, 2000);
    }

    saveToStorage() {
        const markdown = this.getMarkdown();
        localStorage.setItem('markdown-editor-mira-content', markdown);
        this.saveStatus.textContent = '✅ Saved';
        setTimeout(() => {
            this.saveStatus.textContent = '';
        }, 2000);
    }

    loadFromStorage() {
        const saved = localStorage.getItem('markdown-editor-mira-content');
        return saved;
    }

    syncPreview() {
        this.updatePreview();
    }

    clearEditor() {
        if (confirm('Are you sure you want to clear the editor?')) {
            const editor = document.getElementById('editor');
            editor.textContent = '';
            this.updatePreview();
            this.updateWordCount();
            this.saveToStorage();
        }
    }

    downloadMarkdown() {
        const markdown = this.getMarkdown();
        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.md';
        a.click();
        URL.revokeObjectURL(url);
    }

    downloadHTML() {
        const html = this.preview.innerHTML;
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.html';
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Initialize editor when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new MarkdownEditor();
});
