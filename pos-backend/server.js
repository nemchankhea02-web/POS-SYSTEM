const fastify = require('fastify')({ logger: true });
const mysql = require('mysql2/promise');
const path = require('path');
const bcrypt = require('bcrypt');

// ================= CORS =================
fastify.register(require('@fastify/cors'), {
  origin: "*",
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
});

const distPath = path.join(__dirname, '../dist');

fastify.register(require('@fastify/static'), {
  root: distPath,
  prefix: '/', // ឱ្យវាស្គាល់រាល់ file ទាំងអស់ចាប់ពី root ទៅ
  wildcard: false // បិទ wildcard ត្រង់នេះ ដើម្បីកុំឱ្យជាន់ជាមួយ route ខាងក្រោម
});
// ២. បង្កើត Route ដើម្បីឱ្យវាបើក index.html ជាដំបូង
fastify.get('/*', (req, reply) => {
  return reply.sendFile('index.html');
});
// ================= JWT =================
fastify.register(require('@fastify/jwt'), {
  secret: 'supersecretkey'
});

// ================= DB =================
const db = mysql.createPool({
  host: 'mysql-235abaa9-nemchankhea02-75ee.k.aivencloud.com', // យកពី Aiven
  port: 24930,                                               // យកពី Aiven
  user: 'avnadmin',                                          // យកពី Aiven
  password: 'AVNS_YofHVrL_vaTLlhceW_S', 
  database: 'defaultdb',                                     // ឈ្មោះ database លើ Aiven
  waitForConnections: true,
  connectionLimit: 10,
  timezone: '+07:00',
  dateStrings: true,
  ssl: {
    rejectUnauthorized: false // ត្រូវតែមានបន្ទាត់នេះ ទើបអាចភ្ជាប់ទៅ Cloud បាន
  }
});
// ================= AUTH =================
fastify.decorate('authenticate', async (req, reply) => {
  try {
    await req.jwtVerify();
  } catch (err) {
    return reply.code(401).send({ message: "Unauthorized" });
  }
});

// ================= HELPER FUNCTIONS =================
async function createNotification(userId, title, message, type) {
  try {
    const [result] = await db.query(
      'INSERT INTO notifications (user_id, title, message, type, is_read, created_at) VALUES (?, ?, ?, ?, false, NOW())',
      [userId || null, title, message, type]
    );
    return result.insertId;
  } catch (err) {
    console.error('Failed to create notification:', err);
    return null;
  }
}

async function createNotificationForAll(title, message, type) {
  try {
    const [users] = await db.query('SELECT id FROM users');
    for (const user of users) {
      await db.query(
        'INSERT INTO notifications (user_id, title, message, type, is_read, created_at) VALUES (?, ?, ?, ?, false, NOW())',
        [user.id, title, message, type]
      );
    }
    return true;
  } catch (err) {
    console.error('Failed to create notification for all:', err);
    return false;
  }
}

