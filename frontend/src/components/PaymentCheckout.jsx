import { useState, useEffect } from 'react';
import { paymentAPI } from '../services/api';

const PaymentCheckout = ({ appointment, doctor, onShowSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [initLoading, setInitLoading] = useState(true);
  const amount = doctor.consultationFee || 2500;

  // Card form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  // Initialize payment intent on backend
  useEffect(() => {
    const initPayment = async () => {
      try {
        const res = await paymentAPI.createIntent({
          appointmentId: appointment._id || 'PENDING',
          amount: amount,
          patientName: appointment.patientName,
          patientPhone: appointment.patientPhone,
        });
        setOrderId(res.data.data.order_id);
        setInitLoading(false);
      } catch (err) {
        const errorMsg = err?.response?.data?.message || "Failed to initialize payment.";
        setError(errorMsg);
        setInitLoading(false);
      }
    };
    initPayment();
  }, [appointment, amount]);

  // Format card number with spaces every 4 digits
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const parts = [];
    for (let i = 0; i < v.length && i < 16; i += 4) {
      parts.push(v.substring(i, i + 4));
    }
    return parts.join(' ');
  };

  // Format expiry as MM/YY
  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  // Validate card form
  const isFormValid = () => {
    const cleanCard = cardNumber.replace(/\s/g, '');
    return cleanCard.length === 16 && cardName.trim().length > 2 && expiry.length === 5 && cvv.length >= 3;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid() || !orderId) return;

    setLoading(true);
    setError(null);

    try {
      console.log("Confirming payment for order:", orderId);
      // Process payment through backend
      const res = await paymentAPI.confirm({
        paymentId: orderId,
        status: 'completed',
        cardLast4: cardNumber.replace(/\s/g, '').slice(-4),
      });

      console.log("Payment confirmation response:", res.data);

      // Payment succeeded — tell parent to book the appointment
      await onShowSuccess(orderId);
    } catch (err) {
      console.error("Payment confirmation error:", err);
      const errorMsg = err?.response?.data?.message || err.message || "Payment processing failed. Please try again.";
      setError(errorMsg);
      setLoading(false);
    }
  };

  // Card type detection
  const getCardType = () => {
    const cleanNum = cardNumber.replace(/\s/g, '');
    if (cleanNum.startsWith('4')) return 'visa';
    if (cleanNum.startsWith('5') || cleanNum.startsWith('2')) return 'mastercard';
    if (cleanNum.startsWith('3')) return 'amex';
    return null;
  };

  const cardType = getCardType();

  return (
    <div style={{
      maxWidth: '520px',
      margin: '0 auto',
      background: '#fff',
      border: '1px solid #f0f0f0',
      borderRadius: '2rem',
      padding: '2.5rem',
      boxShadow: '0 25px 50px -12px rgba(0,0,0,0.08)',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{
          width: '56px', height: '56px', background: 'linear-gradient(135deg, #635BFF 0%, #8B85FF 100%)',
          borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1rem',
        }}>
          <svg width="28" height="28" fill="none" stroke="white" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#1a1a2e', margin: '0 0 0.25rem' }}>Secure Checkout</h2>
        <p style={{ fontSize: '0.85rem', color: '#888', fontWeight: '500', margin: 0 }}>Enter your card details to complete payment</p>
      </div>

      {/* Order Summary */}
      <div style={{
        background: '#f8f9fb', borderRadius: '1.25rem', padding: '1.25rem', marginBottom: '1.5rem',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px solid #e8e8ee' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#888' }}>Doctor</span>
          <span style={{ fontSize: '0.9rem', fontWeight: '800', color: '#1a1a2e' }}>Dr. {doctor.firstName} {doctor.lastName}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#888' }}>Amount Due</span>
          <span style={{ fontSize: '1.5rem', fontWeight: '900', color: '#1a1a2e' }}>LKR {amount.toLocaleString()}.00</span>
        </div>
      </div>

      {initLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2.5rem 0', gap: '1rem' }}>
          <div style={{
            width: '32px', height: '32px', border: '3px solid #e0e0ef', borderTopColor: '#635BFF',
            borderRadius: '50%', animation: 'spin 1s linear infinite',
          }} />
          <p style={{ color: '#888', fontWeight: '600', fontSize: '0.85rem' }}>Initializing...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Cardholder Name */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#555', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Cardholder Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              style={{
                width: '100%', padding: '0.85rem 1rem', border: '2px solid #e8e8ee', borderRadius: '0.85rem',
                fontSize: '0.95rem', fontWeight: '600', color: '#1a1a2e', outline: 'none',
                transition: 'border 0.2s', boxSizing: 'border-box', background: '#fafafe',
              }}
              onFocus={(e) => e.target.style.borderColor = '#635BFF'}
              onBlur={(e) => e.target.style.borderColor = '#e8e8ee'}
            />
          </div>

          {/* Card Number */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#555', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Card Number
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="4242 4242 4242 4242"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                maxLength={19}
                style={{
                  width: '100%', padding: '0.85rem 3.5rem 0.85rem 1rem', border: '2px solid #e8e8ee', borderRadius: '0.85rem',
                  fontSize: '0.95rem', fontWeight: '600', color: '#1a1a2e', outline: 'none', letterSpacing: '0.1em',
                  transition: 'border 0.2s', boxSizing: 'border-box', background: '#fafafe',
                }}
                onFocus={(e) => e.target.style.borderColor = '#635BFF'}
                onBlur={(e) => e.target.style.borderColor = '#e8e8ee'}
              />
              {/* Card icon */}
              <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)' }}>
                {cardType === 'visa' && (
                  <span style={{ fontWeight: '900', fontSize: '0.85rem', color: '#1a1f71', fontStyle: 'italic' }}>VISA</span>
                )}
                {cardType === 'mastercard' && (
                  <div style={{ display: 'flex', gap: '0' }}>
                    <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#eb001b', opacity: 0.8 }} />
                    <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#f79e1b', opacity: 0.8, marginLeft: '-8px' }} />
                  </div>
                )}
                {!cardType && (
                  <svg width="22" height="22" fill="none" stroke="#ccc" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                )}
              </div>
            </div>
          </div>

          {/* Expiry & CVV row */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#555', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Expiry Date
              </label>
              <input
                type="text"
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value.replace('/', '')))}
                maxLength={5}
                style={{
                  width: '100%', padding: '0.85rem 1rem', border: '2px solid #e8e8ee', borderRadius: '0.85rem',
                  fontSize: '0.95rem', fontWeight: '600', color: '#1a1a2e', outline: 'none', letterSpacing: '0.15em',
                  transition: 'border 0.2s', boxSizing: 'border-box', background: '#fafafe', textAlign: 'center',
                }}
                onFocus={(e) => e.target.style.borderColor = '#635BFF'}
                onBlur={(e) => e.target.style.borderColor = '#e8e8ee'}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#555', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                CVV
              </label>
              <input
                type="password"
                placeholder="•••"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
                maxLength={4}
                style={{
                  width: '100%', padding: '0.85rem 1rem', border: '2px solid #e8e8ee', borderRadius: '0.85rem',
                  fontSize: '0.95rem', fontWeight: '600', color: '#1a1a2e', outline: 'none', letterSpacing: '0.25em',
                  transition: 'border 0.2s', boxSizing: 'border-box', background: '#fafafe', textAlign: 'center',
                }}
                onFocus={(e) => e.target.style.borderColor = '#635BFF'}
                onBlur={(e) => e.target.style.borderColor = '#e8e8ee'}
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              padding: '0.85rem 1rem', background: '#fff0f0', border: '1px solid #ffe0e0',
              color: '#cc3333', borderRadius: '0.85rem', fontSize: '0.85rem', fontWeight: '600',
              marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}>
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          {/* Pay button */}
          <button
            type="submit"
            disabled={!isFormValid() || loading || !orderId}
            style={{
              width: '100%', height: '56px', background: isFormValid() && !loading ? 'linear-gradient(135deg, #635BFF 0%, #8B85FF 100%)' : '#ccc',
              color: '#fff', fontWeight: '900', fontSize: '1rem', border: 'none', borderRadius: '1rem',
              cursor: isFormValid() && !loading ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
              transition: 'all 0.3s', boxShadow: isFormValid() ? '0 8px 25px -5px rgba(99,91,255,0.4)' : 'none',
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite',
                }} />
                Processing Payment...
              </>
            ) : (
              <>
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Pay LKR {amount.toLocaleString()}.00
              </>
            )}
          </button>

          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>

          {/* Cancel */}
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            style={{
              width: '100%', padding: '1rem', background: 'transparent', border: 'none',
              color: '#888', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer',
              marginTop: '0.5rem',
            }}
          >
            Cancel and return
          </button>

          {/* Security badge */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            marginTop: '1rem', opacity: 0.4,
          }}>
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span style={{ fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#999' }}>
              Secured with 256-bit SSL encryption
            </span>
          </div>
        </form>
      )}
    </div>
  );
};

export default PaymentCheckout;
