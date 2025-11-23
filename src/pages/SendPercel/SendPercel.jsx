import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import ParcelInfo from "./ParcelInfo";
import ReceiverInfo from "./ReceiverInfo";
import SenderInfo from "./SenderInfo";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";


// ---------------- COST CALCULATION ---------------- 
const calculateDeliveryCost = (senderRegion, receiverRegion, weight, parcelType) => {
  const isWithinCity = senderRegion === receiverRegion;
  const w = Number(weight);

  // Document Rule
  if (parcelType === "document") {
    return {
      base: isWithinCity ? 60 : 80,
      extra: 0,
      total: isWithinCity ? 60 : 80
    };
  }

  // Non-document up to 3kg
  if (w <= 3) {
    return {
      base: isWithinCity ? 110 : 150,
      extra: 0,
      total: isWithinCity ? 110 : 150
    };
  }

  // Non-document above 3kg
  const extraKg = w - 3;
  const extraCost = extraKg * 40;

  if (isWithinCity) {
    return {
      base: 110,
      extra: extraCost,
      total: 110 + extraCost
    };
  }

  return {
    base: 150,
    extra: extraCost + 40,
    total: 150 + extraCost + 40
  };
};

// 🔑 Helper function to generate unique tracking ID
const generateTrackingId = () => { 
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);     // Last two digits of year   
  const month = String(now.getMonth() + 1).padStart(2, '0');    // Month is 0-indexed
  const day = String(now.getDate()).padStart(2, '0');        // Day of month
  const random = Math.random().toString(36).substring(2, 7).toUpperCase(); // 5 digit random string

  return `TRK${year}${month}${day}${random}`; 
};