// ================= INIT DATABASE =================
async function initDatabase() {
  const conn = await db.getConnection();
  await conn.query("SET time_zone = '+07:00'");

  // Users table
  await conn.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) UNIQUE,
      password VARCHAR(255),
      role VARCHAR(20) DEFAULT 'user',
      email VARCHAR(100) NULL,
      fullname VARCHAR(100) NULL,
      phone VARCHAR(20) NULL,
      address TEXT NULL,
      avatar VARCHAR(500) NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Login history table
  await conn.query(`
    CREATE TABLE IF NOT EXISTS login_history (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      username VARCHAR(50),
      login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      ip_address VARCHAR(50)
    )
  `);

  // Products table
  await conn.query(`
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      barcode VARCHAR(100) UNIQUE,
      category VARCHAR(100) DEFAULT 'Uncategorized',
      price DECIMAL(10,2) NOT NULL,
      image VARCHAR(500) NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Product transactions table
  await conn.query(`
    CREATE TABLE IF NOT EXISTS product_transactions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      product_id INT NOT NULL,
      qty INT NOT NULL,
      status ENUM('IN', 'SALE') NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )
  `);

  // Sales table
  await conn.query(`
    CREATE TABLE IF NOT EXISTS sales (
      id INT AUTO_INCREMENT PRIMARY KEY,
      receipt_number VARCHAR(50) UNIQUE NOT NULL,
      total_amount DECIMAL(10,2) NOT NULL,
      payment_method VARCHAR(50) DEFAULT 'Cash',
      payment_status ENUM('Paid', 'Unpaid', 'Pending') DEFAULT 'Paid',
      customer_name VARCHAR(100) NULL,
      customer_phone VARCHAR(20) NULL,
      customer_email VARCHAR(100) NULL,
      reference_number VARCHAR(100) NULL,
      status VARCHAR(20) DEFAULT 'Completed',
      currency VARCHAR(10) DEFAULT 'USD',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Customers table
  await conn.query(`
    CREATE TABLE IF NOT EXISTS customers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      phone VARCHAR(20) NULL,
      email VARCHAR(100) NULL,
      address TEXT NULL,
      total_spent DECIMAL(10,2) DEFAULT 0,
      point INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Sale items table
  await conn.query(`
    CREATE TABLE IF NOT EXISTS sale_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      sale_id INT NOT NULL,
      product_id INT NOT NULL,
      quantity INT NOT NULL,
      unit_price DECIMAL(10,2) NOT NULL,
      total_price DECIMAL(10,2) NOT NULL,
      FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )
  `);

  // Notifications table
  await conn.query(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NULL,
      title VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      type ENUM('success', 'warning', 'info', 'error') DEFAULT 'info',
      is_read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Insert default admin
  const [admin] = await conn.query("SELECT id FROM users WHERE username='admin'");
  if (admin.length === 0) {
    const hash = await bcrypt.hash('admin123', 10);
    await conn.query(
      "INSERT INTO users (username, password, role, fullname) VALUES (?, ?, ?, ?)",
      ['admin', hash, 'admin', 'System Administrator']
    );
    await createNotification(1, 'Welcome to POS System!', 'Thank you for using our POS system.', 'success');
  }

  conn.release();
}
initDatabase();

// ================= COMPANY INFO TABLE =================
async function initCompanyTable() {
  const conn = await db.getConnection();
  try {
    await conn.query(`
      CREATE TABLE IF NOT EXISTS company_info (
        id INT PRIMARY KEY DEFAULT 1,
        name VARCHAR(255) NULL,
        email VARCHAR(100) NULL,
        phone VARCHAR(50) NULL,
        address TEXT NULL,
        website VARCHAR(255) NULL,
        logo VARCHAR(500) NULL,
        tax_id VARCHAR(100) NULL,
        currency VARCHAR(10) DEFAULT 'USD',
        footer_note TEXT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT check_single_row CHECK (id = 1)
      )
    `);
    
    const [existing] = await conn.query("SELECT id FROM company_info WHERE id = 1");
    if (existing.length === 0) {
      await conn.query(`
        INSERT INTO company_info (id, name, email, phone, address, website, logo, tax_id, currency, footer_note) 
        VALUES (1, 'POS System', 'info@pos.com', '+855 12 345 6789', 'Street Address, City, Country', 'www.pos.com', NULL, NULL, 'USD', 'Thank you for your business!')
      `);
      console.log('✅ Default company info created');
    }
  } catch (err) {
    console.error('Failed to create company_info table:', err);
  } finally {
    conn.release();
  }
}
initCompanyTable();

// ================= LOGIN =================
fastify.post('/login', async (req, reply) => {
  const { username, password } = req.body;
  const [rows] = await db.query("SELECT * FROM users WHERE username=?", [username]);
  if (!rows.length) return reply.code(401).send({ message: "User not found" });

  const user = rows[0];
  const match = await bcrypt.compare(password, user.password);
  if (!match) return reply.code(401).send({ message: "Wrong password" });

  const token = fastify.jwt.sign({ id: user.id, username: user.username, role: user.role });
  
  const ip = req.headers['x-forwarded-for'] || req.ip || req.socket.remoteAddress || '127.0.0.1';
  
  try {
    await db.query(
      "INSERT INTO login_history (user_id, username, ip_address, login_time) VALUES (?, ?, ?, NOW())", 
      [user.id, user.username, ip]
    );
    console.log(`✅ Login recorded for user: ${username} from IP: ${ip}`);
  } catch (err) {
    console.error("Failed to record login history:", err);
  }

  const { password: _, ...userWithoutPassword } = user;
  reply.send({ token, user: userWithoutPassword });
});

// ================= USERS =================
fastify.get('/users', { preHandler: [fastify.authenticate] }, async (req, reply) => {
  if (req.user.role !== 'admin') {
    return reply.code(403).send({ message: 'Admin access required' });
  }
  
  const [rows] = await db.query(`
    SELECT id, username, role, email, fullname, phone, address, created_at 
    FROM users
    ORDER BY created_at DESC
  `);
  
  for (const user of rows) {
    const [lastLogin] = await db.query(
      `SELECT login_time, ip_address FROM login_history WHERE user_id = ? ORDER BY login_time DESC LIMIT 1`,
      [user.id]
    );
    if (lastLogin.length > 0) {
      user.lastLogin = lastLogin[0].login_time;
      user.lastIp = lastLogin[0].ip_address;
    } else {
      user.lastLogin = null;
      user.lastIp = null;
    }
  }
  
  reply.send(rows);
});

fastify.get('/users/:id', { preHandler: [fastify.authenticate] }, async (req, reply) => {
  if (req.user.role !== 'admin' && req.user.id !== parseInt(req.params.id)) {
    return reply.code(403).send({ message: 'Access denied' });
  }
  
  const [rows] = await db.query(`
    SELECT id, username, role, email, fullname, phone, address, avatar, created_at 
    FROM users 
    WHERE id = ?
  `, [req.params.id]);
  if (!rows.length) return reply.code(404).send({ message: 'User not found' });
  reply.send(rows[0]);
});

fastify.post('/users', { preHandler: [fastify.authenticate] }, async (req, reply) => {
  if (req.user.role !== 'admin') {
    return reply.code(403).send({ message: 'Admin access required' });
  }
  
  const { username, password, role, email, fullname, phone, address } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const [result] = await db.query(
    "INSERT INTO users (username, password, role, email, fullname, phone, address) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [username, hash, role || 'user', email || null, fullname || null, phone || null, address || null]
  );
  await createNotification(req.user.id, 'New User Created', `User "${username}" has been added`, 'info');
  reply.send({ message: "User created", id: result.insertId });
});

fastify.put('/users/:id', { preHandler: [fastify.authenticate] }, async (req, reply) => {
  if (req.user.role !== 'admin' && req.user.id !== parseInt(req.params.id)) {
    return reply.code(403).send({ message: 'Access denied' });
  }
  
  const { username, role, email, fullname, phone, address, password } = req.body;
  
  const updates = [];
  const values = [];
  
  if (username) { updates.push('username = ?'); values.push(username); }
  if (role) { updates.push('role = ?'); values.push(role); }
  if (email !== undefined) { updates.push('email = ?'); values.push(email); }
  if (fullname !== undefined) { updates.push('fullname = ?'); values.push(fullname); }
  if (phone !== undefined) { updates.push('phone = ?'); values.push(phone); }
  if (address !== undefined) { updates.push('address = ?'); values.push(address); }
  
  if (password) {
    const hash = await bcrypt.hash(password, 10);
    updates.push('password = ?');
    values.push(hash);
  }
  
  if (updates.length === 0) {
    return reply.code(400).send({ message: 'No fields to update' });
  }
  
  values.push(req.params.id);
  await db.query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values);
  reply.send({ message: "Updated" });
});

fastify.delete('/users/:id', { preHandler: [fastify.authenticate] }, async (req, reply) => {
  if (req.user.role !== 'admin') {
    return reply.code(403).send({ message: 'Admin access required' });
  }
  if (Number(req.params.id) === Number(req.user.id)) {
    return reply.code(400).send({ message: "Cannot delete yourself" });
  }
  await db.query("DELETE FROM users WHERE id=?", [req.params.id]);
  reply.send({ message: "Deleted" });
});

fastify.get('/login-history/:id', { preHandler: [fastify.authenticate] }, async (req, reply) => {
  if (req.user.role !== 'admin') {
    return reply.code(403).send({ message: 'Admin access required' });
  }

  const [rows] = await db.query(
    `SELECT login_time, ip_address 
     FROM login_history 
     WHERE user_id = ? 
     ORDER BY login_time DESC 
     LIMIT 20`,
    [req.params.id]
  );

  reply.send(rows);
});

// ================= COMPANY INFO ENDPOINTS =================
fastify.get('/company/info', { preHandler: [fastify.authenticate] }, async (req, reply) => {
  try {
    const [rows] = await db.query("SELECT * FROM company_info WHERE id = 1");
    if (rows.length === 0) {
      return reply.send({
        id: null,
        name: "",
        email: "",
        phone: "",
        address: "",
        website: "",
        logo: "",
        taxId: "",
        currency: "USD",
        footerNote: "Thank you for your business!"
      });
    }
    
    const company = rows[0];
    reply.send({
      id: company.id,
      name: company.name || "",
      email: company.email || "",
      phone: company.phone || "",
      address: company.address || "",
      website: company.website || "",
      logo: company.logo || "",
      taxId: company.tax_id || "",
      currency: company.currency || "USD",
      footerNote: company.footer_note || "Thank you for your business!"
    });
  } catch (err) {
    console.error('Error fetching company info:', err);
    reply.code(500).send({ message: 'Failed to fetch company information', error: err.message });
  }
});

fastify.post('/company/info', { preHandler: [fastify.authenticate] }, async (req, reply) => {
  if (req.user.role !== 'admin') {
    return reply.code(403).send({ message: 'Admin access required' });
  }
  
  const { name, email, phone, address, website, logo, taxId, currency, footerNote } = req.body;
  
  try {
    await db.query(`
      UPDATE company_info 
      SET name = ?, email = ?, phone = ?, address = ?, website = ?, 
          logo = ?, tax_id = ?, currency = ?, footer_note = ?, updated_at = NOW()
      WHERE id = 1
    `, [name || null, email || null, phone || null, address || null, website || null, 
        logo || null, taxId || null, currency || 'USD', footerNote || null]);
    
    await createNotification(req.user.id, 'Company Info Updated', 'Company information has been updated successfully', 'success');
    
    reply.send({ 
      success: true, 
      message: 'Company information updated successfully',
      data: { name, email, phone, address, website, logo, taxId, currency, footerNote }
    });
  } catch (err) {
    console.error('Error updating company info:', err);
    reply.code(500).send({ message: 'Failed to update company information', error: err.message });
  }
});

fastify.post('/company/logo', { preHandler: [fastify.authenticate] }, async (req, reply) => {
  if (req.user.role !== 'admin') {
    return reply.code(403).send({ message: 'Admin access required' });
  }
  
  const { logoUrl } = req.body;
  
  if (!logoUrl) {
    return reply.code(400).send({ message: 'Logo URL is required', success: false });
  }
  
  try {
    await db.query(`UPDATE company_info SET logo = ?, updated_at = NOW() WHERE id = 1`, [logoUrl]);
    await createNotification(req.user.id, 'Company Logo Updated', 'Company logo has been updated successfully', 'success');
    reply.send({ success: true, message: 'Company logo updated successfully', logoUrl: logoUrl });
  } catch (err) {
    console.error('Error updating company logo:', err);
    reply.code(500).send({ message: 'Failed to update company logo', error: err.message });
  }
});

// ================= USER PROFILE =================
fastify.get('/user/profile', { preHandler: [fastify.authenticate] }, async (req, reply) => {
  try {
    const [rows] = await db.query(
      `SELECT id, username, role, email, fullname, phone, address, avatar, created_at FROM users WHERE id = ?`,
      [req.user.id]
    );
    
    if (!rows.length) {
      return reply.code(404).send({ message: 'User not found' });
    }
    
    const [lastLogin] = await db.query(
      `SELECT login_time FROM login_history WHERE user_id = ? ORDER BY login_time DESC LIMIT 1`,
      [req.user.id]
    );
    
    const user = rows[0];
    user.last_login = lastLogin.length > 0 ? lastLogin[0].login_time : null;
    
    reply.send(user);
  } catch (err) {
    console.error('Get profile error:', err);
    reply.code(500).send({ message: 'Failed to fetch profile', error: err.message });
  }
});

fastify.put('/user/profile', { preHandler: [fastify.authenticate] }, async (req, reply) => {
  const { username, email, fullname, phone, address, current_password, new_password } = req.body;
  
  try {
    let updateFields = [];
    let values = [];
    
    if (username) {
      updateFields.push('username = ?');
      values.push(username);
    }
    if (email !== undefined) {
      updateFields.push('email = ?');
      values.push(email || null);
    }
    if (fullname !== undefined) {
      updateFields.push('fullname = ?');
      values.push(fullname || null);
    }
    if (phone !== undefined) {
      updateFields.push('phone = ?');
      values.push(phone || null);
    }
    if (address !== undefined) {
      updateFields.push('address = ?');
      values.push(address || null);
    }
    
    if (new_password) {
      const [user] = await db.query('SELECT password FROM users WHERE id = ?', [req.user.id]);
      if (!user.length) {
        return reply.code(404).send({ message: 'User not found' });
      }
      
      const isValid = await bcrypt.compare(current_password, user[0].password);
      if (!isValid) {
        return reply.code(401).send({ message: 'Current password is incorrect' });
      }
      
      const hashedPassword = await bcrypt.hash(new_password, 10);
      updateFields.push('password = ?');
      values.push(hashedPassword);
    }
    
    if (updateFields.length === 0) {
      return reply.send({ success: true, message: 'No changes made' });
    }
    
    values.push(req.user.id);
    await db.query(`UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`, values);
    
    const [updatedUser] = await db.query(
      `SELECT id, username, role, email, fullname, phone, address, avatar, created_at FROM users WHERE id = ?`,
      [req.user.id]
    );
    
    await createNotification(req.user.id, 'Profile Updated', 'Your profile information has been updated', 'info');
    
    reply.send({ 
      success: true, 
      message: 'Profile updated successfully',
      user: updatedUser[0]
    });
  } catch (err) {
    console.error('Update profile error:', err);
    reply.code(500).send({ message: 'Failed to update profile', error: err.message });
  }
});

fastify.post('/user/avatar', { preHandler: [fastify.authenticate] }, async (req, reply) => {
  const { avatarUrl } = req.body;
  
  if (!avatarUrl) {
    return reply.code(400).send({ message: 'Avatar URL is required', success: false });
  }
  
  try {
    await db.query('UPDATE users SET avatar = ? WHERE id = ?', [avatarUrl, req.user.id]);
    reply.send({ success: true, message: 'Avatar updated successfully', avatarUrl: avatarUrl });
  } catch (err) {
    console.error('Update avatar error:', err);
    reply.code(500).send({ message: 'Failed to update avatar', success: false, error: err.message });
  }
});

fastify.get('/user/sessions', { preHandler: [fastify.authenticate] }, async (req, reply) => {
  try {
    const [sessions] = await db.query(
      `SELECT id, login_time, ip_address FROM login_history WHERE user_id = ? ORDER BY login_time DESC LIMIT 10`,
      [req.user.id]
    );
    reply.send(sessions);
  } catch (err) {
    console.error('Get sessions error:', err);
    reply.code(500).send({ message: 'Failed to fetch sessions', error: err.message });
  }
});

// ================= CUSTOMERS =================
fastify.get('/customers', async (req, reply) => {
  const [rows] = await db.query(`
    SELECT id, name, phone, email, address, total_spent, point, created_at
    FROM customers
    ORDER BY name ASC
  `);
  reply.send(rows);
});

fastify.get('/customers/search/:keyword', async (req, reply) => {
  const keyword = `%${req.params.keyword}%`;
  const [rows] = await db.query(`
    SELECT id, name, phone, email, address, total_spent, point, created_at
    FROM customers
    WHERE name LIKE ? OR phone LIKE ? OR email LIKE ?
    ORDER BY name ASC
  `, [keyword, keyword, keyword]);
  reply.send(rows);
});

fastify.post('/customers', async (req, reply) => {
  const { name, phone, email, address } = req.body;
  const [result] = await db.query(`
    INSERT INTO customers (name, phone, email, address)
    VALUES (?, ?, ?, ?)
  `, [name, phone || null, email || null, address || null]);
  reply.send({ message: 'Customer created', id: result.insertId });
});

fastify.put('/customers/:id', async (req, reply) => {
  const { name, phone, email, address } = req.body;
  await db.query(`
    UPDATE customers SET name=?, phone=?, email=?, address=? WHERE id=?
  `, [name, phone || null, email || null, address || null, req.params.id]);
  reply.send({ message: 'Customer updated' });
});

fastify.delete('/customers/:id', async (req, reply) => {
  await db.query(`DELETE FROM customers WHERE id = ?`, [req.params.id]);
  reply.send({ message: 'Customer deleted' });
});

// ================= DASHBOARD STATS (FIXED for Cambodia Timezone 2026) =================
fastify.get('/dashboard/stats', { preHandler: [fastify.authenticate] }, async (req, reply) => {
  try {
    // Force Cambodia timezone for entire session
    await db.query("SET time_zone = '+07:00'");
    await db.query("SET SESSION time_zone = '+07:00'");
    
 
    // Total Sales (all time)
    const [sales] = await db.query(`SELECT COALESCE(SUM(total_amount),0) as totalSales, COUNT(*) as totalOrders FROM sales WHERE status = 'Completed'`);
    
    // Total Products
    const [products] = await db.query(`SELECT COUNT(*) as totalProducts FROM products`);
    
    // User Count
    const [users] = await db.query(`SELECT COUNT(*) as userCount FROM users`);
    
    // Low Stock (≤5)
    const [lowStock] = await db.query(`
      SELECT COUNT(*) as lowStock FROM (
        SELECT p.id, COALESCE(SUM(CASE WHEN pt.status='IN' THEN pt.qty WHEN pt.status='SALE' THEN -pt.qty ELSE 0 END),0) as stock
        FROM products p LEFT JOIN product_transactions pt ON p.id = pt.product_id
        GROUP BY p.id HAVING stock <= 5 AND stock > 0
      ) as t
    `);
    
    // TODAY'S SALES - Using direct date comparison with Cambodia timezone
    const [today] = await db.query(`
      SELECT COALESCE(SUM(total_amount),0) as todaySales 
      FROM sales 
      WHERE DATE(created_at) = CURDATE() 
      AND status = 'Completed'
    `);
    
    // YESTERDAY'S SALES
    const [yesterday] = await db.query(`
      SELECT COALESCE(SUM(total_amount),0) as yesterdaySales 
      FROM sales 
      WHERE DATE(created_at) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)
      AND status = 'Completed'
    `);
    
    // THIS YEAR SALES (2026)
    const [thisYear] = await db.query(`
      SELECT COALESCE(SUM(total_amount),0) as thisYearSales 
      FROM sales 
      WHERE YEAR(created_at) = YEAR(CURDATE())
      AND status = 'Completed'
    `);
    
    console.log('📊 Today Sales:', today[0].todaySales);
    console.log('📊 Yesterday Sales:', yesterday[0].yesterdaySales);
    console.log('📊 This Year Sales:', thisYear[0].thisYearSales);
    
    // Calculate sales growth
    const salesGrowth = yesterday[0].yesterdaySales > 0 
      ? ((today[0].todaySales - yesterday[0].yesterdaySales) / yesterday[0].yesterdaySales) * 100 
      : 0;
    
    // Top 5 Products
    const [topProducts] = await db.query(`
      SELECT p.name, COALESCE(SUM(si.quantity),0) as total_sold
      FROM products p 
      LEFT JOIN sale_items si ON p.id = si.product_id
      GROUP BY p.id 
      ORDER BY total_sold DESC 
      LIMIT 5
    `);
    
    // Last 7 Days Sales
    const [dailySales] = await db.query(`
      SELECT 
        DATE(created_at) as date,
        COALESCE(SUM(total_amount),0) as total
      FROM sales 
      WHERE DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
        AND status = 'Completed'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);
    
    // Fill missing dates with proper formatting
    const filledDailySales = [];
    const todayCambodia = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date(todayCambodia);
      d.setDate(d.getDate() - i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      const displayDate = `${month}/${day}`;
      
      const found = dailySales.find(s => {
        const saleDate = new Date(s.date);
        const saleYear = saleDate.getFullYear();
        const saleMonth = String(saleDate.getMonth() + 1).padStart(2, '0');
        const saleDay = String(saleDate.getDate()).padStart(2, '0');
        return `${saleYear}-${saleMonth}-${saleDay}` === dateStr;
      });
      
      filledDailySales.push({ date: displayDate, total: found ? parseFloat(found.total) : 0 });
    }
    
    // Recent Sales (last 5)
    const [recentSales] = await db.query(`
      SELECT receipt_number, total_amount, customer_name, created_at, payment_method 
      FROM sales 
      WHERE status = 'Completed'
      ORDER BY created_at DESC 
      LIMIT 5
    `);
    
    // Recent Logins (last 5)
    const [recentLogins] = await db.query(`
      SELECT username, login_time, ip_address 
      FROM login_history 
      ORDER BY login_time DESC 
      LIMIT 5
    `);
    
    reply.send({
      totalSales: parseFloat(sales[0].totalSales),
      totalOrders: parseInt(sales[0].totalOrders),
      totalProducts: parseInt(products[0].totalProducts),
      userCount: parseInt(users[0].userCount),
      adminCount: 1,
      lowStock: parseInt(lowStock[0].lowStock),
      todaySales: parseFloat(today[0].todaySales),
      yesterdaySales: parseFloat(yesterday[0].yesterdaySales),
      thisYearSales: parseFloat(thisYear[0].thisYearSales),
      salesGrowth: parseFloat(salesGrowth.toFixed(2)),
      topProducts: topProducts.map(p => ({ name: p.name, total_sold: parseInt(p.total_sold) })),
      dailySales: filledDailySales,
      recentSales: recentSales,
      recentLogins: recentLogins
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    reply.code(500).send({ message: err.message });
  }
});

