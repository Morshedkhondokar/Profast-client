// pages/Dashboard/AssignRider/AssignRider.jsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useUserRole from "../../../hooks/useUserRole";
import Swal from "sweetalert2";
import { 
  Package, 
  Truck, 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  DollarSign, 
  FileText, 
  Check, 
  X, 
  Map,
  Filter
} from "lucide-react";

const AssignRider = () => {
  const axiosSecure = useAxiosSecure();
  const { isAdmin, isLoading: roleLoading } = useUserRole();
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [selectedRider, setSelectedRider] = useState("");
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [matchingRiders, setMatchingRiders] = useState([]);
  const [isLoadingRiders, setIsLoadingRiders] = useState(false);

  // Fetch parcels with paymentStatus="unpaid" and deliveryStatus="not_collected"
  const {
    data: parcels = [],
    isLoading: parcelsLoading,
    refetch,
  } = useQuery({
    queryKey: ["unassignedParcels"],
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels/unassigned");
      return res.data;
    },
    enabled: isAdmin,
  });

  // Get selected parcel details
  const selectedParcelDetails = parcels.find(p => p._id === selectedParcel);

  // Function to open assign rider modal
  const openAssignModal = async () => {
    if (!selectedParcel) {
      Swal.fire({
        title: "No Parcel Selected",
        text: "Please select a parcel first",
        icon: "warning",
      });
      return;
    }

    setShowAssignModal(true);
    setIsLoadingRiders(true);

    try {
      // Fetch riders whose district matches the parcel's senderRegion
      const res = await axiosSecure.get(
        `/riders/by-district/${selectedParcelDetails.senderRegion}`
      );
      
      if (res.data && res.data.length > 0) {
        setMatchingRiders(res.data);
      } else {
        setMatchingRiders([]);
        Swal.fire({
          title: "No Riders Found",
          html: `No riders available in <strong>${selectedParcelDetails.senderRegion}</strong> district.<br/>Try selecting a parcel from a different region.`,
          icon: "info",
        });
      }
    } catch (error) {
      console.error("No Riders Available", error);
    } finally {
      setIsLoadingRiders(false);
    }
  };

