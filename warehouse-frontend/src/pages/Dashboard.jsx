import { Warehouse, Package, TrendingUp, AlertTriangle } from 'lucide-react';
import Card from '../components/common/Card';
import { motion } from 'framer-motion';

// Mock data for initial render
const stats = [
    { name: 'Total Warehouses', value: '4', icon: Warehouse, change: '+12%', changeType: 'increase', color: 'indigo' },
    { name: 'Total Inventory', value: '2,450', icon: Package, change: '+2.5%', changeType: 'increase', color: 'green' },
    { name: 'Active Orders', value: '12', icon: TrendingUp, change: '-4%', changeType: 'decrease', color: 'blue' },
    { name: 'Low Stock Alerts', value: '7', icon: AlertTriangle, change: '+2 new', changeType: 'increase', color: 'amber' },
];

const Dashboard = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                <div className="flex space-x-3">
                    <span className="text-sm text-slate-500 self-center">Last updated: Just now</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((item, index) => (
                    <motion.div
                        key={item.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                        <Card className="relative overflow-hidden">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className={`flex-shrink-0 rounded-md p-3 bg-${item.color}-100 text-${item.color}-600`}>
                                        <item.icon className="h-6 w-6" aria-hidden="true" />
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-slate-500 truncate">{item.name}</dt>
                                            <dd>
                                                <div className="text-lg font-bold text-slate-900">{item.value}</div>
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-slate-50 px-5 py-3">
                                <div className="text-sm">
                                    <span className={`font-medium ${item.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                                        {item.change}
                                    </span>
                                    <span className="text-slate-500"> from last month</span>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="h-96">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-slate-900">Inventory Trends</h3>
                        <select className="text-sm border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500">
                            <option>Last 7 days</option>
                            <option>Last 30 days</option>
                            <option>This Year</option>
                        </select>
                    </div>
                    <div className="p-6 flex items-center justify-center h-full text-slate-400">
                        {/* Chart placeholder - Recharts would go here */}
                        Chart Component
                    </div>
                </Card>

                <Card className="h-96">
                    <div className="p-6 border-b border-slate-100">
                        <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
                    </div>
                    <div className="p-6">
                        <ul className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <li key={i} className="flex space-x-3">
                                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                                        <Package className="h-4 w-4 text-slate-500" />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-medium">Stock received</h3>
                                            <p className="text-xs text-slate-500">2h ago</p>
                                        </div>
                                        <p className="text-xs text-slate-500">Received 50 units of Product XYZ at Main Warehouse</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
