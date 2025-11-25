import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState("");
  const { parcelId } = useParams();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { isPending, data: parcelInfo = {} } = useQuery({
    queryKey: ["parcels", parcelId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels/${parcelId}`);
      return res.data;
    },
  });

  if (isPending) {
    return <div>Loading...</div>;
  }

  console.log(parcelInfo);
  const amount = parcelInfo.deliveryCost;
  const amountInCents = amount * 100;
  console.log(amountInCents);

  const handleSubmit = async (event) => {
    console.log(event);
    event.preventDefault();
    //=========== Handle payment submission logic here
    // if does not have stripe or elements, return
    if (!stripe || !elements) {
      return;
    }

    // get card element from elements
    const card = elements.getElement(CardElement);
    if (!card) {
      return;
    }

    // create payment method
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: card,
    });

    // handle error or success PaymentMethod
    if (error) {
      setError(error.message);
    } else {
      setError("");
      console.log("PaymentMethod", paymentMethod);

      // create payment intent on the server
      const res = await axiosSecure.post("/create-payment-intent", {
        amountInCents,
        parcelId,
      });

      const clientSecret = res.data.clientSecret;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: user.displayName,
            email: user.email,
          },
        },
      });

      // handle result of payment confirmation
      if (result.error) {
        setError(result.error.message);
      } else {
        setError("");
        if (result.paymentIntent.status === "succeeded") {
          const transactionId = result.paymentIntent.id;

          const paymentData = {
            parcelId: parcelId,
            email: user.email,
            amount,
            transactionId,
            paymentMethod: result.paymentIntent.payment_method_types[0],
          };

          const paymentRes = await axiosSecure.post(
            `/parcels/payment/${parcelId}`,
            paymentData
          );

          if (paymentRes.data.insertedId) {
            Swal.fire({
              icon: "success",
              title: "Payment Successful!",
              html: `<p>Your Transaction ID:</p>
             <strong>${transactionId}</strong>`,
              confirmButtonText: "OK",
            }).then(() => {
              navigate("/dashboard/myparcels");
            });
          }
        }
      }
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-xl shadow-md max-w-md mx-auto"
      >
        <CardElement className="p-2 border rounded" />
        <button
          type="submit"
          className="btn btn-primary w-full text-black"
          disabled={!stripe}
        >
          Payment ${amount}
        </button>
        {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
      </form>
    </div>
  );
};

export default PaymentForm;
