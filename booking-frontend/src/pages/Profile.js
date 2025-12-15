// src/pages/Profile.jsx
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import API_URL from "../config";


import ChatBox from "./ChatBox";
import "./Profile.css";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    username: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }

    const userData = JSON.parse(storedUser);
    setUser(userData);
    setEditForm({
      name: userData.name || '',
      username: userData.username || '',
      phone: userData.phone || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });

    // Ambil booking user
    axios
      .get(`${API_URL}/bookings?user_id=${userData.id}`)
      .then((res) => setBookings(res.data))
      .catch((err) => console.error("Gagal ambil booking:", err));
  }, [navigate]);

  const handleBackToHome = () => {
    navigate("/");
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setEditForm({
        name: user.name || '',
        username: user.username || '',
        phone: user.phone || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  };

  const handleInputChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    
    // Validasi password jika ingin mengubah
    if (editForm.newPassword) {
      if (editForm.newPassword !== editForm.confirmPassword) {
        alert('Password baru dan konfirmasi password tidak sama!');
        return;
      }
      if (!editForm.currentPassword) {
        alert('Masukkan password lama untuk mengubah password!');
        return;
      }
    }

    try {
      const updateData = {
        name: editForm.name,
        username: editForm.username,
        phone: editForm.phone
      };

      if (editForm.newPassword) {
        updateData.currentPassword = editForm.currentPassword;
        updateData.newPassword = editForm.newPassword;
      }

      const res = await axios.put(
        `${API_URL}/user/${user.id}`,
        updateData
      );

      // Update localStorage dan state
      const updatedUser = { ...user, ...res.data.user };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);
      alert('Profil berhasil diperbarui!');
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal memperbarui profil!');
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const getStatusClass = (status, paymentStatus) => {
    if (status === 'pending' && paymentStatus !== 'paid') {
      return 'waiting-payment';
    }
    return (status || "pending").toLowerCase().replace('_', '-');
  };

  const getStatusText = (status, paymentStatus) => {
    if (status === 'pending' && paymentStatus !== 'paid') {
      return 'Menunggu Pembayaran';
    }
    const statusMap = {
      'confirmed': 'Terkonfirmasi',
      'completed': 'Selesai',
      'cancelled': 'Dibatalkan',
      'rejected': 'Ditolak',
      'pending': 'Pending'
    };
    return statusMap[status] || status;
  };

  const handlePayment = async (booking) => {
    // Redirect ke halaman pembayaran dengan data booking
    navigate('/payment', { 
      state: { 
        booking: booking
      } 
    });
  };

  const handleOpenChat = (booking) => {
    setSelectedBooking(booking);
    setShowChat(true);
  };

  const handleCloseChat = () => {
    setShowChat(false);
    setSelectedBooking(null);
  };

  return (
    <div className="profile-page">
      <div className="profile-container-new">
        {/* Left Side - Profile Card */}
        <div className="profile-left-section">
          <div className="profile-card-yellow">
            <div className="profile-avatar-large">
              <span className="avatar-icon-large">👤</span>
            </div>
            <h2 className="profile-welcome">Siapkan Profil Anda</h2>
            <p className="profile-subtitle">
              Hanya perlu beberapa menit untuk<br />
              memperbarui profil Anda
            </p>
            <button onClick={handleBackToHome} className="profile-back-btn">
              ← Kembali ke Beranda
            </button>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="profile-right-section">
          <form onSubmit={handleSaveProfile} className="profile-form-new">
            <div className="form-group-profile">
              <label>Nama Lengkap</label>
              <input
                type="text"
                name="name"
                value={editForm.name}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Masukkan nama lengkap"
                required
              />
            </div>

            <div className="form-group-profile">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={editForm.username}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="@username"
              />
            </div>

            <div className="form-group-profile">
              <label>Email</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                placeholder="email@example.com"
              />
            </div>

            <div className="form-group-profile">
              <label>Nomor Telepon</label>
              <input
                type="tel"
                name="phone"
                value={editForm.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="+62 812 3456 7890"
              />
            </div>

            {isEditing && (
              <>
                <div className="form-group-profile">
                  <label>Password Saat Ini</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={editForm.currentPassword}
                    onChange={handleInputChange}
                    placeholder="Masukkan password saat ini"
                  />
                </div>

                <div className="form-group-profile">
                  <label>Password Baru</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={editForm.newPassword}
                    onChange={handleInputChange}
                    placeholder="Masukkan password baru"
                  />
                </div>

                <div className="form-group-profile">
                  <label>Konfirmasi Password Baru</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={editForm.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Konfirmasi password baru"
                  />
                </div>
              </>
            )}

            <div className="form-actions">
              {isEditing ? (
                <>
                  <button type="button" onClick={handleEditToggle} className="btn-cancel">
                    BATAL
                  </button>
                  <button type="submit" className="btn-save">
                    SIMPAN
                  </button>
                </>
              ) : (
                <button type="button" onClick={handleEditToggle} className="btn-edit">
                  EDIT PROFIL
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Booking History Section */}
      <div className="booking-history-section">
        <h2 className="booking-history-title">Riwayat Booking</h2>
        <div className="booking-list-container">
          {bookings.length > 0 ? (
            <ul className="booking-list">
              {bookings.map((b) => (
                <li key={b.id} className="booking-item">
                  <div className="booking-info">
                    <span className="field-name">{b.field_name}</span>
                    <span className="booking-date">{formatDate(b.date)} | {b.start_time.substring(0, 5)} - {b.end_time.substring(0, 5)}</span>
                    {b.total_price && (
                      <span className="booking-price">Rp {b.total_price.toLocaleString('id-ID')}</span>
                    )}
                  </div>
                  <div className="booking-actions">
                    <span className={`status-badge ${getStatusClass(b.status, b.payment_status)}`}>
                      {getStatusText(b.status, b.payment_status)}
                    </span>
                    <button 
                      onClick={() => handleOpenChat(b)} 
                      className="btn-chat"
                      title="Chat dengan Admin"
                    >
                      💬 Chat
                    </button>
                    {b.payment_status === 'unpaid' && (
                      <button 
                        onClick={() => handlePayment(b)} 
                        className="btn-pay"
                      >
                        Bayar Sekarang
                      </button>
                    )}
                    {b.payment_status === 'pending' && (
                      <span className="payment-pending">Menunggu Pembayaran</span>
                    )}
                    {b.payment_status === 'paid' && (
                      <span className="payment-paid">✓ Lunas</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="no-bookings">
              <p>Anda belum memiliki riwayat booking.</p>
              <Link to="/#fields" className="book-now-link">Booking sekarang!</Link>
            </div>
          )}
        </div>
      </div>

      {/* Chat Modal */}
      {showChat && selectedBooking && (
        <ChatBox 
          booking={selectedBooking} 
          user={user} 
          onClose={handleCloseChat}
        />
      )}
    </div>
  );
}
