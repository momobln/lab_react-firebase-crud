import { useAuthState } from "react-firebase-hooks/auth"; 
import { Navigate} from "react-router-dom";
import {auth} from "../config/firebase";

export default function ProtectedRoute ({ childern }){
    const [user, loading ] = useAuthState(auth);
    if (loading) return <div>Loading session...</div>;
    if (!user) return <Navigate to="/login" replace />;
    return <>{childern}</>;
}