import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import DataTable from "react-data-table-component";
import api, { formatDate } from "@/utils/api";
import { Check, X, Loader2, ExternalLink } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { getTableStyles } from '@/utils/tableStyles';

const TaskLog = () => {
    const [taskLogs, setTaskLogs] = useState([]);
    const [loadingId, setLoadingId] = useState(null);
    const [filter, setFilter] = useState("pending");

    const { theme } = useTheme();
    const customStyles = getTableStyles(theme);

    const fetchTaskLogs = async () => {
        const loadingToast = toast.loading("Fetching Task Logs...");
        try {
            const response = await api.get("/tasks/tasklogs");
            setTaskLogs(response.data.data);
            toast.update(loadingToast, {
                render: "Task Logs loaded successfully",
                type: "success",
                isLoading: false,
                autoClose: 500,
            });
        } catch (error) {
            toast.update(loadingToast, {
                render: error.response?.data?.message || "Error fetching Task Logs",
                type: "error",
                isLoading: false,
                autoClose: 500,
            });
        }
    };

    useEffect(() => {
        fetchTaskLogs();
    }, []);

    const handleAction = async (taskLogId, action) => {
        Swal.fire({
            title: `Are you sure you want to ${action} this task?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: action === "confirm" ? "#28a745" : "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: `Yes, ${action} it!`,
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoadingId(taskLogId);
                try {
                    const response = await api.post("/tasks/review", { taskLogId, action });
                    Swal.fire("Success", response.data.message, "success");
                    fetchTaskLogs();
                } catch (error) {
                    Swal.fire("Error", error.response?.data?.message || "Action failed", "error");
                } finally {
                    setLoadingId(null);
                }
            }
        });
    };

    const filteredTaskLogs = taskLogs.filter((log) => log.status === filter);

    const columns = [
        { name: "#", selector: (row, index) => index + 1, width: "60px" },
        { name: "User Name", selector: (row) => row.userId?.name, sortable: true },
        { name: "User Email", selector: (row) => row.userId?.email, sortable: true },
        { name: "Task Title", selector: (row) => row.taskId?.title, sortable: true },
        { 
            name: "Task Link", 
            cell: (row) => (
                row.taskId?.taskLink ? (
                    <a 
                        href={row.taskId.taskLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
                    >
                        {row.taskId.taskLink}
                        <ExternalLink size={16} />
                    </a>
                ) : (
                    <span className="text-gray-400">No link</span>
                )
            ),
            sortable: true,
            minWidth: "200px"
        },
        { name: "Amount", selector: (row) => `₦${row.amount}`, sortable: true },
        { 
            name: "Status", 
            cell: (row) => (
                <span className={`px-2 py-1 rounded-full text-xs ${
                    row.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    row.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                }`}>
                    {row.status}
                </span>
            ),
            sortable: true 
        },
        { name: "Date", selector: (row) => formatDate(row.createdAt), sortable: true },
    ];

    if (filter === "pending") {
        columns.push({
            name: "Actions",
            cell: (row) => (
                <div className="flex items-center gap-x-3">
                    <button
                        onClick={() => handleAction(row._id, "confirm")}
                        className="text-green-500 hover:text-green-700"
                        disabled={loadingId === row._id}
                    >
                        {loadingId === row._id ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
                    </button>
                    <button
                        onClick={() => handleAction(row._id, "reject")}
                        className="text-red-500 hover:text-red-700"
                        disabled={loadingId === row._id}
                    >
                        {loadingId === row._id ? <Loader2 className="animate-spin" size={20} /> : <X size={20} />}
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        });
    }

    return (
        <div className="flex flex-col gap-y-4">
            <h1 className="title">Task Logs</h1>
            <div className="flex gap-x-4 mb-4">
                {['pending', 'confirmed', 'rejected'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded transition-colors ${
                            filter === status 
                                ? "bg-blue-500 text-white" 
                                : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                        }`}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                ))}
            </div>
            <div className="card">
                <DataTable
                    columns={columns}
                    data={filteredTaskLogs}
                    pagination
                    highlightOnHover
                    paginationPerPage={50}
                    paginationRowsPerPageOptions={[10, 25, 50, 100, 200]}
                    persistTableHead
                    striped
                    responsive
                    customStyles={customStyles}
                    theme={theme === 'dark' ? 'dark' : 'light'}
                    noDataComponent={<p className="p-4 text-center">No Task Logs found</p>}
                />
            </div>
        </div>
    );
};

export default TaskLog;