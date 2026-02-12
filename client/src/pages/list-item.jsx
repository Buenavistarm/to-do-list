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
            <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{
                backgroundColor: '#030014',
                backgroundImage: `
                    radial-gradient(circle at 10% 10%, rgba(255,0,150,0.06), transparent 10%),
                    linear-gradient(180deg, rgba(2,6,23,0.8), rgba(0,4,10,0.9)),
                    repeating-linear-gradient(0deg, rgba(0,255,200,0.02) 0 1px, transparent 1px 28px)
                `,
                backgroundBlendMode: 'screen, normal, overlay',
                backgroundSize: 'cover'
            }}>
                <div className="bg-[linear-gradient(180deg,#071018,_#001018)] border border-pink-500/20 p-8 rounded-3xl shadow-xl max-w-sm w-full text-center font-mono text-[#9fffd6]" style={{boxShadow: '0 30px 80px rgba(2,6,23,0.7)'}}>
                    <svg className="w-12 h-12 mx-auto mb-4 text-[#7af2d6]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                    </svg>
                    <p className="mb-6 font-bold uppercase text-[#9fffd6]">No list selected. Choose a list from home.</p>
                    <button
                        onClick={() => navigate('/home')}
                        className="w-full px-6 py-3 bg-gradient-to-r from-[#ff4da6] to-[#66f0b8] text-black rounded-md font-bold shadow-lg uppercase"
                    >
                        Return to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6" style={{
            backgroundColor: '#030014',
            backgroundImage: `
                radial-gradient(circle at 10% 10%, rgba(255,0,150,0.06), transparent 10%),
                linear-gradient(180deg, rgba(2,6,23,0.8), rgba(0,4,10,0.9)),
                repeating-linear-gradient(0deg, rgba(0,255,200,0.02) 0 1px, transparent 1px 28px)
            `,
            backgroundBlendMode: 'screen, normal, overlay',
            backgroundSize: 'cover'
        }}>
            <div className="w-full max-w-4xl mx-auto px-6">
                <div className="bg-[linear-gradient(180deg,#071018,_#001018)] border border-pink-500/20 rounded-3xl p-8 shadow-[0_30px_80px_rgba(2,6,23,0.7)] backdrop-blur-sm" style={{boxShadow: '0 40px 120px rgba(0,0,0,0.7), inset 0 0 60px rgba(255,20,147,0.03)'}}>

                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/home')}
                                className="px-3 py-2 bg-transparent text-[#9fffd6] border border-cyan-400/10 rounded-md font-mono hover:bg-black/10"
                            >
                                <svg className="w-5 h-5 inline-block mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
                                </svg>
                                Back
                            </button>
                            <div>
                                <h1 className="text-3xl font-black text-[#7af2d6]">{listTitle}</h1>
                                <div className="text-sm text-[#66f0b8] font-mono uppercase tracking-wide">Manage your items</div>
                            </div>
                        </div>
                        <div>
                            <button
                                onClick={() => navigate('/home')}
                                className="px-4 py-2 bg-gradient-to-r from-[#ff4da6] to-[#66f0b8] text-black rounded-md font-bold shadow-md"
                            >
                                Home
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-6 px-4 py-3 rounded-md bg-black/40 border border-red-600 text-red-400 font-bold font-mono">{error}</div>
                    )}

                    {success && (
                        <div className="mb-6 px-4 py-3 rounded-md bg-black/30 border border-green-600 text-green-300 font-bold font-mono">{success}</div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Add Item Section */}
                        <div className="bg-[#001018] border border-pink-600/10 p-6 rounded-2xl">
                            <h2 className="text-xl font-black mb-4 text-[#7af2d6] font-mono">Add New Task</h2>
                            <div className="grid grid-cols-1 gap-4 mb-4">
                                <div>
                                    <label className="block text-[11px] text-[#9fffd6] mb-2 uppercase">Description</label>
                                    <input
                                        type="text"
                                        className="w-full bg-[#00161a] text-[#7ef1c9] placeholder-[#2a6a63] px-4 py-3 rounded-md border border-transparent focus:outline-none font-mono"
                                        value={desc}
                                        onChange={(e) => { setDesc(e.target.value); if (error) setError(""); }}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] text-[#9fffd6] mb-2 uppercase">Status</label>
                                    <select
                                        className="w-full bg-[#00161a] text-[#7ef1c9] px-4 py-3 rounded-md border border-transparent focus:outline-none font-mono"
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
                                className="w-full py-3 bg-gradient-to-r from-[#ff4da6] to-[#66f0b8] text-black font-bold rounded-md shadow-lg uppercase"
                            >
                                {addingItem ? 'adding...' : 'Add Task to List'}
                            </button>
                        </div>

                        {/* Items Section */}
                        <div className="bg-[#001018] border border-pink-600/10 p-6 rounded-2xl">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-black text-[#7af2d6]">Tasks ({items.length})</h2>
                                <div className="h-1 flex-1 mx-4 bg-gradient-to-r from-[#ff4da6] to-[#66f0b8] rounded-full" style={{height: '6px'}}></div>
                            </div>

                            {items.length === 0 ? (
                                <div className="text-center py-8 bg-transparent rounded-2xl border-2 border-dashed border-pink-600/20">
                                    <svg className="w-12 h-12 mx-auto mb-4 text-[#7af2d6]" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.707a1 1 0 00-1.414-1.414L9 9.586 7.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                    </svg>
                                    <p className="text-[#9fffd6] font-bold uppercase">No tasks yet. Ready to start?</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {items.map((item, idx) => (
                                        <div key={item.id} className={`p-4 rounded-lg border border-pink-600/10 bg-transparent ${idx % 2 === 0 ? '' : 'bg-black/5'}`}>
                                            {editingItem === item.id ? (
                                                <div className="space-y-4">
                                                    <input
                                                        type="text"
                                                        value={editDesc}
                                                        onChange={(e) => setEditDesc(e.target.value)}
                                                        className="w-full bg-[#00161a] text-[#7ef1c9] px-4 py-2 rounded-md border border-transparent font-mono"
                                                    />
                                                    <div className="flex gap-3">
                                                        <button
                                                            onClick={handleSaveEdit}
                                                            className="flex-1 px-4 py-2 bg-gradient-to-r from-[#ff4da6] to-[#66f0b8] text-black rounded-md font-bold"
                                                        >
                                                            Save Changes
                                                        </button>
                                                        <button
                                                            onClick={handleCancelEdit}
                                                            className="px-4 py-2 bg-transparent text-[#9fffd6] rounded-md border border-cyan-400/10 font-bold"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex justify-between items-start gap-4">
                                                    <div className="flex-1">
                                                        <p className={`text-lg font-bold mb-2 ${item.status === 'completed' ? 'text-gray-400 line-through' : 'text-[#c7f7e9]'}`}>
                                                            {item.description}
                                                        </p>
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${item.status === 'completed' ? 'bg-green-500/20 text-[#9fffd6] border border-green-400/20' :
                                                            item.status === 'in-progress' ? 'bg-blue-500/20 text-[#9fffd6] border border-blue-400/20' :
                                                            'bg-yellow-500/20 text-[#9fffd6] border border-yellow-400/20'}`}>
                                                            {item.status}
                                                        </span>
                                                    </div>
                                                    <div className="flex gap-2 opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => handleEditClick(item)}
                                                            className="px-3 py-2 bg-gradient-to-r from-[#ff4da6] to-[#66f0b8] text-black rounded-md font-bold"
                                                            title="Edit Task"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteItem(item.id)}
                                                            className="px-3 py-2 bg-red-500/10 text-[#ffd3a0] rounded-md border border-red-400/10 font-bold"
                                                            title="Delete Task"
                                                        >
                                                            Delete
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
        </div>
    );
}

export default ListItem;
