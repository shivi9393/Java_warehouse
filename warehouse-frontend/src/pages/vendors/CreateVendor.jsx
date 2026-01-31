import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { createVendor } from '../../api/vendors';
import { ArrowLeft, Save, Building } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import toast from 'react-hot-toast';

const CreateVendor = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await createVendor(data);
            toast.success('Vendor created successfully');
            navigate('/vendors');
        } catch (error) {
            toast.error('Failed to create vendor');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link to="/vendors">
                        <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                            Back
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900">Add Vendor</h1>
                </div>
            </div>

            <Card>
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center space-x-3">
                        <div className="bg-indigo-100 p-2 rounded-lg">
                            <Building className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-slate-900">Vendor Information</h3>
                            <p className="text-sm text-slate-500">Details about the supplier company</p>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <Input
                                    label="Company Name"
                                    {...register('name', { required: 'Company name is required' })}
                                    error={errors.name}
                                    placeholder="e.g. Acme Corp"
                                />
                            </div>

                            <div>
                                <Input
                                    label="Contact Person"
                                    {...register('contactPerson', { required: 'Contact person is required' })}
                                    error={errors.contactPerson}
                                    placeholder="e.g. Jane Doe"
                                />
                            </div>

                            <div>
                                <Input
                                    label="Email"
                                    type="email"
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address"
                                        }
                                    })}
                                    error={errors.email}
                                    placeholder="e.g. contact@acme.com"
                                />
                            </div>

                            <div>
                                <Input
                                    label="Phone"
                                    {...register('phone', { required: 'Phone is required' })}
                                    error={errors.phone}
                                    placeholder="e.g. +1 (555) 123-4567"
                                />
                            </div>

                            <div>
                                <Input
                                    label="Payment Terms"
                                    {...register('paymentTerms')}
                                    placeholder="e.g. Net 30"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <Input
                                    label="Address"
                                    {...register('address', { required: 'Address is required' })}
                                    error={errors.address}
                                    placeholder="e.g. 123 Business Park, City, State"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Contract Details / Notes</label>
                                <textarea
                                    {...register('contractDetails')}
                                    rows={3}
                                    className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    placeholder="Additional information..."
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex items-center justify-end space-x-3 border-t border-slate-100 mt-6">
                            <Link to="/vendors">
                                <Button type="button" variant="secondary">
                                    Cancel
                                </Button>
                            </Link>
                            <Button
                                type="submit"
                                isLoading={loading}
                                leftIcon={<Save className="w-4 h-4" />}
                            >
                                Create Vendor
                            </Button>
                        </div>
                    </form>
                </div>
            </Card>
        </div>
    );
};

export default CreateVendor;
