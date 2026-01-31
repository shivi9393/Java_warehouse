import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Loader2 } from 'lucide-react';

// Layouts
import DashboardLayout from './components/layout/DashboardLayout';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import WarehouseList from './pages/warehouses/WarehouseList';
import CreateWarehouse from './pages/warehouses/CreateWarehouse';
import WarehouseDetails from './pages/warehouses/WarehouseDetails';
import InventoryList from './pages/inventory/InventoryList';
import StockIn from './pages/inventory/StockIn';
import StockOut from './pages/inventory/StockOut';
import PurchaseOrderList from './pages/purchase-orders/PurchaseOrderList';
import CreatePurchaseOrder from './pages/purchase-orders/CreatePurchaseOrder';
import PurchaseOrderDetails from './pages/purchase-orders/PurchaseOrderDetails';
import VendorList from './pages/vendors/VendorList';
import CreateVendor from './pages/vendors/CreateVendor';

// Placeholder pages (will be implemented later)
const PlaceholderPage = ({ title }) => (
    <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-700">{title}</h2>
        <p className="text-slate-500 mt-2">This feature is coming soon.</p>
    </div>
);

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

// Public Route Wrapper (redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return children;
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <Toaster position="top-right" />
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    } />
                    <Route path="/register" element={
                        <PublicRoute>
                            <Register />
                        </PublicRoute>
                    } />

                    {/* Protected Routes */}
                    <Route path="/" element={
                        <ProtectedRoute>
                            <DashboardLayout />
                        </ProtectedRoute>
                    }>
                        <Route index element={<Dashboard />} />

                        {/* Warehouse Routes */}
                        <Route path="warehouses" element={<WarehouseList />} />
                        <Route path="warehouses/new" element={<CreateWarehouse />} />
                        <Route path="warehouses/:id" element={<WarehouseDetails />} />

                        {/* Inventory Routes */}
                        <Route path="inventory" element={<InventoryList />} />
                        <Route path="inventory/stock-in" element={<StockIn />} />
                        <Route path="inventory/stock-out" element={<StockOut />} />

                        {/* Purchase Order Routes */}
                        <Route path="purchase-orders" element={<PurchaseOrderList />} />
                        <Route path="purchase-orders/new" element={<CreatePurchaseOrder />} />
                        <Route path="purchase-orders/new" element={<CreatePurchaseOrder />} />
                        <Route path="purchase-orders/:id" element={<PurchaseOrderDetails />} />

                        {/* Vendor Routes */}
                        <Route path="vendors" element={<VendorList />} />
                        <Route path="vendors/new" element={<CreateVendor />} />

                        <Route path="users" element={<PlaceholderPage title="User Management" />} />
                        <Route path="settings" element={<PlaceholderPage title="Settings" />} />
                    </Route>

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
