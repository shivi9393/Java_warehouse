import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    BarChart2,
    Warehouse,
    Package,
    ShoppingCart,
    Users,
    Truck,
    Settings,
    X
} from 'lucide-react';
import clsx from 'clsx';
import { logo } from '../../utils/constants'; // We'll create this constants file

const Sidebar = ({ isOpen, onClose }) => {
    const { user } = useAuth();

    const navigation = [
        { name: 'Dashboard', href: '/', icon: BarChart2, exact: true },
        { name: 'Warehouses', href: '/warehouses', icon: Warehouse },
        { name: 'Inventory', href: '/inventory', icon: Package },
        { name: 'Purchase Orders', href: '/purchase-orders', icon: ShoppingCart },
        { name: 'Vendors', href: '/vendors', icon: Truck },
        { name: 'Users', href: '/users', icon: Users, adminOnly: true },
        { name: 'Settings', href: '/settings', icon: Settings },
    ];

    return (
        <>
            <div
                className={clsx(
                    "fixed inset-0 bg-slate-900/50 z-40 lg:hidden transition-opacity duration-300",
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={onClose}
            />

            <div
                className={clsx(
                    "fixed inset-y-0 left-0 bg-slate-900 w-64 z-50 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-auto",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex items-center justify-between h-16 px-6 bg-slate-950/50">
                    <div className="flex items-center space-x-3">
                        <div className="bg-indigo-600 p-1.5 rounded-lg">
                            <Warehouse className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-bold text-white tracking-tight">NexStock</span>
                    </div>
                    <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="px-4 py-6">
                    <p className="px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                        Menu
                    </p>
                    <nav className="space-y-1">
                        {navigation.map((item) => {
                            // Skip if admin only and user is not admin
                            // Using optional chaining and default empty role for safety
                            if (item.adminOnly && !['SUPER_ADMIN', 'COMPANY_ADMIN'].includes(user?.role)) {
                                return null;
                            }

                            return (
                                <NavLink
                                    key={item.name}
                                    to={item.href}
                                    className={({ isActive }) =>
                                        clsx(
                                            'group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200',
                                            isActive
                                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50'
                                                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                        )
                                    }
                                    end={item.exact}
                                    onClick={() => window.innerWidth < 1024 && onClose()}
                                >
                                    <item.icon
                                        className={clsx(
                                            'mr-3 h-5 w-5 flex-shrink-0 transition-colors',
                                        )}
                                    />
                                    {item.name}
                                </NavLink>
                            );
                        })}
                    </nav>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 bg-slate-950/30">
                    <div className="flex items-center px-2">
                        <div className="flex-shrink-0">
                            <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold border-2 border-slate-800">
                                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-white group-hover:text-white truncate">
                                {user?.name || 'User'}
                            </p>
                            <p className="text-xs font-medium text-slate-400 group-hover:text-slate-300 truncate">
                                {user?.role ? user.role.replace('_', ' ') : 'Role'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
