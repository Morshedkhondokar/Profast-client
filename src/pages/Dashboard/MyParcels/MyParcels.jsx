import { useQuery,  } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const MyParcels = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();


  // Date Formatter: DD/MM/YYYY, 12-hour time with seconds + am/pm
  const formatDate = (iso) => {
    return new Intl.DateTimeFormat("en-BD", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    }).format(new Date(iso));
  };

  const { data: parcels = [] , refetch} = useQuery({
    queryKey: ["my-parcels", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels?email=${user?.email}`);
      return res.data;
    },
  });

  const handleView = (parcel) => {
    console.log("View:", parcel);
  };

  const handlePay = (parcel) => {
    console.log("Pay:", parcel);
  };

   // 🔥 DELETE with SweetAlert2 Confirmation
 const handleDelete = (parcel) => {
  Swal.fire({
    title: "Are you sure?",
    text: `You are about to delete "${parcel.parcelName}".`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/parcels/${parcel._id}`);
        if (res.data.deletedCount > 0) {
          Swal.fire({
            title: "Deleted!",
            text: "Parcel has been removed.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });

          // Refresh the parcel list
          refetch();
        }
      } catch (error) {
        Swal.fire("Error", "Failed to delete the parcel.", "error");
      }
    }
  });
};


  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 border-b pb-2 text-center">
        My Parcels 
      </h2>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Type</th>
              <th>Created At</th>
              <th>Delivery Cost</th>
              <th>Payment Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {parcels.map((p,index) => (
              <tr key={p._id}>
                <td>{index + 1}</td>
                {/* parcel Title */}
                <td className="font-medium">{p.parcelName}</td>
                {/* parcel type */}
                <td className="capitalize font-medium">
                  {p.parcelType === "document"
                    ? "Document"
                    : "Non-Document"}
                </td>
                    {/* parcel created date */}
                <td>{formatDate(p.createdAtISO)}</td>
                    {/* delivrry cost */}
                <td>{p.deliveryCost} TK</td>

                    {/* payment status */}
                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-white text-sm ${
                      p.paymentStatus === "paid"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  >
                    {p.paymentStatus}
                  </span>
                </td>
    
                {/* action buttons */}
                <td className="flex gap-2">
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() => handleView(p)}
                  >
                    View
                  </button>

                  {p.paymentStatus !== "paid" && (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handlePay(p)}
                    >
                      Pay
                    </button>
                  )}

                  <button
                    className="btn btn-error btn-sm"
                    onClick={() => handleDelete(p)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default MyParcels;
