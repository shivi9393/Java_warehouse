import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    Bell,
    Search,
    User,
    Settings,
    LogOut,
    Menu
} from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

const Header = ({ onMenuClick }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="bg-white border-b border-slate-200 h-16 fixed w-full top-0 z-30 lg:pl-64 transition-all duration-300">
            <div className="flex items-center justify-between h-full px-4 sm:px-6 lg:px-8">
                <div className="flex items-center">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                    >
                        <Menu className="h-6 w-6" />
                    </button>

                    <div className="hidden md:flex ml-4 items-center">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 sm:text-sm border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Search..."
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <button className="p-2 rounded-full text-slate-400 hover:text-slate-500 hover:bg-slate-100 relative">
                        <Bell className="h-6 w-6" />
                        <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                    </button>

                    <div className="relative ml-3">
                        <div>
                            <button
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="flex items-center max-w-xs text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <span className="sr-only">Open user menu</span>
                                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold border border-indigo-200">
                                    {user?.name ? user.name.charAt(0).toUpperCase() : <User className="h-5 w-5" />}
                                </div>
                                <span className="hidden ml-3 md:block font-medium text-slate-700">
                                    {user?.name || 'User'}
                                </span>
                            </button>
                        </div>

                        <AnimatePresence>
                            {showProfileMenu && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.1 }}
                                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                                >
                                    <div className="px-4 py-2 border-b border-slate-100">
                                        <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                                    </div>

                                    <a
                                        href="#"
                                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center"
                                        onClick={() => setShowProfileMenu(false)}
                                    >
                                        <User className="mr-2 h-4 w-4" /> Your Profile
                                    </a>
                                    <a
                                        href="#"
                                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center"
                                        onClick={() => setShowProfileMenu(false)}
                                    >
                                        <Settings className="mr-2 h-4 w-4" /> Settings
                                    </a>

                                    <div className="border-t border-slate-100 mt-1">
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                                        >
                                            <LogOut className="mr-2 h-4 w-4" /> Sign out
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
