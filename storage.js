export const Storage = {
  async save(key, value) {
    return chrome.storage.local.set({ [key]: value });
  },

  async get(key) {
    const result = await chrome.storage.local.get(key);
    return result[key];
  },

  async remove(key) {
    return chrome.storage.local.remove(key);
  },
};
