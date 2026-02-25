import React, { useEffect, useState } from 'react';
import './App.css';

const SAMPLE = [
  { id: 1, name: 'Obsidian Hoodie', price: 2999, image: 'https://images.unsplash.com/photo-1556821552-5f0dc49bfe5d?w=900&q=80&auto=format&fit=crop', desc: 'Cozy heavyweight hoodie.' },
  { id: 2, name: 'Inferno Tee', price: 1499, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&q=80&auto=format&fit=crop', desc: 'Soft, breathable tee.' },
  { id: 3, name: 'Minimalist Sneakers', price: 3999, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=80&auto=format&fit=crop', desc: 'Sleek everyday sneakers.' },
  { id: 4, name: 'Ranger Jacket', price: 4999, image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=900&q=80&auto=format&fit=crop', desc: 'Windproof lightweight jacket.' }
];

const ADMIN_PASS = 'admin123';

function useLocalState(key, initial) {
  const [state, setState] = useState(() => {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : initial; } catch { return initial; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(state)); } catch {} }, [key, state]);
  return [state, setState];
}

export default function App() {
  const [products, setProducts] = useLocalState('sb:products', SAMPLE);
  const [cart, setCart] = useLocalState('sb:cart', []);
  const [orders, setOrders] = useLocalState('sb:orders', []);
  const [testimonials, setTestimonials] = useLocalState('sb:tests', []);
  const [view, setView] = useState('home');
  const [selected, setSelected] = useState(null);
  const [notif, setNotif] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPwd, setAdminPwd] = useState('');
  const [customerId] = useState(() => 'CUST-' + Math.floor(Math.random() * 90000 + 10000));

  useEffect(() => {
    const s = document.createElement('script'); s.src = 'https://checkout.razorpay.com/v1/checkout.js'; s.async = true; document.body.appendChild(s);
    return () => { try { document.body.removeChild(s); } catch {} };
  }, []);

  const notify = (m) => { setNotif(m); setTimeout(() => setNotif(''), 3000); };

  const addToCart = (p) => { setCart(c => [...c, p]); notify(`${p.name} added`); };

  const checkoutRazor = (product) => {
    if (!window.Razorpay) { notify('Razorpay not loaded'); return; }
    const options = { key: 'rzp_test_1DP5mmOlF23Z58', amount: product.price * 100, currency: 'INR', name: 'SANBAE', description: product.name,
      handler(res) {
        const id = 'SAN-' + Date.now().toString(36).toUpperCase();
        const order = { id, product: product.name, amount: product.price, status: 'Confirmed', customerId, history: [{ ts: Date.now(), status: 'Paid (Razorpay)' }] };
        setOrders(o => [order, ...o]); notify('Payment successful'); setView('home');
      }
    };
    new window.Razorpay(options).open();
  };

  const submitManual = ({ product, name, phone, upi, file }) => {
    const id = 'SAN-' + Date.now().toString(36).toUpperCase();
    const screenshot = file ? URL.createObjectURL(file) : null;
    const order = { id, product: product.name, amount: product.price, status: 'Payment Submitted', customerId, customerName: name || 'Guest', customerPhone: phone || '', upi, screenshot, history: [{ ts: Date.now(), status: 'Payment Submitted' }] };
    setOrders(o => [order, ...o]); notify('Manual payment submitted'); setView('home');
  };

  const adminVerify = (id) => { setOrders(o => o.map(x => x.id===id ? { ...x, status: 'Confirmed', history: [...(x.history||[]), { ts: Date.now(), status: 'Confirmed' }] } : x)); notify('Order verified'); };
  const adminUpdateStatus = (id, status) => { setOrders(o => o.map(x => x.id===id ? { ...x, status, history: [...(x.history||[]), { ts: Date.now(), status }] } : x)); };

  const addProduct = (p) => { setProducts(prev => [{ ...p, id: Date.now() }, ...prev]); notify('Product added'); };
  const removeProduct = (id) => { setProducts(prev => prev.filter(x => x.id !== id)); };

  const submitTestimonial = (t) => { setTestimonials(s => [{ ...t, id: Date.now() }, ...s]); notify('Thanks for feedback'); };

  // global ripple for .btn
  useEffect(() => {
    const h = (e) => { const btn = e.target.closest('.btn'); if (!btn) return; const r = btn.getBoundingClientRect(); const s = document.createElement('span'); s.className='ripple'; const size = Math.max(r.width, r.height); s.style.width = s.style.height = size + 'px'; s.style.left = (e.clientX - r.left - size/2)+'px'; s.style.top = (e.clientY - r.top - size/2)+'px'; btn.appendChild(s); setTimeout(()=>s.remove(),650); };
    document.addEventListener('click', h); return () => document.removeEventListener('click', h);
  }, []);

  return (
    <div className="app-root">
      <a href="#main" className="skip-link">Skip to main content</a>
      <header className="topbar" role="banner">
        <button className="brand" onClick={() => { setView('home'); setIsAdmin(false); }} aria-label="SANBAE Home">SANBAE</button>
        <div className="search-wrap"><input aria-label="Search products" placeholder="Search products" /></div>
        <nav className="actions" aria-label="Main navigation">
          <div className="cid" aria-label={`Customer ID: ${customerId}`}>{customerId}</div>
          <button className="btn" onClick={() => setView('home')} aria-label="Go to shop">Shop</button>
          <button className="btn" onClick={() => setView('cart')} aria-label={`Cart with ${cart.length} items`}>Cart <span className="cart-badge" aria-hidden="true">{cart.length}</span></button>
          <button className="btn" onClick={() => setView('orders')} aria-label="View my orders">My Orders</button>
          <button className="btn" onClick={() => setView('admin-login')} aria-label="Admin login">Admin</button>
        </nav>
      </header>

      {notif && <div className="toast" role="status" aria-live="polite" aria-atomic="true">{notif}</div>}

      <main id="main" role="main">
        {view==='home' && (
          <section className="hero" aria-label="Hero banner">
            <div className="hero-left">
              <h1>Premium Streetwear</h1>
              <p>Curated drops with reliable delivery and easy returns.</p>
              <div className="cta"><button className="btn" onClick={() => document.querySelector('.product-grid')?.scrollIntoView({behavior:'smooth'})} aria-label="Scroll to shop products">Shop Now</button><button className="btn secondary" onClick={() => setView('orders')} aria-label="View my orders">My Orders</button></div>
            </div>
            <div className="hero-right"><img alt="Premium streetwear featured product" src={products[0]?.image} /></div>
          </section>
        )}

        {view==='home' && (
          <section className="container product-grid" aria-label="Available products">
            <h2 className="section-title">Products</h2>
            {products.map(p => (
              <article className="card" key={p.id} aria-label={`${p.name}, ₹${p.price}`}>
                <div className="media" style={{backgroundImage:`url(${p.image})`}} role="img" aria-label={p.name} />
                <div className="body">
                  <h3>{p.name}</h3>
                  <p className="muted">{p.desc}</p>
                  <div className="meta"><div className="price" aria-label={`Price: ₹${p.price}`}>₹{p.price}</div><div className="actions"><button className="btn buy-animate" onClick={()=>{ setSelected(p); setView('checkout'); }} aria-label={`Buy ${p.name} for ₹${p.price}`}>Buy</button><button className="btn secondary" onClick={()=>addToCart(p)} aria-label={`Add ${p.name} to cart`}>Add</button></div></div>
                </div>
              </article>
            ))}
          </section>
        )}

        {view==='cart' && (
          <section className="container" aria-label="Shopping cart">
            <h2>Your Cart</h2>
            {cart.length===0 ? <p>Your cart is empty</p> : (
              <div className="cart-list" role="list">
                {cart.map((c,i)=> (
                  <div className="cart-item" key={i} role="listitem"><img src={c.image} alt={c.name}/><div><strong>{c.name}</strong><div className="muted">₹{c.price}</div></div></div>
                ))}
                <div className="cart-actions"><button className="btn" onClick={()=>{ setSelected(cart[0]); setView('checkout'); }} aria-label={`Proceed to checkout with ${cart.length} items`}>Checkout</button></div>
              </div>
            )}
          </section>
        )}

        {view==='checkout' && selected && (
          <section className="container" aria-label="Checkout">
            <h2>Checkout — {selected.name}</h2>
            <div className="checkout-grid" role="region" aria-label="Payment options">
              <div className="panel">
                <h4>Instant (Razorpay)</h4>
                <p className="muted">Secure card/UPI checkout.</p>
                <button className="btn secondary" onClick={()=>checkoutRazor(selected)} aria-label="Pay ₹{selected.price} with Razorpay">Pay ₹{selected.price}</button>
              </div>
              <div className="panel">
                <h4>Manual UPI</h4>
                <ManualPaymentForm product={selected} onSubmit={submitManual} onCancel={()=>setView('home')} />
              </div>
            </div>
          </section>
        )}

        {view==='orders' && (
          <section className="container" aria-label="My orders">
            <h2>My Orders</h2>
            {orders.filter(o=>o.customerId===customerId).length===0 ? <p>No orders yet</p> : <div role="list">{orders.filter(o=>o.customerId===customerId).map(o=> (
              <div className="order" key={o.id} role="listitem" aria-label={`Order ${o.id}: ${o.product}, ₹${o.amount}, Status: ${o.status}`}><strong>{o.id}</strong> — {o.product} • <span className="muted" aria-live="polite">{o.status}</span></div>
            ))}</div>}
          </section>
        )}

        {view==='admin-login' && !isAdmin && (
          <section className="container card admin-login" aria-label="Admin login"><h3>Admin</h3><form onSubmit={(e)=>{ e.preventDefault(); if (adminPwd===ADMIN_PASS){ setIsAdmin(true); setView('admin'); notify('Admin logged in'); } else notify('Bad password'); setAdminPwd(''); }}><label htmlFor="admin-pwd">Password</label><input id="admin-pwd" value={adminPwd} onChange={e=>setAdminPwd(e.target.value)} placeholder="Password" type="password" aria-label="Admin password" aria-required="true" required/><div className="form-row"><button className="btn" type="submit" aria-label="Login as admin">Login</button></div></form></section>
        )}

        {view==='admin' && isAdmin && (
          <section className="container admin-panel">
            <h2>Admin</h2>
            <AdminPanel products={products} onAdd={addProduct} onRemove={removeProduct} orders={orders} onVerify={adminVerify} onUpdate={adminUpdateStatus} testimonials={testimonials} onDelTest={(id)=>{ /* simple removal */ }} />
          </section>
        )}
      </main>

      <footer className="footer" role="contentinfo">© SANBAE</footer>
    </div>
  );
}

