import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import DataTable from "react-data-table-component";
import Modal from "@/components/modal";
import api, { formatDate } from "@/utils/api";
import { Plus, PencilLine, Trash, Loader2, ToggleLeft, ToggleRight, Download, FilePlus2, X } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { getTableStyles } from '@/utils/tableStyles';

const Coupon = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [coupons, setCoupons] = useState([]);
    const [packages, setPackages] = useState([]);
    const [formData, setFormData] = useState({ 
        code: "", 
        expiryDate: "", 
        isActive: true,
        packageId: "" 
    });
    const [bulkFormData, setBulkFormData] = useState({
        quantity: 1,
        expiryDate: "",
        packageId: "",
        codePrefix: ""
    });
    const [editCode, setEditCode] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isBulkLoading, setIsBulkLoading] = useState(false);
    const [isExportLoading, setIsExportLoading] = useState(false);
    const [loadingId, setLoadingId] = useState(null);
    const [statusLoadingId, setStatusLoadingId] = useState(null);

    const { theme } = useTheme();
    const customStyles = getTableStyles(theme);

    const fetchCoupons = async () => {
        const loadingToast = toast.loading("Fetching coupons...");
        try {
            const response = await api.get("/coupon/");
            // Sort by createdAt date (newest first)
            const sortedCoupons = response.data.data.sort((a, b) => 
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            setCoupons(sortedCoupons);

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

    const handleBulkChange = (e) => {
        setBulkFormData({ ...bulkFormData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.packageId) {
            toast.error("Please select a package");
            return;
        }

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

    const handleBulkSubmit = async (e) => {
        e.preventDefault();
        
        if (!bulkFormData.packageId) {
            toast.error("Please select a package");
            return;
        }
        if (!bulkFormData.codePrefix) {
            toast.error("Please enter a code prefix");
            return;
        }

        setIsBulkLoading(true);
        try {
            const response = await api.post("/coupon/bulk-create", bulkFormData);
            toast.success(`Successfully created ${response.data.data.createdCount} coupons`);
            fetchCoupons();
            setIsBulkModalOpen(false);
            setBulkFormData({
                quantity: 1,
                expiryDate: "",
                packageId: "",
                codePrefix: ""
            });
            
          
        } catch (error) {
            toast.error(error.response?.data?.message || "Error creating bulk coupons");
        } finally {
            setIsBulkLoading(false);
        }
    };

    const handleExport = async () => {
        setIsExportLoading(true);
        try {
            const response = await api.get("/coupon/export/export", {
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'coupons-export.csv');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            
            toast.success("Coupons exported successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Error exporting coupons");
        } finally {
            setIsExportLoading(false);
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
        setStatusLoadingId(coupon.code);
        try {
            await api.patch(`/coupon/${coupon.code}/status`, {
                isActive: !coupon.isActive
            });
            toast.success(`Coupon ${!coupon.isActive ? "activated" : "deactivated"}`);
            fetchCoupons();
        } catch (error) {
            toast.error(error.response?.data?.message || "Error updating coupon status");
        } finally {
            setStatusLoadingId(null);
        }
    };

    const handleRowClicked = (row) => {
        setSelectedCoupon(row);
        setIsDetailModalOpen(true);
    };

    const columns = [
        { name: "#", selector: (row, index) => index + 1, sortable: true, width: "60px" },
        { name: "Code", selector: (row) => row.code, sortable: true },
        { name: "Package", selector: (row) => row.packageId?.name || "N/A", sortable: true },
        { 
            name: "Status", 
            cell: (row) => (
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleStatus(row);
                    }} 
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
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(row);
                        }} 
                        className="text-secondary-500" 
                        disabled={statusLoadingId === row.code || loadingId === row.code}
                    >
                        <PencilLine size={20} />
                    </button>
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(row.code);
                        }} 
                        className="text-red-500" 
                        disabled={statusLoadingId === row.code || loadingId === row.code}
                    >
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
                <div className="flex gap-2">
                    <button
                        onClick={() => handleExport()}
                        disabled={isExportLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                    >
                        {isExportLoading ? (
                            <Loader2 className="animate-spin" size={18} />
                        ) : (
                            <Download size={18} />
                        )}
                        {isExportLoading ? "Exporting..." : "Export CSV"}
                    </button>
                    <button
                        onClick={() => setIsBulkModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
                    >
                        <FilePlus2 size={18} />
                        Bulk Create
                    </button>
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
            </div>

            {/* Regular Coupon Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <form onSubmit={handleSubmit}>
                    <label className="block mb-2 text-sm font-medium">Coupon Code <span className="text-red-500">*</span></label>
                    <input 
                        type="text" 
                        name="code" 
                        value={formData.code} 
                        onChange={handleChange} 
                        className="w-full p-2 border rounded-md" 
                        disabled={isLoading || editCode}
                        required
                    />

                    <label className="block mt-4 mb-2 text-sm font-medium">Package <span className="text-red-500">*</span></label>
                    <select
                        name="packageId"
                        value={formData.packageId}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md"
                        disabled={isLoading}
                        required
                    >
                        <option value="">Select a package</option>
                        {packages.map((pkg) => (
                            <option key={pkg._id} value={pkg._id}>
                                {pkg.name}
                            </option>
                        ))}
                    </select>

                    <label className="block mt-4 mb-2 text-sm font-medium">Expiry Date <span className="text-red-500">*</span></label>
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

            {/* Bulk Create Modal */}
            <Modal isOpen={isBulkModalOpen} onClose={() => setIsBulkModalOpen(false)}>
                <form onSubmit={handleBulkSubmit}>
                    <label className="block mb-2 text-sm font-medium">Quantity <span className="text-red-500">*</span></label>
                    <input 
                        type="number" 
                        name="quantity" 
                        min="1"
                        max="100"
                        value={bulkFormData.quantity} 
                        onChange={handleBulkChange} 
                        className="w-full p-2 border rounded-md" 
                        disabled={isBulkLoading}
                        required
                    />

                    <label className="block mt-4 mb-2 text-sm font-medium">Package <span className="text-red-500">*</span></label>
                    <select
                        name="packageId"
                        value={bulkFormData.packageId}
                        onChange={handleBulkChange}
                        className="w-full p-2 border rounded-md"
                        disabled={isBulkLoading}
                        required
                    >
                        <option value="">Select a package</option>
                        {packages.map((pkg) => (
                            <option key={pkg._id} value={pkg._id}>
                                {pkg.name}
                            </option>
                        ))}
                    </select>

                    <label className="block mt-4 mb-2 text-sm font-medium">Code Prefix <span className="text-red-500">*</span></label>
                    <input 
                        type="text" 
                        name="codePrefix" 
                        value={bulkFormData.codePrefix} 
                        onChange={handleBulkChange} 
                        className="w-full p-2 border rounded-md" 
                        disabled={isBulkLoading}
                        required
                    />

                    <label className="block mt-4 mb-2 text-sm font-medium">Expiry Date <span className="text-red-500">*</span></label>
                    <input 
                        type="date" 
                        name="expiryDate" 
                        value={bulkFormData.expiryDate} 
                        onChange={handleBulkChange} 
                        className="w-full p-2 border rounded-md" 
                        disabled={isBulkLoading}
                        required
                    />

                    <button 
                        type="submit" 
                        className="mt-4 w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition flex justify-center items-center gap-2" 
                        disabled={isBulkLoading}
                    >
                        {isBulkLoading ? <Loader2 className="animate-spin" size={18} /> : null}
                        {isBulkLoading ? "Creating..." : "Create Coupons"}
                    </button>
                </form>
            </Modal>

            {/* Detail View Modal */}
            <Modal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)}>
                {selectedCoupon && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold">Coupon Details</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Code</p>
                                <p className="mt-1">{selectedCoupon.code}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Package</p>
                                <p className="mt-1">{selectedCoupon.packageId?.name || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Status</p>
                                <p className="mt-1">
                                    {selectedCoupon.isActive ? (
                                        <span className="text-green-500">Active</span>
                                    ) : (
                                        <span className="text-gray-500">Inactive</span>
                                    )}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Expiry Date</p>
                                <p className="mt-1">{formatDate(selectedCoupon.expiryDate)}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Created At</p>
                                <p className="mt-1">{formatDate(selectedCoupon.createdAt)}</p>
                            </div>
                        </div>
                    </div>
                )}
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
                    onRowClicked={handleRowClicked}
                    pointerOnHover
                />
            </div>
        </div>
    );
};

export default Coupon;