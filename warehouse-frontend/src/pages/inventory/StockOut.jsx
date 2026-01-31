import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { getWarehouses, getWarehouse } from '../../api/warehouses';
import { getProducts } from '../../api/products';
import { stockOut } from '../../api/inventory';
import { ArrowLeft, Save, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import toast from 'react-hot-toast';

const StockOut = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [warehouses, setWarehouses] = useState([]);
    const [products, setProducts] = useState([]);
    const [zones, setZones] = useState([]);

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();
    const selectedWarehouseId = watch('warehouseId');

    useEffect(() => {
        // Fetch warehouses and products on load
        const fetchData = async () => {
            try {
                const [warehousesData, productsData] = await Promise.all([
                    getWarehouses(),
                    getProducts()
                ]);
                setWarehouses(warehousesData);
                setProducts(productsData);
            } catch (error) {
                toast.error('Failed to load initial data');
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        // Fetch zones when warehouse selection changes
        const fetchZones = async () => {
            if (!selectedWarehouseId) {
                setZones([]);
                return;
            }
            try {
                const warehouse = await getWarehouse(selectedWarehouseId);
                setZones(warehouse.storageZones || []);
            } catch (error) {
                toast.error('Failed to load storage zones');
            }
        };
        fetchZones();
    }, [selectedWarehouseId]);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await stockOut({
                ...data,
                warehouseId: parseInt(data.warehouseId),
                productId: parseInt(data.productId),
                zoneId: data.zoneId ? parseInt(data.zoneId) : null,
                quantity: parseInt(data.quantity)
            });
            toast.success('Stock dispatched successfully');
            navigate('/inventory');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to process stock out');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link to="/inventory">
                        <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                            Back
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900">Stock Out</h1>
                </div>
            </div>

            <Card>
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center space-x-3">
                        <div className="bg-amber-100 p-2 rounded-lg">
                            <ArrowUpRight className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-slate-900">Dispatch Stock</h3>
                            <p className="text-sm text-slate-500">Record outgoing inventory items</p>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Product</label>
                                <select
                                    {...register('productId', { required: 'Product is required' })}
                                    className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                >
                                    <option value="">Select a product...</option>
                                    {products.map(product => (
                                        <option key={product.id} value={product.id}>
                                            {product.name} ({product.sku})
                                        </option>
                                    ))}
                                </select>
                                {errors.productId && <p className="mt-1 text-sm text-red-600">{errors.productId.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Warehouse</label>
                                <select
                                    {...register('warehouseId', { required: 'Warehouse is required' })}
                                    className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                >
                                    <option value="">Select a warehouse...</option>
                                    {warehouses.map(warehouse => (
                                        <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>
                                    ))}
                                </select>
                                {errors.warehouseId && <p className="mt-1 text-sm text-red-600">{errors.warehouseId.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Storage Zone</label>
                                <select
                                    {...register('zoneId')}
                                    className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    disabled={!selectedWarehouseId}
                                >
                                    <option value="">default (no specific zone)</option>
                                    {zones.map(zone => (
                                        <option key={zone.id} value={zone.id}>{zone.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <Input
                                    label="Quantity"
                                    type="number"
                                    {...register('quantity', {
                                        required: 'Quantity is required',
                                        min: { value: 1, message: 'Minimum quantity is 1' }
                                    })}
                                    error={errors.quantity}
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Reason / Notes</label>
                                <textarea
                                    {...register('notes')}
                                    rows={3}
                                    className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    placeholder="Reason for stock out (e.g., Shipping, Damaged, Adjustment)..."
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex items-center justify-end space-x-3 border-t border-slate-100 mt-6">
                            <Link to="/inventory">
                                <Button type="button" variant="secondary">
                                    Cancel
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                isLoading={loading}
                                className="bg-amber-600 hover:bg-amber-700 focus:ring-amber-500 shadow-amber-500/30"
                                leftIcon={<Save className="w-4 h-4" />}
                            >
                                Dispatch Stock
                            </Button>
                        </div>
                    </form>
                </div>
            </Card>
        </div>
    );
};

export default StockOut;
