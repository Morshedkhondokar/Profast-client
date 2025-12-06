import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const PendingDeliveries = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // -------------------------
  // Fetch Pending Deliveries
  // -------------------------
  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ["riderTasks", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels/rider-tasks?email=${user.email}`);
      return res.data;
    },
  });
  console.log(parcels)

  // -------------------------
  // Mutation to update status
  // -------------------------
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await axiosSecure.patch(`/parcels/${id}/update-status`, {
        status,
        email: user.email,
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Parcel status updated!");
      queryClient.invalidateQueries(["riderTasks"]);
    },
    onError: () => {
      toast.error("Failed to update parcel status!");
    },
  });

  // -------------------------
  // Handle Action Button Click
  // -------------------------
  const handleActionClick = (parcel) => {
    let nextStatus = "";

    if (parcel.deleveryStatus === "rider_assigned") nextStatus = "in_transit";
    else if (parcel.deleveryStatus === "in_transit") nextStatus = "delivered";
    else return; // nothing to do

    Swal.fire({
      title: `Are you sure you want to mark this parcel as "${nextStatus}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, proceed",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        updateStatusMutation.mutate({ id: parcel._id, status: nextStatus });
      }
    });
  };

  if (isLoading)
    return <div className="text-center py-10">Loading pending deliveries...</div>;

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">Pending Deliveries</h1>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full border">
          <thead className="bg-gray-700">
            <tr>
              <th>#</th>
              <th>Tracking ID</th>
              <th>Parcel</th>
              <th>Sender</th>
              <th>Receiver</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {parcels.map((parcel, idx) => (
              <tr key={parcel._id}>
                <td>{idx + 1}</td>
                <td className="font-semibold">{parcel.trackingId}</td>
                <td>
                  {parcel.parcelName} <br />
                  <span className="text-xs text-gray-500">
                    {parcel.parcelWeight} kg • {parcel.parcelType}
                  </span>
                </td>
                <td>
                  {parcel.senderName}
                  <br />
                  <span className="text-xs text-gray-400">{parcel.senderContact}</span>
                </td>
                <td>
                  {parcel.receiverName}
                  <br />
                  <span className="text-xs text-gray-400">{parcel.receiverContact}</span>
                </td>
                <td className="capitalize">{parcel.deleveryStatus}</td>
                <td>{parcel.createdAtDisplay}</td>
                <td>
                  {parcel.deleveryStatus === "rider_assigned" ||
                  parcel.deleveryStatus === "in_transit" ? (
                    <button
                      className={`btn btn-sm ${
                        parcel.deleveryStatus === "rider_assigned"
                          ? "btn-primary"
                          : "btn-success"
                      }`}
                      onClick={() => handleActionClick(parcel)}
                    >
                      {parcel.deleveryStatus === "rider_assigned"
                        ? "Mark Picked Up"
                        : "Mark Delivered"}
                    </button>
                  ) : (
                    <span className="text-gray-400 text-sm">No Action</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingDeliveries;
