const DB_NAME = "store";
const STORAGE_NAME = "stringList";
const DB_VERSION = 1;
export const maxDisplayedStrings = 10000;

let DB;

export default {
  async getDb() {
    return new Promise((resolve, reject) => {
      if (DB) return resolve(DB);

      const request = window.indexedDB.open(DB_NAME, DB_VERSION);
      request.onerror = (e) => {
        console.log("Error opening db", e);
        reject("Error");
      };
      request.onsuccess = (e) => {
        DB = e.target.result;
        resolve(DB);
      };
      request.onupgradeneeded = (e) => {
        let db = e.target.result;
        db.createObjectStore(STORAGE_NAME, {
          autoIncrement: false,
          keyPath: "percent",
        });
      };
    });
  },

  async getStringList(startPercent = 0.1) {
    let db = await this.getDb();
    return new Promise((resolve) => {
      let transaction = db.transaction([STORAGE_NAME], "readonly");
      transaction.oncomplete = () => {
        resolve({ stringList, endPercent });
      };
      const store = transaction.objectStore(STORAGE_NAME);
      const stringList = [];
      let endPercent = 0;
      store.openCursor(startPercent).onsuccess = (e) => {
        const cursor = e.target.result;
        if (cursor && stringList < maxDisplayedStrings) {
          stringList.push(...cursor.value.partStrings);
          endPercent = cursor.value.percent;
          cursor.continue();
        }
      };
    });
  },

  async addStrings(percent, partStrings) {
    let db = await this.getDb();
    return new Promise((resolve) => {
      let transaction = db.transaction([STORAGE_NAME], "readwrite");
      transaction.oncomplete = () => {
        resolve();
      };
      let store = transaction.objectStore(STORAGE_NAME);
      store.add({ percent, partStrings });
    });
  },

  async deleteStringList() {
    const db = await this.getDb();
    return new Promise((resolve) => {
      let transaction = db.transaction([STORAGE_NAME], "readwrite");
      transaction.oncomplete = () => {
        resolve();
      };
      let store = transaction.objectStore(STORAGE_NAME);
      store.clear();
    });
  },
};