// ================= PRODUCTS =================
fastify.get('/products', async (req, reply) => {
  const [products] = await db.query(`
    SELECT 
      p.*,
      COALESCE(SUM(CASE 
        WHEN pt.status='IN' THEN pt.qty 
        WHEN pt.status='SALE' THEN -pt.qty 
        ELSE 0 
      END), 0) as stock,
      COALESCE(SUM(CASE 
        WHEN pt.status='IN' THEN pt.qty * p.price
        WHEN pt.status='SALE' THEN -pt.qty * p.price
        ELSE 0 
      END), 0) as inventory_value
    FROM products p 
    LEFT JOIN product_transactions pt ON p.id = pt.product_id
    GROUP BY p.id, p.name, p.barcode, p.category, p.price, p.image
    ORDER BY p.name ASC
  `);
  reply.send(products);
});

fastify.get('/products/:id', async (req, reply) => {
  const [rows] = await db.query(`
    SELECT p.*, COALESCE(SUM(CASE WHEN pt.status='IN' THEN pt.qty WHEN pt.status='SALE' THEN -pt.qty ELSE 0 END),0) as stock
    FROM products p LEFT JOIN product_transactions pt ON p.id = pt.product_id
    WHERE p.id = ? GROUP BY p.id
  `, [req.params.id]);
  if (!rows.length) return reply.code(404).send({ message: 'Product not found' });
  reply.send(rows[0]);
});

