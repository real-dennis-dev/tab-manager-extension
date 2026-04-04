import { useState, useEffect } from 'react';
import { getCurrentWindowTabs, normalizeTab } from '../utils.js';

function CurrentTabsList() {
  const [tabs, setTabs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCurrentTabs = async () => {
    setLoading(true);
    try {
      const currentTabs = await getCurrentWindowTabs();
      const normalized = currentTabs.map(normalizeTab);
      setTabs(normalized);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCurrentTabs();
  }, []);

  if (loading) {
    return <p className="text-zinc-500 text-sm">Loading current tabs...</p>;
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-zinc-400">Currently Open Tabs ({tabs.length})</h3>
      </div>

      <div className="max-h-52 overflow-y-auto pr-2 custom-scroll">
        {tabs.length === 0 ? (
          <p className="text-zinc-500 text-sm">No tabs open.</p>
        ) : (
          tabs.slice(0, 8).map((tab) => (
            <div
              key={tab.id}
              className="flex items-center gap-3 bg-zinc-900 hover:bg-zinc-800 rounded-xl p-3 mb-2 transition"
            >
              {tab.favIconUrl ? (
                <img
                  src={tab.favIconUrl}
                  alt=""
                  className="w-5 h-5 rounded-sm flex-shrink-0"
                  onError={(e) => (e.target.style.display = 'none')}
                />
              ) : (
                <div className="w-5 h-5 bg-zinc-700 rounded-sm flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {tab.title}
                </p>
                <p className="text-xs text-zinc-500 truncate">{tab.domain}</p>
              </div>
            </div>
          ))
        )}
      </div>
      {tabs.length > 8 && (
        <p className="text-xs text-zinc-500 text-center mt-2">
          +{tabs.length - 8} more tabs
        </p>
      )}
    </div>
  );
}

export default CurrentTabsList;