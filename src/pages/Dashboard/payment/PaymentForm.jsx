import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";

const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState("");

    const handleSubmit = async(event) => {
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
        const {error, paymentMethod} = await stripe.createPaymentMethod({
            type: "card",
            card: card,
        })

        // handle error or success PaymentMethod
        if(error){
            setError(error.message);
        }
        else{
            setError("");
            console.log("PaymentMethod", paymentMethod)
        }
        

    };

  return (
    <div>
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow-md max-w-md mx-auto">
            <CardElement className="p-2 border rounded"/>
                <button 
                type="submit"
                className="btn btn-primary w-full text-black"
                disabled={!stripe}
                >
                    Payment for Parcel Pickup 
                </button>
                {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
        </form>
    </div>
  )
}

export default PaymentForm
