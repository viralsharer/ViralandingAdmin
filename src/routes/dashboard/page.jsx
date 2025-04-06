import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DataTable from "react-data-table-component";
import { useTheme } from "@/hooks/use-theme";
import { getTableStyles } from '@/utils/tableStyles';

import { DollarSign, Package, Users } from "lucide-react";
import api from "@/utils/api";

const Dashboard = () => {
    const { theme } = useTheme();
    const [dashboard, setDashboard] = useState({
        totalUsers: 0,
        totalTasks: 0,
        totalPackages: 0,
        transactions: [],
        users: []
    });

    const customStyles = getTableStyles(theme);

    const transactionColumns = [
        { name: "#", selector: (row, index) => index + 1, sortable: true, width: "60px" },
        { name: "Name", selector: (row) => row.name || "N/A", sortable: true },
        { name: "Email", selector: (row) => row.email || "N/A", sortable: true },
        { name: "Amount", selector: (row) => `₦${row.amount.toLocaleString()}`, sortable: true },
        { 
            name: "Date", 
            selector: (row) => new Date(row.date).toLocaleString(), 
            sortable: true,
            sortFunction: (a, b) => new Date(a.date) - new Date(b.date)
        },
    ];

    const userColumns = [
        { name: "#", selector: (row, index) => index + 1, sortable: true, width: "60px" },
        { name: "Name", selector: (row) => row.name || "No Name", sortable: true },
        { name: "Email", selector: (row) => row.email, sortable: true },
        { 
            name: "Join Date", 
            selector: (row) => new Date(row.date).toLocaleDateString(), 
            sortable: true,
            sortFunction: (a, b) => new Date(a.date) - new Date(b.date)
        },
        { 
            name: "Status", 
            selector: (row) => row.isPaid ? "Paid" : "Unpaid", 
            sortable: true,
            cell: (row) => (
                <span className={`px-2 py-1 rounded-full text-xs ${row.isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {row.isPaid ? "Paid" : "Unpaid"}
                </span>
            )
        },
        { 
            name: "Package", 
            selector: (row) => row.package || "None", 
            sortable: true 
        },
    ];

    const fetchDashboardData = async () => {
        const loadingToast = toast.loading("Fetching dashboard data...");
        try {
            const response = await api.get("/admin/dashboard/");
            setDashboard(response.data.data);
            toast.update(loadingToast, { 
                render: "Dashboard data loaded", 
                type: "success", 
                isLoading: false, 
                autoClose: 500 
            });
        } catch (error) {
            toast.update(loadingToast, { 
                render: error.response?.data?.message || "Error fetching dashboard data", 
                type: "error", 
                isLoading: false, 
                autoClose: 500 
            });
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    return (
        <div className="flex flex-col gap-y-4">
            <h1 className="title">Dashboard</h1>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-3">
                <div className="card">
                    <div className="card-header">
                        <div className="w-fit rounded-lg bg-primary-500/20 p-2 text-primary-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                            <Package size={26} />
                        </div>
                        <p className="card-title">Total Packages</p>
                    </div>
                    <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                        <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">
                            {dashboard.totalPackages}
                        </p>
                    </div>
                </div>
                
                <div className="card">
                    <div className="card-header">
                        <div className="w-fit rounded-lg bg-primary-500/20 p-2 text-primary-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                            <Users size={26} />
                        </div>
                        <p className="card-title">Total Users</p>
                    </div>
                    <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                        <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">
                            {dashboard.totalUsers}
                        </p>
                    </div>
                </div>
                
                <div className="card">
                    <div className="card-header">
                        <div className="rounded-lg bg-primary-500/20 p-2 text-primary-500 transition-colors dark:bg-blue-600/20 dark:text-blue-600">
                            <DollarSign size={26} />
                        </div>
                        <p className="card-title">Total Tasks</p>
                    </div>
                    <div className="card-body bg-slate-100 transition-colors dark:bg-slate-950">
                        <p className="text-3xl font-bold text-slate-900 transition-colors dark:text-slate-50">
                            {dashboard.totalTasks}
                        </p>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4 ">
                <div className="card">
                    <div className="card-header">
                        <p className="card-title">Recent Transactions</p>
                    </div>
                    <div className="card-body p-0">
                        <DataTable
                            columns={transactionColumns}
                            data={dashboard.transactions}
                            pagination
                            highlightOnHover
                            striped
                            responsive
                            customStyles={customStyles}
                            theme={theme === 'dark' ? 'dark' : 'light'}
                            noDataComponent={<p className="p-4 text-center">No transactions found</p>}
                        />
                    </div>
                </div>
                
                <div className="card">
                    <div className="card-header">
                        <p className="card-title">Recent Users</p>
                    </div>
                    <div className="card-body p-0">
                        <DataTable
                            columns={userColumns}
                            data={dashboard.users}
                            pagination
                            highlightOnHover
                            striped
                            responsive
                            customStyles={customStyles}
                            theme={theme === 'dark' ? 'dark' : 'light'}
                            noDataComponent={<p className="p-4 text-center">No users found</p>}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;