fastify.post('/products', async (req, reply) => {
  const { name, barcode, category, price, stock, image } = req.body;
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const [res] = await conn.query(
      'INSERT INTO products (name, barcode, category, price, image) VALUES (?, ?, ?, ?, ?)',
      [name, barcode, category || 'Uncategorized', price, image]
    );
    if (parseInt(stock) > 0) {
      await conn.query('INSERT INTO product_transactions (product_id, qty, status) VALUES (?, ?, ?)', [res.insertId, stock, 'IN']);
    }
    await conn.commit();
    await createNotificationForAll('New Product Added', `${name} added to inventory`, 'info');
    reply.send({ success: true, productId: res.insertId });
  } catch (err) {
    await conn.rollback();
    reply.code(500).send({ message: err.message });
  } finally { conn.release(); }
});

fastify.put('/products/:id', async (req, reply) => {
  const { name, barcode, category, price, image, stock } = req.body;
  await db.query(
    'UPDATE products SET name=?, barcode=?, category=?, price=?, image=? WHERE id=?',
    [name, barcode, category, price, image, req.params.id]
  );
  if (stock !== undefined && parseInt(stock) !== 0) {
    await db.query(
      'INSERT INTO product_transactions (product_id, qty, status) VALUES (?, ?, ?)',
      [req.params.id, Math.abs(stock), stock > 0 ? 'IN' : 'ADJUST']
    );
  }
  reply.send({ success: true });
});

