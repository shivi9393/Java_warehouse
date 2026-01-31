import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, User, Building, Warehouse } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { motion } from 'framer-motion';

const Register = () => {
    const { register: registerUser } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const password = watch('password');

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            await registerUser({
                organizationName: data.organizationName,
                adminName: data.fullName,
                email: data.email,
                password: data.password
            });
            toast.success('Registration successful! Please login.');
            navigate('/login');
        } catch (error) {
            toast.error('Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="h-12 w-12 rounded-xl bg-indigo-600 flex items-center justify-center">
                        <Warehouse className="h-8 w-8 text-white" />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
                    Create your account
                </h2>
                <p className="mt-2 text-center text-sm text-slate-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                        Sign in
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-slate-100"
                >
                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>

                        <div className="bg-indigo-50 p-4 rounded-lg mb-6 border border-indigo-100">
                            <h3 className="text-sm font-medium text-indigo-800 mb-1">Organization Details</h3>
                            <p className="text-xs text-indigo-600">Register your company to get started</p>
                        </div>

                        <Input
                            label="Organization Name"
                            type="text"
                            icon={<Building className="h-5 w-5" />}
                            {...register('organizationName', { required: 'Organization name is required' })}
                            error={errors.organizationName}
                            placeholder="Acme Corp"
                        />

                        <Input
                            label="Full Name"
                            type="text"
                            icon={<User className="h-5 w-5" />}
                            {...register('fullName', { required: 'Full name is required' })}
                            error={errors.fullName}
                            placeholder="John Doe"
                        />

                        <Input
                            label="Email address"
                            type="email"
                            icon={<Mail className="h-5 w-5" />}
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Invalid email address'
                                }
                            })}
                            error={errors.email}
                            placeholder="you@example.com"
                        />

                        <Input
                            label="Password"
                            type="password"
                            icon={<Lock className="h-5 w-5" />}
                            {...register('password', {
                                required: 'Password is required',
                                minLength: {
                                    value: 8,
                                    message: 'Password must be at least 8 characters'
                                }
                            })}
                            error={errors.password}
                            placeholder="••••••••"
                        />

                        <Input
                            label="Confirm Password"
                            type="password"
                            icon={<Lock className="h-5 w-5" />}
                            {...register('confirmPassword', {
                                required: 'Please confirm your password',
                                validate: value => value === password || 'Passwords do not match'
                            })}
                            error={errors.confirmPassword}
                            placeholder="••••••••"
                        />

                        <div className="text-sm text-slate-500">
                            By clicking "Create Account", you agree to our{' '}
                            <a href="#" className="font-medium text-indigo-600 hover:underline">Terms of Service</a>
                            {' '}and{' '}
                            <a href="#" className="font-medium text-indigo-600 hover:underline">Privacy Policy</a>.
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            isLoading={isLoading}
                        >
                            Create Account
                        </Button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;
