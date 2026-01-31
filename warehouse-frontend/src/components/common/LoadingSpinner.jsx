import { Loader2 } from 'lucide-react';
import clsx from 'clsx';

const LoadingSpinner = ({ fullScreen = false, className }) => {
    if (fullScreen) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
                <div className="flex flex-col items-center">
                    <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                    <p className="mt-2 text-sm text-slate-500 font-medium">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={clsx('flex justify-center p-4', className)}>
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
    );
};

export default LoadingSpinner;