fastify.delete('/products/:id', async (req, reply) => {
  await db.query('DELETE FROM products WHERE id=?', [req.params.id]);
  reply.send({ success: true });
});

fastify.patch('/products/:id/stock', async (req, reply) => {
  const { id } = req.params;
  const { qtyChange, type } = req.body;
  
  if (!qtyChange || isNaN(qtyChange) || qtyChange <= 0) {
    return reply.code(400).send({ message: 'Valid quantity change is required', success: false });
  }
  
  if (!type || !['IN', 'SALE'].includes(type)) {
    return reply.code(400).send({ message: 'Valid type (IN or SALE) is required', success: false });
  }
  
  try {
    const [product] = await db.query('SELECT id, name FROM products WHERE id = ?', [id]);
    if (product.length === 0) {
      return reply.code(404).send({ message: 'Product not found', success: false });
    }
    
    if (type === 'SALE') {
      const [stockResult] = await db.query(`
        SELECT COALESCE(SUM(CASE 
          WHEN status='IN' THEN qty 
          WHEN status='SALE' THEN -qty 
          ELSE 0 
        END), 0) AS currentStock
        FROM product_transactions
        WHERE product_id = ?
      `, [id]);
      
      const currentStock = stockResult[0].currentStock;
      
      if (currentStock < qtyChange) {
        return reply.code(400).send({ 
          message: `Insufficient stock! Available: ${currentStock}, Requested: ${qtyChange}`,
          success: false
        });
      }
    }
    
    await db.query(
      'INSERT INTO product_transactions (product_id, qty, status) VALUES (?, ?, ?)',
      [id, qtyChange, type]
    );
    
    const [updatedStock] = await db.query(`
      SELECT COALESCE(SUM(CASE 
        WHEN status='IN' THEN qty 
        WHEN status='SALE' THEN -qty 
        ELSE 0 
      END), 0) AS newStock
      FROM product_transactions
      WHERE product_id = ?
    `, [id]);
    
    reply.send({ 
      success: true,
      message: `Stock ${type === 'IN' ? 'added' : 'removed'} successfully`,
      newStock: updatedStock[0].newStock
    });
    
  } catch (err) {
    console.error('Stock update error:', err);
    reply.code(500).send({ message: 'Failed to update stock', success: false, error: err.message });
  }
});

