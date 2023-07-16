import { Route, Routes } from "react-router-dom";

import {
    Home,
    Demo,
    Dashboard,
    Project,
    Login,
    Introduction,
    Playground,
    Discover,
} from "@/pages";
import { Protected, NotFound } from "@/components/common";

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
                <Route path="playground" element={<Playground />} />
                <Route path="discover" element={<Discover />} />
                <Route path="demo/:projectId" element={<Demo />} />
                <Route
                    path="project/:projectId"
                    element={
                        <Protected>
                            <Project />
                        </Protected>
                    }
                />
                <Route
                    path="*"
                    element={<NotFound message="Page Not Found" />}
                />
            </Route>
        </Routes>
    );
}
