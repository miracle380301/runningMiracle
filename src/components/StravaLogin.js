const STRAVA_CLIENT_ID = "77505"; // 여기에 Strava Client ID 입력
//const REDIRECT_URI = "http://localhost:3000/callback";
const REDIRECT_URI = "https://runningmiracle.onrender.com/callback";

const AUTH_URL = `https://www.strava.com/oauth/authorize?client_id=${STRAVA_CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URI}&approval_prompt=force&scope=activity:read_all`;

const StravaLogin = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Connect to Strava</h2>
            <a href={AUTH_URL}>
                <button className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-75">
                    Login with Strava
                </button>
            </a>
        </div>
    );
};

export default StravaLogin;