function ManualPaymentForm({ product, onSubmit, onCancel }){
  const [name,setName]=useState(''); const [phone,setPhone]=useState(''); const [upi,setUpi]=useState(''); const [file,setFile]=useState(null);
  return (
    <form onSubmit={(e)=>{ e.preventDefault(); onSubmit({ product, name, phone, upi, file }); }} className="manual-form">
      <label htmlFor="name-input">Full name <span aria-label="required">*</span></label>
      <input id="name-input" required placeholder="Full name" value={name} onChange={e=>setName(e.target.value)} aria-required="true" />
      <label htmlFor="phone-input">Phone <span aria-label="required">*</span></label>
      <input id="phone-input" required placeholder="Phone" value={phone} onChange={e=>setPhone(e.target.value)} aria-required="true" />
      <label htmlFor="upi-input">UPI ID</label>
      <input id="upi-input" placeholder="UPI ID" value={upi} onChange={e=>setUpi(e.target.value)} />
      <label htmlFor="file-input">Payment receipt <span aria-label="required">*</span></label>
      <input id="file-input" required type="file" accept="image/*" onChange={e=>setFile(e.target.files[0])} aria-required="true" />
      <div className="form-row"><button className="btn secondary" type="submit" aria-label="Submit payment for ₹{product.price}">Submit Payment</button><button className="btn" type="button" onClick={onCancel} aria-label="Cancel payment">Cancel</button></div>
    </form>
  );
}

