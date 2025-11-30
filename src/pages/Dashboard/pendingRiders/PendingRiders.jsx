import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
// Assuming this is your custom hook for axios with auth/interceptors
import useAxiosSecure from "../../../hooks/useAxiosSecure"; 

const PendingRiders = () => {
  // Custom hook for authenticated axios
  const axiosSecure = useAxiosSecure(); 
  
  // Use riders as the main source of data, initialized by useQuery
  // The local state will be used for the modal selection only.
  const [selectedRider, setSelectedRider] = useState(null);
//   console.log(selectedRider)


  // 1. Fetching Data using React Query
  // The 'riders' variable holds the fetched list of pending riders
  const { 
    data: riders = [], // Default to an empty array
    refetch, 
    isPending 
  } = useQuery({
    queryKey: ['Pending-riders'],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders/pending");
      return res.data;
    },
  });

  // Handle loading state
  if (isPending) {
    return <div className="text-center py-10">Loading Pending Riders....</div>;
  }

  // 2. Approve Rider Function
  const approveRider = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to approve this rider?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, approve",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.patch(`/riders/update/${id}`, {
            status: "active",
          });

          if (res.data.modifiedCount > 0) {
            Swal.fire(
              "Approved!",
              "The rider has been approved successfully.",
              "success"
            );
            // Invalidate and refetch the query to update the table immediately
            refetch();
            setSelectedRider(null);
          }
        } catch (error) {
          console.error("Error approving rider:", error);
          Swal.fire(
            "Error",
            "Could not approve rider. Please try again.",
            "error"
          );
        }
      }
    });
  };

  // 3. Reject Rider Function
  const rejectRider = (id) => {
    Swal.fire({
      title: "Reject Rider?",
      text: "This rider’s application will be rejected.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, reject",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.patch(`/riders/update/${id}`, {
            status: "rejected",
          });

          if (res.data.modifiedCount > 0) {
            Swal.fire(
              "Rejected!",
              "The rider has been rejected.",
              "success"
            );
            // Invalidate and refetch the query to update the table immediately
            refetch();
            setSelectedRider(null);
          }
        } catch (error) {
          console.error("Error rejecting rider:", error);
          Swal.fire(
            "Error",
            "Could not reject rider. Please try again.",
            "error"
          );
        }
      }
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Pending Riders ({riders.length})</h2>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table w-full shadow-md">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Region</th>
              <th>District</th>
              <th>Bike Brand</th>
              <th>Registration</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {/* 4. Display data from the 'riders' variable fetched by useQuery */}
            {riders.map((rider) => (
              <tr key={rider._id}>
                <td>{rider.name}</td>
                <td>{rider.email}</td>
                <td>{rider.region}</td>
                <td>{rider.district}</td>
                <td>{rider.bikeBrand}</td>
                <td>{rider.bikeRegistration}</td>
                <td>
                  <button
                    className="btn btn-sm btn-info text-white"
                    onClick={() => setSelectedRider(rider)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
            
            {/* Show a message if there are no riders */}
            {riders.length === 0 && (
                <tr>
                    <td colSpan="7" className="text-center py-4 text-gray-500">
                        No pending riders found.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedRider && (
        // Using a more reliable way to display modals like a dedicated state or an actual DaisyUI component setup if available
        <div className="modal modal-open"> 
          <div className="modal-box w-11/12 max-w-2xl">
            <h3 className="text-xl font-bold mb-4">Rider Details</h3>

            <div className="space-y-2">
              <p><strong>Name:</strong> {selectedRider.name}</p>
              <p><strong>Email:</strong> {selectedRider.email}</p>
              <p><strong>Age:</strong> {selectedRider.age}</p>
              <p><strong>Phone:</strong> {selectedRider.phoneNumber}</p>
              <p><strong>Region:</strong> {selectedRider.region}</p>
              <p><strong>District:</strong> {selectedRider.district}</p>
              <p><strong>Bike Brand:</strong> {selectedRider.bikeBrand}</p>
              <p><strong>Registration:</strong> {selectedRider.bikeRegistration}</p>
              <p><strong>Status:</strong> <span className="text-orange-500 font-semibold">{selectedRider.status}</span></p>
             <p><strong>Status:</strong> {selectedRider.status}</p>
             <p> <strong>Apply Date: </strong> 
                 {
                  new Date(selectedRider.appliedDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    })
                 }
             </p>
            </div>

            <div className="modal-action flex justify-between mt-6">
              <button
                className="btn btn-error"
                onClick={() => rejectRider(selectedRider._id)}
              >
                Reject
              </button>

              <button
                className="btn btn-success"
                onClick={() => approveRider(selectedRider._id)}
              >
                Approve
              </button>

              <button
                className="btn"
                onClick={() => setSelectedRider(null)}
              >
                Close
              </button>
            </div>
          </div>
          {/* Optional: Add a backdrop to close the modal on outside click */}
          <div className="modal-backdrop" onClick={() => setSelectedRider(null)}></div>
        </div>
      )}
    </div>
  );
};

export default PendingRiders;