// ================= SALES =================
fastify.post('/sales', async (req, reply) => {
  const { items, total_amount, payment_method, customer_name, customer_phone, customer_email, payment_status, reference_number, currency } = req.body;
  
  if (!items || items.length === 0) return reply.code(400).send({ message: 'No items', success: false });
  
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    const receiptNumber = 'REC-' + Date.now();
    
    const [sale] = await conn.query(
      `INSERT INTO sales (receipt_number, total_amount, payment_method, payment_status, customer_name, customer_phone, customer_email, reference_number, status, currency) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Completed', ?)`,
      [receiptNumber, total_amount, payment_method || 'Cash', payment_status || 'Paid', customer_name || null, customer_phone || null, customer_email || null, reference_number || null, currency || 'USD']
    );
    
    if (customer_name && customer_name !== 'Walk-in Customer') {
      const pointsEarned = Math.floor(total_amount / 10);
      const [existingCustomer] = await conn.query(
        'SELECT id, total_spent, point FROM customers WHERE name = ? OR phone = ?',
        [customer_name, customer_phone]
      );
      
      if (existingCustomer.length > 0) {
        await conn.query(
          'UPDATE customers SET total_spent = total_spent + ?, point = point + ? WHERE id = ?',
          [total_amount, pointsEarned, existingCustomer[0].id]
        );
      } else if (customer_name && customer_name !== '') {
        await conn.query(
          'INSERT INTO customers (name, phone, email, total_spent, point) VALUES (?, ?, ?, ?, ?)',
          [customer_name, customer_phone || null, customer_email || null, total_amount, pointsEarned]
        );
      }
    }
    
    for (const item of items) {
      const pid = item.product_id || item.id;
      await conn.query(
        'INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, total_price) VALUES (?, ?, ?, ?, ?)',
        [sale.insertId, pid, item.qty, item.unit_price || item.price, item.total_price || (item.price * item.qty)]
      );
      await conn.query(
        'INSERT INTO product_transactions (product_id, qty, status) VALUES (?, ?, ?)',
        [pid, item.qty, 'SALE']
      );
    }
    
    await conn.commit();
    const currencySymbol = currency === 'KHR' ? '៛' : '$';
    await createNotificationForAll('New Sale', `Sale #${receiptNumber}: ${currencySymbol}${total_amount}`, 'success');
    
    reply.send({ success: true, receipt_number: receiptNumber });
  } catch (err) {
    await conn.rollback();
    console.error('Sale error:', err);
    reply.code(500).send({ message: err.message, success: false });
  } finally { conn.release(); }
});

fastify.get('/sales', async (req, reply) => {
  const [rows] = await db.query(`SELECT * FROM sales ORDER BY created_at DESC LIMIT 50`);
  reply.send(rows);
});

