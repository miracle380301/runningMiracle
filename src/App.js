import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StravaLogin from "./components/StravaLogin";
import StravaCallback from "./components/StravaCallback";
import StravaData from "./components/StravaData";
import { AuthProvider } from "./components/AuthContext";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<StravaLogin />} />
                <Route path="/callback" element={<StravaCallback />} />
                <Route path="/data" element={<StravaData />} />
            </Routes>
        </Router>
    );
}

export default App;