const SendParcel = () => {
  const [serviceCenters, setServiceCenters] = useState([]);

  //  Get current user's email from useAuth hook
  const { user } = useAuth(); 
  const axiosSecure = useAxiosSecure();
  //  tracking ID
  const trackingId = generateTrackingId();

  const {register, handleSubmit, watch, setValue, formState: { errors }} = useForm();
  // Fetch service centers (unchanged)
  useEffect(() => {
    fetch("/warehouses.json")
      .then((res) => res.json())
      .then((data) => setServiceCenters(data))
      .catch((err) => console.error("Failed to load warehouses:", err));
  }, []);

  const onSubmit = (data) => {
  const cost = calculateDeliveryCost(
    data.senderRegion,
    data.receiverRegion,
    data.parcelWeight || 1,
    data.parcelType
  );

 Swal.fire({
  title: `<strong style="font-size:22px;">Confirm Parcel Booking</strong>`,
  width: 650,
  html: `
    <div style="text-align:left; font-size:16px; line-height:1.7; background:#f8fafc; padding:20px; border-radius:12px; border:1px solid #e2e8f0;">
      
      <!-- Basic Info -->
      <div style="margin-bottom:18px;">
        <p><strong>Parcel Type :</strong> 
          ${data.parcelType === "document" ? "Document" : "Non-Document"}
        </p>
        <p><strong>Weight :</strong> <strong>${data.parcelWeight || 1} kg</strong></p>
        <p><strong>Delivery Route :</strong> 
          ${data.senderRegion} → ${data.receiverRegion}
          ${data.senderRegion === data.receiverRegion 
            ? '<span style="color:#16a34a; font-weight:600;"> (Same City)</span>' 
            : '<span style="color:#dc2626; font-weight:600;"> (Outside City)</span>'
          }
        </p>
      </div>

      <hr style="border:1px dashed #cbd5e1; margin:18px 0;" />

      <!-- Cost Breakdown -->
      <div style="background:#fff; padding:15px; border-radius:8px; border:1px solid #e2e8f0;">
        <h3 style="margin:0 0 12px 0; color:#1e293b; font-size:18px;">Cost Breakdown</h3>
        
        <!-- Base Price -->
        <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
          <span>Base Price 
            ${data.senderRegion === data.receiverRegion ? "(Same City)" : "(Outside City)"}
          </span>
          <strong>${cost.base} ৳</strong>
        </div>

        <!-- Extra Weight Charge -->
        ${data.parcelType !== "document" && data.parcelWeight > 3 
          ? `<div style="display:flex; justify-content:space-between; margin-bottom:8px; color:#d97706;">
              <span>Extra Weight Charge <small>(${(data.parcelWeight - 3).toFixed(2)} kg × 40৳)</small></span>
              <strong>${(data.parcelWeight - 3) * 40} ৳</strong>
            </div>`
          : ''
        }

        <!-- Outside City Surcharge -->
        ${data.senderRegion !== data.receiverRegion && data.parcelType !== "document"
          ? `<div style="display:flex; justify-content:space-between; margin-bottom:8px; color:#dc2626;">
              <span>Outside City Surcharge</span>
              <strong>+40 ৳</strong>
            </div>`
          : ''
        }

        <!-- Total -->
        <hr style="border:1px solid #16a34a; margin:15px 0;" />
        <div style="display:flex; justify-content:space-between; font-size:22px;">
          <span style="font-weight:700; color:#16a34a;">Total Amount</span>
          <strong style="color:#16a34a;">${cost.total} ৳</strong>
        </div>
      </div>

      <!-- Footer Note -->
      <div style="margin-top:20px; font-size:14px; color:#64748b; text-align:center;">
        ${data.parcelType === "document" 
          ? "Document delivery has fixed rate. No extra charge for weight or distance." 
          : "Non-document parcels over 3kg = 40৳ per extra kg<br>Outside city delivery = +40৳ surcharge"
        }
      </div>
    </div>
  `,
  icon: "info",
  showCancelButton: true,
  confirmButtonText: `💳 Proceed to payment `,
  cancelButtonText: "✏ Edit form",
  confirmButtonColor: "#16a34a",
  cancelButtonColor: "#94a3b8",
  allowOutsideClick: false,
}).then((result) => {
 if (result.isConfirmed) {
  const createdAt = new Date();

  const finalData = {
    ...data,
    // 🆕 Required fields
    trackingId,                             // Unique tracking ID
    status: "pending",                      // Default parcel status
    deliveryCost: cost.total,
    paymentStatus: "unpaid",               // Default payment status
    deleveryStatus: 'not_collected',        // Default delivery status
    // 🧠 Metadata
    senderEmail: user?.email,
    createdAtISO: createdAt.toISOString(),
    createdAtUnix: Math.floor(createdAt.getTime() / 1000),
    createdAtDisplay: createdAt.toLocaleString("en-BD", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  };

  console.log('Final data to send ',finalData)
  // =========== Send data to server ==========
  axiosSecure.post('/parcels', finalData)
  .then(res => {
    console.log('Server response ',res.data)
    if(res.data.insertedId){
      // TODO: Redirect to payment gateway with necessary info
      Swal.fire({
        icon: "success",
        title: "Redirecting to Payment...",
        text: `Proceed to payment geateway to complete your booking.`,
        showConfirmButton: false,
        timer: 2000
      });
    }
  })
  .catch(err => {
    console.error('Error saving parcel data ',err)
  });

}
});
};

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Add Parcel</h1>
      <p className="text-gray-200 mb-6">Enter your parcel details</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        <ParcelInfo
        register={register} 
        errors={errors} 
        watch={watch} 
        setValue={setValue} 
        />

        <div className="flex gap-5 flex-col md:flex-row">
          <div className="flex-1">
            <SenderInfo
              register={register}
              errors={errors}
              watch={watch}
              serviceCenters={serviceCenters}
              setValue={setValue}
            />
          </div>

          <div className="flex-1">
            <ReceiverInfo
              register={register}
              errors={errors}
              watch={watch}
              serviceCenters={serviceCenters}
              setValue={setValue}
            />
          </div>
        </div>

        <button className="btn bg-lime-500 hover:bg-lime-600 text-black font-bold w-full mt-4">
          Proceed to Confirm Booking
        </button>
      </form>
    </div>
  );
};

export default SendParcel;