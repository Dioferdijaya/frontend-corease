// src/pages/PaymentSuccess.js
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API_URL from "../config";


import axios from "axios";
import "./PaymentSuccess.css";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('booking_id');
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookingId) {
      checkPaymentStatus();
    }
  }, [bookingId]);

  const checkPaymentStatus = async () => {
    try {
      const res = await axios.get(`${API_URL}/payment/status/${bookingId}`);
      setPaymentStatus(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleBackToProfile = () => {
    navigate("/profile");
  };

  if (loading) {
    return (
      <div className="payment-success-container">
        <div className="payment-success-card">
          <div className="loading-spinner"></div>
          <p>Memuat status pembayaran...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-success-container">
      <div className="payment-success-card">
        {paymentStatus?.payment_status === 'paid' ? (
          <>
            <div className="success-icon">✓</div>
            <h1 className="success-title">Pembayaran Berhasil!</h1>
            <p className="success-message">
              Terima kasih! Pembayaran Anda telah diterima.
            </p>
            <div className="payment-details">
              <p><strong>Total Pembayaran:</strong> Rp {paymentStatus.total_price?.toLocaleString('id-ID')}</p>
              <p><strong>Status:</strong> <span className="status-paid">Lunas</span></p>
            </div>
          </>
        ) : (
          <>
            <div className="pending-icon">⏱</div>
            <h1 className="pending-title">Menunggu Pembayaran</h1>
            <p className="pending-message">
              Pembayaran Anda masih dalam proses. Silakan selesaikan pembayaran melalui link yang diberikan.
            </p>
            {paymentStatus?.payment_url && (
              <a 
                href={paymentStatus.payment_url} 
                className="btn-continue-payment"
                target="_blank"
                rel="noopener noreferrer"
              >
                Lanjutkan Pembayaran
              </a>
            )}
          </>
        )}
        <button onClick={handleBackToProfile} className="btn-back-profile">
          Kembali ke Profil
        </button>
      </div>
    </div>
  );
}
