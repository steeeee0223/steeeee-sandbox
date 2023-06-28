import { useEffect } from "react";
import { shallowEqual } from "react-redux";

import { useAppDispatch, useAppSelector } from "@/hooks";
import { setProject } from "@/stores/project";

export default function Home() {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(
        (state) => ({ user: state.auth.user }),
        shallowEqual
    );

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
