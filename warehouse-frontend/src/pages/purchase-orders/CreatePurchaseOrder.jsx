import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { getVendors } from '../../api/vendors';
import { getProducts } from '../../api/products';
import { createPurchaseOrder } from '../../api/purchaseOrders';
import { ArrowLeft, Save, ShoppingCart, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import toast from 'react-hot-toast';

const CreatePurchaseOrder = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [vendors, setVendors] = useState([]);
    const [products, setProducts] = useState([]);

    const { register, control, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: {
            items: [{ productId: '', quantity: 1 }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "items"
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [vendorsData, productsData] = await Promise.all([
                    getVendors(),
                    getProducts()
                ]);
                setVendors(vendorsData);
                setProducts(productsData);
            } catch (error) {
                toast.error('Failed to load initial data');
            }
        };
        fetchData();
    }, []);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            // Format items
            const formattedItems = data.items.map(item => ({
                productId: parseInt(item.productId),
                quantity: parseInt(item.quantity)
            }));

            await createPurchaseOrder({
                vendorId: parseInt(data.vendorId),
                expectedDeliveryDate: data.expectedDeliveryDate,
                items: formattedItems
            });

            toast.success('Purchase Order created successfully');
            navigate('/purchase-orders');
        } catch (error) {
            toast.error('Failed to create purchase order');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getProductPrice = (productId) => {
        const product = products.find(p => p.id === parseInt(productId));
        return product ? product.unitPrice : 0;
    };

    // Watch items to calculate total (client-side estimation)
    const watchedItems = watch('items');
    const estimatedTotal = watchedItems.reduce((sum, item) => {
        const price = getProductPrice(item.productId);
        const qty = parseInt(item.quantity) || 0;
        return sum + (price * qty);
    }, 0);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link to="/purchase-orders">
                        <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                            Back
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900">Create Purchase Order</h1>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Card>
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                        <div className="flex items-center space-x-3">
                            <div className="bg-indigo-100 p-2 rounded-lg">
                                <ShoppingCart className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-slate-900">Order Details</h3>
                                <p className="text-sm text-slate-500">General information about the purchase order</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Vendor</label>
                            <select
                                {...register('vendorId', { required: 'Vendor is required' })}
                                className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value="">Select a vendor...</option>
                                {vendors.map(vendor => (
                                    <option key={vendor.id} value={vendor.id}>{vendor.name}</option>
                                ))}
                            </select>
                            {errors.vendorId && <p className="mt-1 text-sm text-red-600">{errors.vendorId.message}</p>}
                            <div className="mt-2 text-xs text-slate-500">
                                Don't see your vendor? <Link to="/vendors/new" className="text-indigo-600 hover:text-indigo-500">Create new vendor</Link>
                            </div>
                        </div>

                        <div>
                            <Input
                                label="Expected Delivery Date"
                                type="date"
                                {...register('expectedDeliveryDate')}
                            />
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                        <h3 className="text-lg font-medium text-slate-900">Line Items</h3>
                        <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            leftIcon={<Plus className="w-4 h-4" />}
                            onClick={() => append({ productId: '', quantity: 1 })}
                        >
                            Add Item
                        </Button>
                    </div>

                    <div className="p-6 space-y-4">
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex flex-col sm:flex-row gap-4 items-start bg-slate-50 p-4 rounded-lg border border-slate-100">
                                <div className="flex-1 w-full">
                                    <label className="block text-xs font-medium text-slate-500 mb-1">Product</label>
                                    <select
                                        {...register(`items.${index}.productId`, { required: 'Product is required' })}
                                        className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    >
                                        <option value="">Select product...</option>
                                        {products.map(product => (
                                            <option key={product.id} value={product.id}>
                                                {product.name} ({product.sku}) - ${product.unitPrice}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="w-full sm:w-32">
                                    <Input
                                        label="Quantity"
                                        type="number"
                                        min="1"
                                        {...register(`items.${index}.quantity`, { required: true, min: 1 })}
                                    />
                                </div>

                                <div className="hidden sm:block w-32 pt-6 text-right font-medium text-slate-700">
                                    {/* Estimated Item Total */}
                                    ${(getProductPrice(watch(`items.${index}.productId`)) * (parseInt(watch(`items.${index}.quantity`)) || 0)).toFixed(2)}
                                </div>

                                <div className="pt-6">
                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="text-red-500 hover:text-red-700 p-2"
                                        disabled={fields.length === 1}
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}

                        <div className="flex justify-end pt-4 border-t border-slate-100">
                            <div className="text-right">
                                <span className="text-sm text-slate-500">Estimated Total:</span>
                                <span className="ml-2 text-2xl font-bold text-slate-900">${estimatedTotal.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="flex justify-end space-x-3">
                    <Link to="/purchase-orders">
                        <Button type="button" variant="secondary">
                            Cancel
                        </Button>
                    </Link>
                    <Button
                        type="submit"
                        isLoading={loading}
                        leftIcon={<Save className="w-4 h-4" />}
                    >
                        Create Order
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CreatePurchaseOrder;
