import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
    const [view, setView] = useState('home');
    const [orderId, setOrderId] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('upi');
    const [uploadedFile, setUploadedFile] = useState(null);
    const [cart, setCart] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const [showNotification, setShowNotification] = useState('');
    const [cartCount, setCartCount] = useState(0);
    
    // Admin Authentication
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
    const [adminPassword, setAdminPassword] = useState('');
    const ADMIN_PASSWORD = 'admin123'; // Simple password for demo

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
    }, []);

    const handleRazorpayPayment = () => {
        if (!window.Razorpay) {
            alert('Payment gateway not loaded. Please try again.');
            return;
        }
        const options = {
            key: 'rzp_test_1DP5mmOlF23Z58',
            amount: selectedProduct.price * 100,
            currency: 'INR',
            name: 'SANBAE Official',
            description: selectedProduct.name,
            image: selectedProduct.image,
            handler: function (response) {
                const id = 'SAN-' + Math.floor(Math.random() * 90000 + 10000);
                const newOrder = {
                    id: id,
                    date: new Date().toLocaleDateString('en-IN'),
                    amount: selectedProduct.price,
                    status: 'Payment Confirmed ✓',
                    customer: 'Premium Customer',
                    email: 'customer@sanbae.com',
                    phone: '9999999999',
                    product: selectedProduct.name
                };
                setPendingOrders([newOrder, ...pendingOrders]);
                showNotify(`✅ Payment successful! Order: ${id}`);
                setView('home');
            },
            prefill: {
                name: 'Customer',
                email: 'customer@sanbae.com',
                contact: '9999999999'
            },
            theme: {
                color: '#ff6b35'
            }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    return (
        <div>
            {showNotification && <div className="notification">{showNotification}</div>}

            <nav>
                <div className="logo" onClick={() => setView('home')}>SANBAE</div>
                {!isAdminLoggedIn && (
                    <div className="nav-search">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                )}
                <div className="nav-right">
                    <div className="nav-item" onClick={() => { setView('home'); setIsAdminLoggedIn(false); }}>Shop</div>
                    {!isAdminLoggedIn && cartCount > 0 && (
                        <div className="nav-item" onClick={() => setView('cart')} style={{ position: 'relative' }}>
                            🛒 Cart
                            <span className="badge">{cartCount}</span>
                        </div>
                    )}
                    {!isAdminLoggedIn && wishlist.length > 0 && (
                        <div className="nav-item" onClick={() => setView('wishlist')}>
                            ♥ Wishlist ({wishlist.length})
                        </div>
                    )}
                    {isAdminLoggedIn ? (
                        <button className="btn-logout" onClick={handleAdminLogout}>Logout</button>
                    ) : (
                        <div className="nav-item" onClick={() => setView('admin-login')}>Admin</div>
                    )}
                </div>
            </nav>

            {/* ADMIN LOGIN PAGE */}
            {view === 'admin-login' && !isAdminLoggedIn && (
                <div className="login-container">
                    <div className="login-card">
                        <h1>Admin Login</h1>
                        <p>Access SANBAE Administration Portal</p>
                        <form onSubmit={handleAdminLogin}>
                            <input
                                type="password"
                                placeholder="Enter admin password"
                                value={adminPassword}
                                onChange={(e) => setAdminPassword(e.target.value)}
                                required
                            />
                            <button type="submit" className="btn secondary">Login</button>
                        </form>
                        <p className="login-hint">Demo password: admin123</p>
                        <button className="btn" onClick={() => setView('home')} style={{marginTop: '15px'}}>Back to Shop</button>
                    </div>
                </div>
            )}

            {/* ADMIN DASHBOARD */}
            {view === 'admin' && isAdminLoggedIn && (
                <div className="container">
                    <div className="admin-dashboard">
                        <div className="admin-header">
                            <h2>SANBAE Admin Dashboard</h2>
                            <p>Manage Products, Orders & Content</p>
                        </div>

                        {/* ADMIN TABS */}
                        <div className="admin-tabs">
                            <button className="tab-btn active" onClick={() => setView('admin-products')}>📦 Products ({products.length})</button>
                            <button className="tab-btn" onClick={() => setView('admin-orders')}>📋 Orders ({pendingOrders.length})</button>
                            <button className="tab-btn" onClick={() => setView('admin-testimonials')}>⭐ Reviews</button>
                            <button className="tab-btn" onClick={() => setView('admin-updates')}>📰 Updates</button>
                            <button className="tab-btn" onClick={() => setView('admin-stats')}>📊 Analytics</button>
                        </div>

                        <div className="admin-content">
                            <div style={{textAlign: 'center', padding: '40px'}}>
                                <p>Select a tab to manage</p>
                                <button className="btn secondary" onClick={() => setView('admin-products')} style={{marginTop: '20px'}}>Manage Products</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ADMIN PRODUCTS */}
            {view === 'admin-products' && isAdminLoggedIn && (
                <div className="container">
                    <div className="admin-section">
                        <h2 className="section-title">Manage Products</h2>

                        {/* Add New Product Form */}
                        <div className="admin-form-card">
                            <h3>➕ Add New Product</h3>
                            <form onSubmit={handleAddProduct}>
                                <div className="form-row">
                                    <input type="text" placeholder="Product Name" value={newProductForm.name} onChange={(e) => setNewProductForm({...newProductForm, name: e.target.value})} required />
                                    <input type="number" placeholder="Price (₹)" value={newProductForm.price} onChange={(e) => setNewProductForm({...newProductForm, price: e.target.value})} required />
                                </div>
                                <div className="form-row">
                                    <select value={newProductForm.category} onChange={(e) => setNewProductForm({...newProductForm, category: e.target.value})}>
                                        <option value="hoodies">Hoodies</option>
                                        <option value="tees">T-Shirts</option>
                                        <option value="jackets">Jackets</option>
                                        <option value="bottoms">Bottoms</option>
                                        <option value="shoes">Shoes</option>
                                        <option value="bags">Bags</option>
                                        <option value="accessories">Accessories</option>
                                    </select>
                                    <input type="number" placeholder="Stock" value={newProductForm.stock} onChange={(e) => setNewProductForm({...newProductForm, stock: e.target.value})} required />
                                </div>
                                <input type="text" placeholder="SKU Code" value={newProductForm.sku} onChange={(e) => setNewProductForm({...newProductForm, sku: e.target.value})} />
                                <input type="text" placeholder="Image URL" value={newProductForm.image} onChange={(e) => setNewProductForm({...newProductForm, image: e.target.value})} required />
                                <textarea placeholder="Product Description" value={newProductForm.desc} onChange={(e) => setNewProductForm({...newProductForm, desc: e.target.value})} rows="4"></textarea>
                                <button type="submit" className="btn secondary">Add Product</button>
                            </form>
                        </div>

                        {/* Products List */}
                        <h3 style={{marginTop: '40px'}}>Current Products</h3>
                        <div className="admin-products-list">
                            {products.map(product => (
                                <div key={product.id} className="admin-product-item">
                                    <img src={product.image} alt={product.name} />
                                    <div className="product-info">
                                        <h4>{product.name}</h4>
                                        <p>SKU: {product.sku} | Stock: {product.stock}</p>
                                        <p>₹{product.price} | Category: {product.category}</p>
                                    </div>
                                    <div className="admin-actions">
                                        <button className="btn-action edit" onClick={() => {setEditingProduct(product); setView('admin-edit-product')}}>✏️ Edit</button>
                                        <button className="btn-action delete" onClick={() => handleDeleteProduct(product.id)}>🗑️ Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button className="btn" onClick={() => setView('admin')} style={{marginTop: '30px'}}>Back to Dashboard</button>
                    </div>
                </div>
            )}

            {/* ADMIN EDIT PRODUCT */}
            {view === 'admin-edit-product' && isAdminLoggedIn && editingProduct && (
                <div className="container">
                    <div className="admin-form-card" style={{maxWidth: '600px', margin: '60px auto'}}>
                        <h2>Edit Product: {editingProduct.name}</h2>
                        <form onSubmit={handleUpdateProduct}>
                            <input type="text" placeholder="Product Name" value={editingProduct.name} onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})} required />
                            <input type="number" placeholder="Price" value={editingProduct.price} onChange={(e) => setEditingProduct({...editingProduct, price: parseInt(e.target.value)})} required />
                            <input type="number" placeholder="Stock" value={editingProduct.stock} onChange={(e) => setEditingProduct({...editingProduct, stock: parseInt(e.target.value)})} required />
                            <textarea placeholder="Description" value={editingProduct.desc} onChange={(e) => setEditingProduct({...editingProduct, desc: e.target.value})} rows="4"></textarea>
                            <div style={{display: 'flex', gap: '10px'}}>
                                <button type="submit" className="btn secondary" style={{flex: 1}}>Save Changes</button>
                                <button type="button" className="btn" style={{flex: 1}} onClick={() => {setEditingProduct(null); setView('admin-products')}}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ADMIN ORDERS */}
            {view === 'admin-orders' && isAdminLoggedIn && (
                <div className="container">
                    <div className="admin-section">
                        <h2 className="section-title">Manage Orders</h2>
                        <div className="admin-orders-list">
                            {pendingOrders.map(order => (
                                <div key={order.id} className="admin-order-item">
                                    <div className="order-header">
                                        <h4>{order.id}</h4>
                                        <span className={`status ${order.status.includes('Verified') ? 'verified' : 'pending'}`}>{order.status}</span>
                                    </div>
                                    <div className="order-details">
                                        <p><strong>Customer:</strong> {order.customer} | <strong>Email:</strong> {order.email}</p>
                                        <p><strong>Phone:</strong> {order.phone} | <strong>Product:</strong> {order.product}</p>
                                        <p><strong>Amount:</strong> ₹{order.amount} | <strong>Date:</strong> {order.date}</p>
                                    </div>
                                    <div className="admin-actions">
                                        <button className="btn-action view">👁️ View</button>
                                        {order.status === 'Awaiting Verification' && (
                                            <button className="btn-action verify" onClick={() => handleVerifyOrder(order.id)}>✓ Verify</button>
                                        )}
                                        <button className="btn-action delete" onClick={() => handleDeleteOrder(order.id)}>🗑️ Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="btn" onClick={() => setView('admin')} style={{marginTop: '30px'}}>Back to Dashboard</button>
                    </div>
                </div>
            )}

            {/* ADMIN TESTIMONIALS */}
            {view === 'admin-testimonials' && isAdminLoggedIn && (
                <div className="container">
                    <div className="admin-section">
                        <h2 className="section-title">Manage Testimonials</h2>

                        {/* Add Testimonial Form */}
                        <div className="admin-form-card">
                            <h3>➕ Add New Testimonial</h3>
                            <form onSubmit={handleAddTestimonial}>
                                <input type="text" placeholder="Customer Name" value={testimonialForm.name} onChange={(e) => setTestimonialForm({...testimonialForm, name: e.target.value})} required />
                                <textarea placeholder="Review Text" value={testimonialForm.text} onChange={(e) => setTestimonialForm({...testimonialForm, text: e.target.value})} rows="4"></textarea>
                                <div className="form-row">
                                    <select value={testimonialForm.rating} onChange={(e) => setTestimonialForm({...testimonialForm, rating: parseFloat(e.target.value)})}>
                                        <option value="5">⭐ 5 Stars</option>
                                        <option value="4.5">⭐ 4.5 Stars</option>
                                        <option value="4">⭐ 4 Stars</option>
                                        <option value="3.5">⭐ 3.5 Stars</option>
                                    </select>
                                </div>
                                <button type="submit" className="btn secondary">Add Testimonial</button>
                            </form>
                        </div>

                        {/* Testimonials List */}
                        <h3 style={{marginTop: '40px'}}>Current Reviews</h3>
                        <div className="admin-testimonials-list">
                            {testimonials.map(t => (
                                <div key={t.id} className="admin-testimonial-item">
                                    <div className="testimonial-info">
                                        <h4>{t.name}</h4>
                                        <p>{"⭐".repeat(Math.floor(t.rating))} {t.rating}</p>
                                        <p>"{t.text}"</p>
                                    </div>
                                    <div className="admin-actions">
                                        <button className="btn-action delete" onClick={() => handleDeleteTestimonial(t.id)}>🗑️ Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="btn" onClick={() => setView('admin')} style={{marginTop: '30px'}}>Back to Dashboard</button>
                    </div>
                </div>
            )}

            {/* ADMIN UPDATES */}
            {view === 'admin-updates' && isAdminLoggedIn && (
                <div className="container">
                    <div className="admin-section">
                        <h2 className="section-title">Manage Updates</h2>

                        {/* Post Update Form */}
                        <div className="admin-form-card">
                            <h3>➕ Post New Update</h3>
                            <form onSubmit={handleAddUpdate}>
                                <input type="date" value={updateForm.date} onChange={(e) => setUpdateForm({...updateForm, date: e.target.value})} required />
                                <textarea placeholder="Update Message" value={updateForm.event} onChange={(e) => setUpdateForm({...updateForm, event: e.target.value})} rows="3"></textarea>
                                <button type="submit" className="btn secondary">Post Update</button>
                            </form>
                        </div>

                        {/* Updates List */}
                        <h3 style={{marginTop: '40px'}}>Current Updates</h3>
                        <div className="admin-updates-list">
                            {updates.map(u => (
                                <div key={u.id} className="admin-update-item">
                                    <div className="update-info">
                                        <h4>{u.date}</h4>
                                        <p>{u.event}</p>
                                    </div>
                                    <div className="admin-actions">
                                        <button className="btn-action delete" onClick={() => handleDeleteUpdate(u.id)}>🗑️ Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="btn" onClick={() => setView('admin')} style={{marginTop: '30px'}}>Back to Dashboard</button>
                    </div>
                </div>
            )}

            {/* ADMIN STATS */}
            {view === 'admin-stats' && isAdminLoggedIn && (
                <div className="container">
                    <div className="admin-section">
                        <h2 className="section-title">Analytics & Statistics</h2>
                        <div className="admin-stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon">📦</div>
                                <div className="stat-content">
                                    <p className="stat-number">{products.length}</p>
                                    <p className="stat-label">Total Products</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">📋</div>
                                <div className="stat-content">
                                    <p className="stat-number">{pendingOrders.length}</p>
                                    <p className="stat-label">Total Orders</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">💸</div>
                                <div className="stat-content">
                                    <p className="stat-number">₹{pendingOrders.reduce((sum, o) => sum + o.amount, 0).toLocaleString()}</p>
                                    <p className="stat-label">Total Revenue</p>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon">✓</div>
                                <div className="stat-content">
                                    <p className="stat-number">{pendingOrders.filter(o => o.status.includes('✓')).length}</p>
                                    <p className="stat-label">Verified Orders</p>
                                </div>
                            </div>
                        </div>
                        <button className="btn" onClick={() => setView('admin')} style={{marginTop: '30px'}}>Back to Dashboard</button>
                    </div>
                </div>
            )}

            {/* HOME VIEW (existing) */}
            {view === 'home' && !isAdminLoggedIn && (
                <>
                    <div className="hero">
                        <div className="hero-content">
                            <h1>PREMIUM STREETWEAR</h1>
                            <p>Elevate Your Style. Express Yourself.</p>
                            <button className="btn secondary" style={{ marginTop: '20px', width: '200px' }}>
                                Explore Collection
                            </button>
                        </div>
                    </div>

                    <div className="container">
                        <div className="filters-section">
                            <div className="filter-group">
                                <label>Category:</label>
                                <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                                    <option value="all">All Products</option>
                                    <option value="hoodies">Hoodies</option>
                                    <option value="tees">T-Shirts</option>
                                    <option value="jackets">Jackets</option>
                                    <option value="bottoms">Bottoms</option>
                                    <option value="shoes">Shoes</option>
                                    <option value="bags">Bags</option>
                                    <option value="accessories">Accessories</option>
                                </select>
                            </div>
                            <div className="filter-group">
                                <label>Sort By:</label>
                                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                    <option value="newest">Newest</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="rating">Top Rated</option>
                                </select>
                            </div>
                        </div>

                        <div className="section-title">Featured Collection ({getFilteredProducts().length})</div>
                        <div className="grid">
                            {getFilteredProducts().map((product) => (
                                <div className="card" key={product.id}>
                                    <div className="card-image-container">
                                        <div
                                            className="img-box"
                                            style={{ backgroundImage: `url(${product.image})` }}
                                            onClick={() => handleProductClick(product)}
                                        ></div>
                                        <button
                                            className="wishlist-btn"
                                            onClick={() => handleAddToWishlist(product)}
                                            style={{
                                                color: wishlist.find(p => p.id === product.id) ? 'var(--accent)' : '#999'
                                            }}
                                        >
                                            ♥
                                        </button>
                                        <div className="price-badge">₹{product.price}</div>
                                    </div>
                                    <div className="card-content">
                                        <h3 className="product-name">{product.name}</h3>
                                        <div className="rating">
                                            <span className="stars">★ {product.rating}</span>
                                            <span className="reviews">({product.reviews})</span>
                                        </div>
                                        <p className="product-desc">{product.desc}</p>
                                        <div className="card-actions">
                                            <button className="btn" onClick={() => generateOrder(product)}>
                                                Buy Now
                                            </button>
                                            <button className="btn secondary" onClick={() => handleAddToCart(product)}>
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="testimonials-section">
                            <div className="section-title">Customer Reviews</div>
                            <div className="testimonials-grid">
                                {testimonials.map((t, idx) => (
                                    <div className="testimonial-card" key={idx}>
                                        <div className="stars">{'★'.repeat(Math.floor(t.rating))}</div>
                                        <p className="testimonial-text">"{t.text}"</p>
                                        <p className="testimonial-author">- {t.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="updates-section">
                            <div className="section-title">Latest Updates</div>
                            <div className="updates-grid">
                                {updates.map((u, idx) => (
                                    <div className="update-item" key={idx}>
                                        <div className="update-date">{u.date}</div>
                                        <div className="update-event">{u.event}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="newsletter-section">
                            <div className="newsletter-content">
                                <h2>Join Our Newsletter</h2>
                                <p>Get exclusive deals and latest updates delivered to your inbox</p>
                                <div className="newsletter-form">
                                    <input type="email" placeholder="Enter your email" />
                                    <button className="btn secondary">Subscribe</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* CART, WISHLIST, PRODUCT DETAIL, PAYMENT (keeping existing code) */}
            {view === 'product-detail' && selectedProduct && (
                <div className="container" style={{ marginTop: '60px' }}>
                    <button className="btn" style={{ width: '150px', marginBottom: '30px' }} onClick={() => setView('home')}>
                        ← Back
                    </button>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start' }}>
                        <div className="card-image-container" style={{ height: '500px' }}>
                            <div className="img-box" style={{ backgroundImage: `url(${selectedProduct.image})` }}></div>
                        </div>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                                <h1 className="section-title">{selectedProduct.name}</h1>
                                <button className="wishlist-btn-large" onClick={() => handleAddToWishlist(selectedProduct)}
                                    style={{ color: wishlist.find(p => p.id === selectedProduct.id) ? 'var(--accent)' : '#999' }}>♥</button>
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <span style={{ fontSize: '18px' }}>★ {selectedProduct.rating}</span>
                                <span style={{ color: '#999', marginLeft: '10px' }}>({selectedProduct.reviews} reviews)</span>
                            </div>
                            <p style={{ fontSize: '32px', color: 'var(--accent)', fontWeight: 'bold', marginBottom: '20px' }}>
                                ₹{selectedProduct.price}
                            </p>
                            <p style={{ fontSize: '16px', lineHeight: '1.8', marginBottom: '30px', color: '#555' }}>
                                {selectedProduct.desc}
                            </p>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ fontWeight: '700', marginBottom: '10px', display: 'block' }}>
                                    Select Size:
                                </label>
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                    {selectedProduct.sizes.map((size) => (
                                        <button key={size} className="size-btn">{size}</button>
                                    ))}
                                </div>
                            </div>
                            <div style={{ marginBottom: '30px' }}>
                                <label style={{ fontWeight: '700', marginBottom: '10px', display: 'block' }}>
                                    Available Colors:
                                </label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    {selectedProduct.colors.map((color) => (
                                        <div key={color} className="color-option" title={color}>{color}</div>
                                    ))}
                                </div>
                            </div>
                            <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
                                <p style={{ margin: '8px 0', fontWeight: '600' }}>✓ Premium Quality</p>
                                <p style={{ margin: '8px 0', fontWeight: '600' }}>✓ Free Shipping on Orders Above ₹500</p>
                                <p style={{ margin: '8px 0', fontWeight: '600' }}>✓ 30-Day Easy Returns</p>
                                <p style={{ margin: '8px 0', fontWeight: '600' }}>✓ 100% Authentic Products</p>
                            </div>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <button className="btn secondary" style={{ flex: 1 }} onClick={() => generateOrder(selectedProduct)}>
                                    Buy Now
                                </button>
                                <button className="btn" style={{ flex: 1 }} onClick={() => handleAddToCart(selectedProduct)}>
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {view === 'payment' && selectedProduct && (
                <div className="container">
                    <div className="order-portal">
                        <h2>Secure Checkout #{orderId}</h2>
                        <hr />
                        <div className="order-details">
                            <div className="detail-row">
                                <span>Product:</span>
                                <strong>{selectedProduct.name}</strong>
                            </div>
                            <div className="detail-row">
                                <span>Price:</span>
                                <strong>₹{selectedProduct.price}</strong>
                            </div>
                            <div className="detail-row">
                                <span>Shipping:</span>
                                <strong style={{ color: 'var(--accent)' }}>Free</strong>
                            </div>
                            <hr style={{ margin: '15px 0' }} />
                            <div className="detail-row" style={{ fontSize: '18px', fontWeight: 'bold' }}>
                                <span>Total:</span>
                                <span>₹{selectedProduct.price}</span>
                            </div>
                        </div>
                        <div className="payment-method">
                            <strong style={{ color: 'var(--accent)' }}>Choose Payment Method</strong>
                        </div>
                        <div className="payment-options">
                            <div className={`payment-option ${paymentMethod === 'razorpay' ? 'active' : ''}`}
                                onClick={() => setPaymentMethod('razorpay')}>
                                💳 Card/Razorpay
                            </div>
                            <div className={`payment-option ${paymentMethod === 'upi' ? 'active' : ''}`}
                                onClick={() => setPaymentMethod('upi')}>
                                📱 UPI Payment
                            </div>
                        </div>
                        {paymentMethod === 'razorpay' && (
                            <button className="btn secondary" onClick={handleRazorpayPayment}>
                                Pay ₹{selectedProduct.price} with Razorpay
                            </button>
                        )}
                        {paymentMethod === 'upi' && (
                            <>
                                <div className="payment-method">
                                    📱 Scan & Pay via UPI<br/>
                                    <strong>sanbae@upi</strong> or <strong>9876543210</strong>
                                </div>
                                <div className="file-input-wrapper">
                                    <label>Upload Payment Screenshot:</label>
                                    <input type="file" accept="image/*" onChange={handleFileUpload} />
                                    {uploadedFile && (
                                        <p style={{ color: 'var(--accent)', marginTop: '10px', fontWeight: 'bold' }}>
                                            ✓ {uploadedFile} uploaded
                                        </p>
                                    )}
                                </div>
                                <button className="btn" onClick={handleSubmitOrder}>
                                    Submit Payment Confirmation
                                </button>
                            </>
                        )}
                        <button className="btn" style={{ background: '#999', marginTop: '15px' }} onClick={() => setView('home')}>
                            Cancel Order
                        </button>
                    </div>
                </div>
            )}

            {view === 'cart' && (
                <div className="container">
                    <h2 className="section-title">Shopping Cart ({cart.length} items)</h2>
                    {cart.length > 0 ? (
                        <div className="cart-section">
                            <div className="cart-items">
                                {cart.map((item, idx) => (
                                    <div className="cart-item" key={idx}>
                                        <img src={item.image} alt={item.name} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }} />
                                        <div style={{ flex: 1 }}>
                                            <h3>{item.name}</h3>
                                            <p>₹{item.price}</p>
                                        </div>
                                        <button className="btn btn-small" onClick={() => generateOrder(item)}>
                                            Checkout
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p style={{ textAlign: 'center', color: '#999', padding: '40px' }}>Your cart is empty</p>
                    )}
                    <button className="btn" style={{ marginTop: '20px' }} onClick={() => setView('home')}>
                        Continue Shopping
                    </button>
                </div>
            )}

            {view === 'wishlist' && (
                <div className="container">
                    <h2 className="section-title">My Wishlist ({wishlist.length} items)</h2>
                    {wishlist.length > 0 ? (
                        <div className="grid">
                            {wishlist.map((product) => (
                                <div className="card" key={product.id}>
                                    <div className="card-image-container">
                                        <div className="img-box" style={{ backgroundImage: `url(${product.image})` }}
                                            onClick={() => handleProductClick(product)}></div>
                                        <div className="price-badge">₹{product.price}</div>
                                    </div>
                                    <div className="card-content">
                                        <h3 className="product-name">{product.name}</h3>
                                        <p className="product-desc">{product.desc}</p>
                                        <button className="btn secondary" onClick={() => generateOrder(product)}>
                                            Buy Now
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{ textAlign: 'center', color: '#999', padding: '40px' }}>Your wishlist is empty</p>
                    )}
                    <button className="btn" style={{ marginTop: '20px' }} onClick={() => setView('home')}>
                        Continue Shopping
                    </button>
                </div>
            )}
        </div>
    );
};

export default App;

            {/* HOME VIEW */}
            {view === 'home' && (
                <>
                    <div className="hero">
                        <div className="hero-content">
                            <h1>PREMIUM STREETWEAR</h1>
                            <p>Elevate Your Style. Express Yourself.</p>
                            <button className="btn secondary" style={{ marginTop: '20px', width: '200px' }}>
                                Explore Collection
                            </button>
                        </div>
                    </div>

                    <div className="container">
                        {/* FILTERS & SORT */}
                        <div className="filters-section">
                            <div className="filter-group">
                                <label>Category:</label>
                                <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                                    <option value="all">All Products</option>
                                    <option value="hoodies">Hoodies</option>
                                    <option value="tees">T-Shirts</option>
                                    <option value="jackets">Jackets</option>
                                    <option value="bottoms">Bottoms</option>
                                    <option value="shoes">Shoes</option>
                                    <option value="bags">Bags</option>
                                    <option value="accessories">Accessories</option>
                                </select>
                            </div>
                            <div className="filter-group">
                                <label>Sort By:</label>
                                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                    <option value="newest">Newest</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="rating">Top Rated</option>
                                </select>
                            </div>
                        </div>

                        <div className="section-title">Featured Collection ({getFilteredProducts().length})</div>
                        <div className="grid">
                            {getFilteredProducts().map((product) => (
                                <div className="card" key={product.id}>
                                    <div className="card-image-container">
                                        <div
                                            className="img-box"
                                            style={{ backgroundImage: `url(${product.image})` }}
                                            onClick={() => handleProductClick(product)}
                                        ></div>
                                        <button
                                            className="wishlist-btn"
                                            onClick={() => handleAddToWishlist(product)}
                                            style={{
                                                color: wishlist.find(p => p.id === product.id) ? 'var(--accent)' : '#999'
                                            }}
                                        >
                                            ♥
                                        </button>
                                        <div className="price-badge">₹{product.price}</div>
                                    </div>
                                    <div className="card-content">
                                        <h3 className="product-name">{product.name}</h3>
                                        <div className="rating">
                                            <span className="stars">★ {product.rating}</span>
                                            <span className="reviews">({product.reviews})</span>
                                        </div>
                                        <p className="product-desc">{product.desc}</p>
                                        <div className="card-actions">
                                            <button className="btn" onClick={() => generateOrder(product)}>
                                                Buy Now
                                            </button>
                                            <button className="btn secondary" onClick={() => handleAddToCart(product)}>
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* TESTIMONIALS */}
                        <div className="testimonials-section">
                            <div className="section-title">Customer Reviews</div>
                            <div className="testimonials-grid">
                                {testimonials.map((t, idx) => (
                                    <div className="testimonial-card" key={idx}>
                                        <div className="stars">{'★'.repeat(Math.floor(t.rating))}</div>
                                        <p className="testimonial-text">"{t.text}"</p>
                                        <p className="testimonial-author">- {t.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* UPDATES */}
                        <div className="updates-section">
                            <div className="section-title">Latest Updates</div>
                            <div className="updates-grid">
                                {updates.map((u, idx) => (
                                    <div className="update-item" key={idx}>
                                        <div className="update-date">{u.date}</div>
                                        <div className="update-event">{u.event}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* NEWSLETTER */}
                        <div className="newsletter-section">
                            <div className="newsletter-content">
                                <h2>Join Our Newsletter</h2>
                                <p>Get exclusive deals and latest updates delivered to your inbox</p>
                                <div className="newsletter-form">
                                    <input type="email" placeholder="Enter your email" />
                                    <button className="btn secondary">Subscribe</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* PRODUCT DETAIL VIEW */}
            {view === 'product-detail' && selectedProduct && (
                <div className="container" style={{ marginTop: '60px' }}>
                    <button className="btn" style={{ width: '150px', marginBottom: '30px' }} onClick={() => setView('home')}>
                        ← Back
                    </button>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start' }}>
                        <div className="card-image-container" style={{ height: '500px' }}>
                            <div
                                className="img-box"
                                style={{ backgroundImage: `url(${selectedProduct.image})` }}
                            ></div>
                        </div>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                                <h1 className="section-title">{selectedProduct.name}</h1>
                                <button
                                    className="wishlist-btn-large"
                                    onClick={() => handleAddToWishlist(selectedProduct)}
                                    style={{
                                        color: wishlist.find(p => p.id === selectedProduct.id) ? 'var(--accent)' : '#999'
                                    }}
                                >
                                    ♥
                                </button>
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <span style={{ fontSize: '18px' }}>★ {selectedProduct.rating}</span>
                                <span style={{ color: '#999', marginLeft: '10px' }}>({selectedProduct.reviews} reviews)</span>
                            </div>
                            <p style={{ fontSize: '32px', color: 'var(--accent)', fontWeight: 'bold', marginBottom: '20px' }}>
                                ₹{selectedProduct.price}
                            </p>
                            <p style={{ fontSize: '16px', lineHeight: '1.8', marginBottom: '30px', color: '#555' }}>
                                {selectedProduct.desc}
                            </p>

                            {/* Size Selection */}
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ fontWeight: '700', marginBottom: '10px', display: 'block' }}>
                                    Select Size:
                                </label>
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                    {selectedProduct.sizes.map((size) => (
                                        <button key={size} className="size-btn">
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Color Selection */}
                            <div style={{ marginBottom: '30px' }}>
                                <label style={{ fontWeight: '700', marginBottom: '10px', display: 'block' }}>
                                    Available Colors:
                                </label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    {selectedProduct.colors.map((color) => (
                                        <div key={color} className="color-option" title={color}>
                                            {color}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Features */}
                            <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
                                <p style={{ margin: '8px 0', fontWeight: '600' }}>✓ Premium Quality</p>
                                <p style={{ margin: '8px 0', fontWeight: '600' }}>✓ Free Shipping on Orders Above ₹500</p>
                                <p style={{ margin: '8px 0', fontWeight: '600' }}>✓ 30-Day Easy Returns</p>
                                <p style={{ margin: '8px 0', fontWeight: '600' }}>✓ 100% Authentic Products</p>
                            </div>

                            <div style={{ display: 'flex', gap: '15px' }}>
                                <button className="btn secondary" style={{ flex: 1 }} onClick={() => generateOrder(selectedProduct)}>
                                    Buy Now
                                </button>
                                <button className="btn" style={{ flex: 1 }} onClick={() => handleAddToCart(selectedProduct)}>
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* PAYMENT VIEW */}
            {view === 'payment' && selectedProduct && (
                <div className="container">
                    <div className="order-portal">
                        <h2>Secure Checkout #{orderId}</h2>
                        <hr />

                        <div className="order-details">
                            <div className="detail-row">
                                <span>Product:</span>
                                <strong>{selectedProduct.name}</strong>
                            </div>
                            <div className="detail-row">
                                <span>Price:</span>
                                <strong>₹{selectedProduct.price}</strong>
                            </div>
                            <div className="detail-row">
                                <span>Shipping:</span>
                                <strong style={{ color: 'var(--accent)' }}>Free</strong>
                            </div>
                            <hr style={{ margin: '15px 0' }} />
                            <div className="detail-row" style={{ fontSize: '18px', fontWeight: 'bold' }}>
                                <span>Total:</span>
                                <span>₹{selectedProduct.price}</span>
                            </div>
                        </div>

                        <div className="payment-method">
                            <strong style={{ color: 'var(--accent)' }}>Choose Payment Method</strong>
                        </div>

                        <div className="payment-options">
                            <div
                                className={`payment-option ${paymentMethod === 'razorpay' ? 'active' : ''}`}
                                onClick={() => setPaymentMethod('razorpay')}
                            >
                                💳 Card/Razorpay
                            </div>
                            <div
                                className={`payment-option ${paymentMethod === 'upi' ? 'active' : ''}`}
                                onClick={() => setPaymentMethod('upi')}
                            >
                                📱 UPI Payment
                            </div>
                        </div>

                        {paymentMethod === 'razorpay' && (
                            <button className="btn secondary" onClick={handleRazorpayPayment}>
                                Pay ₹{selectedProduct.price} with Razorpay
                            </button>
                        )}

                        {paymentMethod === 'upi' && (
                            <>
                                <div className="payment-method">
                                    📱 Scan & Pay via UPI<br/>
                                    <strong>sanbae@upi</strong> or <strong>9876543210</strong>
                                </div>
                                <div className="file-input-wrapper">
                                    <label>Upload Payment Screenshot:</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileUpload}
                                    />
                                    {uploadedFile && (
                                        <p style={{ color: 'var(--accent)', marginTop: '10px', fontWeight: 'bold' }}>
                                            ✓ {uploadedFile} uploaded
                                        </p>
                                    )}
                                </div>
                                <button className="btn" onClick={handleSubmitOrder}>
                                    Submit Payment Confirmation
                                </button>
                            </>
                        )}

                        <button
                            className="btn"
                            style={{ background: '#999', marginTop: '15px' }}
                            onClick={() => setView('home')}
                        >
                            Cancel Order
                        </button>
                    </div>
                </div>
            )}

            {/* CART VIEW */}
            {view === 'cart' && (
                <div className="container">
                    <h2 className="section-title">Shopping Cart ({cart.length} items)</h2>
                    {cart.length > 0 ? (
                        <div className="cart-section">
                            <div className="cart-items">
                                {cart.map((item, idx) => (
                                    <div className="cart-item" key={idx}>
                                        <img src={item.image} alt={item.name} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '4px' }} />
                                        <div style={{ flex: 1 }}>
                                            <h3>{item.name}</h3>
                                            <p>₹{item.price}</p>
                                        </div>
                                        <button className="btn btn-small" onClick={() => generateOrder(item)}>
                                            Checkout
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p style={{ textAlign: 'center', color: '#999', padding: '40px' }}>Your cart is empty</p>
                    )}
                    <button className="btn" style={{ marginTop: '20px' }} onClick={() => setView('home')}>
                        Continue Shopping
                    </button>
                </div>
            )}

            {/* WISHLIST VIEW */}
            {view === 'wishlist' && (
                <div className="container">
                    <h2 className="section-title">My Wishlist ({wishlist.length} items)</h2>
                    {wishlist.length > 0 ? (
                        <div className="grid">
                            {wishlist.map((product) => (
                                <div className="card" key={product.id}>
                                    <div className="card-image-container">
                                        <div
                                            className="img-box"
                                            style={{ backgroundImage: `url(${product.image})` }}
                                            onClick={() => handleProductClick(product)}
                                        ></div>
                                        <div className="price-badge">₹{product.price}</div>
                                    </div>
                                    <div className="card-content">
                                        <h3 className="product-name">{product.name}</h3>
                                        <p className="product-desc">{product.desc}</p>
                                        <button className="btn secondary" onClick={() => generateOrder(product)}>
                                            Buy Now
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{ textAlign: 'center', color: '#999', padding: '40px' }}>Your wishlist is empty</p>
                    )}
                    <button className="btn" style={{ marginTop: '20px' }} onClick={() => setView('home')}>
                        Continue Shopping
                    </button>
                </div>
            )}

            {/* ADMIN VIEW */}
            {view === 'admin' && (
                <div className="container">
                    <div className="admin-panel">
                        <div className="admin-header">
                            <h2>Admin Control Panel</h2>
                            <p style={{ margin: '10px 0 0 0', opacity: 0.9 }}>Total Orders: {pendingOrders.length}</p>
                        </div>
                        <div className="admin-stats">
                            <div className="stat-box">
                                <div className="stat-number">{pendingOrders.length}</div>
                                <div>Total Orders</div>
                            </div>
                            <div className="stat-box">
                                <div className="stat-number">₹{pendingOrders.reduce((sum, o) => sum + o.amount, 0)}</div>
                                <div>Total Revenue</div>
                            </div>
                            <div className="stat-box">
                                <div className="stat-number">{pendingOrders.filter(o => o.status.includes('Verified')).length}</div>
                                <div>Verified Orders</div>
                            </div>
                        </div>
                        <div className="pending-orders">
                            {pendingOrders.length > 0 ? (
                                pendingOrders.map((order) => (
                                    <div className="order-card" key={order.id}>
                                        <div className="order-info">
                                            <div className="order-id">{order.id}</div>
                                            <div className="order-status">
                                                <p>Customer: {order.customer}</p>
                                                <p>Date: {order.date} | Amount: ₹{order.amount}</p>
                                                <p>Status: {order.status}</p>
                                            </div>
                                        </div>
                                        <div className="order-actions">
                                            <button className="btn btn-small">View Details</button>
                                            {order.status === 'Awaiting Verification' && (
                                                <button
                                                    className="btn btn-small btn-verify"
                                                    onClick={() => handleVerifyOrder(order.id)}
                                                >
                                                    Verify & Dispatch
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                                    No orders yet
                                </div>
                            )}
                        </div>
                        <button className="btn" style={{ marginTop: '30px' }} onClick={() => setView('home')}>
                            Back to Home
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;