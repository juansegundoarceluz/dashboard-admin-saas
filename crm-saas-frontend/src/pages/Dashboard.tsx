import { useEffect, useState } from "react";

type Project = {
    id: string;
    name: string;
};

export default function Dashboard() {
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        const fetchProjects = async () => {
            const token = localStorage.getItem("token");

            const res = await fetch("http://localhost:3001/api/projects", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            setProjects(data);
        };

        fetchProjects();
    }, []);

    return (
        <div className="min-h-screen p-6 text-white bg-gray-900">
            <div className="flex justify-end w-full">
                <button
                    onClick={() => {
                        localStorage.removeItem("token");
                        window.location.reload();
                    }}
                    className="p-2 text-white transition duration-300 bg-green-500 rounded hover:scale-110"
                >
                    Logout
                </button>
            </div>
            <h1 className="mb-6 text-3xl font-bold text-center">
                Dashboard
            </h1>

            <div className="max-w-xl mx-auto">
                {projects.length === 0 ? (
                    <p className="text-center text-gray-400">
                        No hay proyectos todavía
                    </p>
                ) : (
                    projects.map((project) => (
                        <div
                            key={project.id}
                            className="p-4 mb-3 bg-gray-800 rounded-lg shadow"
                        >
                            {project.name}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}