import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const CLIENT_ID = "77505";
const CLIENT_SECRET = "5fa802f6ee3011bf8362f22b28db3ac233a3a053";

const StravaCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const code = searchParams.get("code");
    const [tokenFetched, setTokenFetched] = useState(false);
    const [age, setAge] = useState("");

    useEffect(() => {
        if (code) {
            fetch("https://www.strava.com/oauth/token", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    client_id: CLIENT_ID,
                    client_secret: CLIENT_SECRET,
                    code: code,
                    grant_type: "authorization_code",
                }),
            })
                .then((response) => response.json())
                .then((data) => {
                    localStorage.setItem("strava_token", data.access_token);
                    setTokenFetched(true); // Indicate that the token has been fetched
                })
                .catch((error) => console.error("Error fetching token:", error));
        }
    }, [code]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (age) {
            localStorage.setItem("user_age", age); // Store the age in localStorage
            navigate("/data"); // Redirect to the /data route
        } else {
            alert("Please enter your age.");
        }
    };

    if (!tokenFetched) {
        return <h2>Authenticating...</h2>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Please enter your age to get an accurate heart rate range.
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
                <input
                    type="number"
                    placeholder="Enter your age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                />
                <button
                    type="submit"
                    className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-75"
                >
                    Submit Age
                </button>
            </form>
        </div>
    );
};

export default StravaCallback;
