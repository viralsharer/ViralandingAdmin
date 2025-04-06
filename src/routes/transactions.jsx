import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DataTable from "react-data-table-component";
import api, {formatDate} from "@/utils/api";
import { useTheme } from "@/hooks/use-theme";
import { getTableStyles } from '@/utils/tableStyles';

const Transactions = () => {
    const { theme } = useTheme();
    const customStyles = getTableStyles(theme);
    
    const [Transaction, setTransaction] = useState([]);

    // Fetch Transaction
    const fetchTransactions = async () => {
        const loadingToast = toast.loading("Fetching Transaction...");
        try {
            const response = await api.get("/admin/transactions/");
            setTransaction(response.data.data);
            toast.update(loadingToast, {
                render: "Transaction loaded",
                type: "success",
                isLoading: false,
                autoClose: 500,
            });
        } catch (error) {
            toast.update(loadingToast, {
                render: error.response?.data?.message || "Error fetching Transaction",
                type: "error",
                isLoading: false,
                autoClose: 500,
            });
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    // Status badge component
    const StatusBadge = ({ status }) => {
        let bgColor = '';
        let textColor = '';
        
        switch(status?.toLowerCase()) {
            case 'success':
                bgColor = 'bg-green-100';
                textColor = 'text-green-800';
                break;
            case 'pending':
                bgColor = 'bg-yellow-100';
                textColor = 'text-yellow-800';
                break;
            default: // for failed or other statuses
                bgColor = 'bg-red-100';
                textColor = 'text-red-800';
        }
        
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
                {status}
            </span>
        );
    };

    // Format amount with currency symbol
    const formatAmount = (amount) => {
        return `₦${parseFloat(amount).toLocaleString('en-NG', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };

    // Columns for DataTable
    const columns = [
        { name: "#", selector: (row, index) => index + 1, sortable: true, width: "60px" },
        { name: "Name", selector: (row) => row.user?.name || 'N/A', sortable: true },
        { name: "Email", selector: (row) => row.user?.email || 'N/A', sortable: false },
        { name: "Transaction ID", selector: (row) => row.transaction_id || 'N/A', sortable: false },
        { name: "Reference", selector: (row) => row.reference || 'N/A', sortable: false },
        { 
            name: "Status", 
            selector: (row) => row.status, 
            sortable: false,
            cell: (row) => <StatusBadge status={row.status} />,
            minWidth: '120px'
        },
        { 
            name: "Amount", 
            selector: (row) => formatAmount(row.amount), 
            sortable: true,
            right: true
        },
        { name: "Transaction Type", selector: (row) => row.transaction_type || 'N/A', sortable: false },
        { name: "Transaction Service", selector: (row) => row.transaction_services || 'N/A', sortable: false },
        { 
            name: "Date Created", 
            selector: (row) => formatDate(row.createdAt), 
            sortable: true,
            minWidth: '150px'
        },
    ];

    return (
        <div className="flex flex-col gap-y-4">
            <div className="flex justify-between items-center">
                <h1 className="title">Transactions</h1>
            </div>

            <div className="card">
                <DataTable 
                    columns={columns} 
                    data={Transaction} 
                    pagination 
                    paginationPerPage={50}
                    paginationRowsPerPageOptions={[10, 25, 50, 100, 200]}
                    persistTableHead
                    highlightOnHover 
                    striped 
                    responsive
                    customStyles={customStyles}
                    theme={theme === 'dark' ? 'dark' : 'light'}
                    noDataComponent={<p className="p-4 text-center">No transactions found</p>} 
                />
            </div>
        </div>
    );
};

export default Transactions;