export async function getAllTabs() {
  return chrome.tabs.query({});
}

export async function getCurrentWindowTabs() {
  return chrome.tabs.query({ currentWindow: true });
}

export function normalizeTab(tab) {
  return {
    id: tab.id,
    title: tab.title || "(no title)",
    url: tab.url,
    domain: extractDomain(tab.url),
    favIconUrl: tab.favIconUrl || "",
  };
}

function extractDomain(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return "unknown";
  }
}
