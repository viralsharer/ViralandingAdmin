import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DataTable from "react-data-table-component";
import api from "@/utils/api";
import { useTheme } from "@/hooks/use-theme";
import { getTableStyles } from '@/utils/tableStyles';

const Users = () => {

    const { theme } = useTheme();
    const customStyles = getTableStyles(theme);

    
    const [Transaction, setTransaction] = useState([]);

    // Fetch Transaction
    const fetchTransactions = async () => {
        const loadingToast = toast.loading("Fetching Transaction...");
        try {
            const response = await api.get("/admin/alluser/");
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

    // Columns for DataTable – showing key fields; adjust as needed
    const columns = [
        { name: "#", selector: (row, index) => index + 1, sortable: true, width: "60px" },
        { name: "Name", selector: (row) => row.name, sortable: true },
        { name: "Email", selector: (row) => row.email, sortable: false },
        { 
            name: "Join Date", 
            selector: (row) => new Date(row.createdAt).toLocaleDateString(), 
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
        }
    ];

    return (
        <div className="flex flex-col gap-y-4">
            <div className="flex justify-between items-center">
                <h1 className="title">Users</h1>
            </div>

          

            <div className="card">
                <DataTable 
                    columns={columns} 
                    data={Transaction} 
                    pagination 
                    highlightOnHover 
                    paginationPerPage={50}
                    paginationRowsPerPageOptions={[10, 25, 50, 100, 200]}
                    persistTableHead
                    striped 
                    responsive
                    customStyles={customStyles}
                    theme={theme === 'dark' ? 'dark' : 'light'}
                    noDataComponent={<p className="p-4 text-center">No Transaction found</p>} 
                />
            </div>
        </div>
    );
};

export default Users;
