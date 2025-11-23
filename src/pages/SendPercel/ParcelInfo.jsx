import { useEffect } from "react";

const ParcelInfo = ({ register, errors, watch,setValue }) => {
  const parcelType = watch("parcelType");

  // clear parcel weight if parcel type is document
  useEffect(() => {
    if (parcelType === "document") {
      setValue("parcelWeight", undefined, { shouldValidate: true }); 
    }
  }, [parcelType, setValue]);


  return (
    <div className="border-b pb-8">
      <h2 className="text-xl font-semibold mb-4">Parcel Information</h2>

      {/* Parcel Type */}
      <div className="flex items-center gap-6 mb-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            value="document"
            {...register("parcelType", { required: true })}
            className="radio radio-success"
          />
          <span>Document</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            value="non-document"
            {...register("parcelType", { required: true })}
            className="radio radio-success"
          />
          <span>Not-Document</span>
        </label>
      </div>
      {
        errors.parcelType && (
          <p className="text-red-500 text-sm mb-4">Parcel type is required</p>
        )
      }

      {/* Parcel Name + Weight */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Parcel Name */}
        <div>
          <label className="font-medium">Parcel Name</label>
          <input
            type="text"
            placeholder="Parcel Name"
            {...register("parcelName", { required: true })}
            className="input input-bordered w-full mt-1"
          />
          {errors.parcelName && (
            <p className="text-red-500 text-sm">Parcel name required</p>
          )}
        </div>

        {/* Weight (only if non-document) */}
        <div>
          <label className="font-medium">Parcel Weight (KG)</label>
          <input
            type="text"
            step="0.1"
            placeholder="Parcel Weight (KG)"
            {...register("parcelWeight", {
              required: parcelType === "non-document",
            })}
            className="input input-bordered w-full mt-1"
            disabled={parcelType === "document"}
          />
          {errors.parcelWeight && (
            <p className="text-red-500 text-sm">Weight required for non-document</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParcelInfo;
