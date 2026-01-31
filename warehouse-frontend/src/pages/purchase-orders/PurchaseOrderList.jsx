import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getPurchaseOrders } from '../../api/purchaseOrders';
import { Plus, ShoppingCart, Search, FileText, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { PO_STATUS } from '../../utils/constants';
import clsx from 'clsx';

const PurchaseOrderList = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await getPurchaseOrders(user?.organizationId || 1);
                setOrders(data);
            } catch (error) {
                toast.error('Failed to load purchase orders');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [user]);

    const getStatusBadge = (status) => {
        const styles = {
            [PO_STATUS.DRAFT]: 'bg-slate-100 text-slate-800',
            [PO_STATUS.PENDING_APPROVAL]: 'bg-amber-100 text-amber-800',
            [PO_STATUS.APPROVED]: 'bg-blue-100 text-blue-800',
            [PO_STATUS.REJECTED]: 'bg-red-100 text-red-800',
            [PO_STATUS.PARTIALLY_RECEIVED]: 'bg-indigo-100 text-indigo-800',
            [PO_STATUS.COMPLETED]: 'bg-green-100 text-green-800',
            [PO_STATUS.CANCELLED]: 'bg-slate-200 text-slate-600',
        };

        return (
            <span className={clsx("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", styles[status] || styles.DRAFT)}>
                {status.replace('_', ' ')}
            </span>
        );
    };

    const columns = [
        {
            header: 'Order Number',
            accessor: 'orderNumber',
            render: (row) => (
                <div className="font-medium text-indigo-600">PO-{row.orderNumber || row.id}</div>
            )
        },
        {
            header: 'Vendor',
            accessor: 'vendorName',
            render: (row) => <div className="font-medium text-slate-900">{row.vendorName}</div>
        },
        {
            header: 'Status',
            accessor: 'status',
            render: (row) => getStatusBadge(row.status)
        },
        {
            header: 'Total Amount',
            accessor: 'totalAmount',
            render: (row) => (
                <div className="font-medium text-slate-900">
                    ${row.totalAmount?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
            )
        },
        {
            header: 'Date Created',
            accessor: 'orderDate',
            render: (row) => (
                <div className="text-sm text-slate-500">
                    {format(new Date(row.orderDate), 'MMM d, yyyy')}
                </div>
            )
        },
        {
            header: 'Expected Delivery',
            accessor: 'expectedDeliveryDate',
            render: (row) => (
                <div className="text-sm text-slate-500">
                    {row.expectedDeliveryDate ? format(new Date(row.expectedDeliveryDate), 'MMM d, yyyy') : '-'}
                </div>
            )
        },
    ];

    const filteredOrders = orders.filter(order =>
        order.vendorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.orderNumber && order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Purchase Orders</h1>
                    <p className="text-slate-500 mt-1">Manage procurement and vendor orders</p>
                </div>
                <Link to="/purchase-orders/new">
                    <Button leftIcon={<Plus className="w-5 h-5" />}>
                        Create Order
                    </Button>
                </Link>
            </div>

            <Card>
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <div className="relative w-full sm:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-9 sm:text-sm border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 py-2"
                            placeholder="Search orders or vendors..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <Table
                    columns={columns}
                    data={filteredOrders}
                    isLoading={loading}
                    emptyMessage="No purchase orders found."
                />
            </Card>
        </div>
    );
};

export default PurchaseOrderList;
