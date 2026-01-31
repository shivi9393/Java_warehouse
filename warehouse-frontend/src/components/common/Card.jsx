import clsx from 'clsx';
import { motion } from 'framer-motion';

const Card = ({ children, className, hover = false, ...props }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={clsx(
                'bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden',
                hover && 'hover:shadow-md transition-shadow duration-200 cursor-pointer',
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export const CardHeader = ({ children, className, action }) => (
    <div className={clsx('px-6 py-4 border-b border-slate-50 flex items-center justify-between', className)}>
        <div>{children}</div>
        {action && <div>{action}</div>}
    </div>
);

export const CardTitle = ({ children, className }) => (
    <h3 className={clsx('text-lg font-semibold text-slate-800', className)}>
        {children}
    </h3>
);

export const CardContent = ({ children, className }) => (
    <div className={clsx('p-6', className)}>
        {children}
    </div>
);

export default Card;
