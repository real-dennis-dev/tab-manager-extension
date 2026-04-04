import { useState, useEffect } from 'react';
import { Save, RotateCcw, Trash2, Plus } from 'lucide-react';
import SaveGroupModal from './components/SaveGroupModal.jsx';
import TabGroupList from './components/TabGroupList.jsx';
import CurrentTabsList from './components/CurrentTabsList.jsx';
import { getSavedGroups, saveTabsGroup } from './utils.js';

function App() {
  const [groups, setGroups] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadGroups = async () => {
    const saved = await getSavedGroups();
    setGroups(saved);
    setLoading(false);
  };

  useEffect(() => {
    loadGroups();
  }, []);

  const handleSaveGroup = async (name) => {
    await saveTabsGroup(name);
    await loadGroups();
    setIsModalOpen(false);
  };

  const handleRefresh = () => loadGroups();

  return (
    <div className="w-[380px] min-h-[500px] bg-zinc-950 text-white p-5 font-sans">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
            📑
          </div>
          <h1 className="text-2xl font-semibold">Tab Groups</h1>
        </div>
        <button
          onClick={handleRefresh}
          className="p-2 hover:bg-zinc-800 rounded-lg transition"
          title="Refresh"
        >
          <RotateCcw size={20} />
        </button>
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full bg-blue-600 hover:bg-blue-700 transition flex items-center justify-center gap-2 py-3 rounded-xl font-medium mb-8"
      >
        <Plus size={20} />
        Save Current Tabs as Group
      </button>

      <CurrentTabsList />

      <div className="mt-8">
        <h2 className="text-lg font-medium mb-3 flex items-center gap-2">
          Saved Groups ({groups.length})
        </h2>

        {loading ? (
          <p className="text-zinc-500">Loading...</p>
        ) : groups.length === 0 ? (
          <p className="text-zinc-500 text-center py-8">
            No saved groups yet.<br />Save your first one above!
          </p>
        ) : (
          <TabGroupList groups={groups} onRefresh={loadGroups} />
        )}
      </div>

      <SaveGroupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveGroup}
      />
    </div>
  );
}

export default App;