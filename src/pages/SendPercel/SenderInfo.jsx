import RegionWarehouseSelect from "./RegionWarehouseSelect";

const SenderInfo = ({ register, errors, watch, serviceCenters, setValue }) => {
  return (
    <div className="p-4 border rounded-2xl">
      <h2 className="text-xl font-semibold mb-4">Sender Information</h2>
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="font-medium">Sender Name</label>
          <input
            type="text"
            placeholder="Sender Name"
            {...register("senderName", { required: true })}
            className="input input-bordered w-full mt-1"
          />
          {errors.senderName && <p className="text-red-500 text-sm">Sender name required</p>}
        </div>

        <div>
          <label className="font-medium">Contact</label>
          <input
            type="text"
            placeholder="Sender Contact"
            {...register("senderContact", { required: true })}
            className="input input-bordered w-full mt-1"
          />
          {errors.senderContact && (
            <p className="text-red-500 text-sm">Contact number required</p>
          )}
        </div>

        <RegionWarehouseSelect
          label="Sender"
          register={register}
          errors={errors}
          watch={watch}
          serviceCenters={serviceCenters}
          setValue={setValue}
          regionField="senderRegion"
          warehouseField="senderWarehouse"
        />

        <div>
          <label className="font-medium">Address</label>
          <input
            type="text"
            placeholder="Address"
            {...register("senderAddress", { required: true })}
            className="input input-bordered w-full mt-1"
          />
          {errors.senderAddress && <p className="text-red-500 text-sm">Address is required</p>}
        </div>

        <div>
          <label className="font-medium">Pickup Instruction</label>
          <textarea
            placeholder="Pickup Instruction"
            {...register("senderInstruction", { required: true })}
            className="textarea textarea-bordered w-full mt-1"
          ></textarea>
          {errors.senderInstruction && (
            <p className="text-red-500 text-sm">Pickup instruction is required</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SenderInfo;
