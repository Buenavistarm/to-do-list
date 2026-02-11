import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function ListItem() {
    const location = useLocation();
    const navigate = useNavigate();
    const { listId, listTitle } = location.state || {};
    const [desc, setDesc] = useState("");
    const [items, setItems] = useState([]);
    const [editingItem, setEditingItem] = useState(null);
    const [editDesc, setEditDesc] = useState("");
    const [itemStatus, setItemStatus] = useState("pending");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [addingItem, setAddingItem] = useState(false);

    const fetchItems = async () => {
        try {
            const response = await axios.post(`${API_URL}/get-items`, { listId });
            setItems(response.data.items);
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    };

    const handleAddItem = async () => {
        if (!desc.trim()) {
            setError("Please enter a description");
            return;
        }

        setAddingItem(true);
        setError("");
        try {
            const response = await axios.post(`${API_URL}/add-items`, { listId, desc, status: itemStatus });
            setDesc("");
            setItemStatus("pending");
            setError("");
            setSuccess("Item added successfully");
            fetchItems();
        } catch (error) {
            console.error("Error adding item:", error);
            setError(error.response?.data?.message || "Error adding item");
        } finally {
            setAddingItem(false);
        }
    };

    const handleEditClick = (item) => {
        setEditingItem(item.id);
        setEditDesc(item.description);
    };

    const handleSaveEdit = async () => {
        if (!editDesc.trim()) {
            setError("Description cannot be empty");
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/edit-items`, { id: editingItem, desc: editDesc });
            setEditingItem(null);
            setError("");
            setSuccess("Item updated successfully");
            fetchItems();
        } catch (error) {
            console.error("Error updating item:", error);
            setError(error.response?.data?.message || "Error updating item");
        }
    };

    const handleCancelEdit = () => {
        setEditingItem(null);
        setEditDesc("");
    };

    const handleDeleteItem = async (id) => {
        try {
            const response = await axios.post(`${API_URL}/delete-items`, { id });
            setError("");
            setSuccess("Item deleted successfully");
            fetchItems();
        } catch (error) {
            console.error("Error deleting item:", error);
            setError(error.response?.data?.message || "Error deleting item");
        }
    };

    useEffect(() => {
        if (listId) {
            fetchItems();
        }
    }, [listId]);

    if (!listId) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6" style={{
                backgroundImage: `
                    linear-gradient(45deg, #000 25%, transparent 25%),
                    linear-gradient(-45deg, #000 25%, transparent 25%),
                    linear-gradient(45deg, transparent 75%, #000 75%),
                    linear-gradient(-45deg, transparent 75%, #000 75%)
                `,
                backgroundSize: '60px 60px',
                backgroundPosition: '0 0, 0 30px, 30px -30px, -30px 0px',
                backgroundColor: '#f5f5f5'
            }}>
                <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-sm w-full border-4 border-black">
                    <svg className="w-12 h-12 mx-auto mb-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                    </svg>
                    <p className="text-gray-700 mb-6 font-bold uppercase">No list selected. Choose a list from home.</p>
                    <button
                        onClick={() => navigate('/home')}
                        className="w-full px-6 py-3 bg-black text-white hover:bg-gray-900 rounded-2xl transition-all shadow-lg font-bold active:scale-95 uppercase border-2 border-black"
                    >
                        Return to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white" style={{
            backgroundImage: `
                linear-gradient(45deg, #000 25%, transparent 25%),
                linear-gradient(-45deg, #000 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, #000 75%),
                linear-gradient(-45deg, transparent 75%, #000 75%)
            `,
            backgroundSize: '60px 60px',
            backgroundPosition: '0 0, 0 30px, 30px -30px, -30px 0px',
            backgroundColor: '#f5f5f5'
        }}>
            <div className="p-6 max-w-4xl mx-auto">
                <div className="bg-white border-4 border-black p-8 rounded-3xl shadow-xl mb-8">
                    <div className="flex justify-between items-center gap-4">
                        <div>
                            <button
                                onClick={() => navigate('/home')}
                                className="bg-gray-200 border-2 border-black text-black hover:bg-gray-300 px-4 py-2 rounded-xl transition-all shadow-md active:scale-95 font-bold uppercase flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
                                </svg>
                                Back
                            </button>
                        </div>
                        <div className="text-right">
                            <h1 className="text-4xl font-black text-black mb-2">{listTitle}</h1>
                            <p className="text-black text-sm font-bold uppercase whitespace-nowrap">Manage your items</p>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border-2 border-red-400 text-red-600 text-sm mb-6 p-4 rounded-2xl shadow-md animate-pulse font-bold">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 border-2 border-green-400 text-green-700 text-sm mb-6 p-4 rounded-2xl shadow-md font-bold">
                        {success}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-8">
                    {/* Add Item Section */}
                    <div className="bg-white border-4 border-black p-8 rounded-3xl shadow-xl">
                        <h2 className="text-2xl font-black mb-6 text-black flex items-center gap-2">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                            </svg>
                            Add New Task
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-black mb-2 text-black uppercase">Description</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 border-2 border-black rounded-2xl focus:outline-none focus:ring-2 focus:ring-black bg-white transition-all font-medium shadow-md"
                                    value={desc}
                                    onChange={(e) => {
                                        setDesc(e.target.value);
                                        if (error) setError("");
                                    }}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-black mb-2 text-black uppercase">Status</label>
                                <select
                                    className="w-full px-4 py-3 border-2 border-black rounded-2xl focus:outline-none focus:ring-2 focus:ring-black bg-white transition-all font-medium shadow-md"
                                    value={itemStatus}
                                    onChange={(e) => setItemStatus(e.target.value)}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                        </div>
                        <button
                            onClick={handleAddItem}
                            disabled={addingItem}
                            className="w-full py-4 bg-black text-white hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl transition-all shadow-lg font-bold text-lg active:scale-[0.98] uppercase border-2 border-black"
                        >
                            {addingItem ? 'Adding to list...' : 'Add Task to List'}
                        </button>
                    </div>

                    {/* Items Section */}
                    <div className="bg-white border-4 border-black p-8 rounded-3xl shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black text-black">Tasks ({items.length})</h2>
                            <div className="h-1 flex-1 mx-4 bg-gray-400 rounded-full"></div>
                        </div>

                        {items.length === 0 ? (
                            <div className="text-center py-12 bg-gray-200 rounded-2xl border-4 border-dashed border-black">
                                <svg className="w-12 h-12 mx-auto mb-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.707a1 1 0 00-1.414-1.414L9 9.586 7.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                </svg>
                                <p className="text-black font-bold uppercase">No tasks yet. Ready to start?</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {items.map((item, idx) => (
                                    <div key={item.id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-100'} border-4 border-black p-6 rounded-3xl hover:shadow-lg transition-all group border-l-8 border-l-black`}>
                                        {editingItem === item.id ? (
                                            <div className="space-y-4">
                                                <input
                                                    type="text"
                                                    value={editDesc}
                                                    onChange={(e) => setEditDesc(e.target.value)}
                                                    className="w-full px-4 py-2 border-2 border-black rounded-2xl focus:outline-none focus:ring-2 focus:ring-black bg-white"
                                                />
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={handleSaveEdit}
                                                        className="flex-1 px-4 py-2 bg-black text-white hover:bg-gray-900 rounded-xl font-bold transition-all border-2 border-black"
                                                    >
                                                        Save Changes
                                                    </button>
                                                    <button
                                                        onClick={handleCancelEdit}
                                                        className="px-4 py-2 bg-gray-300 text-black hover:bg-gray-400 rounded-xl font-bold transition-all border-2 border-black"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex justify-between items-start gap-4">
                                                <div className="flex-1">
                                                    <p className={`text-lg font-bold mb-2 ${item.status === 'completed' ? 'text-gray-400 line-through' : 'text-black'}`}>
                                                        {item.description}
                                                    </p>
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border-2 border-black ${item.status === 'completed' ? 'bg-green-300 text-black' :
                                                        item.status === 'in-progress' ? 'bg-blue-300 text-black' :
                                                            'bg-yellow-300 text-black'
                                                        }`}>
                                                        {item.status}
                                                    </span>
                                                </div>
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleEditClick(item)}
                                                        className="p-2 bg-gray-300 text-black hover:bg-gray-400 rounded-xl transition-all border-2 border-black"
                                                        title="Edit Task"
                                                    >
                                                        <span className="text-sm px-1 font-bold">Edit</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteItem(item.id)}
                                                        className="p-2 bg-red-300 text-black hover:bg-red-400 rounded-xl transition-all border-2 border-black"
                                                        title="Delete Task"
                                                    >
                                                        <span className="text-sm px-1 font-bold">Delete</span>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ListItem;
