import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getWarehouses } from '../../api/warehouses';
import { Warehouse, Plus, MapPin, Box, Eye, Search } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const WarehouseList = () => {
    const { user } = useAuth();
    const [warehouses, setWarehouses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchWarehouses = async () => {
            try {
                // Assuming user object has organizationId. 
                // If not, we might need to handle it or fetch user details first.
                // For now, let's assume we pass a dummy ID if missing or handle in API
                const data = await getWarehouses(user?.organizationId || 1);
                setWarehouses(data);
            } catch (error) {
                toast.error('Failed to load warehouses');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchWarehouses();
    }, [user]);

    const filteredWarehouses = warehouses.filter(w =>
        w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <LoadingSpinner fullScreen />;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Warehouses</h1>
                    <p className="text-slate-500 mt-1">Manage your distribution centers and storage locations</p>
                </div>
                <Link to="/warehouses/new">
                    <Button leftIcon={<Plus className="w-5 h-5" />}>
                        Add Warehouse
                    </Button>
                </Link>
            </div>

            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                    type="text"
                    className="block w-full pl-10 sm:text-sm border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 py-2"
                    placeholder="Search warehouses by name or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {filteredWarehouses.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-dashed border-slate-300">
                    <Warehouse className="mx-auto h-12 w-12 text-slate-400" />
                    <h3 className="mt-2 text-sm font-medium text-slate-900">No warehouses found</h3>
                    <p className="mt-1 text-sm text-slate-500">Get started by creating a new warehouse.</p>
                    <div className="mt-6">
                        <Link to="/warehouses/new">
                            <Button variant="secondary" leftIcon={<Plus className="w-4 h-4" />}>
                                Create Warehouse
                            </Button>
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredWarehouses.map((warehouse, index) => (
                        <motion.div
                            key={warehouse.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                            <Card hover className="h-full flex flex-col">
                                <div className="p-6 flex-1">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="bg-indigo-100 p-2 rounded-lg">
                                                <Warehouse className="w-6 h-6 text-indigo-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-slate-900">{warehouse.name}</h3>
                                                <p className="text-sm text-slate-500 flex items-center mt-1">
                                                    <MapPin className="w-3 h-3 mr-1" />
                                                    {warehouse.location}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={clsx(
                                            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                                            warehouse.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                        )}>
                                            {warehouse.active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>

                                    <div className="mt-6 grid grid-cols-2 gap-4">
                                        <div className="bg-slate-50 p-3 rounded-md">
                                            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Capacity</p>
                                            <p className="text-lg font-bold text-slate-900 mt-1">{warehouse.totalCapacity?.toLocaleString() || 0}</p>
                                        </div>
                                        <div className="bg-slate-50 p-3 rounded-md">
                                            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Zones</p>
                                            <p className="text-lg font-bold text-slate-900 mt-1">{warehouse.storageZones?.length || 0}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-between items-center">
                                    <div className="text-sm text-slate-500">
                                        ID: #{warehouse.id}
                                    </div>
                                    <Link to={`/warehouses/${warehouse.id}`}>
                                        <Button variant="ghost" size="sm" rightIcon={<Eye className="w-4 h-4" />}>
                                            View Details
                                        </Button>
                                    </Link>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WarehouseList;
