// Markdown Editor Pro - MVP v3 Step 1
// File System Access API

class FileManager {
    constructor() {
        this.fileHandle = null;
        this.currentFile = null;
    }

    async newFile() {
        try {
            if (window.showSaveFilePicker) {
                this.fileHandle = await window.showSaveFilePicker({
                    suggestedName: "untitled.md",
                    types: [{
                        description: "Markdown File",
                        accept: { "text/markdown": [".md"] }
                    }]
                });
                await this.saveFile("");
                return true;
            }
            return false;
        } catch (e) {
            console.error("New file error:", e);
            return false;
        }
    }

    async openFile() {
        try {
            if (window.showOpenFilePicker) {
                const [handle] = await window.showOpenFilePicker({
                    types: [{
                        description: "Markdown File",
                        accept: { "text/markdown": [".md"] }
                    }]
                });
                this.fileHandle = handle;
                const file = await handle.getFile();
                const content = await file.text();
                this.currentFile = file.name;
                return content;
            }
            return null;
        } catch (e) {
            console.error("Open file error:", e);
            return null;
        }
    }

    async saveFile(content) {
        try {
            if (this.fileHandle) {
                const writable = await this.fileHandle.createWritable();
                await writable.write(content);
                await writable.close();
                return true;
            }
            return false;
        } catch (e) {
            console.error("Save file error:", e);
            return false;
        }
    }
}

if (typeof window !== "undefined") {
    window.FileManager = FileManager;
}