function AdminPanel({ products, onAdd, onRemove, orders, onVerify, onUpdate, testimonials }){
  const [form, setForm] = useState({name:'', price:'', image:'', desc:''});
  return (
    <div>
      <section className="admin-section card" aria-label="Add new product">
        <h4>Add Product</h4>
        <form onSubmit={(e)=>{ e.preventDefault(); onAdd({ name: form.name, price: Number(form.price), image: form.image, desc: form.desc }); setForm({name:'',price:'',image:'',desc:''}); }} className="admin-form">
          <label htmlFor="prod-name">Product Name <span aria-label="required">*</span></label>
          <input id="prod-name" placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required aria-required="true" />
          <label htmlFor="prod-price">Price <span aria-label="required">*</span></label>
          <input id="prod-price" placeholder="Price" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} required aria-required="true" />
          <label htmlFor="prod-img">Image URL</label>
          <input id="prod-img" placeholder="Image URL" value={form.image} onChange={e=>setForm({...form,image:e.target.value})} />
          <label htmlFor="prod-desc">Description</label>
          <textarea id="prod-desc" placeholder="Description" value={form.desc} onChange={e=>setForm({...form,desc:e.target.value})} />
          <div className="form-row"><button className="btn" type="submit" aria-label="Add new product">Add</button></div>
        </form>
      </section>

      <section className="admin-section" aria-label="Product list">
        <h4>Products</h4>
        <div className="admin-list" role="list">
          {products.map(p=> <div className="admin-item" key={p.id} role="listitem" aria-label={`Product: ${p.name}, Price: ₹${p.price}`}><div className="admin-left"><img src={p.image} alt={p.name}/><div><strong>{p.name}</strong><div className="muted">₹{p.price}</div></div></div><div className="admin-actions"><button className="btn" onClick={()=>onRemove(p.id)} aria-label={`Remove product ${p.name}`}>Remove</button></div></div>)}
        </div>
      </section>

      <section className="admin-section" aria-label="Order management">
        <h4>Orders</h4>
        <div className="admin-list" role="list">
          {orders.map(o=> <div className="order-card" key={o.id} role="listitem" aria-label={`Order ${o.id}: ${o.product}, Status: ${o.status}`}><div><strong>{o.id}</strong><div className="muted">{o.product} • ₹{o.amount}</div></div><div className="admin-actions">{o.status==='Payment Submitted' && <button className="btn" onClick={()=>onVerify(o.id)} aria-label={`Verify payment for order ${o.id}`}>Verify</button>}<button className="btn" onClick={()=>onUpdate(o.id,'Dispatched')} aria-label={`Mark order ${o.id} as dispatched`}>Dispatch</button><button className="btn" onClick={()=>onUpdate(o.id,'Delivered')} aria-label={`Mark order ${o.id} as delivered`}>Deliver</button></div></div>)}
        </div>
      </section>
    </div>
  );
}
