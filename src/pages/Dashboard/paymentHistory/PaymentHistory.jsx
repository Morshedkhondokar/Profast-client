import { useQuery } from '@tanstack/react-query';
import useAuth from '../../../hooks/useAuth'
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const PaymentHistory = () => {
    const {user} = useAuth();
    const axiosSecure = useAxiosSecure();

    const {isPending, data: payments = []} = useQuery({
        queryKey: ['payments', user?.email],
        queryFn: async() => {
           const res = await axiosSecure.get(`/payments/user/${user.email}`);
            return res.data;
        }
    })
    console.log(user.email,"payment History ==========>>>>",payments)

    if(isPending){
        return <div>Loading...</div>
    }

  return (
    <div className="overflow-x-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Payment History</h2>

      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead className="bg-gray-900">
          <tr>
            <th className="border px-3 py-2">#</th>
            <th className="border px-3 py-2">Parcel ID</th>
            <th className="border px-3 py-2">User Email</th>
            <th className="border px-3 py-2">Amount</th>
            <th className="border px-3 py-2">Payment Method</th>
            <th className="border px-3 py-2">Status</th>
            <th className="border px-3 py-2">Date</th>
          </tr>
        </thead>

        <tbody>
          {payments?.map((payment, index) => (
            <tr key={payment._id || index} className="text-center">
              <td className="border px-3 py-2">{index + 1}</td>
              <td className="border px-3 py-2">{payment.parcelId}</td>
              <td className="border px-3 py-2">{payment.userEmail}</td>
              <td className="border px-3 py-2">{payment.amount} ৳</td>
              <td className="border px-3 py-2 capitalize">{payment.paymentMethod}</td>
              <td className="border px-3 py-2 text-green-600 font-semibold">{payment.status}</td>
              <td className="border px-3 py-2">
                {new Date(payment.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default PaymentHistory
