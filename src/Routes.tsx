import { Route, Routes } from "react-router-dom";

import { Home, Demo, Dashboard, Project, Login, Introduction } from "@/pages";
import { Protected } from "@/components/common";

export function AppRoutes() {
    return (
        <Routes>
            <Route path="/">
                <Route index element={<Introduction />} />
                <Route path="login" element={<Login />} />
                <Route
                    path="home"
                    element={
                        <Protected>
                            <Home />
                        </Protected>
                    }
                />
                <Route
                    path="dashboard"
                    element={
                        <Protected>
                            <Dashboard />
                        </Protected>
                    }
                />
                <Route path="demo/:projectId" element={<Demo />} />
                <Route
                    path="project/:projectId"
                    element={
                        <Protected>
                            <Project />
                        </Protected>
                    }
                />
            </Route>
        </Routes>
    );
}
