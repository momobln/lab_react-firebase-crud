import Auth from "../components/Auth.jsx";
export default function LoginPage(){
    return (
        <div>
            <h2>Login Required </h2>
            <p>Please Sign in to view your watchlist. </p>
            <Auth />
        </div>
    );
}