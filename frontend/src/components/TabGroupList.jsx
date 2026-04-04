import { RotateCcw, Trash2 } from 'lucide-react';
import { restoreGroup, deleteGroup } from '../utils.js';

function TabGroupList({ groups, onRefresh }) {
  const handleRestore = async (groupId) => {
    const success = await restoreGroup(groupId);
    if (success) {
      alert('Tabs restored successfully!');
    } else {
      alert('Failed to restore group.');
    }
  };

  const handleDelete = async (groupId) => {
    if (!confirm('Delete this tab group?')) return;
    
    await deleteGroup(groupId);
    onRefresh();
  };

  return (
    <div className="space-y-3">
      {groups.map((group) => {
        const date = new Date(group.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });

        return (
          <div
            key={group.id}
            className="bg-zinc-900 rounded-2xl p-5 hover:bg-zinc-800/80 transition group"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-semibold text-lg text-white">{group.name}</h4>
                <p className="text-xs text-zinc-500">{date}</p>
              </div>
              <div className="text-right">
                <span className="text-sm bg-zinc-800 px-3 py-1 rounded-full">
                  {group.tabs.length} tabs
                </span>
              </div>
            </div>

            {/* Preview first 3 tabs */}
            <div className="text-xs text-zinc-400 mb-4 line-clamp-2">
              {group.tabs.slice(0, 3).map((tab, i) => (
                <span key={i}>
                  {tab.title}
                  {i < 2 && group.tabs.length > 1 ? ', ' : ''}
                </span>
              ))}
              {group.tabs.length > 3 && ' ...'}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleRestore(group.id)}
                className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 transition py-2.5 rounded-xl text-sm font-medium"
              >
                <RotateCcw size={16} />
                Restore Tabs
              </button>

              <button
                onClick={() => handleDelete(group.id)}
                className="px-4 flex items-center justify-center bg-zinc-800 hover:bg-red-950 hover:text-red-400 transition rounded-xl"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default TabGroupList;