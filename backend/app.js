const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const cors = require('cors');
const client = require('./db/conn.js'); // Ensure this is your PostgreSQL client setup

const app = express();
const port = 3000;
const secretKey = 'your-secret-key'; // Replace with your actual secret key

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}.${file.originalname}`);
    }
});
const upload = multer({ storage: storage });

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from 'Bearer <token>'
    if (token) {
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                return res.status(403).send({ auth: false, message: 'Failed to authenticate token.' });
            } else {
                req.userId = decoded.id; // Extract user ID from token
                next();
            }
        });
    } else {
        return res.status(403).send({ auth: false, message: 'No token provided.' });
    }
};

// User Registration
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await client.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword]);
        res.json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error('Error registering user:', error); // Log the error for debugging
        res.status(500).json({ message: 'Error registering user' });
    }
});

// User Login
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Query the database for the user by username
        const result = await client.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = result.rows[0];

        if (user && await bcrypt.compare(password, user.password)) {
            // Generate JWT token if credentials are valid
            const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: '1h' });
            res.json({ auth: true, token });
        } else {
            // Respond with unauthorized if credentials are invalid
            res.status(401).json({ auth: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Error logging in' });
    }
});

// Create a new blog post
app.post('/blog', verifyToken, async (req, res) => {
    const { title, image, post, category } = req.body;
    try {
        const result = await client.query(
            'INSERT INTO blogs (title, image, post, category, users_id) VALUES ($1, $2, $3, $4, $5)',
            [title, image, post, category, req.userId] // Use the userId from token
        );
        res.json({ message: "Added new blog", desc: result.rowCount });
    } catch (error) {
        console.error('Error creating blog:', error);
        res.status(500).json({ message: 'Error creating blog' });
    }
});

// Get all blogs or blogs by category
app.get('/blog/:cat', async (req, res) => {
    try {
        // Determine the query based on the category
        const query = req.params.cat !== 'all' 
            ? 'SELECT * FROM blogs WHERE category = $1' 
            : 'SELECT * FROM blogs';
        
        // Execute the query with parameters if needed
        const result = await client.query(query, req.params.cat !== 'all' ? [req.params.cat] : []);
        
        // Send the result rows as JSON
        res.json({ data: result.rows });
    } catch (error) {
        // Log the error and send a 500 response
        console.error('Error fetching blogs:', error);
        res.status(500).json({ message: 'Error fetching blogs' });
    }
});

// Get a single blog by ID
app.get('/blogbyid/:id', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM blogs WHERE id = $1', [req.params.id]);
        res.json({ "data": result.rows });
    } catch (error) {
        console.error('Error fetching blog by ID:', error); // Log the error for debugging
        res.status(500).json({ message: 'Error fetching blog by ID' });
    }
});

// Upload blog image
app.post('/blogimage', upload.single('file'), (req, res) => {
    res.json(req.file);
});

// Delete a blog post
app.delete('/blog/:id', verifyToken, async (req, res) => {
    try {
        const blogId = req.params.id;
        
        // Fetch the blog to check ownership
        const blogResult = await client.query('SELECT * FROM blogs WHERE id = $1', [blogId]);
        const blog = blogResult.rows[0];
        
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        
        if (blog.users_id !== req.userId) {
            return res.status(403).json({ message: 'You do not have permission to delete this blog' });
        }
        
        const result = await client.query('DELETE FROM blogs WHERE id = $1', [blogId]);
        
        if (result.rowCount > 0) {
            res.json({ message: 'Blog deleted successfully' });
        } else {
            res.status(404).json({ message: 'Blog not found' });
        }
    } catch (error) {
        console.error('Error deleting blog:', error);
        res.status(500).json({ message: 'Error deleting blog' });
    }
});


// Update a blog post
app.put('/blog/:id', verifyToken, async (req, res) => {
    try {
        const { title, image, post, category } = req.body;
        const blogId = req.params.id;
        
        // Fetch the blog to check ownership
        const blogResult = await client.query('SELECT * FROM blogs WHERE id = $1', [blogId]);
        const blog = blogResult.rows[0];
        
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        
        if (blog.users_id !== req.userId) {
            return res.status(403).json({ message: 'You do not have permission to update this blog' });
        }
        
        const result = await client.query(
            'UPDATE blogs SET title = $1, image = $2, post = $3, category = $4 WHERE id = $5',
            [title, image, post, category, blogId]
        );
        
        if (result.rowCount > 0) {
            res.json({ message: 'Blog updated successfully' });
        } else {
            res.status(404).json({ message: 'Blog not found' });
        }
    } catch (error) {
        console.error('Error updating blog:', error);
        res.status(500).json({ message: 'Error updating blog' });
    }
});


app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
