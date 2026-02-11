import { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';


function register() {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (!name.trim() || !username.trim() || !password.trim() || !confirmPass.trim()) {
            setError('Please fill in all fields');
            return;
        }

        if (password !== confirmPass) {
            setError('Passwords do not match');
            return;
        }


        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/register`, { name, username, password, confirm: confirmPass });
            console.log(response.data);
            navigate("/");
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
                    <h1 className="text-2xl font-bold text-center mb-2 text-black">Create Account</h1>
                    <p className="text-center text-gray-700 text-sm mb-6 font-semibold">Join us today!</p>

                    {error && (
                        <p className="text-red-600 text-sm mb-4 bg-red-50 p-3 rounded-2xl border-2 border-red-300 font-semibold">{error}</p>
                    )}

                    <form onSubmit={handleRegister}>
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-1 text-black uppercase">Full Name</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border-2 border-black rounded-2xl focus:outline-none focus:ring-2 focus:ring-black bg-white"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    if (error) setError('');
                                }}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-1 text-black uppercase">Username</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border-2 border-black rounded-2xl focus:outline-none focus:ring-2 focus:ring-black bg-white"
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value);
                                    if (error) setError('');
                                }}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-1 text-black uppercase">Password</label>
                            <input
                                type="password"
                                className="w-full px-4 py-2 border-2 border-black rounded-2xl focus:outline-none focus:ring-2 focus:ring-black bg-white"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (error) setError('');
                                }}
                            />
                        </div>

                        <div className="mb-5">
                            <label className="block text-sm font-bold mb-1 text-black uppercase">Confirm Password</label>
                            <input
                                type="password"
                                className="w-full px-4 py-2 border-2 border-black rounded-2xl focus:outline-none focus:ring-2 focus:ring-black bg-white"
                                value={confirmPass}
                                onChange={(e) => {
                                    setConfirmPass(e.target.value);
                                    if (error) setError('');
                                }}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-black text-white rounded-2xl hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed font-bold uppercase transition-all active:scale-95 border-2 border-black"
                        >
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-4 text-center text-sm text-gray-700 font-semibold">
                        Already have an account?{' '}
                        <a href="/" className="text-black hover:underline font-bold">
                            Login here
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default register;