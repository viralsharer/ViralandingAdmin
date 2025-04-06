import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import DataTable from "react-data-table-component";
import Modal from "@/components/modal";
import api from "@/utils/api";
import { Plus, PencilLine, Trash, Loader2 } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { getTableStyles } from '@/utils/tableStyles';

const Tasks = () => {

    const { theme } = useTheme();
    const customStyles = getTableStyles(theme);

    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [socialPlatforms, setSocialPlatforms] = useState([]);
    const [engagementTypes, setEngagementTypes] = useState([]);
    const [formData, setFormData] = useState({
        title: "",
        image: "",
        socialPlatform: [], 
        engagementType: [], 
        description: "",
        taskLink: "",
        taskPrice: "",
    });
    const [editId, setEditId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingId, setLoadingId] = useState(null);

    // Fetch Tasks
    const fetchTasks = async () => {
        const loadingToast = toast.loading("Fetching Tasks...");
        try {
            const response = await api.get("/tasks/");
            setTasks(response.data.data);
            toast.update(loadingToast, {
                render: "Tasks loaded",
                type: "success",
                isLoading: false,
                autoClose: 500,
            });
        } catch (error) {
            toast.update(loadingToast, {
                render: error.response?.data?.message || "Error fetching Tasks",
                type: "error",
                isLoading: false,
                autoClose: 500,
            });
        }
    };

    // Fetch Social Platform options
    const fetchSocialPlatform = async () => {
        const loadingToast = toast.loading("Fetching Social Platform...");
        try {
            const response = await api.get("social-platform/");
            setSocialPlatforms(response.data.data);
            toast.update(loadingToast, {
                render: "Social Platform loaded",
                type: "success",
                isLoading: false,
                autoClose: 500,
            });
        } catch (error) {
            toast.update(loadingToast, {
                render: error.response?.data?.message || "Error fetching Social Platform",
                type: "error",
                isLoading: false,
                autoClose: 500,
            });
        }
    };

    // Fetch Engagement Types options
    const fetchEngagement = async () => {
        const loadingToast = toast.loading("Fetching Engagement...");
        try {
            const response = await api.get("/engagement-types/");
            setEngagementTypes(response.data.data);
            toast.update(loadingToast, {
                render: "Engagement loaded",
                type: "success",
                isLoading: false,
                autoClose: 500,
            });
        } catch (error) {
            toast.update(loadingToast, {
                render: error.response?.data?.message || "Error fetching Engagement",
                type: "error",
                isLoading: false,
                autoClose: 500,
            });
        }
    };

    useEffect(() => {
        fetchTasks();
        fetchSocialPlatform();
        fetchEngagement();
    }, []);

    // For regular (single value) fields
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (editId) {
                await api.put(`/tasks/task/${editId}`, formData);
                toast.success("Task updated successfully");
            } else {
                await api.post("/tasks/", formData);
                toast.success("Task added successfully");
            }
            fetchTasks();
            setIsModalOpen(false);
            // Reset form data to default
            setFormData({
                title: "",
                image: "",
                socialPlatform: [],
                engagementType: [],
                description: "",
                taskLink: "",
                taskPrice: "",
            });
            setEditId(null);
        } catch (error) {
            toast.error(error.response?.data?.message || "Error saving Task");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (task) => {
        setIsModalOpen(true);
    
        // Convert engagementType string into an array of corresponding IDs
        const selectedEngagementTypes = task.engagementType
            ? task.engagementType.split(',').map(et => {
                const matchedType = engagementTypes.find(e => e.name.trim().toLowerCase() === et.trim().toLowerCase());
                return matchedType ? matchedType._id : null;
            }).filter(Boolean) // Remove null values
            : [];

        setFormData({
            title: task.title || '',
            image: task.image || "",
            socialPlatform: socialPlatforms.find(sp => sp.name === task.socialPlatform)?._id || "", 
            engagementType: selectedEngagementTypes,
            description: task.description || "",
            taskLink: task.taskLink || "",
            taskPrice: task.taskPrice || "",
        });
        setEditId(task._id);
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
                    await api.delete(`/tasks/task/${id}`);
                    toast.success("Task deleted successfully");
                    fetchTasks();
                } catch (error) {
                    toast.error(error.response?.data?.message || "Error deleting Task");
                } finally {
                    setLoadingId(null);
                }
            }
        });
    };

    // Columns for DataTable – showing key fields; adjust as needed
    const columns = [
        { name: "#", selector: (row, index) => index + 1, sortable: true, width: "60px" },
        { name: "Name", selector: (row) => row.title, sortable: true },
        { name: "Image URL", selector: (row) => row.image, sortable: false },
        { name: "Social Platform", selector: (row) => row.socialPlatform, sortable: false },
        { name: "Engagement Type", selector: (row) => row.engagementType, sortable: false },
        // {
        //   name: "Engagement Type",
        //   selector: (row) =>
        //     Array.isArray(row.engagementType) ? row.engagementType.join(", ") : "N/A",
        //   sortable: false
        // },
        { name: "Task Price", selector: (row) => row.taskPrice, sortable: true },
        { name: "Task Link", selector: (row) => row.taskLink, sortable: false },
        { name: "Description", selector: (row) => row.description, sortable: false },
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
                <h1 className="title">Tasks</h1>
                <button
                    onClick={() => {
                        setIsModalOpen(true);
                        setFormData({
                            title: "",
                            image: "",
                            socialPlatform: [],
                            engagementType: [],
                            description: "",
                            taskLink: "",
                            taskPrice: "",
                        });
                        setEditId(null);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-500 dark:bg-blue-500 text-white rounded-lg hover:bg-primary-600 dark:hover:bg-blue-700 transition"
                >
                    <Plus size={18} />
                    Add Task
                </button>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <form onSubmit={handleSubmit}>
                    <label className="block mb-2 text-sm font-medium">Task Titke</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full p-2 border rounded-md" disabled={isLoading} />

                    <label className="block mt-4 text-sm font-medium">Image URL</label>
                    <input type="text" name="image" value={formData.image} onChange={handleChange} className="w-full p-2 border rounded-md" disabled={isLoading} />

                    <label className="block mt-4 text-sm font-medium">Social Platform</label>
                    <select name="socialPlatform" value={formData.socialPlatform}  onChange={handleChange}  className="w-full p-2 border rounded-md" disabled={isLoading} >
                        <option value="">Select a platform</option>
                        {socialPlatforms.map((sp) => (
                            <option key={sp._id} value={sp._id}>{sp.name}</option>
                        ))}
                    </select>


                    <fieldset className="mt-4">
                        <legend className="text-sm font-medium">Engagement Type</legend>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {engagementTypes.map((eng) => (
                                <label key={eng._id} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name="engagementType"
                                        value={eng._id}
                                        checked={formData.engagementType.includes(eng._id)}
                                        onChange={(e) => {
                                            const updatedEngagements = e.target.checked 
                                                ? [...formData.engagementType, eng._id] 
                                                : formData.engagementType.filter((id) => id !== eng._id);
                                            setFormData({ ...formData, engagementType: updatedEngagements });
                                        }}
                                        className="w-4 h-4"
                                    />
                                    {eng.name}
                                </label>
                            ))}
                        </div>
                    </fieldset>


                    <label className="block mt-4 text-sm font-medium">Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded-md" disabled={isLoading}></textarea>

                    <label className="block mt-4 text-sm font-medium">Task Link URL</label>
                    <input type="text" name="taskLink" value={formData.taskLink} onChange={handleChange} className="w-full p-2 border rounded-md" disabled={isLoading} />

                    <label className="block mt-4 text-sm font-medium">Task Price</label>
                    <input type="number" name="taskPrice" value={formData.taskPrice} onChange={handleChange} className="w-full p-2 border rounded-md" disabled={isLoading} />

                    <button type="submit" className="mt-4 w-full bg-primary-500 text-white py-2 rounded-lg hover:bg-primary-600 transition flex justify-center items-center gap-2" disabled={isLoading}>
                        {isLoading ? <Loader2 className="animate-spin" size={18} /> : null}
                        {isLoading ? "Saving..." : editId ? "Update Task" : "Add Task"}
                    </button>
                </form>
            </Modal>

            <div className="card">
                <DataTable 
                    columns={columns} 
                    data={tasks} 
                    pagination 
                    highlightOnHover 
                    paginationPerPage={50}
                    paginationRowsPerPageOptions={[10, 25, 50, 100, 200]}
                    persistTableHead
                    striped 
                    responsive
                    customStyles={customStyles}
                    theme={theme === 'dark' ? 'dark' : 'light'}
                    noDataComponent={<p className="p-4 text-center">No Tasks found</p>} 
                />
            </div>
        </div>
    );
};

export default Tasks;