fastify.get('/sale-items', async (req, reply) => {
  const [rows] = await db.query(`SELECT si.*, p.name as product_name FROM sale_items si JOIN products p ON si.product_id = p.id ORDER BY si.sale_id DESC`);
  reply.send(rows);
});

fastify.get('/sale-items/:saleId', async (req, reply) => {
  const [rows] = await db.query(`
    SELECT si.*, p.name as product_name 
    FROM sale_items si JOIN products p ON si.product_id = p.id 
    WHERE si.sale_id = ?
  `, [req.params.saleId]);
  reply.send(rows);
});

// ================= REPORTS =================
// ================= REPORTS =================

fastify.get('/reports/products', async (req, reply) => {
  try {
    const [products] = await db.query(`
      SELECT 
        p.id,
        p.name,
        p.barcode,
        p.category,
        p.price,
        COALESCE(SUM(si.quantity), 0) as total_sold,
        COALESCE(SUM(si.total_price), 0) as total_revenue,
        COALESCE((
          SELECT SUM(CASE WHEN pt.status='IN' THEN pt.qty WHEN pt.status='SALE' THEN -pt.qty ELSE 0 END)
          FROM product_transactions pt
          WHERE pt.product_id = p.id
        ), 0) as current_stock
      FROM products p
      LEFT JOIN sale_items si ON p.id = si.product_id
      GROUP BY p.id, p.name, p.barcode, p.category, p.price
      ORDER BY total_sold DESC
    `);
    
    reply.send(products.map(p => ({
      ...p,
      total_sold: parseInt(p.total_sold) || 0,
      total_revenue: parseFloat(p.total_revenue) || 0,
      current_stock: parseInt(p.current_stock) || 0
    })));
  } catch (err) {
    console.error('Products report error:', err);
    reply.code(500).send({ message: err.message });
  }
});


fastify.get('/reports/sales-summary', async (req, reply) => {
  await db.query("SET time_zone = '+07:00'");
  const [rows] = await db.query(`SELECT COALESCE(SUM(total_amount),0) as totalSales, COUNT(*) as totalOrders, COALESCE(AVG(total_amount),0) as averageOrder FROM sales WHERE status = 'Completed'`);
  const [[items]] = await db.query(`SELECT COALESCE(SUM(quantity),0) as totalItems FROM sale_items`);
  reply.send({ ...rows[0], totalItems: parseInt(items.totalItems) });
});

fastify.get('/reports/customers', async (req, reply) => {
  const [customers] = await db.query(`
    SELECT c.id, c.name as customer_name, c.phone as customer_phone, c.email as customer_email, c.point,
      COUNT(s.id) as order_count, COALESCE(SUM(s.total_amount), 0) as total_spent,
      COALESCE(MAX(s.created_at), c.created_at) as last_purchase
    FROM customers c
    LEFT JOIN sales s ON s.customer_name = c.name
    GROUP BY c.id, c.name, c.phone, c.email, c.point, c.created_at
    UNION ALL
    SELECT NULL as id, s.customer_name, s.customer_phone, s.customer_email, 0 as point,
      COUNT(s.id) as order_count, COALESCE(SUM(s.total_amount), 0) as total_spent,
      MAX(s.created_at) as last_purchase
    FROM sales s
    WHERE s.customer_name IS NOT NULL AND s.customer_name NOT IN (SELECT name FROM customers)
    GROUP BY s.customer_name, s.customer_phone, s.customer_email
    ORDER BY total_spent DESC LIMIT 100
  `);
  reply.send(customers);
});

fastify.get('/reports/customers/:name', async (req, reply) => {
  const [sales] = await db.query(`
    SELECT s.id, s.receipt_number, s.total_amount, s.payment_method, s.created_at, COUNT(si.id) as item_count
    FROM sales s LEFT JOIN sale_items si ON s.id = si.sale_id
    WHERE s.customer_name = ? GROUP BY s.id ORDER BY s.created_at DESC
  `, [req.params.name]);
  reply.send(sales);
});

fastify.get('/reports/top-selling', async (req, reply) => {
  const [rows] = await db.query(`
    SELECT p.name, SUM(si.quantity) as sold, SUM(si.quantity * si.unit_price) as revenue
    FROM products p JOIN sale_items si ON p.id = si.product_id
    GROUP BY p.id ORDER BY sold DESC LIMIT 10
  `);
  reply.send(rows);
});

fastify.get('/reports/sale-tracking', async (req, reply) => {
  await db.query("SET time_zone = '+07:00'");
  const { startDate, endDate, customerName } = req.query;
  let conditions = [], params = [];
  if (startDate && endDate) {
    conditions.push("DATE(created_at) BETWEEN ? AND ?");
    params.push(startDate, endDate);
  }
  if (customerName) {
    conditions.push("customer_name LIKE ?");
    params.push(`%${customerName}%`);
  }
  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : "";
  
  const [sales] = await db.query(`
    SELECT id, receipt_number, total_amount, payment_method, payment_status, customer_name, customer_phone, created_at,
      (SELECT COUNT(*) FROM sale_items WHERE sale_id = sales.id) as item_count,
      (SELECT SUM(quantity) FROM sale_items WHERE sale_id = sales.id) as total_quantity
    FROM sales
    ${whereClause}
    ORDER BY created_at DESC LIMIT 100
  `, params);
  reply.send(sales);
});

