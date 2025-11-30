import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
// Assuming this is your custom hook for axios with auth/interceptors
import useAxiosSecure from "../../../hooks/useAxiosSecure"; 

const ActiveRiders = () => {
    // Custom hook for authenticated axios
    const axiosSecure = useAxiosSecure(); 
    
    // Local state for search term (selectedRider state is removed as modal is not needed)
    const [searchTerm, setSearchTerm] = useState(''); 

    // 1. Fetching Active Riders Data using React Query
    const { 
        data: riders = [], 
        refetch, 
        isPending 
    } = useQuery({
        queryKey: ['Active-riders'],
        queryFn: async () => {
            // API endpoint to fetch Active Riders
            const res = await axiosSecure.get("/riders/active"); 
            return res.data;
        },
    });

    // 2. Deactivate Rider Function
    const deactivateRider = (id) => {
        Swal.fire({
            title: "Deactivate Rider?",
            text: "This rider will be marked as inactive.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, Deactivate",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // API call to update status to 'inactive'
                    const res = await axiosSecure.patch(`/riders/update/${id}`, {
                        status: "inactive",
                    });

                    if (res.data.modifiedCount > 0) {
                        Swal.fire(
                            "Deactivated!",
                            "The rider has been marked as inactive.",
                            "success"
                        );
                        // Refetch data to update the table immediately
                        refetch();
                    }
                } catch (error) {
                    console.error("Error deactivating rider:", error);
                    Swal.fire(
                        "Error",
                        "Could not deactivate rider. Please try again.",
                        "error"
                    );
                }
            }
        });
    };

    // 3. Filtering Logic (Search by Name or Phone)
    const filteredRiders = useMemo(() => {
        if (!searchTerm) {
            return riders;
        }
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        
        return riders.filter(rider =>
            // Search criteria: Name or Phone Number
            rider.name?.toLowerCase().includes(lowerCaseSearchTerm) ||
            rider.phoneNumber?.includes(searchTerm) 
        );
    }, [riders, searchTerm]);


    // Helper function for Date formatting (for Joined Date in the table)
    const formatAppliedDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        if (isNaN(date)) return "Invalid Date";
        
        return date.toLocaleDateString('en-GB', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };


    // Handle loading state
    if (isPending) {
        return <div className="text-center py-10">Loading Active Riders....</div>;
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Active Riders ({filteredRiders.length} / {riders.length})</h2>

            {/* Search Input Field */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by Rider Name or Phone Number..."
                    className="input input-bordered w-full max-w-xs"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <hr className="mb-4"/>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="table w-full shadow-md">
                    <thead className="bg-green-800 text-white">
                        <tr>
                            <th>Name</th>
                            <th>Phone</th> 
                            <th>Email</th>
                            <th>Status</th> 
                            <th>Joined Date</th> 
                            <th>Region</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredRiders.map((rider) => (
                            <tr key={rider._id}>
                                <td>{rider.name}</td>
                                <td>{rider.phoneNumber}</td> 
                                <td>{rider.email}</td>
                                <td><span className="badge badge-success text-white">{rider.status}</span></td> 
                                <td>{formatAppliedDate(rider.appliedDate)}</td> 
                                <td>{rider.region}</td>
                                <td>
                                    {/* 💡 Deactivate Button is the only action */}
                                    <button
                                        className="btn btn-sm btn-error text-white"
                                        onClick={() => deactivateRider(rider._id)}
                                    >
                                        Deactivate
                                    </button>
                                </td>
                            </tr>
                        ))}
                        
                        {/* Show a message if no riders match the filter */}
                        {filteredRiders.length === 0 && (
                            <tr>
                                <td colSpan="7" className="text-center py-4 text-gray-500">
                                    {searchTerm ? "No riders found matching the search criteria." : "No active riders found."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* 💡 Modal section is entirely removed */}
        </div>
    );
};

export default ActiveRiders;