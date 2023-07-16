import { useAuth } from "@/hooks";

export default function Home() {
    const { user } = useAuth();

    return (
        <div>
            <h1>Home Page!</h1>
            {user && <h3>Welcome, {user.displayName}</h3>}
            <p>This is my sample code registry</p>
        </div>
    );
}
