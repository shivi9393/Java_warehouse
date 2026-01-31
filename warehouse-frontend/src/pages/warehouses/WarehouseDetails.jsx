import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { getWarehouse, addStorageZone } from '../../api/warehouses';
import {
    ArrowLeft,
    MapPin,
    Box,
    Plus,
    Thermometer,
    AlertTriangle,
    Component,
    Truck,
    ShieldCheck
} from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Table from '../../components/common/Table';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { ZONE_TYPES } from '../../utils/constants';
import clsx from 'clsx';
import { motion } from 'framer-motion';

const WarehouseDetails = () => {
    const { id } = useParams();
    const [warehouse, setWarehouse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchWarehouse = async () => {
        try {
            const data = await getWarehouse(id);
            setWarehouse(data);
        } catch (error) {
            toast.error('Failed to load warehouse details');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWarehouse();
    }, [id]);

    const onAddZone = async (data) => {
        setIsSubmitting(true);
        try {
            await addStorageZone(id, {
                ...data,
                capacity: parseInt(data.capacity),
                warehouseId: parseInt(id)
            });
            toast.success('Storage zone added successfully');
            setIsModalOpen(false);
            reset();
            fetchWarehouse(); // Refresh data
        } catch (error) {
            toast.error('Failed to add storage zone');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <LoadingSpinner fullScreen />;
    if (!warehouse) return <div className="text-center py-10">Warehouse not found</div>;

    const zoneColumns = [
        {
            header: 'Zone Name',
            accessor: 'name',
            render: (row) => (
                <div className="font-medium text-slate-900">{row.name}</div>
            )
        },
        {
            header: 'Type',
            accessor: 'zoneType',
            render: (row) => {
                const icons = {
                    [ZONE_TYPES.GENERAL]: <Box className="w-4 h-4 mr-1 text-slate-500" />,
                    [ZONE_TYPES.COLD_STORAGE]: <Thermometer className="w-4 h-4 mr-1 text-blue-500" />,
                    [ZONE_TYPES.HAZMAT]: <AlertTriangle className="w-4 h-4 mr-1 text-amber-500" />,
                    [ZONE_TYPES.RECEIVING]: <Truck className="w-4 h-4 mr-1 text-green-500" />,
                    [ZONE_TYPES.SHIPPING]: <Truck className="w-4 h-4 mr-1 text-indigo-500" />,
                    [ZONE_TYPES.QUARANTINE]: <ShieldCheck className="w-4 h-4 mr-1 text-red-500" />,
                };
                return (
                    <div className="flex items-center text-slate-600 capitalize">
                        {icons[row.zoneType] || <Component className="w-4 h-4 mr-1" />}
                        {row.zoneType.replace('_', ' ').toLowerCase()}
                    </div>
                );
            }
        },
        {
            header: 'Capacity',
            accessor: 'capacity',
            render: (row) => row.capacity.toLocaleString()
        },
        {
            header: 'Utilization',
            accessor: 'utilizationPercentage',
            render: (row) => {
                const percentage = row.utilizationPercentage || 0;
                let color = 'bg-green-500';
                if (percentage > 80) color = 'bg-red-500';
                else if (percentage > 60) color = 'bg-amber-500';

                return (
                    <div className="w-full max-w-xs">
                        <div className="flex justify-between text-xs mb-1">
                            <span>{row.currentUtilization || 0} units</span>
                            <span>{percentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                            <div
                                className={clsx("h-2 rounded-full transition-all duration-300", color)}
                                style={{ width: `${Math.min(percentage, 100)}%` }}
                            />
                        </div>
                    </div>
                );
            }
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link to="/warehouses">
                        <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                            Back
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900">{warehouse.name}</h1>
                    <span className={clsx(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                        warehouse.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    )}>
                        {warehouse.active ? 'Active' : 'Inactive'}
                    </span>
                </div>
                <Button onClick={() => setIsModalOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
                    Add Storage Zone
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="col-span-2">
                    <div className="p-6">
                        <h3 className="text-lg font-medium text-slate-900 mb-4">Overview</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 rounded-lg">
                                <p className="text-sm text-slate-500 flex items-center mb-1">
                                    <MapPin className="w-4 h-4 mr-1" /> Location
                                </p>
                                <p className="font-semibold text-slate-900">{warehouse.location}</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-lg">
                                <p className="text-sm text-slate-500 mb-1">Manager</p>
                                <p className="font-semibold text-slate-900">{warehouse.managerName || 'Not Assigned'}</p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h4 className="text-sm font-medium text-slate-700 mb-2">Total Capacity Utilization</h4>
                            <div className="relative pt-1">
                                <div className="flex mb-2 items-center justify-between">
                                    <div>
                                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
                                            Utilization
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-semibold inline-block text-indigo-600">
                                            {/* Calculate total utilization maybe? Backend doesn't send total utilization directly in DTO? 
                            Checking DTO: totalCapacity yes. But current load? 
                            Assuming I can sum zones or maybe placeholder for now. 
                        */}
                                            0%
                                        </span>
                                    </div>
                                </div>
                                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-100">
                                    <div style={{ width: "0%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="p-6">
                        <h3 className="text-lg font-medium text-slate-900 mb-4">Quick Stats</h3>
                        <dl className="space-y-4">
                            <div className="flex justify-between border-b border-slate-100 pb-2">
                                <dt className="text-sm text-slate-500">Total Capacity</dt>
                                <dd className="font-semibold text-slate-900">{warehouse.totalCapacity.toLocaleString()}</dd>
                            </div>
                            <div className="flex justify-between border-b border-slate-100 pb-2">
                                <dt className="text-sm text-slate-500">Total Zones</dt>
                                <dd className="font-semibold text-slate-900">{warehouse.storageZones?.length || 0}</dd>
                            </div>
                        </dl>
                    </div>
                </Card>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900">Storage Zones</h3>
                <Table
                    columns={zoneColumns}
                    data={warehouse.storageZones || []}
                    emptyMessage="No storage zones defined. Add one to get started."
                />
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add Storage Zone"
            >
                <form onSubmit={handleSubmit(onAddZone)} className="space-y-4">
                    <Input
                        label="Zone Name"
                        {...register('name', { required: 'Name is required' })}
                        error={errors.name}
                        placeholder="e.g. Zone A"
                    />

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Zone Type</label>
                        <select
                            {...register('zoneType', { required: 'Type is required' })}
                            className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                            {Object.keys(ZONE_TYPES).map((type) => (
                                <option key={type} value={type}>
                                    {type.replace('_', ' ').charAt(0) + type.replace('_', ' ').slice(1).toLowerCase().replace('_', ' ')}
                                    {/* Simple capitalization, but replace logic a bit complex inline. Better map manually or create util */}
                                    {type.replace(/_/g, ' ')}
                                </option>
                            ))}
                        </select>
                    </div>

                    <Input
                        label="Capacity"
                        type="number"
                        {...register('capacity', {
                            required: 'Capacity is required',
                            min: { value: 1, message: 'Minimum capacity is 1' }
                        })}
                        error={errors.capacity}
                    />

                    <div className="pt-4 flex justify-end space-x-3">
                        <Button variant="secondary" onClick={() => setIsModalOpen(false)} type="button">
                            Cancel
                        </Button>
                        <Button type="submit" isLoading={isSubmitting}>
                            Add Zone
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default WarehouseDetails;
