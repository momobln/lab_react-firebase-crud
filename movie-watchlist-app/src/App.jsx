/*import { Routes, Route, Link} from "react-router-dom";
import HomePage from "./pages/HomePage";
import WatchListPage from "./pages/WatchlistPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Auth from "./components/Auth";
impot{ auth } from "./config/firebase";

export default function App(){
  return (
    <div>
      <header style={{ display:"flex", gap:12, padding:12}}>
        <link to="/">Home</link>
        <link to="/watchList">Watchlist</link>
        <div style={{marginLeft:"auto"}}><Auth /></div>

      </header>
      <main style={{padding:12}}>
        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/Login" element={<LoginPage/>}/>
          <Route path="/watchlist" element={
            <ProtectedRoute>
              <WatchListPage/>
            </ProtectedRoute>
          }/>
        </Routes>

      </main>
    </div>
  );
}
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default*/ 

// src/App.jsx
import { Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import WatchlistPage from "./pages/WatchlistPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Auth from "./components/Auth.jsx";

export default function App() {
  return (
    <div>
      <header style={{ display: "flex", gap: 12, padding: 12 }}>
        <nav style={{ display: "flex", gap: 12 }}>
          <Link to="/">Home</Link>
          <Link to="/watchlist">Watchlist</Link>
        </nav>
        <div style={{ marginLeft: "auto" }}>
          <Auth />
        </div>
      </header>

      <main style={{ padding: 12 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/watchlist"
            element={
              <ProtectedRoute>
                <WatchlistPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
