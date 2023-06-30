import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "@/hooks";

interface ProtectedProps {
    children: ReactNode;
}

const Protected = ({ children }: ProtectedProps) => {
    const { user } = useAuth();

    return user ? <>{children}</> : <Navigate to="/" />;
};

export default Protected;
