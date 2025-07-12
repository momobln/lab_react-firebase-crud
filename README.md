# lab_react-firebase-crud

![logo_ironhack_blue 7](https://user-images.githubusercontent.com/23629340/40541063-a07a0a8a-601a-11e8-91b5-2f13e4e6b441.png)

# LAB | React with Firebase - CRUD

## Learning Goals

After this exercise, you will be able to:

- Set up a new Firebase project with Authentication and Realtime Database.
- Perform CRUD (Create, Read, Update, Delete) operations against the Firebase Realtime Database using its REST API.
- Structure data-fetching logic into a reusable custom React hook.
- Secure database access using Firebase Security Rules to protect user data.
- Build a full CRUD interface where authenticated users can manage their own data.

<br>

## Requirements

- Fork this repo.
- Clone this repo.
- You will need a Google account to create a Firebase project.
- A code editor like Visual Studio Code.
- A REST client like [Postman](https://www.postman.com/) or [Insomnia](https://insomnia.rest/) is recommended for testing but not required.

<br>

## Submission

- Upon completion, run the following commands:

```shell
$ git add .
$ git commit -m "Solved lab"
$ git push origin master
```

- Create a Pull Request so that your TAs can check your work.

<br>

## Test Your Code

This LAB is not equipped with automated unit tests. You will test your application's functionality by running it in the browser and using the Developer Tools.

1.  Run your React application using `npm run dev`.
2.  Open the application in your browser (usually `http://localhost:5173`).
3.  Use the browser's **Developer Tools** to check for console errors, inspect network requests, and debug your components. This is a critical skill for web developers.

<br>

## Instructions

The goal of this exercise is to build a "Movie Watchlist" application. Users will be able to sign in with their Google account to add movies to a personal watchlist, view their list, and remove movies. This lab will solidify your understanding of performing authenticated CRUD operations against a REST API.

You will build this project from scratch, following the iterations below.

### Iteration 0 - Project Setup

First, you need to set up your Firebase project and your local React development environment.

1.  **Firebase Project**:

    - Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project (e.g., `movie-watchlist`).
    - **Enable Authentication**: In the console, go to **Build > Authentication** and enable the **Google** sign-in provider.
    - **Enable Realtime Database**: Go to **Build > Realtime Database**, create a database, and start it in **"locked mode"**.
    - **Get Config Keys**: In your Project Settings (`⚙️`), register a new Web App (`</>`) and copy the `firebaseConfig` object.

2.  **React Project**:

    - Create a new React + TypeScript project using Vite:
      ```bash
      npm create vite@latest movie-watchlist-app -- --template react-ts
      ```
    - Navigate into the new directory:
      ```bash
      cd movie-watchlist-app
      ```
    - Install the necessary dependencies:
      ```bash
      npm install firebase react-firebase-hooks react-router-dom
      ```
    - Create a `.env.local` file in the root of your project. Paste your `firebaseConfig` keys into it, prefixed with `VITE_`:
      ```env
      # .env.local
      VITE_API_KEY="your-api-key"
      VITE_AUTH_DOMAIN="your-auth-domain"
      VITE_DATABASE_URL="your-database-url"
      # ... and so on for all keys
      ```

3.  **Folder Structure**:
    - Inside the `src` folder, create the following directories: `components`, `config`, `hooks`, and `pages`. This keeps our code organized and scalable.

### Iteration 1 - Authentication & Basic Routing

Let's get the core authentication flow and page navigation working.

1.  **Create the Firebase config file** in `src/config/firebase.js`. This file will initialize Firebase and export the services we need.

2.  **Create an `Auth.js` component** in `src/components/Auth.js`. This will display login/logout buttons based on the user's state, using the `useAuthState` hook from `react-firebase-hooks/auth`.

3.  **Set up routing** in `src/App.js`. Use `react-router-dom` to create routes for a `HomePage` and a `WatchlistPage`. For now, these pages can just be simple placeholders.

<details>
<summary>⭐ **Click for Iteration 1 Solution** ⭐</summary>

**`src/config/firebase.js`**

```javascript
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_DATABASE_URL,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    await signInWithPopup(auth, googleProvider);
  } catch (err) {
    console.error('Error signing in with Google:', err);
  }
};

export const signOutUser = () => signOut(auth);
```

**`src/components/Auth.js`**

```javascript
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, signInWithGoogle, signOutUser } from '../config/firebase';

const Auth = () => {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {user ? (
        <>
          <span>Welcome, {user.displayName}!</span>
          <button onClick={signOutUser} style={{ marginLeft: '10px' }}>
            Sign Out
          </button>
        </>
      ) : (
        <button onClick={signInWithGoogle}>Sign in with Google</button>
      )}
    </div>
  );
};

export default Auth;
```

**`src/pages/HomePage.js`** (and similar for `WatchlistPage.js`)

```javascript
const HomePage = () => {
  return (
    <div>
      <h2>Home</h2>
      <p>Welcome to the Movie Watchlist App! Sign in and go to your watchlist to add movies.</p>
    </div>
  );
};
export default HomePage;
```

**`src/App.js`**

```javascript
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import WatchlistPage from './pages/WatchlistPage';
import Auth from './components/Auth';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header>
          <nav>
            <Link to="/">Home</Link> | <Link to="/watchlist">My Watchlist</Link>
          </nav>
          <Auth />
        </header>
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/watchlist" element={<WatchlistPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
```

</details>

### Iteration 2 - Protected Routes & Security Rules

The watchlist should only be accessible to logged-in users. Let's protect it.

1.  **Update Firebase Security Rules**. Go to your Realtime Database rules in the Firebase Console. Replace the default rules to allow anyone to read, but only authenticated users to write data associated with their own user ID.

    ```json
    {
      "rules": {
        "movies": {
          ".read": "auth != null",
          "$movieId": {
            // User must be logged in to write (create/update/delete)
            ".write": "auth != null",
            // On CREATE: new data must have a `uid` matching the user's auth.uid
            // On UPDATE/DELETE: existing data's uid must match the user's auth.uid
            ".validate": "(newData.exists() && newData.child('uid').val() === auth.uid) || (data.exists() && data.child('uid').val() === auth.uid)"
          }
        }
      }
    }
    ```

    > [!CAUTION]
    > Security rules are your backend's first line of defense. This rule ensures that users can only read the list if logged in, and can only write or delete movies that belong to them.

2.  **Create a `ProtectedRoute.js` component**. This component will check the user's auth state. If the user is not logged in, it will redirect them to a new `LoginPage`. Otherwise, it will render the requested page.

3.  **Update the router in `App.js`**. Wrap the `/watchlist` route with your new `ProtectedRoute` component.

<details>
<summary>⭐ **Click for Iteration 2 Solution** ⭐</summary>

**`src/pages/LoginPage.js`**

```javascript
import Auth from '../components/Auth';

const LoginPage = () => {
  return (
    <div>
      <h2>Login Required</h2>
      <p>Please sign in to view your watchlist.</p>
      <Auth />
    </div>
  );
};

export default LoginPage;
```

**`src/components/ProtectedRoute.js`**

```javascript
import { useAuthState } from 'react-firebase-hooks/auth';
import { Navigate } from 'react-router-dom';
import { auth } from '../config/firebase';

const ProtectedRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <div>Loading session...</div>;
  }

  if (!user) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to. This is a good UX practice.
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
```

**`src/App.js` (Updated)**

```javascript
// ... other imports
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="App">
        {/* ... header ... */}
        <main>
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
    </Router>
  );
}

export default App;
```

</details>

### Iteration 3 - CRUD with Firebase REST API

Now for the core functionality: managing the watchlist using `fetch` to interact with the Firebase REST API.

1.  **Create a custom hook `useMovies.js`** in `src/hooks/`. This hook will encapsulate all the logic for interacting with the `movies` endpoint. It should handle:

    - Fetching all movies for the current user.
    - Adding a new movie (tagged with the user's `uid`).
    - Deleting a movie.
    - All interactions should use `fetch` and the REST API conventions (`.json` suffix, `auth` token).

2.  **Create a `Watchlist.js` component** in `src/components/`. This component will:

    - Use your `useMovies` hook to get the data and functions.
    - Display a form for adding a new movie.
    - Map over the movies and display them.
    - For each movie, show a "Delete" button. Since our hook and security rules are set up correctly, this will only work for the user's own movies.

3.  **Update `WatchlistPage.js`** to render the `Watchlist` component.

<details>
<summary>⭐ **Click for Iteration 3 Solution** ⭐</summary>

**`src/hooks/useMovies.js`**

```javascript
import { useState, useEffect, useCallback } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../config/firebase';

// Define the base URL in one place for easy maintenance
const API_URL = import.meta.env.VITE_DATABASE_URL;

export const useMovies = () => {
  const [user] = useAuthState(auth);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use useCallback to memoize the fetch function, preventing re-creation on every render
  const fetchMovies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Use the .json endpoint for the REST API
      const response = await fetch(`${API_URL}/movies.json`);
      if (!response.ok) {
        throw new Error('Failed to fetch movies. Please check your database URL.');
      }
      const data = await response.json();

      // Firebase returns null for empty paths, or an object of objects if data exists
      const loadedMovies = [];
      if (data) {
        for (const key in data) {
          loadedMovies.push({
            id: key,
            title: data[key].title,
            uid: data[key].uid,
            authorName: data[key].authorName
          });
        }
      }
      setMovies(loadedMovies.reverse()); // Show newest first
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch movies on initial component mount
  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  // Function to add a movie
  const addMovie = async (title) => {
    if (!user) {
      throw new Error('You must be logged in to add a movie.');
    }

    // Get the user's ID token to make an authenticated request
    const token = await user.getIdToken();
    const response = await fetch(`${API_URL}/movies.json?auth=${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: title,
        uid: user.uid,
        authorName: user.displayName || 'Anonymous'
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to add movie.');
    }

    // Refetch movies to show the new one
    await fetchMovies();
  };

  // Function to delete a movie
  const deleteMovie = async (movieId) => {
    if (!user) {
      throw new Error('You must be logged in to delete a movie.');
    }

    const token = await user.getIdToken();
    const response = await fetch(`${API_URL}/movies/${movieId}.json?auth=${token}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete movie. Check security rules.');
    }

    // Refetch movies to reflect the deletion
    await fetchMovies();
  };

  // Return all state and functions needed by the UI
  return { movies, loading, error, addMovie, deleteMovie, user };
};
```

**`src/components/MovieList.js`**

This component will use our new hook to display the UI for adding, viewing, and deleting movies.

```javascript
import { useState } from 'react';
import { useMovies } from '../hooks/useMovies';

const MovieList = () => {
  const { movies, loading, error, addMovie, deleteMovie, user } = useMovies();
  const [newMovieTitle, setNewMovieTitle] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newMovieTitle.trim()) {
      try {
        await addMovie(newMovieTitle);
        setNewMovieTitle('');
      } catch (err) {
        alert(err.message); // Show error to the user
      }
    }
  };

  return (
    <section>
      {user && (
        <form onSubmit={handleSubmit} className="add-movie-form">
          <h3>Add a Movie to the Wishlist</h3>
          <input type="text" value={newMovieTitle} onChange={e => setNewMovieTitle(e.target.value)} placeholder="e.g., The Matrix" />
          <button type="submit">Add Movie</button>
        </form>
      )}

      <h2>Movie Wishlist</h2>
      {loading && <p>Loading movies...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {!loading && !error && (
        <ul className="movie-list">
          {movies.length === 0 ? (
            <p>No movies in the wishlist yet. Add one!</p>
          ) : (
            movies.map(movie => (
              <li key={movie.id}>
                <span>
                  <strong>{movie.title}</strong> (Added by: {movie.authorName})
                </span>
                {/* Show delete button only if the logged-in user is the author */}
                {user && user.uid === movie.uid && (
                  <button onClick={() => deleteMovie(movie.id)} className="delete-btn">
                    Delete
                  </button>
                )}
              </li>
            ))
          )}
        </ul>
      )}
    </section>
  );
};

export default MovieList;
```

**`src/App.js`**

Finally, update your main `App` component to render the `Auth` and `MovieList` components.

```javascript
import Auth from './components/Auth';
import MovieList from './components/MovieList';
import './App.css';

function App() {
  return (
    <div className="App">
      <header>
        <h1>Movie Wishlist</h1>
        <Auth />
      </header>
      <main>
        <MovieList />
      </main>
    </div>
  );
}

export default App;
```

Now, run your app with `npm run dev`. You should be able to sign in with Google, add movies to the list, and delete only the movies you have added. Check the Developer Tools console for any errors and inspect the network tab to see the `fetch` requests being made to your Firebase REST API!

</details>

<br>

## Extra Resources

- [MDN Docs on `fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API): The definitive guide to the Fetch API.
- [Firebase REST API Docs](https://firebase.google.com/docs/database/rest/start): Official documentation for the Realtime Database REST API.
- [Postman](https://www.postman.com/downloads/): An essential tool for testing and debugging APIs without writing any code.
- [React Docs on Hooks](https://react.dev/reference/react): A great resource for understanding how to build your own custom hooks.
