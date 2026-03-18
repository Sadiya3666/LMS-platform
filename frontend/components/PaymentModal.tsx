import React, { useState } from 'react';

interface PaymentModalProps {
  subject: any;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PaymentModal({ subject, onClose, onSuccess }: PaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [cardData, setCardData] = useState({
    name: '',
    card_number: '',
    expiry: '',
    cvv: ''
  });

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // 1. Create checkout to get transaction ID
      // If we don't have apiClient here directly, we use fetch or a prop.
      // Easiest is to import apiClient since it's a client component.
      const apiClient = require('@/lib/apiClient').default;
      
      const sessionRes = await apiClient.post('/api/payments/checkout', { subjectId: subject.id });
      
      if (sessionRes.data.enrolled) {
        setSuccess(true);
        setTimeout(onSuccess, 1500);
        return;
      }

      const txnId = sessionRes.data.payment.transaction_id;

      // 2. Confirm payment
      await apiClient.post('/api/payments/confirm', {
        transaction_id: txnId,
        ...cardData
      });

      setSuccess(true);
      setTimeout(onSuccess, 1500);

    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Payment failed');
    } finally {
      if (!success) setLoading(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(10px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.08)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: '24px',
        padding: '40px',
        width: '100%',
        maxWidth: '480px',
        boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
        position: 'relative'
      }}>
        {/* Watermark overlay */}
        <div style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%) rotate(-30deg)',
            fontSize: '4rem',
            fontWeight: 900,
            color: 'rgba(255,255,255,0.05)',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            zIndex: 0
        }}>
            DEMO PAYMENT
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>
                Complete Payment
            </h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <span style={{ color: 'rgba(255,255,255,0.7)' }}>{subject.title}</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#4ade80' }}>
                    ₹{subject.price / 100}
                </span>
            </div>

            <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', marginBottom: '24px' }} />

            {success ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <div style={{ 
                        width: '60px', height: '60px', 
                        background: 'linear-gradient(135deg, #4ade80, #16a34a)',
                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 20px', fontSize: '2rem',
                        boxShadow: '0 0 30px rgba(74, 222, 128, 0.4)'
                    }}>✓</div>
                    <h3 style={{ fontSize: '1.2rem', color: '#4ade80', marginBottom: '10px' }}>Payment Successful!</h3>
                    <p style={{ color: 'rgba(255,255,255,0.7)' }}>Redirecting to course...</p>
                </div>
            ) : (
                <form onSubmit={handlePay}>
                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>Cardholder Name</label>
                        <input required value={cardData.name} onChange={(e) => setCardData({...cardData, name: e.target.value})} type="text" style={inputStyle} placeholder="John Doe" />
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>Card Number</label>
                        <input required value={cardData.card_number} onChange={(e) => setCardData({...cardData, card_number: formatCardNumber(e.target.value)})} type="text" maxLength={19} style={inputStyle} placeholder="XXXX XXXX XXXX XXXX" />
                    </div>

                    <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>Expiry</label>
                            <input required value={cardData.expiry} onChange={(e) => setCardData({...cardData, expiry: e.target.value})} type="text" maxLength={5} style={inputStyle} placeholder="MM/YY" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>CVV</label>
                            <input required value={cardData.cvv} onChange={(e) => setCardData({...cardData, cvv: e.target.value})} type="text" maxLength={4} style={inputStyle} placeholder="123" />
                        </div>
                    </div>

                    {error && (
                        <div style={{ padding: '12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: '#fca5a5', marginBottom: '24px', fontSize: '0.9rem' }}>
                            {error}
                        </div>
                    )}

                    <div style={{ padding: '12px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '8px', color: '#93c5fd', marginBottom: '24px', fontSize: '0.8rem' }}>
                        ✅ Any valid card number simulates success.<br/>
                        ❌ Use <strong>0000 0000 0000 0000</strong> to test decline.
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button type="button" onClick={onClose} style={{
                            flex: 1, padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: 'white', cursor: 'pointer', transition: 'all 0.2s', fontWeight: 600
                        }}>
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} style={{
                            flex: 2, padding: '12px', background: 'linear-gradient(135deg,#7c3aed,#6d28d9)', border: 'none', borderRadius: '12px', color: 'white', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s', fontWeight: 600, boxShadow: '0 4px 15px rgba(124,58,237,0.4)'
                        }}>
                            {loading ? 'Processing...' : `Pay ₹${subject.price / 100}`}
                        </button>
                    </div>
                </form>
            )}
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '12px',
    color: 'white',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.2s ease',
};
