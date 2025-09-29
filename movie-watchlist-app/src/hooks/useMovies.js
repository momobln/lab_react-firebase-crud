import { useState, useEffect, useCallback } from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../config/firebase";

const API_URL = import.meta.env.VITE_DATABASE_URL;

export function useMovies(){
    const [user] = useAuthState(auth);
    const [movies, setMovies]= useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMovies = useCallback(async () => {
        setLoading(true); setError(null);
        try{
            const res = await fetch(`${API_URL}/movies.json`);
            if(!res.ok) throw new Error("Faild to Fetch Movies");
            const data = await res.json();
            const list = data ? Object.entries(data).map(([id, v]) => ({id, ...v})) : [];
                setMovies(list.reverse());
        }catch(e){ setError(e.message);}
        finally{ setLoading(false);}
    }, []);

    useEffect(() => {fetchMovies(); },[fetchMovies]);


    const addMovie = async (title) => {
        if(!user) throw new Error("Login required");
        const token = await user.getIdToken();
        const body = { title, uid: user.id, authorName: user.displayName || "Anonymous"};
        const res = await fetch(`${API_URL}/movies.json?auth=${token}`, {
            method: "POST", headers:{"content-Type":"application/json"}, body: JSON.stringify(body)
        });
        if(!res.ok){ const j = await res.json(); throw new Error(j.error || "Faild to add movie");}
        await fetchMovies();
    };

    const deleteMovie = async (movieId) => {
        if(!user) throw new Error("Login required");
        const token = await user.getIdToken();
        const res = await fetch(`${API_URL}/movies/${movieId}.json?auth=${token}`, {method:"DELETE"});

        if (!res.ok){ const j = await res.json(); throw new Error(j.error || "Faild to delete movie");}
        await fetchMovies();
    };

    return { movies, loading, error, addMovie, deleteMovie, user};
}