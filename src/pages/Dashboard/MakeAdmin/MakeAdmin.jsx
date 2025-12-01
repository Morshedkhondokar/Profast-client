import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const MakeAdmin = () => {
  const axiosSecure = useAxiosSecure();
  const [emailQuery, setEmailQuery] = useState("");
  const [searchKey, setSearchKey] = useState("");

  // Fetch user from backend using React Query
  const { data: users = [], refetch, isLoading } = useQuery({
    queryKey: ["searchUsers", searchKey],
    queryFn: async () => {
      if (!searchKey) return [];
      const res = await axiosSecure.get(`/users/search?email=${searchKey}`);
      return res.data;
    },
    enabled: !!searchKey, // Only run when searchKey has value
  });

  // Handle Search Click
  const handleSearch = () => {
    if (!emailQuery.trim()) {
      Swal.fire("Error!", "Please enter an email.", "warning");
      return;
    }
    setSearchKey(emailQuery.trim());
  };

  // Role Update
  const updateRole = async (id, newRole) => {
    Swal.fire({
      title: `Are you sure?`,
      text: `You want to set this user as ${newRole}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Update",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.patch(`/users/${id}/role`, {
            role: newRole,
          });

          if (res.data) {
            Swal.fire("Success!", `Role updated to ${newRole}`, "success");
            refetch(); // Refresh user list
          }
        } catch (error) {
          Swal.fire("Error!", "Failed to update role", "error");
          console.error(error);
        }
      }
    });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Manage User Roles</h2>

      {/* Search Box */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search user by email..."
          className="input input-bordered w-full"
          value={emailQuery}
          onChange={(e) => setEmailQuery(e.target.value)}
        />

        <button onClick={handleSearch} className="btn btn-primary">
          Search
        </button>
      </div>

      {isLoading && <p>Searching...</p>}

      {/* No results */}
      {!isLoading && users.length === 0 && searchKey && (
        <p className="text-red-500">No users found</p>
      )}

      {/* Results Table */}
      {users.length > 0 && (
        <table className="table w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th>#</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u, index) => (
              <tr key={u._id}>
                <td>{index + 1}</td>
                <td>{u.email}</td>
                <td className="capitalize">{u.role}</td>
                <td>{new Date(u.created_date).toLocaleDateString()}</td>
                <td>
                  {u.role === "admin" ? (
                    <button
                      onClick={() => updateRole(u._id, "user")}
                      className="btn btn-error btn-sm"
                    >
                      Remove Admin
                    </button>
                  ) : (
                    <button
                      onClick={() => updateRole(u._id, "admin")}
                      className="btn btn-success btn-sm"
                    >
                      Make Admin
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MakeAdmin;
