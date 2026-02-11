import Header from "../components/header";
import { useState, useEffect } from "react";
import axios from "axios";
import { Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function home() {
    const [title, setTitle] = useState("");
    const [status, setStatus] = useState("");
    const navigate = useNavigate();
    const [lists, setLists] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const handleLogout = async () => {
        try {
            const response = await axios.post(`${API_URL}/logout`);
            console.log(response.data);
            setSuccess(response.data?.message || "Logged out Successfully");
            setTimeout(() => navigate("/"), 1000);
        } catch (error) {
            console.error(
                "There was an error!",
                error.response?.data || error.message,
            );
            setError(
                error.response?.data?.message || error.message || "An error occurred",
            );
        }
    };

    const handleSubmit = async () => {
        try {
            let response;
            if (editingItem) {
                response = await axios.post(`${API_URL}/edit-list`, {
                    id: editingItem.id,
                    title,
                    status,
                });
                setSuccess(response.data?.message || "List Updated successfully");
            } else {
                response = await axios.post(`${API_URL}/add-list`, {
                    title,
                    status,
                });
                setSuccess(response.data?.message || "List Added successfully");
            }
            console.log(response.data);
            fetchList();
            setTitle("");
            setStatus("");
            setEditingItem(null);
            setShowForm(false);
            navigate("/home");
        } catch (error) {
            console.error(
                "There was an error!",
                error.response?.data || error.message,
            );
            setError(
                error.response?.data?.message || error.message || "An error occurred",
            );
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.post(`${API_URL}/delete-list`, { id });
            console.log(response.data);
            setSuccess(response.data?.message || "List Deleted successfully");
            fetchList();
        } catch (error) {
            console.error(
                "There was an error!",
                error.response?.data || error.message,
            );
            setError(
                error.response?.data?.message || error.message || "An error occurred",
            );
        }
    };

    const handleEdit = (item) => {
        setTitle(item.title);
        setStatus(item.status);
        setEditingItem(item);
        setShowForm(true);
    };

    const handleOpen = (item) => {
        navigate('/list-item', { state: { listId: item.id, listTitle: item.title } });
    };
    /*   const handleEditlist = async () => {
        try {
          const response = await axios.get(`${API_URL}/edit-list`, {
            title,
            stats,
          });
          setLists(response.data);
        } catch (error) {
          console.error(
            "There was an error!",
            error.response?.data || error.message,
          );
          alert(
            error.response?.data?.message || error.message || "An error occurred",
          );
        }
      }; */

    const fetchList = async () => {
        try {
            const response = await axios.get(`${API_URL}/get-list`);
            console.log(response.data);
            setLists(response.data.list);
        } catch (error) {
            console.error(
                "There was an error!",
                error.response?.data || error.message,
            );
            setError(
                error.response?.data?.message || error.message || "An error occurred",
            );
        }
    };

    useEffect(() => {
        fetchList();
    }, []);

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
            <div className="p-6">
                <div className="bg-white border-4 border-black p-8 rounded-3xl shadow-xl mb-8">
                    <div className="flex justify-between items-center">
                        <h1 className="text-4xl font-black text-black">My Tasks</h1>
                        <button
                            onClick={handleLogout}
                            className="bg-black hover:bg-gray-900 text-white px-6 py-3 rounded-2xl transition-all shadow-lg active:scale-95 font-bold uppercase border-2 border-black"
                        >
                            Logout
                        </button>
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

                <div className="bg-white border-4 border-black p-8 rounded-3xl shadow-xl">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-3xl font-black text-black">Your Lists</h2>
                            <p className="text-gray-700 text-sm mt-1 font-semibold uppercase">Manage and organize your tasks.</p>
                        </div>
                        <button
                            onClick={() => setShowForm(true)}
                            className="bg-black hover:bg-gray-900 text-white px-6 py-3 rounded-2xl transition-all shadow-xl active:scale-95 font-bold uppercase flex items-center gap-2 border-2 border-black"
                        >
                            <span className="text-xl leading-none">+</span> Add List
                        </button>
                    </div>

                    {showForm && (
                        <div className="mb-10 p-8 bg-gray-100 border-4 border-black rounded-3xl animate-in fade-in slide-in-from-top-4 duration-300">
                            <h3 className="text-2xl font-black mb-6 text-black flex items-center gap-2">
                                {editingItem ? (
                                    <>
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                                        </svg>
                                        Edit List
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000-2H6a4 4 0 100 8H4a1 1 0 100 2h2a2 2 0 012 2H4a4 4 0 01-4-4V5z"/>
                                        </svg>
                                        Create New List
                                    </>
                                )}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div>
                                    <label className="block text-sm font-black mb-2 text-black uppercase">List Title</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 border-2 border-black rounded-2xl focus:outline-none focus:ring-2 focus:ring-black bg-white shadow-md transition-all"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-black mb-2 text-black uppercase">Status</label>
                                    <select
                                        className="w-full px-4 py-3 border-2 border-black rounded-2xl focus:outline-none focus:ring-2 focus:ring-black bg-white shadow-md transition-all"
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                    >
                                        <option value="">Select status...</option>
                                        <option value="Pending">Pending</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={() => {
                                        setShowForm(false);
                                        setEditingItem(null);
                                        setTitle("");
                                        setStatus("");
                                    }}
                                    className="px-6 py-3 bg-white text-black hover:bg-gray-200 border-2 border-black rounded-2xl transition-all font-bold uppercase"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="px-8 py-3 bg-black text-white hover:bg-gray-900 rounded-2xl transition-all shadow-lg font-bold active:scale-95 uppercase border-2 border-black"
                                >
                                    {editingItem ? "Update Changes" : "Create List"}
                                </button>
                            </div>
                        </div>
                    )}

                    {lists.length === 0 ? (
                        <div className="text-center py-16 bg-gray-200 rounded-3xl border-4 border-dashed border-black">
                            <svg className="w-12 h-12 mx-auto mb-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000-2H6a4 4 0 100 8H4a1 1 0 100 2h2a2 2 0 012 2H4a4 4 0 01-4-4V5z"/>
                            </svg>
                            <p className="text-black font-bold uppercase">No lists yet. Create your first list!</p>
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-3xl border-4 border-black">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-black text-white">
                                        <th className="px-6 py-4 text-left text-sm font-black uppercase tracking-wider">Title</th>
                                        <th className="px-6 py-4 text-left text-sm font-black uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-center text-sm font-black uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y-2 divide-black">
                                    {lists.map((item, index) => (
                                        <tr key={item.id || index} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'} hover:bg-gray-300 transition-colors group border-l-4 border-l-black`}>
                                            <td className="px-6 py-4 text-black font-bold">{item.title}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${item.status === 'Completed' ? 'bg-green-300 text-black border-2 border-black' :
                                                    item.status === 'In Progress' ? 'bg-blue-300 text-black border-2 border-black' :
                                                        'bg-yellow-300 text-black border-2 border-black'
                                                    }`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex justify-center gap-2">
                                                    <button
                                                        onClick={() => handleOpen(item)}
                                                        className="p-2 bg-black hover:bg-gray-800 text-white rounded-xl transition-all active:scale-90 border-2 border-black"
                                                        title="Open"
                                                    >
                                                        <span className="text-sm font-bold">View</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleEdit(item)}
                                                        className="p-2 bg-gray-300 hover:bg-gray-400 text-black rounded-xl transition-all active:scale-90 border-2 border-black font-bold"
                                                        title="Edit"
                                                    >
                                                        <span className="text-sm">Edit</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="p-2 bg-red-300 hover:bg-red-400 text-black rounded-xl transition-all active:scale-90 border-2 border-black font-bold"
                                                        title="Delete"
                                                    >
                                                        <span className="text-sm">Delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}


                </div>
            </div>
        </div>
    );
}

export default home;
