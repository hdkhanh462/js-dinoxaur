// Added error handling for localStorage operations.
export default class Process {
  constructor(key, defaultSave = {}) {
    this.key = key;
    this.defaultSave = defaultSave;
    this.setSaveFile();
  }

  save(data) {
    try {
      window.localStorage.setItem(this.key, JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save data:", error);
    }
  }

  getSaveFile() {
    try {
      const saveFile = window.localStorage.getItem(this.key);
      return saveFile ? JSON.parse(saveFile) : null;
    } catch (error) {
      console.error("Failed to retrieve save file:", error);
      return null;
    }
  }

  setSaveFile() {
    const saveFile = this.getSaveFile();
    if (!saveFile || saveFile.version !== this.defaultSave.version) {
      this.save(this.defaultSave);
    }
  }
}
