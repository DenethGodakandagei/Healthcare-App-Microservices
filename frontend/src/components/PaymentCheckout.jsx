import { useState, useEffect } from 'react';
import { paymentAPI } from '../services/api';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Load Stripe outside of components to avoid recreating the object
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ clientSecret, orderId, amount, doctor, appointment, onShowSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    // Confirm Payment Inline (no reload necessary if redirect is 'if_required' for cards)
    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href, // Fallback for 3D Secure
      },
      redirect: 'if_required', 
    });

    if (stripeError) {
      setError(stripeError.message);
      setLoading(false);
    } else if (paymentIntent && (paymentIntent.status === 'succeeded' || paymentIntent.status === 'requires_capture')) {
      try {
        // Send success to our backend
        onShowSuccess(orderId);
      } catch (err) {
        setError("Payment processed but system sync failed. Support will verify.");
        setLoading(false);
      }
    } else {
        setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <PaymentElement className="mb-4" />
      
      {error && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-medium flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      <div className="flex flex-col gap-3">
        <button
          type="submit"
          disabled={!stripe || !elements || loading}
          className="w-full h-16 bg-[#2299C9] text-white font-black rounded-3xl hover:bg-[#1C82AB] transition-all shadow-xl shadow-sky-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 active:scale-[0.98]"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Pay LKR {amount.toLocaleString()}.00
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="w-full py-4 text-gray-500 font-bold hover:text-gray-900 transition-colors"
        >
          Cancel and return
        </button>
      </div>
    </form>
  );
};

const PaymentCheckout = ({ appointment, doctor, onShowSuccess, onCancel }) => {
  const [clientSecret, setClientSecret] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [initError, setInitError] = useState(null);
  const amount = doctor.consultationFee || 2500;

  useEffect(() => {
    const initPayment = async () => {
      try {
        const res = await paymentAPI.createIntent({
          appointmentId: appointment._id,
          amount: amount,
          patientName: appointment.patientName,
          patientPhone: appointment.patientPhone,
        });
        setClientSecret(res.data.data.clientSecret);
        setOrderDetails({ orderId: res.data.data.order_id, amount: res.data.data.amount });
      } catch (err) {
        const errorMsg = err?.response?.data?.message || "Failed to initialize Stripe Payment Intent.";
        setInitError(`Stripe Error: ${errorMsg}`);
      }
    };
    initPayment();
  }, [appointment, amount]);

  return (
    <div className="max-w-xl mx-auto bg-white border border-gray-100 rounded-[3rem] p-8 md:p-10 shadow-2xl shadow-gray-200/50 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col items-center text-center space-y-3 mb-8">
        <div className="w-16 h-16 bg-[#635BFF]/10 rounded-3xl flex items-center justify-center text-[#635BFF] mb-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
        </div>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Secure Checkout</h2>
        <p className="text-gray-500 font-medium max-w-sm text-sm">
          Complete your payment securely with Stripe.
        </p>
      </div>

      <div className="bg-gray-50 rounded-3xl p-6 mb-8">
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <span className="text-gray-500 text-sm font-bold">Doctor</span>
          <span className="text-gray-900 font-black">Dr. {doctor.firstName} {doctor.lastName}</span>
        </div>
        <div className="flex justify-between items-center pt-4">
          <span className="text-gray-500 text-sm font-bold">Amount Due</span>
          <span className="text-2xl text-gray-900 font-black tracking-tight flex items-center gap-2">
            LKR {amount.toLocaleString()}.00
          </span>
        </div>
      </div>

      {initError ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold">{initError}</div>
      ) : clientSecret ? (
        <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
          <CheckoutForm 
            clientSecret={clientSecret} 
            orderId={orderDetails.orderId}
            amount={orderDetails.amount}
            doctor={doctor}
            appointment={appointment}
            onShowSuccess={onShowSuccess}
            onCancel={onCancel}
          />
        </Elements>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 gap-4">
          <div className="w-8 h-8 border-4 border-[#635BFF]/30 border-t-[#635BFF] rounded-full animate-spin" />
          <p className="text-gray-500 font-bold text-sm animate-pulse">Initializing Secure Gateway...</p>
        </div>
      )}
    </div>
  );
};

export default PaymentCheckout;
