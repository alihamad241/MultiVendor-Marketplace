import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "../libs/axios";
import { Users, Package, ShoppingCart, DollarSign } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";

const AnalyticsTab = () => {
    const [analyticsData, setAnalyticsData] = useState({
        users: 0,
        products: 0,
        totalSales: 0,
        totalRevenue: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [dailySalesData, setDailySalesData] = useState([]);

    useEffect(() => {
        const fetchAnalyticsData = async () => {
            try {
                const response = await axios.get("/analytics");
                setAnalyticsData(response.data.analyticsData);
                setDailySalesData(response.data.dailySalesData);
            } catch (error) {
                console.error("Error fetching analytics data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnalyticsData();
    }, []);

    if (isLoading) {
        return <div className="text-center py-8">Loading...</div>;
    }

    const chartData = dailySalesData.map((d) => ({ name: d.date || d._id || d.name, sales: d.sales, revenue: d.revenue }));

    return (
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <AnalyticsCard
                    title="Total Users"
                    value={analyticsData.users.toLocaleString()}
                    icon={Users}
                    color="from-blue-500 to-blue-700"
                />
                <AnalyticsCard
                    title="Total Products"
                    value={analyticsData.products.toLocaleString()}
                    icon={Package}
                    color="from-green-500 to-green-700"
                />
                <AnalyticsCard
                    title="Total Sales"
                    value={analyticsData.totalSales.toLocaleString()}
                    icon={ShoppingCart}
                    color="from-yellow-500 to-yellow-700"
                />
                <AnalyticsCard
                    title="Total Revenue"
                    value={`$${analyticsData.totalRevenue.toLocaleString()}`}
                    icon={DollarSign}
                    color="from-red-500 to-red-700"
                />
            </div>
            <motion.div
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Daily Sales and Revenue</h3>
                <ResponsiveContainer
                    width="100%"
                    height={400}>
                    <AreaChart
                        data={chartData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient
                                id="colorSales"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="#10B981"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#10B981"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                            <linearGradient
                                id="colorRevenue"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="#3B82F6"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#3B82F6"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#E5E7EB"
                        />
                        <XAxis
                            dataKey="name"
                            stroke="#6B7280"
                        />
                        <YAxis
                            yAxisId="left"
                            stroke="#6B7280"
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#FFFFFF",
                                border: "1px solid #E5E7EB",
                                color: "#111827",
                            }}
                        />
                        <Legend />
                        <Area
                            yAxisId="left"
                            type="monotone"
                            dataKey="sales"
                            stroke="#10B981"
                            fillOpacity={0.2}
                            fill="url(#colorSales)"
                            name="Sales"
                        />
                        <Area
                            yAxisId="left"
                            type="monotone"
                            dataKey="revenue"
                            stroke="#3B82F6"
                            fillOpacity={0.15}
                            fill="url(#colorRevenue)"
                            name="Revenue"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </motion.div>
        </div>
    );
};
export default AnalyticsTab;

const AnalyticsCard = ({ title, value, icon: Icon, color }) => (
    <motion.div
        className={`bg-white rounded-lg p-6 shadow-sm overflow-hidden relative border border-gray-100`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        <div className={`absolute top-4 left-4 h-12 w-12 rounded-full bg-emerald-600 flex items-center justify-center text-white`}>
            <Icon className="h-5 w-5" />
        </div>
        <div className="ml-16">
            <p className="text-gray-500 text-sm mb-1 font-semibold">{title}</p>
            <h3 className="text-gray-900 text-3xl font-bold">{value}</h3>
        </div>
    </motion.div>
);
