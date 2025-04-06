import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import DataTable from "react-data-table-component";
import Modal from "@/components/modal";
import api from "@/utils/api";
import { Plus, PencilLine, Trash, Loader2 } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { getTableStyles } from '@/utils/tableStyles';

const SocialPlatform = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [SocialPlatform, setSocialPlatform] = useState([]);
    const [formData, setFormData] = useState({ name: "",  });
    const [editId, setEditId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingId, setLoadingId] = useState(null); 

    const { theme } = useTheme();
    const customStyles = getTableStyles(theme);

    const fetchSocialPlatform = async () => {
        const loadingToast = toast.loading("Fetching Social Platform...");
        try {
            const response = await api.get("social-platform/");
            setSocialPlatform(response.data.data);
            toast.update(loadingToast, { render: "Social Platform loaded", type: "success", isLoading: false, autoClose: 500, });
        } catch (error) {
            toast.update(loadingToast, { render: error.response?.data?.message || "Error fetching Social Platform", type: "error", isLoading: false, autoClose: 500 });
        }
    };

    useEffect(() => {
        fetchSocialPlatform();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (editId) {
                await api.put(`/social-platform/${editId}`, formData);
                toast.success("Social Platform updated successfully");
            } else {
                await api.post("/social-platform/", formData);
                toast.success("Social Platform added successfully");
            }
            fetchSocialPlatform();
            setIsModalOpen(false);
            setFormData({ name: "",  });
            setEditId(null);
        } catch (error) {
            toast.error(error.response?.data?.message || "Error saving Social Platform");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (pkg) => {
        setIsModalOpen(true);
        setFormData({ name: pkg.name });
        setEditId(pkg._id);
    };

    const handleDelete = async (id) => {
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
                setLoadingId(id);
                try {
                    await api.delete(`/social-platform/${id}`);
                    toast.success("Social Platform deleted successfully");
                    fetchSocialPlatform();
                } catch (error) {
                    toast.error(error.response?.data?.message || "Error deleting Social Platform");
                } finally {
                    setLoadingId(null);
                }
            }
        });
    };

    // Columns for DataTable
    const columns = [
        { name: "#", selector: (row, index) => index + 1, sortable: true, width: "60px" },
        { name: "Name", selector: (row) => row.name, sortable: true },
        {
            name: "Actions",
            cell: (row) => (
                <div className="flex items-center gap-x-4">
                    <button onClick={() => handleEdit(row)} className="text-secondary-500" disabled={isLoading}>
                        <PencilLine size={20} />
                    </button>
                    <button onClick={() => handleDelete(row._id)} className="text-red-500" disabled={loadingId === row._id}>
                        {loadingId === row._id ? <Loader2 className="animate-spin" size={20} /> : <Trash size={20} />}
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
                <h1 className="title">Social Platform</h1>
                <button
                    onClick={() => {
                        setIsModalOpen(true);
                        setFormData({ name: "",  });
                        setEditId(null);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-500 dark:bg-blue-500 text-white rounded-lg hover:bg-primary-600 dark:hover:bg-blue-700 transition"
                >
                    <Plus size={18} />
                    Add Social Platform
                </button>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <form onSubmit={handleSubmit}>
                    <label className="block mb-2 text-sm font-medium">SocialPlatform Type</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded-md" disabled={isLoading} />

                    <button type="submit" className="mt-4 w-full bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600 transition flex justify-center items-center gap-2" disabled={isLoading}>
                        {isLoading ? <Loader2 className="animate-spin" size={18} /> : null}
                        {isLoading ? "Saving..." : editId ? "Update SocialPlatform" : "Add SocialPlatform"}
                    </button>
                </form>
            </Modal>

            <div className="card">
                <DataTable
                    columns={columns}
                    data={SocialPlatform}
                    pagination
                    highlightOnHover
                    paginationPerPage={50}
                    paginationRowsPerPageOptions={[10, 25, 50, 100, 200]}
                    persistTableHead
                    striped
                    responsive
                    customStyles={customStyles}
                    theme={theme === 'dark' ? 'dark' : 'light'}
                    noDataComponent={<p className="p-4 text-center">No Social Platform found</p>}
                />
            </div>
        </div>
    );
};

export default SocialPlatform;
