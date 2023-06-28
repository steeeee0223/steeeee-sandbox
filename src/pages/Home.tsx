import { useEffect } from "react";

import { useAuthContext } from "@/contexts/auth";
import { useAppDispatch } from "@/hooks";
import { setProject } from "@/stores/project";

export default function Home() {
    const { user } = useAuthContext();
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setProject(null));
    }, []);

    return (
        <div>
            <h1>Home Page!</h1>
            {user && <h3>Welcome, {user.displayName}</h3>}
            <p>This is my sample code registry</p>
        </div>
    );
}
