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
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

            {projects.map((project) => (
                <div key={project.id} className="border p-3 mb-2 rounded">
                    {project.name}
                </div>
            ))}
        </div>
    );
}