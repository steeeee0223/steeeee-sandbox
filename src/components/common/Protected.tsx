import { ReactNode, useEffect } from "react";
import { Navigate } from "react-router-dom";

import { useAuthContext } from "@/contexts/auth";

interface ProtectedProps {
    children: ReactNode;
}

const Protected = ({ children }: ProtectedProps) => {
    const { user } = useAuthContext();
    useEffect(() => {}, [user]);

    return user ? <>{children}</> : <Navigate to="/login" />;
};

export default Protected;
