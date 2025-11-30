import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
// Swal, useAuth, useAxiosSecure - এইগুলো ব্যাকএন্ডের জন্য প্রয়োজন, তাই এখন যুক্ত করা হলো।
import Swal from "sweetalert2"; 
import useAuth from "../../../hooks/useAuth"; 
import useAxiosSecure from "../../../hooks/useAxiosSecure";
// Icons
import { FaUser, FaEnvelope, FaMotorcycle, FaIdCard, FaMapMarkerAlt, FaPhone, FaCalendarAlt } from 'react-icons/fa';


 import riderImage from '../../../assets/agent-pending.png'


const BeARider = () => {
    // --- AUTH INTEGRATION START ---
    // get data from useAuth 
    const { user } = useAuth(); 
    const axiosSecure = useAxiosSecure(); 
    // --- AUTH INTEGRATION END --- 

    // State for local data management (Regions and Districts)
    const [serviceCenters, setServiceCenters] = useState([]);
    const [uniqueRegions, setUniqueRegions] = useState([]);
    const [availableDistricts, setAvailableDistricts] = useState([]);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: user?.displayName,
            email: user?.email
        },
    });

    const selectedRegion = watch("region");

    // 1. Load warehouse data and extract unique regions (Frontend Data Logic)
    useEffect(() => {
        // NOTE: For local testing, ensure /warehouses.json is accessible
        fetch("/warehouses.json")
            .then((res) => res.json())
            .then((data) => {
                setServiceCenters(data);
                const regions = [...new Set(data.map(item => item.region))];
                setUniqueRegions(regions);
            })
            .catch((err) => console.error("Failed to load regions:", err));
    }, []);

    // 2. Filter districts when the selected region changes (Frontend Data Logic)
    useEffect(() => {
        if (selectedRegion && serviceCenters.length > 0) {
            const districtsInRegion = serviceCenters
                .filter(item => item.region === selectedRegion)
                .map(item => item.district);
            
            const uniqueDistricts = [...new Set(districtsInRegion)]; 
            
            setAvailableDistricts(uniqueDistricts);
            setValue("district", ""); 
        } else {
            setAvailableDistricts([]);
        }
    }, [selectedRegion, serviceCenters, setValue]);

    // 3. Set user data to the form
    useEffect(() => {
        if (user) {
            // Updating name and email when user information changes
            setValue("name", user.displayName);
            setValue("email", user.email);
        }
    }, [user, setValue]);


    // --- BACKEND SUBMISSION LOGIC ---
    const onSubmit = async (data) => {
        const riderData = {
            ...data,
            age: Number(data.age),
            status: "pending", 
            role: "rider",    
            appliedDate: new Date().toISOString(),
        };

        console.log("Form Data Ready for Submission:", riderData);

        // ====================================================================
        // === BACKEND INTEGRATION ===
        // Swal and useAxiosSecure POST reques to backend 
        try {
            const res = await axiosSecure.post("/riders", riderData);
            console.log(res.data)
            if (res.data.insertedId) {
                // Success alert (Using Swal)
                Swal.fire({ 
                    icon: "success", 
                    title: "Application Submitted Successfully!",
                    text: "Admin will review your request soon.",
                    showConfirmButton: false,
                    timer: 1500,
                });
                // reset();
            }
        } catch (error) {
            console.error("Submission Error:", error);
            // Error alert (Using Swal)
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Could not submit application. Please check console.",
            });
        }
        // ====================================================================
    };
    // ------------------------------------

    return (
        // Outer container: centered, white background, large shadow
        <div className="min-h-screen  flex items-center justify-center py-12 px-4">
            <div className="max-w-6xl w-full  rounded-2xl shadow-2xl overflow-hidden p-10">
                
                {/* Header Section */}
                <div className="mb-8 border-b pb-4">
                    <h2 className="text-4xl font-bold text-gray-300">Be a Rider</h2>
                    <p className="text-gray-500 mt-2">
                        Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle. From personal
                        packages to business shipments — we deliver on time, every time.
                    </p>
                </div>

                {/* --- Main Content: Form + Image Side-by-Side --- */} 
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    
                    {/* 1. Left Column: The Form Inputs */} 
                    <div>
                        <h3 className="text-xl font-semibold mb-6 text-gray-300">Tell us about yourself</h3>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            
                            {/* Row 1: Name & Age */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="form-control">
                                    <label className="label"><span className="label-text font-semibold">Your Name</span></label>
                                    <input
                                        type="text"
                                        placeholder="Your Name"
                                        {...register("name")}
                                        readOnly
                                        className="input input-bordered w-full bg-gray-100 cursor-not-allowed text-gray-500"
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label"><span className="label-text font-semibold">Your Age</span></label>
                                    <input
                                        type="number"
                                        placeholder="Your age"
                                        {...register("age", { required: true, min: 18 })}
                                        className="input input-bordered w-full"
                                    />
                                    {errors.age && <span className="text-red-500 text-sm mt-1">Age must be 18+</span>}
                                </div>
                            </div>

                            {/* Row 2: Email & Region */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="form-control">
                                    <label className="label"><span className="label-text font-semibold">Your Email</span></label>
                                    <input
                                        type="email"
                                        placeholder="Your Email"
                                        {...register("email")}
                                        readOnly
                                        className="input input-bordered w-full bg-gray-100 cursor-not-allowed text-gray-500"
                                    />
                                </div>
                                <div className="form-control">
                                    <label className="label"><span className="label-text font-semibold">Your Region</span></label>
                                    <select
                                        {...register("region", { required: true })}
                                        className="select select-bordered w-full"
                                    >
                                        <option value="">Select your region</option>
                                        {uniqueRegions.map((regionName, idx) => (
                                            <option key={idx} value={regionName}>
                                                {regionName}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.region && <span className="text-red-500 text-sm mt-1">Region is required</span>}
                                </div>
                            </div>

                            {/* Row 3: NID & Contact (Phone Number) */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="form-control">
                                    <label className="label"><span className="label-text font-semibold">NID No</span></label>
                                    <input
                                        type="text"
                                        placeholder="NID"
                                        {...register("nidNo", { required: true })}
                                        className="input input-bordered w-full"
                                    />
                                    {errors.nidNo && <span className="text-red-500 text-sm mt-1">NID is required</span>}
                                </div>
                                <div className="form-control">
                                    <label className="label"><span className="label-text font-semibold">Contact (Phone)</span></label>
                                    <input
                                        type="tel"
                                        placeholder="Contact"
                                        {...register("phoneNumber", { required: true })}
                                        className="input input-bordered w-full"
                                    />
                                    {errors.phoneNumber && <span className="text-red-500 text-sm mt-1">Contact is required</span>}
                                </div>
                            </div>

                            {/* Row 4: Warehouse (District) Selection */}
                            <div className="form-control">
                                <label className="label"><span className="label-text font-semibold">Which wire-house you want to work?</span></label>
                                <select
                                    {...register("district", { required: true })}
                                    disabled={!selectedRegion || availableDistricts.length === 0}
                                    className="select select-bordered w-full disabled:bg-gray-200"
                                >
                                    <option value="">Select wire-house</option>
                                    {availableDistricts.map((dist, idx) => (
                                        <option key={idx} value={dist}>
                                            {dist}
                                        </option>
                                    ))}
                                </select>
                                {errors.district && <span className="text-red-500 text-sm mt-1">Warehouse/District is required</span>}
                            </div>
                            
                            {/* Row 5: Bike Info */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="form-control">
                                    <label className="label"><span className="label-text font-semibold">Bike Brand</span></label>
                                    <input type="text" placeholder="Bike Brand" {...register("bikeBrand", { required: true })} className="input input-bordered w-full" />
                                    {errors.bikeBrand && <span className="text-red-500 text-sm mt-1">Bike Brand is required</span>}
                                </div>
                                <div className="form-control">
                                    <label className="label"><span className="label-text font-semibold">Registration No</span></label>
                                    <input type="text" placeholder="Reg. No." {...register("bikeRegistration", { required: true })} className="input input-bordered w-full" />
                                    {errors.bikeRegistration && <span className="text-red-500 text-sm mt-1">Registration No is required</span>}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="btn w-full text-lg bg-lime-500 hover:bg-lime-600 text-white border-none shadow-md"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* 2. Right Column: The Image/Diagram */}
                    <div className="hidden lg:block">
                        <div className="h-full w-full flex items-center justify-center">
                           <img 
                             // Replace riderImage with your actual imported asset or URL
                             src={riderImage} 
                             alt="A rider on a motorcycle carrying a delivery box" 
                             className="w-full h-auto object-contain rounded-lg"
                           />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default BeARider;