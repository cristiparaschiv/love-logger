import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Layout } from '../components/common/Layout';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useWishlist } from '../hooks/useWishlist';

export const Wishlist = () => {
  const { items, isLoading, error, createItem, updateItem, deleteItem, clearError } = useWishlist();
  const [newTitle, setNewTitle] = useState('');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    await createItem({ title: newTitle.trim() });
    setNewTitle('');
  };

  const handleToggle = async (id: string, completed: boolean) => {
    await updateItem(id, { completed: !completed });
  };

  const handleDelete = async (id: string) => {
    await deleteItem(id);
  };

  const incompleteItems = items.filter((i) => !i.completed);
  const completedItems = items.filter((i) => i.completed);

  return (
    <Layout>
      <div className="container-app py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Our Wishlist</h1>
          <p className="text-gray-600">Things we want to do together</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={clearError} className="text-red-700 hover:text-red-900" aria-label="Dismiss error">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        {/* Add form */}
        <form onSubmit={handleAdd} className="mb-8 flex gap-3">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Add something to the list..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
          />
          <button
            type="submit"
            disabled={!newTitle.trim()}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Add
          </button>
        </form>

        {isLoading && items.length === 0 && (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {!isLoading && items.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <Sparkles className="w-12 h-12 text-primary-400 mx-auto mb-4" />
            <p className="text-lg">Your wishlist is empty. Add your first dream!</p>
          </div>
        )}

        {/* Incomplete items */}
        {incompleteItems.length > 0 && (
          <div className="space-y-3 mb-8">
            {incompleteItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => handleToggle(item.id, item.completed)}
                  className="w-6 h-6 rounded-full border-2 border-gray-300 hover:border-primary-500 flex-shrink-0 transition-colors"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 font-medium truncate">{item.title}</p>
                  {item.description && (
                    <p className="text-gray-500 text-sm truncate">{item.description}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                  aria-label="Delete item"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Completed items */}
        {completedItems.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-500 mb-3">
              Completed ({completedItems.length})
            </h2>
            <div className="space-y-3">
              {completedItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100"
                >
                  <button
                    onClick={() => handleToggle(item.id, item.completed)}
                    className="w-6 h-6 rounded-full bg-primary-500 flex-shrink-0 flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-400 line-through truncate">{item.title}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0"
                    aria-label="Delete item"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
