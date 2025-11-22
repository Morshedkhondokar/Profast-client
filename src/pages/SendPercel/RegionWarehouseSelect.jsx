import { useEffect, useState } from "react";

const RegionWarehouseSelect = ({
  label,
  register,
  errors,
  watch, 
  serviceCenters,
  setValue,
  regionField,
  warehouseField,
}) => {
  const selectedRegion = watch(regionField);
  const [uniqueRegions, setUniqueRegions] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  // Extract unique regions
  useEffect(() => {
    if (serviceCenters?.length > 0) {
      const regions = [...new Set(serviceCenters.map(center => center.region))];
      setUniqueRegions(regions.sort());
    }
  }, [serviceCenters]);

  // Get all areas when region changes
  useEffect(() => {
    if (!selectedRegion) {
      setWarehouses([]);
      return;
    }
    
    // Get all covered areas from selected region
    const regionData = serviceCenters.filter((sc) => sc.region === selectedRegion);
    const allCoveredAreas = [...new Set(regionData.flatMap((sc) => sc.covered_area || []))];
    setWarehouses(allCoveredAreas.sort());
    
    // Reset warehouse selection
    setValue(warehouseField, "");
  }, [selectedRegion, serviceCenters, setValue, warehouseField]);

  return (
    <>
      {/* Region */}
      <div>
        <label className="font-medium">{label} Region</label>
        <select
          {...register(regionField, { required: true })}
          className="select select-bordered w-full mt-1"
        >
          <option value="">Select Region</option>
          {uniqueRegions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
        {errors[regionField] && <p className="text-red-500 text-sm">{label} region required</p>}
      </div>

      {/* Area */}
      <div>
        <label className="font-medium">{label} Area</label>
        <select
          {...register(warehouseField, { required: true })}
          className="select select-bordered w-full mt-1"
          disabled={!selectedRegion}
        >
          <option value="">Select Area</option>
          {warehouses.map((area, idx) => (
            <option key={idx} value={area}>
              {area}
            </option>
          ))}
        </select>
        {errors[warehouseField] && <p className="text-red-500 text-sm">{label} area required</p>}
      </div>
    </>
  );
};

export default RegionWarehouseSelect;