fastify.get('/reports/sale-tracking/:id', async (req, reply) => {
  const [sale] = await db.query(`SELECT * FROM sales WHERE id = ?`, [req.params.id]);
  const [items] = await db.query(`SELECT si.*, p.name as product_name FROM sale_items si JOIN products p ON si.product_id = p.id WHERE si.sale_id = ?`, [req.params.id]);
  reply.send({ sale: sale[0], items: items });
});
fastify.get('/reports/sales', async (req, reply) => {
  await db.query("SET time_zone = '+07:00'");
  const { startDate, endDate, year } = req.query;
  let dateFilter = "", params = [];
  
  // If year is provided, filter by year
  if (year) {
    dateFilter = "WHERE YEAR(created_at) = ? AND status = 'Completed'";
    params = [year];
  } else if (startDate && endDate) {
    dateFilter = "WHERE DATE(created_at) BETWEEN ? AND ? AND status = 'Completed'";
    params = [startDate, endDate];
  } else {
    dateFilter = "WHERE status = 'Completed'";
  }
  
  const [dailySales] = await db.query(`
    SELECT 
      DATE(created_at) as date, 
      COUNT(DISTINCT s.id) as order_count,
      COALESCE(SUM(si.total_price), 0) as total_sales,
      COALESCE(AVG(si.total_price), 0) as avg_order,
      COALESCE(SUM(si.quantity), 0) as total_items
    FROM sales s
    LEFT JOIN sale_items si ON s.id = si.sale_id
    ${dateFilter}
    GROUP BY DATE(created_at)
    ORDER BY date DESC
  `, params);
  
  const [summary] = await db.query(`
    SELECT 
      COUNT(DISTINCT s.id) as total_orders,
      COALESCE(SUM(si.total_price), 0) as total_revenue,
      COALESCE(AVG(si.total_price), 0) as average_order,
      COALESCE(SUM(si.quantity), 0) as total_items
    FROM sales s
    LEFT JOIN sale_items si ON s.id = si.sale_id
    ${dateFilter}
  `, params);
  
  const [recentSales] = await db.query(`
    SELECT 
      s.id, 
      s.receipt_number, 
      COALESCE(SUM(si.total_price), 0) as total_amount,
      s.payment_method, 
      s.customer_name, 
      s.created_at
    FROM sales s
    LEFT JOIN sale_items si ON s.id = si.sale_id
    ${dateFilter}
    GROUP BY s.id, s.receipt_number, s.payment_method, s.customer_name, s.created_at
    ORDER BY s.created_at DESC
    LIMIT 20
  `, params);
  
  reply.send({ 
    dailySales: dailySales.map(d => ({
      ...d,
      date: d.date ? new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '',
      total_sales: parseFloat(d.total_sales),
      avg_order: parseFloat(d.avg_order)
    })),
    summary: {
      total_orders: summary[0]?.total_orders || 0,
      total_revenue: parseFloat(summary[0]?.total_revenue || 0),
      average_order: parseFloat(summary[0]?.average_order || 0),
      total_items: parseInt(summary[0]?.total_items || 0)
    },
    recentSales: recentSales.map(s => ({
      ...s,
      total_amount: parseFloat(s.total_amount)
    }))
  });
});
// ================= NOTIFICATIONS =================
fastify.get('/notifications', { preHandler: [fastify.authenticate] }, async (req, reply) => {
  const [rows] = await db.query(`SELECT * FROM notifications WHERE user_id = ? OR user_id IS NULL ORDER BY created_at DESC`, [req.user.id]);
  reply.send({ notifications: rows });
});

fastify.put('/notifications/:id/read', { preHandler: [fastify.authenticate] }, async (req, reply) => {
  await db.query('UPDATE notifications SET is_read = true WHERE id = ?', [req.params.id]);
  reply.send({ success: true });
});

fastify.put('/notifications/read-all', { preHandler: [fastify.authenticate] }, async (req, reply) => {
  await db.query('UPDATE notifications SET is_read = true WHERE user_id = ? OR user_id IS NULL', [req.user.id]);
  reply.send({ success: true });
});

fastify.delete('/notifications/:id', { preHandler: [fastify.authenticate] }, async (req, reply) => {
  await db.query('DELETE FROM notifications WHERE id = ?', [req.params.id]);
  reply.send({ success: true });
});

// ================= LOW STOCK CHECKER =================
async function checkLowStock() {
  await db.query("SET time_zone = '+07:00'");
  const [products] = await db.query(`
    SELECT p.id, p.name, COALESCE(SUM(CASE WHEN pt.status='IN' THEN pt.qty WHEN pt.status='SALE' THEN -pt.qty ELSE 0 END),0) as stock
    FROM products p LEFT JOIN product_transactions pt ON p.id = pt.product_id
    GROUP BY p.id HAVING stock <= 5 AND stock > 0
  `);
  const [users] = await db.query('SELECT id FROM users');
  for (const p of products) {
    for (const u of users) {
      const [exists] = await db.query(`SELECT id FROM notifications WHERE user_id=? AND title LIKE '%Low Stock%' AND message LIKE ? AND created_at > DATE_SUB(NOW(), INTERVAL 24 HOUR)`, [u.id, `%${p.name}%`]);
      if (exists.length === 0) {
        await createNotification(u.id, 'Low Stock Warning', `Product "${p.name}" has only ${p.stock} units left!`, 'warning');
      }
    }
  }
}
setInterval(() => checkLowStock(), 30 * 60 * 1000);
setTimeout(() => checkLowStock(), 5000);
// សម្រាប់ឱ្យ Vue Router ដើរ (SPA)
fastify.setNotFoundHandler((req, reply) => {
  return reply.sendFile('index.html');
});
// ================= START SERVER =================
const start = async () => {
  try {
    // ប្រើ process.env.PORT ដើម្បីឱ្យ Render កំណត់លេខ Port ឱ្យខ្លួនឯង
    const port = process.env.PORT || 3002; 
    
    await fastify.listen({ port: port, host: '0.0.0.0' });
    console.log(`🚀 Server running on http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();