import { pathsWithoutSidebar } from "@/data";
import { Location, useLocation } from "react-router-dom";
import { useAppDispatch } from "./stores";
import { useEffect } from "react";
import { setProject } from "@/stores/project";

type Path = Location & {
    path: string[];
    isLoginPage: boolean;
    isPageWithSidebar: boolean;
};

export default function usePath(): Path {
    const dispatch = useAppDispatch();
    const location = useLocation();

    const path = location.pathname.split("/");
    const [, pathname, id] = path;

    const isPageWithSidebar = !pathsWithoutSidebar.includes(pathname);
    const isLoginPage = pathname === "";

    useEffect(() => {
        if (pathname === "project" && id) {
            dispatch(setProject({ id, action: "edit" }));
            console.log(`setting project to: ${id}`);
        } else if (pathname === "demo" && id) {
            dispatch(setProject({ id, action: "demo" }));
            console.log(`setting project to: ${id}`);
        } else {
            dispatch(setProject(null));
        }
    }, [id]);

    return {
        ...location,
        path,
        isPageWithSidebar,
        isLoginPage,
    };
}
