import { Storage } from "./storage.js";
import { getCurrentWindowTabs, normalizeTab } from "./tabs.js";
import { groupByDomain } from "./utils.js";

const TABS_KEY = "saved_tab_groups";

// ==============================
// LIST & RENDER TABS
// ==============================
export async function listTabs() {
  const tabs = await getCurrentWindowTabs();
  const normalized = tabs.map(normalizeTab);

  renderTabs(normalized);
}

// ==============================
// SAVE TABS AS GROUP
// ==============================
export async function saveTabsGroup() {
  const tabs = await getCurrentWindowTabs();
  const normalized = tabs.map(normalizeTab);

  const groups = (await Storage.get(TABS_KEY)) || [];

  const newGroup = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    tabs: normalized,
  };

  groups.push(newGroup);

  await Storage.save(TABS_KEY, groups);

  alert("Tabs saved!");
}

// ==============================
// GROUP BY DOMAIN
// ==============================
export async function groupTabsByDomain() {
  const tabs = await getCurrentWindowTabs();
  const normalized = tabs.map(normalizeTab);

  const grouped = groupByDomain(normalized);

  renderGroupedTabs(grouped);
}

// ==============================
// RESTORE GROUP
// ==============================
export async function restoreGroup(groupId) {
  const groups = (await Storage.get(TABS_KEY)) || [];

  const group = groups.find((g) => g.id === groupId);
  if (!group) return;

  for (const tab of group.tabs) {
    await chrome.tabs.create({ url: tab.url });
  }
}

// ==============================
// RENDER FUNCTIONS
// ==============================
function renderTabs(tabs) {
  const ul = document.getElementById("tabs");
  ul.innerHTML = "";

  tabs.forEach((tab) => {
    const li = document.createElement("li");
    li.textContent = `${tab.title} — ${tab.url}`;
    ul.appendChild(li);
  });
}

function renderGroupedTabs(groups) {
  const container = document.getElementById("tabs");
  container.innerHTML = "";

  Object.entries(groups).forEach(([domain, tabs]) => {
    const section = document.createElement("div");

    const title = document.createElement("h3");
    title.textContent = domain;

    section.appendChild(title);

    tabs.forEach((tab) => {
      const li = document.createElement("li");
      li.textContent = tab.title;
      section.appendChild(li);
    });

    container.appendChild(section);
  });
}
