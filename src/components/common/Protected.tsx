import { ReactNode, useEffect } from "react";
import { shallowEqual } from "react-redux";
import { Navigate } from "react-router-dom";

import { useAppSelector } from "@/hooks";

interface ProtectedProps {
    children: ReactNode;
}

const Protected = ({ children }: ProtectedProps) => {
    const { user } = useAppSelector(
        (state) => ({ user: state.auth.user }),
        shallowEqual
    );
    useEffect(() => {}, [user]);

    return user ? <>{children}</> : <Navigate to="/login" />;
};

export default Protected;
