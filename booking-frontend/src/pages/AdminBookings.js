// src/pages/AdminBookings.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_URL from "../config";


import "./AdminBookings.css";

export default function AdminBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(storedUser);

    if (user.role !== "admin") {
      alert("Hanya admin yang bisa mengakses halaman ini!");
      navigate("/");
      return;
    }

    fetchBookings(user.token);
  }, [navigate]);

  const fetchBookings = async (token) => {
    try {
      const res = await axios.get(`${API_URL}/admin/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data);
    } catch (err) {
      console.error(err);
      alert("Gagal mengambil booking");
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    try {
      await axios.patch(
        `${API_URL}/admin/bookings/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${storedUser.token}` } }
      );

      setBookings(
        bookings.map((b) =>
          b.id === id ? { ...b, status: newStatus } : b
        )
      );
      alert(`Status booking berhasil diupdate menjadi ${newStatus}`);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Gagal update status");
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <div className="admin-bookings-container">
      <div className="admin-header">
        <button onClick={handleBackToHome} className="back-btn-admin">← Back to Home</button>
        <h1 className="admin-bookings-title">Booking Management</h1>
      </div>
      {bookings.length === 0 ? (
        <p className="no-bookings-admin">Belum ada data booking yang masuk.</p>
      ) : (
        <div className="bookings-grid">
          {bookings.map((b) => (
            <div key={b.id} className="booking-card-admin">
              <div className="booking-details-admin">
                <h3>{b.field_name} ({b.field_type})</h3>
                <p><strong>Tanggal:</strong> {formatDate(b.date)}</p>
                <p><strong>Jam:</strong> {b.start_time.substring(0, 5)} - {b.end_time.substring(0, 5)}</p>
                <p><strong>Harga/jam:</strong> Rp{b.price_per_hour?.toLocaleString('id-ID')}</p>
                {b.total_price && (
                  <p><strong>Total Harga:</strong> Rp{b.total_price?.toLocaleString('id-ID')}</p>
                )}
                <p className="user-info">
                  <strong>User:</strong> {b.user_name} ({b.user_email})
                </p>
                
                {/* Status Pembayaran */}
                <p className="payment-status-line">
                  <strong>Pembayaran:</strong>
                  <span className={`payment-badge payment-${b.payment_status || 'unpaid'}`}>
                    {b.payment_status === 'paid' ? '✓ Lunas' : 
                     b.payment_status === 'pending' ? '⏱ Pending' : 
                     '✗ Belum Bayar'}
                  </span>
                </p>
                
                {/* Status Booking */}
                <p className="status-line">
                  <strong>Status Booking:</strong>
                  <span className={`status-text status-${b.status}`}>
                    {b.payment_status !== 'paid' && b.status === 'pending' ? 'Menunggu Pembayaran' :
                     b.status === 'confirmed' ? 'Terkonfirmasi' :
                     b.status === 'completed' ? 'Selesai' :
                     b.status === 'cancelled' ? 'Dibatalkan' :
                     b.status === 'rejected' ? 'Ditolak' : b.status}
                  </span>
                </p>
              </div>

              {/* Action Buttons - Hanya untuk booking yang sudah dibayar */}
              {b.payment_status === 'paid' && b.status === 'confirmed' && (
                <div className="action-buttons">
                  <button
                    onClick={() => handleUpdateStatus(b.id, "completed")}
                    className="action-btn btn-complete"
                  >
                    Tandai Selesai
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(b.id, "cancelled")}
                    className="action-btn btn-reject"
                  >
                    Batalkan
                  </button>
                </div>
              )}
              
              {/* Peringatan jika belum bayar */}
              {b.payment_status !== 'paid' && (
                <div className="warning-message">
                  ⚠️ Menunggu pembayaran dari user
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
