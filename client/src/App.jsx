import { useState } from "react";
import axios from 'axios';
import { Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';


function App() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!username.trim() || !password.trim()) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/login`, { username, password });
            console.log(response.data);
            navigate("/home")
        } catch (error) {
            console.error('There was an error!', error.response?.data || error.message);
            setError(error.response?.data?.message || error.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4" style={{
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
            <div className="w-full max-w-sm">
                <div className="bg-white border-4 border-black rounded-3xl p-6 shadow-xl">
                    <h1 className="text-2xl font-bold text-center mb-2 text-black">Login</h1>
                    <p className="text-center text-gray-700 text-sm mb-6 font-semibold">Welcome back!</p>

                    {error && (
                        <p className="text-red-600 text-sm mb-4 bg-red-50 p-3 rounded-2xl border-2 border-red-300 font-semibold">
                            {error}
                        </p>
                    )}

                    <form onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-1 text-black uppercase">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value);
                                    if (error) setError('');
                                }}
                                className="w-full px-4 py-2 border-2 border-black rounded-2xl focus:outline-none focus:ring-2 focus:ring-black bg-white"
                            />
                        </div>

                        <div className="mb-5">
                            <label className="block text-sm font-bold mb-1 text-black uppercase">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (error) setError('');
                                }}
                                className="w-full px-4 py-2 border-2 border-black rounded-2xl focus:outline-none focus:ring-2 focus:ring-black bg-white"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-black text-white rounded-2xl hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed font-bold uppercase transition-all active:scale-95 border-2 border-black"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <div className="mt-4 text-center text-sm text-gray-700 font-semibold">
                        Don't have an account?{' '}
                        <a href="/register" className="text-black hover:underline font-bold">
                            Sign up
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
