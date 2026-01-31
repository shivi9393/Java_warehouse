import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { createWarehouse } from '../../api/warehouses';
import { ArrowLeft, Save, Warehouse } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import toast from 'react-hot-toast';

const CreateWarehouse = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            // API expects capacity as number
            const payload = {
                ...data,
                totalCapacity: parseInt(data.totalCapacity),
                active: true
            };
            await createWarehouse(payload);
            toast.success('Warehouse created successfully');
            navigate('/warehouses');
        } catch (error) {
            toast.error('Failed to create warehouse');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link to="/warehouses">
                        <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                            Back
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900">Create Warehouse</h1>
                </div>
            </div>

            <Card>
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center space-x-3">
                        <div className="bg-indigo-100 p-2 rounded-lg">
                            <Warehouse className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-slate-900">Warehouse Details</h3>
                            <p className="text-sm text-slate-500">Enter the information for the new distribution center</p>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <Input
                                    label="Warehouse Name"
                                    {...register('name', { required: 'Name is required' })}
                                    error={errors.name}
                                    placeholder="e.g. Main Distribution Center"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <Input
                                    label="Location / Address"
                                    {...register('location', { required: 'Location is required' })}
                                    error={errors.location}
                                    placeholder="e.g. 123 Logistics Way, New York, NY"
                                />
                            </div>

                            <div>
                                <Input
                                    label="Total Capacity"
                                    type="number"
                                    {...register('totalCapacity', {
                                        required: 'Capacity is required',
                                        min: { value: 1, message: 'Capacity must be at least 1' }
                                    })}
                                    error={errors.totalCapacity}
                                    placeholder="e.g. 10000"
                                />
                                <p className="mt-1 text-xs text-slate-500">Maximum number of units this warehouse can hold</p>
                            </div>

                            <div>
                                <Input
                                    label="Manager Name (Optional)"
                                    {...register('managerName')}
                                    placeholder="e.g. John Smith"
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex items-center justify-end space-x-3 border-t border-slate-100 mt-6">
                            <Link to="/warehouses">
                                <Button type="button" variant="secondary">
                                    Cancel
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                isLoading={isLoading}
                                leftIcon={<Save className="w-4 h-4" />}
                            >
                                Create Warehouse
                            </Button>
                        </div>
                    </form>
                </div>
            </Card>
        </div>
    );
};

export default CreateWarehouse;
