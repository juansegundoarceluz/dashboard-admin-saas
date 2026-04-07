import { useState } from "react";

type Register = {
    id: string;
    name: string;
};

type RegisterProps = {
    switchToLogin: () => void;
};


export default function Register({ switchToLogin }: RegisterProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async () => {
        const res = await fetch("http://localhost:3001/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        console.log(data);

        alert("Usuario creado! Ahora inicia sesión");
        switchToLogin();
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="p-6 bg-white shadow-md rounded-xl w-80">
                <h2 className="mb-4 text-xl">Register</h2>

                <input
                    className="w-full p-2 mb-2 text-black rounded"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    className="w-full p-2 mb-4 text-black rounded"
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    onClick={handleRegister}
                    className="w-full p-2 text-white transition duration-300 bg-green-500 rounded hover:scale-103"
                >
                    Register
                </button>

                <p
                    className="mt-4 text-sm text-blue-400 cursor-pointer"
                    onClick={switchToLogin}
                >
                    Ya tienes cuenta? Login
                </p>
            </div>
        </div>
    );
}