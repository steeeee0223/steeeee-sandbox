import { useEffect } from "react";

import { useAppDispatch } from "@/hooks";
import { setProject } from "@/stores/project";

export default function Home() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setProject(null));
    }, []);

    return (
        <div>
            <h1>Home Page!</h1>
            <p>This is my sample code registry</p>
        </div>
    );
}
