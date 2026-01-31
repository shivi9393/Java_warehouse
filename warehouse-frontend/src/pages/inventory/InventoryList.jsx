import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getInventory } from '../../api/inventory';
import { getWarehouses } from '../../api/warehouses';
import { Package, Search, AlertTriangle, ArrowUpRight, ArrowDownRight, RefreshCw, Calendar } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import clsx from 'clsx';

const InventoryList = () => {
    const { user } = useAuth();
    const [inventory, setInventory] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [selectedWarehouse, setSelectedWarehouse] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchWarehouses = async () => {
            try {
                const data = await getWarehouses(user?.organizationId || 1);
                setWarehouses(data);
                if (data.length > 0) {
                    setSelectedWarehouse(data[0].id);
                }
            } catch (error) {
                console.error('Failed to fetch warehouses', error);
                toast.error('Failed to load warehouses');
            }
        };
        fetchWarehouses();
    }, [user]);

    useEffect(() => {
        const fetchInventory = async () => {
            if (!selectedWarehouse) return;

            setLoading(true);
            try {
                const data = await getInventory(selectedWarehouse);
                setInventory(data);
            } catch (error) {
                toast.error('Failed to load inventory');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchInventory();
    }, [selectedWarehouse]);

    const filteredInventory = inventory.filter(item =>
        item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.productSku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        {
            header: 'Product',
            accessor: 'productName',
            render: (row) => (
                <div>
                    <div className="font-medium text-slate-900">{row.productName}</div>
                    <div className="text-xs text-slate-500">SKU: {row.productSku}</div>
                </div>
            )
        },
        {
            header: 'Location',
            accessor: 'warehouseName',
            render: (row) => (
                <div>
                    <div className="text-sm text-slate-900">{row.warehouseName}</div>
                    <div className="text-xs text-slate-500">Zone: {row.zoneName}</div>
                </div>
            )
        },
        {
            header: 'Quantity',
            accessor: 'quantity',
            render: (row) => (
                <div className="flex items-center">
                    <span className={clsx(
                        "font-medium mr-2",
                        row.quantity <= row.minStockLevel ? "text-red-600" : "text-slate-900"
                    )}>
                        {row.quantity}
                    </span>
                    {row.isLowStock && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                            Low Stock
                        </span>
                    )}
                </div>
            )
        },
        {
            header: 'Batch / Expiry',
            accessor: 'batchNumber',
            render: (row) => (
                <div>
                    <div className="text-sm text-slate-900">{row.batchNumber}</div>
                    {row.expiryDate && (
                        <div className={clsx(
                            "text-xs flex items-center mt-0.5",
                            row.isExpiringSoon ? "text-amber-600 font-medium" : "text-slate-500"
                        )}>
                            <Calendar className="w-3 h-3 mr-1" />
                            {format(new Date(row.expiryDate), 'MMM d, yyyy')}
                        </div>
                    )}
                </div>
            )
        },
        {
            header: 'Stock Levels',
            accessor: 'minStockLevel',
            render: (row) => (
                <div className="text-xs text-slate-500">
                    <div>Min: {row.minStockLevel}</div>
                    <div>Max: {row.maxStockLevel}</div>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Inventory</h1>
                    <p className="text-slate-500 mt-1">Track stock levels across all locations</p>
                </div>
                <div className="flex space-x-3">
                    <Link to="/inventory/stock-in">
                        <Button leftIcon={<ArrowDownRight className="w-4 h-4" />}>
                            Stock In
                        </Button>
                    </Link>
                    <Link to="/inventory/stock-out">
                        <Button variant="secondary" leftIcon={<ArrowUpRight className="w-4 h-4" />}>
                            Stock Out
                        </Button>
                    </Link>
                </div>
            </div>

            <Card>
                <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full sm:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-9 sm:text-sm border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 py-2"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="w-full sm:w-auto flex items-center space-x-2">
                        <label className="text-sm font-medium text-slate-700 whitespace-nowrap">Warehouse:</label>
                        <select
                            value={selectedWarehouse}
                            onChange={(e) => setSelectedWarehouse(e.target.value)}
                            className="block w-full sm:w-48 pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                            {warehouses.map(w => (
                                <option key={w.id} value={w.id}>{w.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <Table
                    columns={columns}
                    data={filteredInventory}
                    isLoading={loading}
                    emptyMessage="No inventory found for this warehouse."
                />
            </Card>
        </div>
    );
};

export default InventoryList;