// Handle assign rider
const handleAssignRider = async (riderId, riderName) => {
  Swal.fire({
    title: "Confirm Assignment",
    html: `Are you sure you want to assign <strong>${riderName}</strong> to parcel<br/><strong>${selectedParcelDetails.trackingId}</strong>?<br/><br/>
    <div class="text-left text-sm text-gray-400">
      <p>✓ Parcel delivery status will change to <strong>In-Transit</strong></p>
      <p>✓ Rider status will change to <strong>In-Delivery</strong></p>
    </div>`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes, Assign Rider",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#10B981",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const res = await axiosSecure.patch(
          `/parcels/${selectedParcel}/assign-rider`,
          { riderId }
        );

        if (res.data.success) {
          Swal.fire({
            title: "Success!",
            html: `
              <div class="text-left">
                <p class="font-bold text-green-600">✓ Rider assigned successfully</p>
                <p class="text-sm text-gray-400 mt-2">
                  <strong>Parcel Status:</strong> In-Transit<br/>
                  <strong>Rider Status:</strong> In-Delivery
                </p>
              </div>
            `,
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });

          // Reset states
          setSelectedParcel(null);
          setSelectedRider("");
          setShowAssignModal(false);
          setMatchingRiders([]);
          
          // Refresh the parcels list
          refetch();
        }
      } catch (error) {
        console.error("Error assigning rider:", error);
        Swal.fire({
          title: "Error!",
          text: error.response?.data?.message || "Failed to assign rider",
          icon: "error",
        });
      }
    }
  });
};

  // View parcel details
  const handleViewDetails = (parcel) => {
    Swal.fire({
      title: "Parcel Details",
      html: `
        <div class="text-left">
          <div class="mb-4 p-3 bg-gray-100 rounded">
            <h3 class="font-bold text-gray-700 mb-2">📦 Parcel Information</h3>
            <p><strong>Tracking ID:</strong> ${parcel.trackingId}</p>
            <p><strong>Type:</strong> ${parcel.parcelType}</p>
            <p><strong>Name:</strong> ${parcel.parcelName}</p>
            <p><strong>Weight:</strong> ${parcel.parcelWeight} kg</p>
            <p><strong>Cost:</strong> $${parcel.deliveryCost}</p>
          </div>
          
          <div class="mb-4 p-3 bg-blue-50 rounded">
            <h3 class="font-bold text-gray-700 mb-2">👤 Sender Information</h3>
            <p><strong>Name:</strong> ${parcel.senderName}</p>
            <p><strong>Contact:</strong> ${parcel.senderContact}</p>
            <p><strong>Email:</strong> ${parcel.senderEmail}</p>
            <p><strong>Address:</strong> ${parcel.senderAddress}</p>
            <p><strong>Region:</strong> ${parcel.senderRegion}</p>
            <p><strong>Warehouse:</strong> ${parcel.senderWarehouse}</p>
          </div>
          
          <div class="mb-4 p-3 bg-green-50 rounded">
            <h3 class="font-bold text-gray-700 mb-2">🏠 Receiver Information</h3>
            <p><strong>Name:</strong> ${parcel.receiverName}</p>
            <p><strong>Contact:</strong> ${parcel.receiverContact}</p>
            <p><strong>Address:</strong> ${parcel.receiverAddress}</p>
            <p><strong>Region:</strong> ${parcel.receiverRegion}</p>
            <p><strong>Warehouse:</strong> ${parcel.receiverWarehouse}</p>
          </div>
          
          <div class="p-3 bg-yellow-50 rounded">
            <h3 class="font-bold text-gray-700 mb-2">📊 Status Information</h3>
            <p><strong>Payment:</strong> <span class="badge ${parcel.paymentStatus === 'paid' ? 'bg-green-500' : 'bg-red-500'} text-white">${parcel.paymentStatus}</span></p>
            <p><strong>Delivery:</strong> <span class="badge bg-blue-500 text-white">${parcel.deleveryStatus}</span></p>
            <p><strong>Overall Status:</strong> <span class="badge ${parcel.status === 'pending' ? 'bg-yellow-500' : 'bg-blue-500'} text-white">${parcel.status}</span></p>
            <p><strong>Created:</strong> ${parcel.createdAtDisplay}</p>
          </div>
        </div>
      `,
      width: 600,
      confirmButtonText: "Close",
    });
  };

  // Loading states
  if (roleLoading || parcelsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg text-primary"></div>
          <p className="mt-4 text-gray-600">Loading parcels...</p>
        </div>
      </div>
    );
  }

  // If not admin
  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
          <Package className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Access Denied
        </h2>
        <p className="text-gray-600">
          You need admin privileges to access rider assignment.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-200 flex items-center gap-2">
              <Truck className="w-6 h-6" />
              Assign Rider to Parcels
            </h1>
            <p className="text-gray-500 mt-1">
              Manage and assign riders to unpaid and uncollected parcels
            </p>
          </div>
          <div className="badge badge-warning badge-lg">
            {parcels.length} Parcels Pending
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-300">Total Unassigned</p>
                <p className="text-2xl font-bold text-white">
                  {parcels.length}
                </p>
              </div>
              <Package className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-red-900/30 p-4 rounded-lg border border-red-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-300">Unpaid Parcels</p>
                <p className="text-2xl font-bold text-white">
                  {parcels.filter(p => p.paymentStatus === "unpaid").length}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-red-400" />
            </div>
          </div>
          <div className="bg-green-900/30 p-4 rounded-lg border border-green-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-300">Not Collected</p>
                <p className="text-2xl font-bold text-white">
                  {parcels.filter(p => p.deleveryStatus === "not_collected").length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-green-400" />
            </div>
          </div>
          <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-300">Selected Parcel</p>
                <p className="text-2xl font-bold text-white">
                  {selectedParcel ? "1" : "0"}
                </p>
              </div>
              <Check className="w-8 h-8 text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Selected Parcel Info (if any) */}
      {selectedParcelDetails && (
        <div className="mb-6 p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-blue-300 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Selected Parcel
              </h3>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Tracking ID</p>
                  <p className="font-mono text-white">{selectedParcelDetails.trackingId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Sender Region</p>
                  <div className="flex items-center gap-2">
                    <Map className="w-4 h-4 text-blue-400" />
                    <span className="font-medium text-white">
                      {selectedParcelDetails.senderRegion}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Delivery Cost</p>
                  <p className="font-bold text-green-400">
                    ${selectedParcelDetails.deliveryCost}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedParcel(null)}
                className="btn btn-sm btn-ghost"
              >
                <X className="w-4 h-4" /> Clear
              </button>
              <button
                onClick={openAssignModal}
                className="btn btn-sm btn-primary"
              >
                <User className="w-4 h-4" /> Assign Rider
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Parcels Table */}
      <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-gray-900">
              <tr>
                <th className="text-gray-200 font-semibold">#</th>
                <th className="text-gray-200 font-semibold">Tracking & Parcel</th>
                <th className="text-gray-200 font-semibold">Sender</th>
                <th className="text-gray-200 font-semibold">Receiver</th>
                <th className="text-gray-200 font-semibold">Route</th>
                <th className="text-gray-200 font-semibold">Status</th>
                <th className="text-gray-200 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {parcels.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8">
                    <div className="flex flex-col items-center justify-center">
                      <Package className="w-12 h-12 text-gray-600 mb-2" />
                      <p className="text-gray-400">No parcels available for assignment</p>
                      <p className="text-sm text-gray-500">
                        All parcels are either paid or already assigned
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                parcels.map((parcel, index) => (
                  <tr
                    key={parcel._id}
                    className={`hover:bg-gray-700/50 ${
                      selectedParcel === parcel._id ? "bg-blue-900/20 border-l-4 border-blue-500" : ""
                    }`}
                  >
                    <td className="font-medium">{index + 1}</td>
                    
                    {/* Tracking & Parcel Details */}
                    <td>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <FileText className="w-4 h-4 text-blue-400" />
                          <span className="font-bold text-blue-300">
                            {parcel.trackingId}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-300">
                            <span className="font-medium">Type:</span> {parcel.parcelType}
                          </p>
                          <p className="text-sm text-gray-300">
                            <span className="font-medium">Item:</span> {parcel.parcelName}
                          </p>
                          <p className="text-sm text-gray-300">
                            <span className="font-medium">Weight:</span> {parcel.parcelWeight} kg
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Sender Information */}
                    <td>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-white">{parcel.senderName}</span>
                        </div>
                        <p className="text-sm text-gray-300 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {parcel.senderContact}
                        </p>
                        <p className="text-xs text-gray-400 truncate max-w-[150px]">
                          {parcel.senderAddress}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3 text-blue-400" />
                          <span className="badge badge-sm badge-outline bg-blue-900/30 text-blue-300 border-blue-600">
                            {parcel.senderRegion}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Receiver Information */}
                    <td>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4 text-green-400" />
                          <span className="font-medium text-white">{parcel.receiverName}</span>
                        </div>
                        <p className="text-sm text-gray-300 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {parcel.receiverContact}
                        </p>
                        <p className="text-xs text-gray-400 truncate max-w-[150px]">
                          {parcel.receiverAddress}
                        </p>
                        <span className="badge badge-sm badge-outline bg-green-900/30 text-green-300 border-green-600">
                          {parcel.receiverRegion}
                        </span>
                      </div>
                    </td>

                    {/* Route Information */}
                    <td>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-yellow-400 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-300">
                              <span className="font-medium">From:</span> {parcel.senderWarehouse}
                            </p>
                            <p className="text-sm text-gray-300">
                              <span className="font-medium">To:</span> {parcel.receiverWarehouse}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-xs text-gray-400">
                            {parcel.createdAtDisplay}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Status Information */}
                    <td>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Payment</p>
                          <span className={`badge ${
                            parcel.paymentStatus === "paid" 
                              ? "badge-success" 
                              : "badge-error"
                          }`}>
                            {parcel.paymentStatus}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Delivery</p>
                          <span className="badge badge-warning">
                            {parcel.deleveryStatus}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Cost</p>
                          <span className="font-bold text-green-400">
                            ${parcel.deliveryCost}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Actions Column */}
                    <td>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => setSelectedParcel(parcel._id)}
                          className={`btn btn-sm ${
                            selectedParcel === parcel._id
                              ? "btn-primary"
                              : "btn-outline btn-primary"
                          }`}
                        >
                          {selectedParcel === parcel._id ? (
                            <span className="flex items-center gap-1">
                              <Check className="w-4 h-4" /> Selected
                            </span>
                          ) : (
                            "Select Parcel"
                          )}
                        </button>
                        
                        <button
                          onClick={() => handleViewDetails(parcel)}
                          className="btn btn-sm btn-ghost flex items-center gap-1 text-gray-300"
                        >
                          <FileText className="w-4 h-4" />
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Rider Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-700">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <User className="w-6 h-6" />
                    Assign Rider
                  </h2>
                  <p className="text-gray-400 mt-1">
                    Select a rider from{" "}
                    <span className="font-semibold text-blue-300">
                      {selectedParcelDetails?.senderRegion}
                    </span>{" "}
                    district
                  </p>
                </div>
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="btn btn-sm btn-circle btn-ghost"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Parcel Info */}
              <div className="mt-4 p-3 bg-gray-900/50 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Parcel ID</p>
                    <p className="font-mono text-white">{selectedParcelDetails?.trackingId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Sender Region</p>
                    <div className="flex items-center gap-2">
                      <Map className="w-4 h-4 text-blue-400" />
                      <span className="font-medium text-white">
                        {selectedParcelDetails?.senderRegion}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {isLoadingRiders ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="loading loading-spinner loading-lg text-primary"></div>
                  <p className="mt-4 text-gray-400">Loading available riders...</p>
                </div>
              ) : matchingRiders.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-400">
                        Showing {matchingRiders.length} rider(s) in this district
                      </span>
                    </div>
                    <div className="badge badge-success">
                      Region Matched
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {matchingRiders.map((rider) => (
                      <div
                        key={rider._id}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedRider === rider._id
                            ? "border-blue-500 bg-blue-900/20"
                            : "border-gray-700 bg-gray-900/30 hover:border-gray-600"
                        }`}
                        onClick={() => setSelectedRider(rider._id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-10 h-10 rounded-full bg-blue-900/50 flex items-center justify-center">
                                <User className="w-5 h-5 text-blue-300" />
                              </div>
                              <div>
                                <h3 className="font-bold text-white">{rider.name}</h3>
                                <p className="text-sm text-gray-400">{rider.email}</p>
                              </div>
                            </div>
                            
                            <div className="space-y-2 mt-3">
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-300">{rider.phone}</span>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <div>
                                  <span className="text-sm text-gray-300">{rider.district}</span>
                                  {rider.district === selectedParcelDetails?.senderRegion && (
                                    <span className="ml-2 badge badge-xs badge-success">
                                      Matched
                                    </span>
                                  )}
                                </div>
                              </div>
                              
                              {rider.vehicleType && (
                                <div className="flex items-center gap-2">
                                  <Truck className="w-4 h-4 text-gray-400" />
                                  <span className="text-sm text-gray-300">{rider.vehicleType}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div>
                            {selectedRider === rider._id ? (
                              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                                <Check className="w-4 h-4 text-white" />
                              </div>
                            ) : (
                              <div className="w-6 h-6 rounded-full border-2 border-gray-600"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-900 mb-4">
                    <User className="w-8 h-8 text-gray-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">
                    No Riders Available
                  </h3>
                  <p className="text-gray-400 mb-4">
                    No riders found in{" "}
                    <span className="font-semibold text-blue-300">
                      {selectedParcelDetails?.senderRegion}
                    </span>{" "}
                    district
                  </p>
                  <p className="text-sm text-gray-500">
                    Please try selecting a parcel from a different region or add riders to this district.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-700 flex justify-end gap-3">
              <button
                onClick={() => setShowAssignModal(false)}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const selectedRiderData = matchingRiders.find(r => r._id === selectedRider);
                  if (selectedRiderData) {
                    handleAssignRider(selectedRider, selectedRiderData.name);
                  }
                }}
                disabled={!selectedRider}
                className="btn btn-primary"
              >
                <Check className="w-5 h-5" />
                Assign Selected Rider
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help Information */}
      <div className="mt-8 bg-gray-900/50 border border-gray-700 rounded-lg p-6">
        <h3 className="font-semibold text-gray-300 mb-4 flex items-center gap-2">
          📋 Assignment Instructions
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <h4 className="font-medium text-gray-400 mb-3">Step-by-step Guide:</h4>
            <ol className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-900 flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <span className="text-gray-300">Select a parcel by clicking "Select Parcel"</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-900 flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <span className="text-gray-300">Click "Assign Rider" button</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-900 flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <span className="text-gray-300">Choose a rider from matching district</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-900 flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <span className="text-gray-300">Confirm the assignment</span>
              </li>
            </ol>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-400 mb-3">Status Legend:</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-gray-300">Unpaid - Payment pending</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-gray-300">Not Collected - Ready for pickup</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-gray-300">Region Matched - Rider available</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-400 mb-3">How Region Matching Works:</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <p className="text-gray-300">System automatically filters riders</p>
                  <p className="text-sm text-gray-400">based on parcel's sender region</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-green-400 mt-0.5" />
                <div>
                  <p className="text-gray-300">Only riders from same district</p>
                  <p className="text-sm text-gray-400">are shown for assignment</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignRider;