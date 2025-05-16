import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import DataTable from "react-data-table-component";
import Modal from "@/components/modal";
import api, { formatDate } from "@/utils/api";
import { Plus, PencilLine, Trash, Loader2, ToggleLeft, ToggleRight } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { getTableStyles } from '@/utils/tableStyles';

const Coupon = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [coupons, setCoupons] = useState([]);
    const [packages, setPackages] = useState([]);
    const [formData, setFormData] = useState({ 
        code: "", 
        expiryDate: "", 
        isActive: true,
        packageId: "" 
    });
    const [editCode, setEditCode] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingId, setLoadingId] = useState(null);
    const [statusLoadingId, setStatusLoadingId] = useState(null); // Track which coupon's status is being updated

    const { theme } = useTheme();
    const customStyles = getTableStyles(theme);

    const fetchCoupons = async () => {
        const loadingToast = toast.loading("Fetching coupons...");
        try {
            const response = await api.get("/coupon/");
            setCoupons(response.data.data);
            toast.update(loadingToast, { render: "Coupons loaded", type: "success", isLoading: false, autoClose: 500 });
        } catch (error) {
            toast.update(loadingToast, { render: error.response?.data?.message || "Error fetching coupons", type: "error", isLoading: false, autoClose: 500 });
        }
    };

    const fetchPackages = async () => {
        try {
            const response = await api.get("/packages/");
            setPackages(response.data.data);
        } catch (error) {
            toast.error(error.response?.data?.message || "Error fetching packages");
        }
    };

    useEffect(() => {
        fetchCoupons();
        fetchPackages();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (editCode) {
                await api.put(`/coupon/${editCode}`, formData);
                toast.success("Coupon updated successfully");
            } else {
                await api.post("/coupon/", formData);
                toast.success("Coupon added successfully");
            }
            fetchCoupons();
            setIsModalOpen(false);
            setFormData({ code: "", expiryDate: "", isActive: true, packageId: "" });
            setEditCode(null);
        } catch (error) {
            toast.error(error.response?.data?.message || "Error saving coupon");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (coupon) => {
        setIsModalOpen(true);
        setFormData({ 
            code: coupon.code, 
            expiryDate: coupon.expiryDate.split('T')[0],
            isActive: coupon.isActive,
            packageId: coupon.packageId?._id || "" 
        });
        setEditCode(coupon.code);
    };

    const handleDelete = async (code) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoadingId(code);
                try {
                    await api.delete(`/coupon/${code}`);
                    toast.success("Coupon deleted successfully");
                    fetchCoupons();
                } catch (error) {
                    toast.error(error.response?.data?.message || "Error deleting coupon");
                } finally {
                    setLoadingId(null);
                }
            }
        });
    };

    const toggleStatus = async (coupon) => {
        setStatusLoadingId(coupon.code); // Set loading state for this specific coupon
        try {
            await api.patch(`/coupon/${coupon.code}/status`, {
                isActive: !coupon.isActive
            });
            toast.success(`Coupon ${!coupon.isActive ? "activated" : "deactivated"}`);
            fetchCoupons();
        } catch (error) {
            toast.error(error.response?.data?.message || "Error updating coupon status");
        } finally {
            setStatusLoadingId(null); // Clear loading state
        }
    };

    // Columns for DataTable
    const columns = [
        { name: "#", selector: (row, index) => index + 1, sortable: true, width: "60px" },
        { name: "Code", selector: (row) => row.code, sortable: true },
        { name: "Package", selector: (row) => row.packageId?.name || "All Packages", sortable: true },
        { 
            name: "Status", 
            cell: (row) => (
                <button 
                    onClick={() => toggleStatus(row)} 
                    disabled={statusLoadingId === row.code || loadingId === row.code}
                    className="flex items-center gap-2"
                >
                    {statusLoadingId === row.code ? (
                        <Loader2 className="animate-spin" size={20} />
                    ) : row.isActive ? (
                        <ToggleRight className="text-green-500" size={20} />
                    ) : (
                        <ToggleLeft className="text-gray-500" size={20} />
                    )}
                    {statusLoadingId === row.code ? "Loading..." : row.isActive ? "Active" : "Inactive"}
                </button>
            ),
            sortable: true 
        },
        { name: "Expiry Date", selector: (row) => formatDate(row.expiryDate), sortable: true },
        { name: "Date Created", selector: (row) => formatDate(row.createdAt), sortable: true },
        {
            name: "Actions",
            cell: (row) => (
                <div className="flex items-center gap-x-4">
                    <button onClick={() => handleEdit(row)} className="text-secondary-500" disabled={statusLoadingId === row.code || loadingId === row.code}>
                        <PencilLine size={20} />
                    </button>
                    <button onClick={() => handleDelete(row.code)} className="text-red-500" disabled={statusLoadingId === row.code || loadingId === row.code}>
                        {loadingId === row.code ? <Loader2 className="animate-spin" size={20} /> : <Trash size={20} />}
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    return (
        <div className="flex flex-col gap-y-4">
            <div className="flex justify-between items-center">
                <h1 className="title">Coupons</h1>
                <button
                    onClick={() => {
                        setIsModalOpen(true);
                        setFormData({ code: "", expiryDate: "", isActive: true, packageId: "" });
                        setEditCode(null);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-500 dark:bg-blue-500 text-white rounded-lg hover:bg-primary-600 dark:hover:bg-blue-700 transition"
                >
                    <Plus size={18} />
                    Add Coupon
                </button>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <form onSubmit={handleSubmit}>
                    <label className="block mb-2 text-sm font-medium">Coupon Code</label>
                    <input 
                        type="text" 
                        name="code" 
                        value={formData.code} 
                        onChange={handleChange} 
                        className="w-full p-2 border rounded-md" 
                        disabled={isLoading || editCode}
                        required
                    />

                    <label className="block mt-4 mb-2 text-sm font-medium">Package (optional)</label>
                    <select
                        name="packageId"
                        value={formData.packageId}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                        disabled={isLoading}
                    >
                        <option value="">All Packages</option>
                        {packages.map((pkg) => (
                            <option key={pkg._id} value={pkg._id}>
                                {pkg.name}
                            </option>
                        ))}
                    </select>

                    <label className="block mt-4 mb-2 text-sm font-medium">Expiry Date</label>
                    <input 
                        type="date" 
                        name="expiryDate" 
                        value={formData.expiryDate} 
                        onChange={handleChange} 
                        className="w-full p-2 border rounded-md" 
                        disabled={isLoading}
                        required
                    />

                    <div className="flex items-center mt-4 mb-4">
                        <input
                            type="checkbox"
                            id="isActive"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                            className="mr-2"
                            disabled={isLoading}
                        />
                        <label htmlFor="isActive" className="text-sm font-medium">
                            Active
                        </label>
                    </div>

                    <button 
                        type="submit" 
                        className="mt-4 w-full bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600 transition flex justify-center items-center gap-2" 
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={18} /> : null}
                        {isLoading ? "Saving..." : editCode ? "Update Coupon" : "Save Coupon"}
                    </button>
                </form>
            </Modal>

            <div className="card">
                <DataTable
                    columns={columns}
                    data={coupons}
                    pagination
                    highlightOnHover
                    paginationPerPage={50}
                    paginationRowsPerPageOptions={[10, 25, 50, 100, 200]}
                    persistTableHead
                    striped
                    responsive
                    customStyles={customStyles}
                    theme={theme === 'dark' ? 'dark' : 'light'}
                    noDataComponent={<p className="p-4 text-center">No coupons found</p>}
                />
            </div>
        </div>
    );
};

export default Coupon;