// src/pages/PaymentPage.js
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API_URL from "../config";


import axios from "axios";
import "./PaymentPage.css";

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingData = location.state?.booking;
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentMethods] = useState([
    { id: 'qris', name: 'QRIS', icon: '📱', description: 'Scan QR Code' },
    { id: 'gopay', name: 'GoPay', icon: '💚', description: 'E-Wallet GoPay' },
    { id: 'ovo', name: 'OVO', icon: '💜', description: 'E-Wallet OVO' },
    { id: 'dana', name: 'DANA', icon: '💙', description: 'E-Wallet DANA' },
    { id: 'bank_transfer', name: 'Transfer Bank', icon: '🏦', description: 'BCA, BNI, Mandiri, BRI' },
  ]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }
    setUser(JSON.parse(storedUser));

    if (!bookingData) {
      alert('Data booking tidak ditemukan');
      navigate('/profile');
    }
  }, [navigate, bookingData]);

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!paymentMethod) {
      alert('Silakan pilih metode pembayaran');
      return;
    }

    setLoading(true);
    
    try {
      const paymentRes = await axios.post(`${API_URL}/payment/create`, {
        booking_id: bookingData.id,
        user_email: user.email,
        user_name: user.name,
        payment_method: paymentMethod,
        phone_number: phoneNumber
      });
      
      if (paymentRes.data.success) {
        // Redirect ke halaman pembayaran Mayar.id
        window.location.href = paymentRes.data.payment_url;
      }
    } catch (err) {
      console.error('Payment error:', err);
      alert('Gagal membuat pembayaran: ' + (err.response?.data?.details || err.message));
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/profile');
  };

  if (!bookingData) return null;

  return (
    <div className="payment-page">
      <div className="payment-container">
        {/* Header */}
        <div className="payment-header">
          <button onClick={handleCancel} className="back-button">← Kembali</button>
          <h1>Pembayaran</h1>
        </div>

        <div className="payment-content">
          {/* Booking Summary */}
          <div className="booking-summary-card">
            <h2>Detail Booking</h2>
            <div className="summary-details">
              <div className="summary-row">
                <span className="label">Lapangan:</span>
                <span className="value">{bookingData.field_name}</span>
              </div>
              <div className="summary-row">
                <span className="label">Tanggal:</span>
                <span className="value">{new Date(bookingData.date).toLocaleDateString('id-ID', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div className="summary-row">
                <span className="label">Waktu:</span>
                <span className="value">
                  {bookingData.start_time?.substring(0, 5)} - {bookingData.end_time?.substring(0, 5)}
                </span>
              </div>
              <div className="summary-row">
                <span className="label">Durasi:</span>
                <span className="value">
                  {(() => {
                    const start = new Date(`2000-01-01 ${bookingData.start_time}`);
                    const end = new Date(`2000-01-01 ${bookingData.end_time}`);
                    const hours = (end - start) / (1000 * 60 * 60);
                    return `${hours} jam`;
                  })()}
                </span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row total-row">
                <span className="label">Total Pembayaran:</span>
                <span className="value total-price">
                  Rp {bookingData.total_price?.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="payment-form-card">
            <h2>Pilih Metode Pembayaran</h2>
            <form onSubmit={handlePayment}>
              <div className="payment-methods">
                {paymentMethods.map((method) => (
                  <label key={method.id} className={`payment-method-option ${paymentMethod === method.id ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="payment_method"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div className="method-content">
                      <span className="method-icon">{method.icon}</span>
                      <div className="method-info">
                        <span className="method-name">{method.name}</span>
                        <span className="method-desc">{method.description}</span>
                      </div>
                    </div>
                    <span className="checkmark">✓</span>
                  </label>
                ))}
              </div>

              {(paymentMethod === 'gopay' || paymentMethod === 'ovo' || paymentMethod === 'dana') && (
                <div className="phone-input-group">
                  <label>Nomor Telepon</label>
                  <input
                    type="tel"
                    placeholder="08xxxxxxxxxx"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    pattern="[0-9]{10,13}"
                  />
                  <small>Masukkan nomor yang terdaftar di {paymentMethod.toUpperCase()}</small>
                </div>
              )}

              <div className="payment-actions">
                <button 
                  type="button" 
                  onClick={handleCancel} 
                  className="btn-cancel"
                  disabled={loading}
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="btn-pay"
                  disabled={loading}
                >
                  {loading ? 'Memproses...' : 'Bayar Sekarang'}
                </button>
              </div>
            </form>

            <div className="payment-security">
              <span className="security-icon">🔒</span>
              <span>Pembayaran aman dengan Mayar.id</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
