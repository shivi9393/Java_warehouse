import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPurchaseOrder, approvePurchaseOrder } from '../../api/purchaseOrders';
import {
    ArrowLeft,
    FileText,
    Calendar,
    Truck,
    User,
    CheckCircle,
    Printer
} from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { PO_STATUS } from '../../utils/constants';
import clsx from 'clsx';

const PurchaseOrderDetails = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [approving, setApproving] = useState(false);

    const fetchOrder = async () => {
        try {
            const data = await getPurchaseOrder(id);
            setOrder(data);
        } catch (error) {
            toast.error('Failed to load purchase order details');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const onApprove = async () => {
        setApproving(true);
        try {
            await approvePurchaseOrder(id);
            toast.success('Purchase Order approved');
            fetchOrder(); // Refresh status
        } catch (error) {
            toast.error('Failed to approve order');
        } finally {
            setApproving(false);
        }
    };

    if (loading) return <LoadingSpinner fullScreen />;
    if (!order) return <div className="text-center py-10">Order not found</div>;

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
            <span className={clsx("inline-flex items-center px-3 py-1 rounded-full text-sm font-medium", styles[status])}>
                {status.replace('_', ' ')}
            </span>
        );
    };

    const itemColumns = [
        { header: 'Product', accessor: 'productName' },
        { header: 'SKU', accessor: 'productSku', className: 'text-slate-500' },
        { header: 'Quantity', accessor: 'quantity' },
        {
            header: 'Received',
            accessor: 'receivedQuantity',
            render: (row) => row.receivedQuantity || 0
        },
        {
            header: 'Unit Price',
            accessor: 'unitPrice',
            render: (row) => `$${row.unitPrice?.toFixed(2)}`
        },
        {
            header: 'Total',
            id: 'total',
            render: (row) => (
                <span className="font-medium">
                    ${(row.quantity * row.unitPrice).toFixed(2)}
                </span>
            )
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link to="/purchase-orders">
                        <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                            Back
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900">PO-{order.orderNumber || order.id}</h1>
                    {getStatusBadge(order.status)}
                </div>
                <div className="flex space-x-3">
                    <Button variant="secondary" leftIcon={<Printer className="w-4 h-4" />} onClick={() => window.print()}>
                        Print
                    </Button>
                    {order.status === PO_STATUS.PENDING_APPROVAL && (
                        <Button
                            onClick={onApprove}
                            isLoading={approving}
                            leftIcon={<CheckCircle className="w-4 h-4" />}
                        >
                            Approve Order
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="col-span-2">
                    <div className="p-6">
                        <h3 className="text-lg font-medium text-slate-900 mb-4">Line Items</h3>
                        <Table
                            columns={itemColumns}
                            data={order.items || []}
                            keyField="id"
                        />
                        <div className="mt-4 flex justify-end border-t border-slate-100 pt-4">
                            <div className="text-right">
                                <span className="text-slate-500">Total Amount</span>
                                <p className="text-2xl font-bold text-slate-900">
                                    ${order.totalAmount?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <div className="p-6 space-y-4">
                            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Vendor Information</h3>
                            <div className="flex items-start">
                                <div className="bg-indigo-50 p-2 rounded-lg mr-3">
                                    <User className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-slate-900">{order.vendorName}</p>
                                    <p className="text-sm text-slate-500">Vendor ID: #{order.vendorId}</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <div className="p-6 space-y-4">
                            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Order Details</h3>

                            <div className="flex items-start">
                                <div className="bg-slate-50 p-2 rounded-lg mr-3">
                                    <Calendar className="w-5 h-5 text-slate-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Order Date</p>
                                    <p className="font-medium text-slate-900">{format(new Date(order.orderDate), 'MMM d, yyyy')}</p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="bg-slate-50 p-2 rounded-lg mr-3">
                                    <Truck className="w-5 h-5 text-slate-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500">Expected Delivery</p>
                                    <p className="font-medium text-slate-900">
                                        {order.expectedDeliveryDate ? format(new Date(order.expectedDeliveryDate), 'MMM d, yyyy') : 'Not specified'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default PurchaseOrderDetails;
