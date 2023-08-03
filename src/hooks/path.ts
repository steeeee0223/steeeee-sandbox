import { useEffect } from "react";
import { Location, useLocation } from "react-router-dom";

import { pathsWithoutSidebar } from "@/data";
import { useProjects } from "./projects";

type Path = Location & {
    path: string[];
    isLoginPage: boolean;
    isPageWithSidebar: boolean;
};

export default function usePath(): Path {
    const location = useLocation();
    const { selectProject, resetProject } = useProjects();

    const path = location.pathname.split("/");
    const [, pathname, id] = path;

    const isPageWithSidebar = !pathsWithoutSidebar.includes(pathname);
    const isLoginPage = pathname === "";

    useEffect(() => {
        if (pathname === "project" && id) {
            console.log(`setting project to: ${id}`);
            selectProject(id, "edit");
        } else if (pathname === "demo" && id) {
            console.log(`setting project to: ${id}`);
            selectProject(id, "demo");
        } else {
            resetProject();
        }
    }, [id]);

    return {
        ...location,
        path,
        isPageWithSidebar,
        isLoginPage,
    };
}
