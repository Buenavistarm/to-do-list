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
        <div className="min-h-screen flex items-center justify-center p-6" style={{
            backgroundColor: '#030014',
            backgroundImage: `
                radial-gradient(circle at 10% 10%, rgba(255,0,150,0.06), transparent 10%),
                linear-gradient(180deg, rgba(2,6,23,0.8), rgba(0,4,10,0.9)),
                repeating-linear-gradient(0deg, rgba(0,255,200,0.02) 0 1px, transparent 1px 28px),
                repeating-linear-gradient(90deg, rgba(255,0,150,0.02) 0 1px, transparent 1px 28px)
            `,
            backgroundBlendMode: 'screen, normal, overlay, overlay',
            backgroundSize: 'cover'
        }}>
            <div className="w-full max-w-6xl mx-auto px-6">
                <div className="bg-[linear-gradient(180deg,#071018,_#001018)] border border-pink-500/20 rounded-3xl p-8 shadow-[0_30px_80px_rgba(2,6,23,0.7)] backdrop-blur-sm" style={{boxShadow: '0 40px 120px rgba(0,0,0,0.7), inset 0 0 60px rgba(255,20,147,0.03)'}}>

                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-6">
                            <h1 className="text-4xl font-black text-[#7af2d6]">My Tasks</h1>
                            <div className="text-sm text-[#66f0b8] font-mono uppercase tracking-wide">Manage and organize your tasks.</div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setShowForm(true)}
                                className="px-5 py-3 bg-gradient-to-r from-[#ff4da6] to-[#66f0b8] text-black font-bold rounded-xl shadow-[0_10px_30px_rgba(102,240,184,0.12)] border border-transparent uppercase"
                            >
                                + Add List
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-5 py-3 bg-transparent text-[#9fffd6] font-bold rounded-xl border border-cyan-400/10 hover:bg-black/20 uppercase">
                                Logout
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-6 px-4 py-3 rounded-md bg-black/40 border border-red-600 text-red-400 font-bold font-mono">{error}</div>
                    )}

                    {success && (
                        <div className="mb-6 px-4 py-3 rounded-md bg-black/30 border border-green-600 text-green-300 font-bold font-mono">{success}</div>
                    )}

                    {showForm && (
                        <div className="mb-8 p-6 bg-[#001018] border border-pink-600/10 rounded-2xl shadow-inner">
                            <h3 className="text-xl font-black mb-4 text-[#7af2d6] font-mono">{editingItem ? 'Edit List' : 'Create New List'}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                                <div>
                                    <label className="block text-[11px] text-[#9fffd6] mb-2 uppercase">List Title</label>
                                    <input
                                        type="text"
                                        className="w-full bg-[#00161a] text-[#7ef1c9] placeholder-[#2a6a63] px-4 py-3 rounded-md border border-transparent focus:outline-none font-mono"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] text-[#9fffd6] mb-2 uppercase">Status</label>
                                    <select
                                        className="w-full bg-[#00161a] text-[#7ef1c9] px-4 py-3 rounded-md border border-transparent focus:outline-none font-mono"
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
                                    onClick={() => { setShowForm(false); setEditingItem(null); setTitle(''); setStatus(''); }}
                                    className="px-6 py-3 bg-transparent text-[#9fffd6] border border-cyan-400/10 rounded-md font-bold uppercase"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="px-6 py-3 bg-gradient-to-r from-[#ff4da6] to-[#66f0b8] text-black font-bold rounded-md uppercase shadow-lg"
                                >
                                    {editingItem ? 'Update Changes' : 'Create List'}
                                </button>
                            </div>
                        </div>
                    )}

                    {lists.length === 0 ? (
                        <div className="text-center py-14 bg-transparent rounded-2xl border-2 border-dashed border-pink-600/20">
                            <svg className="w-12 h-12 mx-auto mb-4 text-[#7af2d6]" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000-2H6a4 4 0 100 8H4a1 1 0 100 2h2a2 2 0 012 2H4a4 4 0 01-4-4V5z"/>
                            </svg>
                            <p className="text-[#9fffd6] font-bold uppercase">No lists yet. Create your first list!</p>
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-2xl border border-pink-600/10 bg-[#001018]">
                            <table className="w-full border-collapse text-sm font-mono text-[#9fffd6]">
                                <thead>
                                    <tr className="bg-black/40 text-[#7af2d6]">
                                        <th className="px-6 py-4 text-left font-black uppercase tracking-wider">Title</th>
                                        <th className="px-6 py-4 text-left font-black uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-center font-black uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-pink-800/10">
                                    {lists.map((item, index) => (
                                        <tr key={item.id || index} className={`${index % 2 === 0 ? 'bg-transparent' : 'bg-black/10'} hover:bg-black/20 transition-colors group`}>
                                            <td className="px-6 py-4 text-[#c7f7e9] font-bold">{item.title}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${item.status === 'Completed' ? 'bg-green-500/20 text-[#9fffd6] border border-green-400/20' :
                                                    item.status === 'In Progress' ? 'bg-blue-500/20 text-[#9fffd6] border border-blue-400/20' :
                                                    'bg-yellow-500/20 text-[#9fffd6] border border-yellow-400/20'} `}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex justify-center gap-3">
                                                    <button
                                                        onClick={() => handleOpen(item)}
                                                        className="px-3 py-2 bg-gradient-to-r from-[#ff4da6] to-[#66f0b8] text-black rounded-md font-bold border border-transparent"
                                                        title="Open"
                                                    >
                                                        View
                                                    </button>
                                                    <button
                                                        onClick={() => handleEdit(item)}
                                                        className="px-3 py-2 bg-transparent text-[#9fffd6] rounded-md border border-cyan-400/10 font-bold"
                                                        title="Edit"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="px-3 py-2 bg-red-500/10 text-[#ffd3a0] rounded-md border border-red-400/10 font-bold"
                                                        title="Delete"
                                                    >
                                                        Delete
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
