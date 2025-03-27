import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceArea } from "recharts";

const StravaData = () => {
    const [activities, setActivities] = useState([]);
    const token = localStorage.getItem("strava_token");
    const userAge = localStorage.getItem("user_age");

    useEffect(() => {
        const fetchActivities = async () => {
            if (!token) return;

            try {
                const response = await fetch("https://www.strava.com/api/v3/athlete/activities?per_page=5", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await response.json();

                const processedData = data.length > 0
                    ? data
                        .filter(run => run.type === 'Run')
                        .map((run, index) => ({
                            name: `Run ${index + 1}`,
                            distance: (run.distance / 1000).toFixed(2), // m -> km
                            avg_speed: (run.average_speed * 3.6).toFixed(2), // m/s -> km/h
                            avg_heart_rate: run.average_heartrate || 0, // Heart rate (bpm)
                            cadence: run.average_cadence * 2 || 0, // Cadence (rpm)
                        }))
                    : [
                        { name: 'Run 1', avg_heart_rate: 0, cadence: 120 },
                        { name: 'Run 2', avg_heart_rate: 50, cadence: 150 },
                        { name: 'Run 3', avg_heart_rate: 100, cadence: 170 },
                        { name: 'Run 4', avg_heart_rate: 150, cadence: 190 },
                        { name: 'Run 5', avg_heart_rate: 200, cadence: 200 },
                    ];

                setActivities(processedData);
            } catch (error) {
                console.error("Error fetching activities:", error);
            }
        };

        fetchActivities();
    }, []);

    const getDummyData = () => {
        const dummyData = [];
        for (let i = 0; i <= 200; i += 50) {
            dummyData.push({
                name: `Cadence ${i} bpm`,
                avg_heart_rate: i,
                cadence: i,
            });
        }
        return dummyData;
    };

    const chartData = activities.length > 0 ? activities : getDummyData();
    const maxHeartRate = 220 - userAge;

    return (
        <div className="p-4 sm:p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800">Recent Running Stats</h2>

            {/* 📌 Heart Rate Graph */}
            <div className="p-4 bg-gray-100 rounded-lg shadow">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-700">Heart Rate (bpm)</h3>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
                        <XAxis dataKey="name" stroke="#555" />
                        <YAxis stroke="#555" domain={[100, 200]} />
                        <Tooltip />
                        <Legend />
                        <ReferenceArea y1={Math.round(maxHeartRate * 0.6)} y2={Math.round(maxHeartRate * 0.7)} fill="#4682b4" opacity={0.5} />
                        <ReferenceArea y1={Math.round(maxHeartRate * 0.7)} y2={Math.round(maxHeartRate * 0.8)} fill="#90ee90" opacity={0.5} />
                        <ReferenceArea y1={Math.round(maxHeartRate * 0.8)} y2={Math.round(maxHeartRate * 0.9)} fill="#8A2BE2" opacity={0.5} />
                        <ReferenceArea y1={Math.round(maxHeartRate * 0.9)} y2={maxHeartRate} fill="#ff0000" opacity={0.5} />
                        <Line type="monotone" dataKey="avg_heart_rate" stroke="#ff7300" strokeWidth={3} name="Heart Rate (bpm)" />
                    </LineChart>
                </ResponsiveContainer>
                <div className="mt-2 flex items-center text-gray-600 text-sm">
                    <div className="w-4 h-4 bg-[#4682b4] mr-2"></div>
                    <span>Zone 2 : {Math.round(maxHeartRate * 0.6)}-{Math.round(maxHeartRate * 0.7)} 지방연소 영역(40-80분)</span>
                </div>
                <div className="mt-2 flex items-center text-gray-600 text-sm">
                    <div className="w-4 h-4 bg-[#90ee90] mr-2"></div>
                    <span>Zone 3 : {Math.round(maxHeartRate * 0.7)}-{Math.round(maxHeartRate * 0.8)} 유산소 영역(10-40분)</span>
                </div>
                <div className="mt-2 flex items-center text-gray-600 text-sm">
                    <div className="w-4 h-4 bg-[#8A2BE2] mr-2"></div>
                    <span>Zone 4 : {Math.round(maxHeartRate * 0.8)}-{Math.round(maxHeartRate * 0.9)} 고강도 영역(2-10분)</span>
                </div>           
                <div className="mt-2 flex items-center text-gray-600 text-sm">
                    <div className="w-4 h-4 bg-[#ff0000] mr-2"></div>
                    <span>Zone 5 : {Math.round(maxHeartRate * 0.9)}-{maxHeartRate} 무산소 영역(5분 미만)</span>
                </div>                          
            </div>

            {/* 📌 Cadence Graph */}
            <div className="p-4 bg-gray-100 rounded-lg shadow">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-700">Cadence (rpm)</h3>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
                        <XAxis dataKey="name" stroke="#555" />
                        <YAxis stroke="#555" domain={[130, 220]} />
                        <Tooltip />
                        <Legend />
                        <ReferenceArea y1={150} y2={160} fill="#90ee90" opacity={0.5} />
                        <ReferenceArea y1={180} y2={190} fill="#4682b4" opacity={0.3} />
                        <Line type="monotone" dataKey="cadence" stroke="#007bff" strokeWidth={3} name="Cadence (spm)" />
                    </LineChart>
                </ResponsiveContainer>
                <div className="mt-2 flex items-center text-gray-600 text-sm">
                    <div className="w-4 h-4 bg-[#90ee90] mr-2"></div>
                    <span>For beginner: 150-160</span>
                </div>
                <div className="mt-2 flex items-center text-gray-600 text-sm">
                    <div className="w-4 h-4 bg-[#4682b4] mr-2"></div>
                    <span>For expert: 180-190</span>
                </div>                
            </div>

            {/* 📌 Table Section */}
            <div className="p-4 bg-white rounded-lg shadow overflow-x-auto">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-700 text-center">Running Data</h3>
                <table className="min-w-full border-collapse border border-gray-300 text-center">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 px-4 py-2">Run</th>
                            <th className="border border-gray-300 px-4 py-2">Distance (km)</th>
                            <th className="border border-gray-300 px-4 py-2">Avg Speed (km/h)</th>
                            <th className="border border-gray-300 px-4 py-2">Heart Rate (bpm)</th>
                            <th className="border border-gray-300 px-4 py-2">Cadence (rpm)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {chartData.map((run, index) => (
                            <tr key={index} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                                <td className="border border-gray-300 px-4 py-2">{run.name}</td>
                                <td className="border border-gray-300 px-4 py-2">{run.distance || '-'}</td>
                                <td className="border border-gray-300 px-4 py-2">{run.avg_speed || '-'}</td>
                                <td className="border border-gray-300 px-4 py-2">{run.avg_heart_rate}</td>
                                <td className="border border-gray-300 px-4 py-2">{run.cadence}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StravaData;
