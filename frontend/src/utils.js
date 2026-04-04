// src/utils/utils.js

export const TABS_KEY = "saved_tab_groups";

// Normalize tab object (clean data for storage)
export function normalizeTab(tab) {
  return {
    id: tab.id,
    title: tab.title || "Untitled",
    url: tab.url || "",
    favIconUrl: tab.favIconUrl || "",
    domain: tab.url ? new URL(tab.url).hostname : "unknown",
  };
}

// Get all tabs in current window
export async function getCurrentWindowTabs() {
  return await chrome.tabs.query({ currentWindow: true });
}

// Group tabs by domain
export function groupByDomain(tabs) {
  return tabs.reduce((acc, tab) => {
    const domain = tab.domain || "unknown";
    if (!acc[domain]) acc[domain] = [];
    acc[domain].push(tab);
    return acc;
  }, {});
}

// Save a new named group
export async function saveTabsGroup(name) {
  if (!name || name.trim() === "") {
    alert("Please enter a group name (e.g., Monday, Work, Research)");
    return false;
  }

  const tabs = await getCurrentWindowTabs();
  const normalized = tabs.map(normalizeTab);

  const groups = (await chrome.storage.local.get([TABS_KEY]))[TABS_KEY] || [];

  const newGroup = {
    id: Date.now(),
    name: name.trim(),
    createdAt: new Date().toISOString(),
    tabs: normalized,
    count: normalized.length,
  };

  groups.push(newGroup);
  await chrome.storage.local.set({ [TABS_KEY]: groups });

  return true;
}

// Get all saved groups
export async function getSavedGroups() {
  const result = await chrome.storage.local.get([TABS_KEY]);
  return result[TABS_KEY] || [];
}

// Restore (open) a saved group
export async function restoreGroup(groupId) {
  const groups = await getSavedGroups();
  const group = groups.find((g) => g.id === groupId);

  if (!group) return false;

  for (const tab of group.tabs) {
    await chrome.tabs.create({ url: tab.url });
  }
  return true;
}

// Delete a group
export async function deleteGroup(groupId) {
  let groups = await getSavedGroups();
  groups = groups.filter((g) => g.id !== groupId);
  await chrome.storage.local.set({ [TABS_KEY]: groups });
  return true;
}