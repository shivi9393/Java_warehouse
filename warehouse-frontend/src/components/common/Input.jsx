import { forwardRef } from 'react';
import clsx from 'clsx';

const Input = forwardRef(({
    label,
    error,
    className,
    type = 'text',
    icon,
    ...props
}, ref) => {
    return (
        <div className={className}>
            {label && (
                <label className="block text-sm font-medium text-slate-700 mb-1">
                    {label}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        {icon}
                    </div>
                )}
                <input
                    ref={ref}
                    type={type}
                    className={clsx(
                        'block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-colors duration-200',
                        icon ? 'pl-10' : 'pl-3',
                        error && 'border-red-300 focus:border-red-500 focus:ring-red-500',
                        props.disabled && 'bg-slate-50 text-slate-500'
                    )}
                    {...props}
                />
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-600">{error.message}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
