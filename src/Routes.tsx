import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Home, Demo, Dashboard, Project } from "@/pages";

export function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/">
                    <Route index element={<Home />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="demo/:projectId" element={<Demo />} />
                    <Route path="project/:projectId" element={<Project />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
