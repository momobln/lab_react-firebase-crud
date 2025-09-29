import { useState } from "react";
import { useMovies } from "../hooks/useMovies.js";

export default function MovieList(){
  const { movies, loading, error, addMovie, deleteMovie, user } = useMovies();
  const [title, setTitle] = useState("");

  const submit = async (e)=>{
    e.preventDefault();
    if(!title.trim()) return;
    try{ await addMovie(title.trim()); setTitle(""); }
    catch(err){ alert(err.message); }
  };

  return (
    <section>
      {user && (
        <form onSubmit={submit} style={{ display:"flex", gap:8, marginBottom:12 }}>
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g., The Matrix"/>
          <button type="submit">Add Movie</button>
        </form>
      )}

      <h2>Movie Wishlist</h2>
      {loading && <p>Loading…</p>}
      {error && <p style={{ color:"red" }}>{error}</p>}
      {!loading && movies.length===0 && <p>No movies yet.</p>}

      <ul style={{ padding:0, listStyle:"none", display:"grid", gap:8 }}>
        {movies.map(m=>(
          <li key={m.id} style={{ display:"flex", justifyContent:"space-between" }}>
            <span><strong>{m.title}</strong> — by {m.authorName}</span>
            {user?.uid===m.uid && <button onClick={()=>deleteMovie(m.id)}>Delete</button>}
          </li>
        ))}
      </ul>
    </section>
  );
}
