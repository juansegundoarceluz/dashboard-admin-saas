import { useState } from "react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        const res = await fetch("http://localhost:3001/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        console.log(data);
    };

    return (
        <div className="h-screen flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl shadow-md w-80">
                <h2 className="text-xl font-bold mb-4">Login</h2>

                <input
                    className="w-full mb-2 p-2 border rounded"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    className="w-full mb-4 p-2 border rounded"
                    placeholder="Password"
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    onClick={handleLogin}
                    className="w-full bg-blue-500 text-white p-2 rounded"
                >
                    Login
                </button>
            </div>
        </div>
    );
}