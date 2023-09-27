import { useEffect } from "react";
import { Location, useLocation } from "react-router-dom";

import { pathsWithoutSidebar } from "@/data";
import { useProjects } from "./projects";

type Path = Location & {
    path: string[];
    isHomePage: boolean;
    isPageWithSidebar: boolean;
};

export default function usePath(): Path {
    const location = useLocation();
    const { select, reset } = useProjects();

    const path = location.pathname.split("/");
    const [, pathname, id] = path;

    const isPageWithSidebar = !pathsWithoutSidebar.includes(pathname);
    const isHomePage = pathname === "";

    useEffect(() => {
        if (pathname === "project" && id) {
            console.log(`setting project to: ${id}`);
            select(id, "edit");
        } else if (pathname === "demo" && id) {
            console.log(`setting project to: ${id}`);
            select(id, "demo");
        } else {
            reset();
        }
    }, [id]);

    return {
        ...location,
        path,
        isPageWithSidebar,
        isHomePage,
    };
}
