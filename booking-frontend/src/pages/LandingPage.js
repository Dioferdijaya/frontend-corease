// src/pages/LandingPage.jsx
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../config";
import "./LandingPage.css";

export default function LandingPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [fields, setFields] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    date: new Date().toISOString().split('T')[0],
    start_time: '08:00',
    end_time: '09:00'
  });

  // Hitung total harga berdasarkan durasi
  const calculateTotalPrice = () => {
    if (!selectedField || !bookingForm.start_time || !bookingForm.end_time) return 0;
    
    const start = new Date(`2000-01-01 ${bookingForm.start_time}`);
    const end = new Date(`2000-01-01 ${bookingForm.end_time}`);
    const durationHours = (end - start) / (1000 * 60 * 60);
    
    if (durationHours <= 0) return 0;
    
    return durationHours * (selectedField.price_per_hour || 0);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Fetch fields from backend
    axios.get(`${API_URL}/fields`)
      .then(res => setFields(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const handleBookNow = (field) => {
    if (!user) {
      alert('Silakan login terlebih dahulu untuk melakukan booking!');
      navigate('/login');
      return;
    }
    setSelectedField(field);
    setShowBookingModal(true);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!user || !selectedField) return;

    const bookingData = {
      user_id: user.id,
      field_id: selectedField.id,
      date: bookingForm.date,
      start_time: bookingForm.start_time + ':00',
      end_time: bookingForm.end_time + ':00'
    };

    try {
      const res = await axios.post(`${API_URL}/book`, bookingData);
      const booking = res.data.booking;
      
      // Tutup modal
      setShowBookingModal(false);
      
      // Tampilkan konfirmasi
      const confirmPayment = window.confirm(
        `Booking berhasil dibuat!\n\nTotal: Rp ${booking.total_price?.toLocaleString('id-ID')}\n\nLanjut ke pembayaran?`
      );
      
      if (confirmPayment) {
        // Redirect ke halaman pembayaran dengan data booking
        navigate('/payment', { 
          state: { 
            booking: {
              id: booking.id,
              field_name: selectedField.name,
              date: bookingData.date,
              start_time: bookingData.start_time,
              end_time: bookingData.end_time,
              total_price: booking.total_price
            }
          } 
        });
      } else {
        alert('Anda bisa melakukan pembayaran nanti di halaman Profil.');
        navigate('/profile');
      }
      
      // Reset form
      setBookingForm({
        date: new Date().toISOString().split('T')[0],
        start_time: '08:00',
        end_time: '09:00'
      });
    } catch (err) {
      alert(err.response?.data?.error || err.response?.data?.message || 'Booking gagal!');
    }
  };
  return (
    <div className="landing-page">
      {/* Header/Navigation */}
      <header className="landing-header">
        <div className="container">
          <div className="logo">
            <span className="logo-text">COURSTEASE</span>
          </div>
          <button 
            className="mobile-menu-toggle" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
          <nav className={`main-nav ${mobileMenuOpen ? 'active' : ''}`}>
            <a href="#home" onClick={() => setMobileMenuOpen(false)}>Beranda</a>
            <a href="#featured" onClick={() => setMobileMenuOpen(false)}>Unggulan</a>
            <a href="#fields" onClick={() => setMobileMenuOpen(false)}>Lapangan Kami</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)}>Kontak</a>
            {user ? (
              <>
                {user.role === 'admin' && (
                  <>
                    <Link to="/admin/bookings" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Panel Admin</Link>
                    <Link to="/admin/chat" className="nav-link" onClick={() => setMobileMenuOpen(false)}>💬 Chat</Link>
                  </>
                )}
                <Link to="/profile" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Booking Saya</Link>
                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="nav-cta logout-btn">Keluar</button>
              </>
            ) : (
              <div className="auth-links">
                <Link
                  to="/login"
                  className="nav-cta"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Masuk
                </Link>

                <span className="auth-separator"> atau </span>

                <Link
                  to="/register"
                  className="nav-cta"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Daftar
                </Link>
              </div>
            )
          }
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section" id="home">
        <div className="hero-overlay">
          <div className="container">
            <div className="hero-content">
              <h1 className="hero-title">Nikmati Lapangan Terbaik!</h1>
              <p className="hero-subtitle">
                Rasakan lapangan futsal berkualitas kejuaraan yang<br />
                menghadirkan atmosfer terbaik di setiap permainan!
              </p>
              <a href="#fields" className="hero-btn">Booking Sekarang</a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="featured-section" id="featured">
        <div className="container">
          <div className="featured-content">
            <div className="featured-text">
              <span className="section-label">UNGGULAN</span>
              <h2 className="section-title">Mengapa Memilih Kami?</h2>
              <p className="section-description">
                Temukan tempat lahirnya para legenda. Fasilitas tradisional namun modern kami 
                menawarkan perpaduan sempurna antara pengalaman futsal autentik dengan 
                fasilitas kelas dunia. Setiap lapangan dirawat dengan teliti untuk menghadirkan 
                permukaan bermain berkualitas kejuaraan yang menginspirasi performa terbaik.
              </p>
              <button className="learn-more-btn">Lihat Galeri</button>
            </div>
            <div className="featured-image">
              <img 
                src="https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=800" 
                alt="Featured Field" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Fields Grid Section */}
      <section className="fields-section" id="fields">
        <div className="container">
          <h2 className="section-main-title">Lapangan Premium Kami</h2>
          <div className="fields-grid">
            {fields.length > 0 ? (
              fields.map((field) => (
                <div key={field.id} className="field-card">
                  <div className="field-image">
                    <img 
                      src="https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=500" 
                      alt={field.name} 
                    />
                  </div>
                  <div className="field-info">
                    <h3>{field.name}</h3>
                    <p>{field.type || 'Lapangan futsal berkualitas profesional dengan fasilitas lengkap'}</p>
                    <span className="field-price">Rp {field.price_per_hour?.toLocaleString('id-ID')}/jam</span>
                    <button 
                      onClick={() => handleBookNow(field)} 
                      className="field-btn"
                    >
                      {user ? 'Booking Sekarang' : 'Login untuk Booking'}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>Memuat lapangan...</p>
            )}
          </div>
        </div>
      </section>

      {/* Hours Section */}
      <section className="hours-section" id="contact">
        <div className="container">
          <div className="hours-content">
            <div className="hours-text">
              <h2>Promo Pagi Hari</h2>
              <p className="hours-offer">
                Dapatkan tambahan 30 menit GRATIS saat booking<br />
                antara pukul 07:00 - 10:00 di hari kerja
              </p>
              <p className="hours-details">
                ⚽ PAGI HARI: Semua Fasilitas Premium Tersedia<br />
                🌟 SPESIAL WEEKDAY: Diskon 50% untuk jam kedua<br />
                🎯 SIANG HARI: Harga spesial pukul 14:00 - 17:00
              </p>
              <div className="contact-info">
                <div className="contact-item">
                  <span className="contact-icon">📞</span>
                  <span>+62 812-3456-7890</span>
                </div>
                <div className="contact-item">
                  <span className="contact-icon">📍</span>
                  <span>Lokasi</span>
                </div>
              </div>
            </div>
            <div className="hours-images">
              <img 
                src="https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=400" 
                alt="Futsal Ball" 
                className="hours-img-1"
              />
              <img 
                src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=400" 
                alt="Field View" 
                className="hours-img-2"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {showBookingModal && selectedField && (
        <div className="booking-modal-overlay" onClick={() => setShowBookingModal(false)}>
          <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowBookingModal(false)}>×</button>
            <h2>Booking {selectedField.name}</h2>
            <p className="modal-price">Rp {selectedField.price_per_hour?.toLocaleString('id-ID')}/jam</p>
            <form onSubmit={handleBookingSubmit}>
              <div className="form-group">
                <label>Tanggal</label>
                <input
                  type="date"
                  value={bookingForm.date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setBookingForm({...bookingForm, date: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Jam Mulai</label>
                <input
                  type="time"
                  value={bookingForm.start_time}
                  onChange={(e) => setBookingForm({...bookingForm, start_time: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Jam Selesai</label>
                <input
                  type="time"
                  value={bookingForm.end_time}
                  onChange={(e) => setBookingForm({...bookingForm, end_time: e.target.value})}
                  required
                />
              </div>
              
              {/* Tampilkan Total Harga */}
              <div className="booking-summary">
                <div className="summary-row">
                  <span>Durasi:</span>
                  <span>{(() => {
                    const start = new Date(`2000-01-01 ${bookingForm.start_time}`);
                    const end = new Date(`2000-01-01 ${bookingForm.end_time}`);
                    const hours = (end - start) / (1000 * 60 * 60);
                    return hours > 0 ? `${hours} jam` : '-';
                  })()}</span>
                </div>
                <div className="summary-row total">
                  <span>Total Harga:</span>
                  <span className="total-price">Rp {calculateTotalPrice().toLocaleString('id-ID')}</span>
                </div>
              </div>
              
              <button type="submit" className="modal-submit-btn">Lanjut ke Pembayaran</button>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-left">
              <div className="footer-logo">
                <span className="logo-text">COURSTEASE</span>
              </div>
              <p className="footer-tagline">Destinasi Futsal Premier Anda</p>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h4>Tautan Cepat</h4>
                <a href="#home">Beranda</a>
                <a href="#featured">Tentang Kami</a>
                <a href="#fields">Lapangan Kami</a>
                <a href="#contact">Kontak</a>
              </div>
              <div className="footer-column">
                <h4>Layanan</h4>
                <Link to="/register">Booking Lapangan</Link>
                <a href="#fields">Galeri Lapangan</a>
                <a href="#contact">Promo Pagi</a>
                <Link to="/login">Login Member</Link>
              </div>
              <div className="footer-column">
                <h4>Contact</h4>
                <p>📞 +62 812-3456-7890</p>
                <p>📧 info@courstease.com</p>
                <p>📍 Aceh, Indonesia</p>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Dio Ferdi Jaya & Randy Maulana. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
