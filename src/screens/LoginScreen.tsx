import { useState } from 'react';

export default function LoginScreen({ login }: { login: (u: string, p: string) => Promise<any> }) {
    const [form, setForm] = useState({ username: '', password: '' });
    const [error, setError] = useState<string | null>(null);

    return (
        <div className="max-w-sm mx-auto mt-20 space-y-4">
            <h1 className="text-2xl font-semibold">Log in to Bruttobar</h1>
            <input
                className="w-full p-2 border rounded"
                placeholder="Email"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
            <input
                type="password"
                className="w-full p-2 border rounded"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <button
                className="w-full py-2 bg-indigo-600 text-white rounded"
                onClick={async () => {
                    try {
                        await login(form.username, form.password);
                    } catch (err: any) {
                        setError(err.message || 'Login failed');
                    }
                }}
            >
                Log in
            </button>
        </div>
    );
}
