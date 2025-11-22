import RegionWarehouseSelect from "./RegionWarehouseSelect";

const ReceiverInfo = ({ register, errors, watch, serviceCenters, setValue }) => {
  return (
    <div className="p-4 border rounded-2xl">
      <h2 className="text-xl font-semibold mb-4">Receiver Information</h2>
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="font-medium">Receiver Name</label>
          <input
            type="text"
            placeholder="Receiver Name"
            {...register("receiverName", { required: true })}
            className="input input-bordered w-full mt-1"
          />
          {errors.receiverName && <p className="text-red-500 text-sm">Receiver name required</p>}
        </div>

        <div>
          <label className="font-medium">Contact</label>
          <input
            type="text"
            placeholder="Receiver Contact"
            {...register("receiverContact", { required: true })}
            className="input input-bordered w-full mt-1"
          />
          {errors.receiverContact && (
            <p className="text-red-500 text-sm">Contact number required</p>
          )}
        </div>

        <RegionWarehouseSelect
          label="Receiver"
          register={register}
          errors={errors}
          watch={watch}
          serviceCenters={serviceCenters}
          setValue={setValue}
          regionField="receiverRegion"
          warehouseField="receiverWarehouse"
        />

        <div>
          <label className="font-medium">Address</label>
          <input
            type="text"
            placeholder="Receiver Address"
            {...register("receiverAddress", { required: true })}
            className="input input-bordered w-full mt-1"
          />
          {errors.receiverAddress && <p className="text-red-500 text-sm">Address is required</p>}
        </div>

        <div>
          <label className="font-medium">Delivery Instruction</label>
          <textarea
            placeholder="Delivery Instruction"
            {...register("receiverInstruction", { required: true })}
            className="textarea textarea-bordered w-full mt-1"
          ></textarea>
          {errors.receiverInstruction && (
            <p className="text-red-500 text-sm">Delivery instruction is required</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReceiverInfo;
