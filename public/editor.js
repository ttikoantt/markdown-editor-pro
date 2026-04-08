// Markdown Editor Mira - MVP v1

class MarkdownEditor {
    constructor() {
        this.editor = document.getElementById('editor');
        this.preview = document.getElementById('preview');
        this.saveStatus = document.getElementById('saveStatus');
        this.wordCount = document.getElementById('wordCount');
        this.saveBtn = document.getElementById('saveBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        
        this.init();
    }

    init() {
        // Load from localStorage
        this.loadFromStorage();
        
        // Event listeners
        this.editor.addEventListener('input', () => this.handleInput());
        this.saveBtn.addEventListener('click', () => this.saveToStorage());
        this.clearBtn.addEventListener('click', () => this.clearEditor());
        this.downloadBtn.addEventListener('click', () => this.downloadMarkdown());
        
        // Initial render
        this.updatePreview();
        this.updateWordCount();
    }

    handleInput() {
        this.updatePreview();
        this.updateWordCount();
        this.autoSave();
    }

    updatePreview() {
        const markdown = this.editor.value;
        this.preview.innerHTML = marked.parse(markdown);
    }

    updateWordCount() {
        const text = this.editor.value;
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        this.wordCount.textContent = `${words.length} words`;
    }

    autoSave() {
        localStorage.setItem('markdown-editor-mira-content', this.editor.value);
        this.saveStatus.textContent = '✅ Saved';
        setTimeout(() => {
            this.saveStatus.textContent = '';
        }, 2000);
    }

    saveToStorage() {
        localStorage.setItem('markdown-editor-mira-content', this.editor.value);
        this.saveStatus.textContent = '✅ Saved';
        setTimeout(() => {
            this.saveStatus.textContent = '';
        }, 2000);
    }

    loadFromStorage() {
        const saved = localStorage.getItem('markdown-editor-mira-content');
        if (saved) {
            this.editor.value = saved;
        }
    }

    clearEditor() {
        if (confirm('Are you sure you want to clear the editor?')) {
            this.editor.value = '';
            this.updatePreview();
            this.updateWordCount();
            this.saveToStorage();
        }
    }

    downloadMarkdown() {
        const markdown = this.editor.value;
        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.md';
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Initialize editor when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new MarkdownEditor();
});
