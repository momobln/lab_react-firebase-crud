import { useAuthState } from "react-firebase-hooks/auth";//Imports a hook that subscribes to Firebase Auth state and returns user/loading.

import {auth, loginWithGoogle, logout} from "../config/firebase";

export default function Auth() {
    const [user, loading] = useAuthState(auth);
    if (loading) return <button disabled>Loading..</button>;
    return user? (
        <div style={{display:"flex", gap:8, alignItems:"center"}}>
            {user.photoURL && <img src={user.photoURL} width={28} height={28} style={{ borderRadius:999 }}/>}
            <span>{user.displayName}</span>
            <button onClick={logout}>Logout</button>
        </div>
    ) : (
        <button onClick={loginWithGoogle}>Sign in with Google</button>
    );
}
