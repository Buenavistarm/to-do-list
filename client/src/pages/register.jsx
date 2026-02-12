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
            <div className="w-full max-w-2xl mx-auto px-6">
                <div className="bg-[linear-gradient(180deg,#071018,_#001018)] border border-pink-500/20 rounded-3xl p-8 shadow-[0_30px_80px_rgba(2,6,23,0.7)] backdrop-blur-sm flex gap-8 items-center" style={{boxShadow: '0 40px 120px rgba(0,0,0,0.7), inset 0 0 60px rgba(255,20,147,0.03)'}}>
                    <div className="w-full text-left font-mono text-sm text-[#9fffd6]">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-[#ff4da6] shadow-[0_0_12px_rgba(255,77,166,0.5)]"></div>
                                <div className="w-3 h-3 rounded-full bg-[#ffd34d] shadow-[0_0_12px_rgba(255,211,77,0.35)]"></div>
                                <div className="w-3 h-3 rounded-full bg-[#4dffec] shadow-[0_0_12px_rgba(77,255,236,0.35)]"></div>
                            </div>
                            <div className="text-[12px] text-[#7af2d6] opacity-90">rm@to-do:~</div>
                        </div>

                        <h1 className="text-2xl font-bold text-[#7af2d6] mb-2">create account</h1>
                        <div className="mb-4 text-[#66f0b8]">register a new user <span className="inline-block w-2 h-5 bg-[#66f0b8] ml-2 align-middle animate-pulse" /></div>

                        {error && (
                            <div className="mb-4 px-3 py-2 rounded-md bg-black/50 border border-red-600 text-red-400 font-bold">{error}</div>
                        )}

                        <form onSubmit={handleRegister} className="space-y-4">
                            <div>
                                <label className="block text-[11px] text-[#9fffd6] mb-2 uppercase">full name</label>
                                <input
                                    type="text"
                                    className="w-full bg-[#00161a] text-[#7ef1c9] placeholder-[#2a6a63] px-4 py-2 rounded-md border border-transparent focus:outline-none font-mono"
                                    placeholder="RM Grencio"
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                        if (error) setError('');
                                    }}
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] text-[#9fffd6] mb-2 uppercase">username</label>
                                <input
                                    type="text"
                                    className="w-full bg-[#00161a] text-[#7ef1c9] placeholder-[#2a6a63] px-4 py-2 rounded-md border border-transparent focus:outline-none font-mono"
                                    placeholder="user123"
                                    value={username}
                                    onChange={(e) => {
                                        setUsername(e.target.value);
                                        if (error) setError('');
                                    }}
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] text-[#9fffd6] mb-2 uppercase">password</label>
                                <input
                                    type="password"
                                    className="w-full bg-[#00161a] text-[#7ef1c9] placeholder-[#2a6a63] px-4 py-2 rounded-md border border-transparent focus:outline-none font-mono"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (error) setError('');
                                    }}
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] text-[#9fffd6] mb-2 uppercase">confirm password</label>
                                <input
                                    type="password"
                                    className="w-full bg-[#00161a] text-[#7ef1c9] placeholder-[#2a6a63] px-4 py-2 rounded-md border border-transparent focus:outline-none font-mono"
                                    placeholder="••••••••"
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
                                className="w-full py-3 text-black font-bold uppercase rounded-md transition-all"
                                style={{background: 'linear-gradient(90deg,#ff4da6,#66f0b8)', boxShadow: '0 8px 30px rgba(102,240,184,0.14), 0 0 40px rgba(255,77,166,0.12)'}}
                            >
                                {loading ? 'creating...' : 'create account'}
                            </button>
                        </form>

                        <div className="mt-5 text-[12px] text-[#7af2d6] opacity-90">Already have an account? <a href="/" className="text-[#ffd34d] underline">login</a></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default register;