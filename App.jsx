import React, { useState, useEffect } from 'react';
import './App.css';

const initialProducts = [
  {
    id: 1,
    name: 'Obsidian Hoodie',
    price: 2999,
    category: 'hoodies',
    image: 'https://images.unsplash.com/photo-1556821552-5f0dc49bfe5d?w=500&h=600&fit=crop',
    desc: 'Premium black hoodie crafted from 100% organic cotton blend.',
  },
  {
    id: 2,
    name: 'Inferno Tee',
    price: 1499,
    category: 'tees',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=600&fit=crop',
    desc: 'Bold orange crew neck tee with premium print quality.',
  },
  {
    id: 3,
    name: 'Minimalist Sneakers',
    price: 3999,
    category: 'shoes',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=600&fit=crop',
    desc: 'Clean minimalist sneakers with premium leather upper.',
  }
];

const ADMIN_PASSWORD = 'admin123';

export default function App() {
  const [view, setView] = useState('home');
  const [products, setProducts] = useState(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [orders, setOrders] = useState([]);
  const [notification, setNotification] = useState('');
  const [myCustomerId, setMyCustomerId] = useState(() => 'CUST-' + Math.floor(Math.random() * 90000 + 10000));
  const [testimonials, setTestimonials] = useState([]);
  const [cartBump, setCartBump] = useState(false);

  useEffect(() => {
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.async = true;
    document.body.appendChild(s);
    return () => document.body.removeChild(s);
  }, []);

  const notify = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const addToCart = (p) => {
    setCart((c) => [...c, p]);
    setCartBump(true);
    setTimeout(() => setCartBump(false), 600);
    notify(`${p.name} added to cart`);
  };

  const handleBuyNow = (p) => {
    setSelectedProduct(p);
    setView('payment');
  };

  const handleRazorpay = () => {
    if (!window.Razorpay || !selectedProduct) {
      alert('Payment not available');
      return;
    }
    const options = {
      key: 'rzp_test_1DP5mmOlF23Z58',
      amount: selectedProduct.price * 100,
      currency: 'INR',
      name: 'SANBAE',
      description: selectedProduct.name,
      handler: function (res) {
        const id = 'SAN-' + Math.floor(Math.random() * 90000 + 10000);
        const newOrder = {
          id,
          product: selectedProduct.name,
          amount: selectedProduct.price,
          status: 'Confirmed',
          customerId: myCustomerId,
          customerName: 'Guest',
          history: [{ ts: Date.now(), status: 'Paid via Razorpay' }]
        };
        setOrders((o) => [newOrder, ...o]);
        notify(`Payment successful: ${id}`);
        setView('home');
      }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setView('admin');
      notify('Admin logged in');
    } else {
      notify('Invalid password');
    }
    setAdminPassword('');
  };

  const verifyOrder = (id) => {
    setOrders((s) => s.map(o => o.id === id ? { ...o, status: 'Confirmed', history: [...o.history, { ts: Date.now(), status: 'Confirmed by Admin' }] } : o));
    notify(`Order ${id} confirmed`);
  };

  const updateOrderStatus = (id, statusLabel) => {
    setOrders((s) => s.map(o => o.id === id ? { ...o, status: statusLabel, history: [...o.history, { ts: Date.now(), status: statusLabel }] } : o));
    notify(`Order ${id} updated: ${statusLabel}`);
  };

  const addTestimonial = ({ name, text, rating }) => {
    const t = { id: testimonials.length + 1, name, text, rating };
    setTestimonials((s) => [t, ...s]);
    notify('Thanks for your feedback');
  };

  const adminDeleteTestimonial = (id) => {
    setTestimonials((s) => s.filter(t => t.id !== id));
    notify('Testimonial removed');
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const price = parseInt(form.price.value || '0', 10);
    const image = form.image.value.trim();
    if (!name || !price) return notify('Fill product name and price');
    const newP = { id: products.length + 1, name, price, category: form.category.value, image, desc: form.desc.value };
    setProducts((p) => [newP, ...p]);
    form.reset();
    notify('Product added');
  };

  // Manual UPI payment flow (upload screenshot)
  const submitManualPayment = ({ product, amount, name, phone, upiId, file }) => {
    const id = 'SAN-' + Math.floor(Math.random() * 90000 + 10000);
    const screenshot = file ? URL.createObjectURL(file) : null;
    const newOrder = {
      id,
      product: product.name,
      amount,
      status: 'Payment Submitted',
      customerId: myCustomerId,
      customerName: name || 'Guest',
      customerPhone: phone || '',
      upi: upiId || '',
      screenshot,
      screenshotName: file ? file.name : '',
      history: [{ ts: Date.now(), status: 'Payment Submitted' }]
    };
    setOrders((o) => [newOrder, ...o]);
    notify(`Order submitted: ${id}. Awaiting admin verification.`);
    setView('home');
  };

  const handleRemoveProduct = (id) => {
    setProducts((p) => p.filter(x => x.id !== id));
    notify('Product removed');
  };

  useEffect(() => {
    // global ripple handler for .btn elements
    const handler = (e) => {
      const btn = e.target.closest('.btn');
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const span = document.createElement('span');
      span.className = 'ripple';
      const size = Math.max(rect.width, rect.height);
      span.style.width = span.style.height = size + 'px';
      span.style.left = (e.clientX - rect.left - size / 2) + 'px';
      span.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.appendChild(span);
      setTimeout(() => span.remove(), 650);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  return (
    <div>
      <nav className="nav">
        <div className="logo" onClick={() => { setView('home'); setIsAdmin(false); }}>SANBAE</div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ fontSize: 12, color: '#666' }}>ID: {myCustomerId}</div>
          <button className="btn" onClick={() => setView('home')}>Shop</button>
          <button className="btn cart-btn" onClick={() => setView('cart')}>
            Cart <span className={`cart-badge ${cartBump ? 'bump' : ''}`} style={{ marginLeft: 8 }}>{cart.length}</span>
          </button>
          <button className="btn" onClick={() => setView('my-orders')}>My Orders</button>
          <button className="btn" onClick={() => setView('admin-login')}>Admin</button>
        </div>
      </nav>

      {notification && <div className="notification">{notification}</div>}

      {view === 'home' && (
        <main className="container">
          {/* HERO - clear value proposition and CTA */}
          <section style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 40, alignItems: 'center', marginBottom: 40 }}>
            <div>
              <h1 style={{ fontSize: 42, margin: 0, lineHeight: 1.05 }}>Premium Streetwear — Crafted For You</h1>
              <p style={{ color: '#666', marginTop: 12, fontSize: 18 }}>Curated drops, quality materials, and seamless checkout. Shop limited pieces and enjoy reliable delivery tracking.</p>
              <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                <button className="btn" onClick={() => { setView('home'); window.scrollTo({ top: 600, behavior: 'smooth' }); }}>Shop Now</button>
                <button className="btn secondary" onClick={() => { setView('my-orders'); }}>My Orders</button>
              </div>
              <div style={{ marginTop: 22 }}>
                <input
                  placeholder="Search products, styles or collections"
                  value={''}
                  onChange={() => {}}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid var(--border)' }}
                />
              </div>
            </div>

            <div style={{ background: 'linear-gradient(180deg, rgba(255,107,53,0.06), rgba(16,24,40,0.03))', padding: 18, borderRadius: 12 }}>
              <div style={{ height: 360, borderRadius: 10, overflow: 'hidden', backgroundSize: 'cover', backgroundPosition: 'center', backgroundImage: `url(${products[0].image})` }} />
            </div>
          </section>

          {/* CATEGORIES */}
          <section style={{ display: 'flex', gap: 12, marginBottom: 30, flexWrap: 'wrap' }}>
            {['Hoodies', 'T-Shirts', 'Jackets', 'Shoes', 'Accessories', 'Bags'].map((c) => (
              <button key={c} className="btn" style={{ background: 'transparent', color: 'var(--primary)', border: '1px solid var(--border)', padding: '10px 14px', borderRadius: 10 }}>{c}</button>
            ))}
          </section>

          {/* FEATURED PRODUCTS - show first 4 for clarity */}
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18 }}>
              <h2 style={{ margin: 0 }}>Featured Collection</h2>
              <button className="btn" onClick={() => setView('home')}>View All</button>
            </div>

            <div className="grid">
              {products.slice(0, 4).map(p => (
                <div className="card" key={p.id}>
                  <div className="img-box" style={{ backgroundImage: `url(${p.image})`, height: 300 }} />
                  <div className="card-content">
                    <h3 style={{ marginBottom: 6 }}>{p.name}</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontWeight: 800 }}>₹{p.price}</div>
                      <div style={{ color: '#666' }}>{p.category}</div>
                    </div>
                    <p className="desc" style={{ marginTop: 10 }}>{p.desc}</p>
                    <div className="card-actions" style={{ marginTop: 12 }}>
                                  <button className="btn buy-animate" onClick={() => handleBuyNow(p)}>Buy</button>
                      <button className="btn secondary" onClick={() => addToCart(p)}>Add</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* BENEFITS */}
          <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginTop: 36, marginBottom: 36 }}>
            <div className="admin-form-card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28 }}>🚚</div>
              <h4>Fast, Tracked Delivery</h4>
              <p style={{ color: '#666' }}>Orders confirmed and tracked from warehouse to your doorstep.</p>
            </div>
            <div className="admin-form-card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28 }}>🔁</div>
              <h4>Easy Returns</h4>
              <p style={{ color: '#666' }}>30-day hassle-free returns for eligible items.</p>
            </div>
            <div className="admin-form-card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28 }}>🔒</div>
              <h4>Secure Payments</h4>
              <p style={{ color: '#666' }}>Pay via Razorpay or manual UPI with admin verification.</p>
            </div>
          </section>

          {/* TESTIMONIALS PREVIEW */}
          <section style={{ marginBottom: 40 }}>
            <h3 style={{ marginBottom: 12 }}>What customers say</h3>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {(testimonials.length ? testimonials.slice(0,3) : [
                { id: 1, name: 'Rahul K.', text: 'Amazing quality and fast delivery! Highly recommended.' },
                { id: 2, name: 'Priya S.', text: 'Best streetwear brand in India. Love the premium feel.' },
                { id: 3, name: 'Arjun M.', text: 'Perfect fit and amazing designs. Will buy again!' }
              ]).map(t => (
                <div key={t.id} className="testimonial-card" style={{ flex: '1 1 300px' }}>
                  <div className="stars">★ ★ ★ ★ ★</div>
                  <p className="testimonial-text">"{t.text}"</p>
                  <p className="testimonial-author">- {t.name}</p>
                </div>
              ))}
            </div>
          </section>

          {/* NEWSLETTER */}
          <section className="newsletter-section">
            <div className="newsletter-content">
              <h2>Join Our Newsletter</h2>
              <p>Sign up for early access to new drops and members-only offers.</p>
              <div className="newsletter-form">
                <input type="email" placeholder="Enter your email" />
                <button className="btn secondary">Subscribe</button>
              </div>
            </div>
          </section>
        </main>
      )}

      {view === 'cart' && (
        <div className="container">
          <h2>Cart ({cart.length})</h2>
          {cart.length === 0 ? <p>Your cart is empty</p> : (
            <div>
              {cart.map((it, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                  <img src={it.image} alt="" style={{ width: 80, height: 80, objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <div>{it.name}</div>
                    <div className="price">₹{it.price}</div>
                  </div>
                </div>
              ))}
              <button className="btn" onClick={() => { setSelectedProduct(cart[0]); setView('payment'); }}>Checkout</button>
            </div>
          )}
        </div>
      )}

      {view === 'my-orders' && (
        <div className="container">
          <h2>My Orders</h2>
          {orders.filter(o => o.customerId === myCustomerId).length === 0 ? (
            <p>You have no orders yet.</p>
          ) : (
            <div style={{ display: 'grid', gap: 12 }}>
              {orders.filter(o => o.customerId === myCustomerId).map(o => (
                <div key={o.id} style={{ padding: 12, border: '1px solid #eee', borderRadius: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong>{o.id}</strong> — {o.product}
                      <div style={{ color: '#666' }}>Amount: ₹{o.amount} • Status: {o.status}</div>
                    </div>
                    <div>
                      {o.screenshot && <a href={o.screenshot} target="_blank" rel="noreferrer" className="btn">View Screenshot</a>}
                    </div>
                  </div>
                  {o.status === 'Delivered' ? (
                    <FeedbackForm order={o} onSubmit={(f) => { addTestimonial(f); setOrders((s) => s.map(x => x.id===o.id?{...x, feedback: f.text}:x)); }} />
                  ) : null}
                  <div style={{ marginTop: 8 }}>
                    <details>
                      <summary style={{ cursor: 'pointer', color: '#666' }}>Order History</summary>
                      <ul>
                        {o.history && o.history.map((h, idx) => (
                          <li key={idx}>{new Date(h.ts).toLocaleString()} — {h.status}</li>
                        ))}
                      </ul>
                    </details>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {view === 'payment' && selectedProduct && (
        <div className="container">
          <h2>Checkout: {selectedProduct.name}</h2>
          <p>Amount: ₹{selectedProduct.price}</p>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <h4>Instant Payment (Razorpay)</h4>
              <p>Fast checkout using card/UPI via Razorpay (test).</p>
              <button className="btn secondary" onClick={handleRazorpay}>Pay with Razorpay</button>
            </div>

            <div style={{ flex: 1 }}>
              <h4>Manual UPI / Bank Transfer</h4>
              <p>Pay to UPI ID <strong>sanbae@upi</strong> or phone <strong>9876543210</strong>. Upload screenshot below.</p>
              <ManualPaymentForm product={selectedProduct} onSubmit={submitManualPayment} onCancel={() => setView('home')} />
            </div>
          </div>
        </div>
      )}

      {view === 'admin-login' && !isAdmin && (
        <div className="container">
          <h2>Admin Login</h2>
          <form onSubmit={handleAdminLogin} style={{ maxWidth: 420 }}>
            <input name="password" placeholder="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} />
            <button className="btn" type="submit">Login</button>
          </form>
        </div>
      )}

      {view === 'admin' && isAdmin && (
        <div className="container">
          <h2>Admin Panel</h2>
          <section style={{ marginBottom: 20 }}>
            <h3>Add Product</h3>
            <form onSubmit={handleAddProduct} style={{ display: 'grid', gap: 8 }}>
              <input name="name" placeholder="Name" />
              <input name="price" placeholder="Price" />
              <input name="image" placeholder="Image URL" />
              <input name="category" placeholder="Category" />
              <textarea name="desc" placeholder="Description" />
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn" type="submit">Add</button>
                <button className="btn" onClick={() => { setIsAdmin(false); setView('home'); }}>Logout</button>
              </div>
            </form>
          </section>

          <section>
            <h3>Products</h3>
            <div style={{ display: 'grid', gap: 8 }}>
              {products.map(p => (
                <div key={p.id} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <img src={p.image} alt="" style={{ width: 60, height: 60, objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <div>{p.name}</div>
                    <div className="price">₹{p.price}</div>
                  </div>
                  <button className="btn" onClick={() => handleRemoveProduct(p.id)}>Remove</button>
                </div>
              ))}
            </div>
          </section>

          <section style={{ marginTop: 20 }}>
            <h3>Orders</h3>
            {orders.length === 0 ? <p>No orders yet</p> : (
              <div style={{ display: 'grid', gap: 12 }}>
                {orders.map(o => (
                  <div key={o.id} style={{ padding: 12, border: '1px solid #eee', borderRadius: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                      <div>
                        <strong>{o.id}</strong> — {o.product}
                        <div style={{ color: '#666' }}>Amount: ₹{o.amount} • Status: {o.status}</div>
                        <div style={{ color: '#666' }}>Customer: {o.customerName || o.customerId} {o.customerPhone ? `• ${o.customerPhone}` : ''}</div>
                      </div>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        {o.screenshot && <a href={o.screenshot} target="_blank" rel="noreferrer" className="btn">Preview</a>}
                        {o.status === 'Payment Submitted' && (
                          <button className="btn" onClick={() => verifyOrder(o.id)}>Verify Payment</button>
                        )}
                        {o.status !== 'Delivered' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <button className="btn" onClick={() => updateOrderStatus(o.id, 'Confirmed')}>Confirm</button>
                            <button className="btn" onClick={() => updateOrderStatus(o.id, 'Dispatched')}>Mark Dispatched</button>
                            <button className="btn" onClick={() => updateOrderStatus(o.id, 'Out for Delivery')}>Out for Delivery</button>
                            <button className="btn" onClick={() => updateOrderStatus(o.id, 'Delivered')}>Mark Delivered</button>
                          </div>
                        )}
                      </div>
                    </div>
                    {o.history && (
                      <details style={{ marginTop: 8 }}>
                        <summary style={{ cursor: 'pointer', color: '#666' }}>View History</summary>
                        <ul>
                          {o.history.map((h, i) => <li key={i}>{new Date(h.ts).toLocaleString()} — {h.status}</li>)}
                        </ul>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      <footer style={{ padding: 20, textAlign: 'center', color: '#777' }}>© SANBAE</footer>
    </div>
  );
}

function FeedbackForm({ order, onSubmit }) {
  const [name, setName] = useState(order.customerName || '');
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const handle = (e) => {
    e.preventDefault();
    onSubmit({ name: name || 'Guest', rating, text });
    setText('');
  };
  return (
    <form onSubmit={handle} style={{ marginTop: 12, display: 'grid', gap: 8 }}>
      <h4>Leave Feedback</h4>
      <input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
      <select value={rating} onChange={(e) => setRating(parseInt(e.target.value, 10))}>
        {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} stars</option>)}
      </select>
      <textarea placeholder="Your feedback" value={text} onChange={(e) => setText(e.target.value)} required />
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn secondary" type="submit">Submit</button>
      </div>
    </form>
  );
}

function ManualPaymentForm({ product, onSubmit, onCancel }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [upi, setUpi] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ product, amount: product.price, name, phone, upiId: upi, file });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 8 }}>
      <input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} required />
      <input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
      <input placeholder="UPI ID or Phone used" value={upi} onChange={(e) => setUpi(e.target.value)} />
      <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} required />
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn secondary" type="submit">Submit Payment</button>
        <button className="btn" type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}
