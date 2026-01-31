import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getVendors } from '../../api/vendors';
import { Plus, Search, Truck, Phone, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import clsx from 'clsx';

const VendorList = () => {
    const { user } = useAuth();
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const data = await getVendors(user?.organizationId || 1);
                setVendors(data);
            } catch (error) {
                toast.error('Failed to load vendors');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchVendors();
    }, [user]);

    const columns = [
        {
            header: 'Vendor Name',
            accessor: 'name',
            render: (row) => (
                <div className="flex items-center">
                    <div className="bg-indigo-50 p-2 rounded-lg mr-3">
                        <Truck className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                        <div className="font-medium text-slate-900">{row.name}</div>
                        <div className="text-xs text-slate-500">Code: V-{row.id}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'Contact Person',
            accessor: 'contactPerson',
            render: (row) => (
                <div>
                    <div className="text-sm text-slate-900">{row.contactPerson}</div>
                    <a href={`mailto:${row.email}`} className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center mt-0.5">
                        <Mail className="w-3 h-3 mr-1" /> {row.email}
                    </a>
                </div>
            )
        },
        {
            header: 'Phone / Address',
            accessor: 'phone',
            render: (row) => (
                <div>
                    <div className="text-sm text-slate-900 flex items-center">
                        <Phone className="w-3 h-3 mr-1 text-slate-400" /> {row.phone}
                    </div>
                    <div className="text-xs text-slate-500 flex items-center mt-0.5 truncate max-w-xs">
                        <MapPin className="w-3 h-3 mr-1 text-slate-400" /> {row.address}
                    </div>
                </div>
            )
        },
        {
            header: 'Rating',
            accessor: 'rating',
            render: (row) => (
                <div className="flex items-center">
                    <span className={clsx(
                        "px-2 py-0.5 rounded text-xs font-medium",
                        row.rating >= 4 ? "bg-green-100 text-green-800" :
                            row.rating >= 3 ? "bg-amber-100 text-amber-800" : "bg-red-100 text-red-800"
                    )}>
                        {row.rating || 'N/A'}
                    </span>
                </div>
            )
        },
        {
            header: 'Status',
            accessor: 'active',
            render: (row) => (
                <span className={clsx(
                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                    row.active ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-800"
                )}>
                    {row.active ? 'Active' : 'Inactive'}
                </span>
            )
        },
    ];

    const filteredVendors = vendors.filter(vendor =>
        vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Vendors</h1>
                    <p className="text-slate-500 mt-1">Manage suppliers and partners</p>
                </div>
                <Link to="/vendors/new">
                    <Button leftIcon={<Plus className="w-5 h-5" />}>
                        Add Vendor
                    </Button>
                </Link>
            </div>

            <Card>
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <div className="relative w-full sm:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-9 sm:text-sm border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 py-2"
                            placeholder="Search vendors..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <Table
                    columns={columns}
                    data={filteredVendors}
                    isLoading={loading}
                    emptyMessage="No vendors found."
                />
            </Card>
        </div>
    );
};

export default VendorList;
