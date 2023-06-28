import { Location, useLocation } from "react-router-dom";

type Path = Location & {
    path: string[];
};

export default function usePath(): Path {
    const location = useLocation();
    const path = location.pathname.split("/");
    return { path, ...location };
}
