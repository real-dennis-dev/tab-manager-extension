export function groupByDomain(tabs) {
  return tabs.reduce((groups, tab) => {
    if (!groups[tab.domain]) {
      groups[tab.domain] = [];
    }
    groups[tab.domain].push(tab);
    return groups;
  }, {});
}

export function groupByCustom(tabs, groupNameFn) {
  return tabs.reduce((groups, tab) => {
    const key = groupNameFn(tab);

    if (!groups[key]) {
      groups[key] = [];
    }

    groups[key].push(tab);
    return groups;
  }, {});
}
