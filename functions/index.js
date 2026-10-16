const express = require('express');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Static fayllar
app.use(express.static(path.join(__dirname, '../public')));

// ===== Kinolar bazasi =====
let kinolar = [
    { id: 1, nomi: "Inception", haqida: "Sci-Fi film", rasm: "https://picsum.photos/200/300?random=1" },
    { id: 2, nomi: "Interstellar", haqida: "Kosmos filmi", rasm: "https://picsum.photos/200/300?random=2" }
];

// ===== GET / → index.html (login) =====
app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

// ===== GET /home → home.html (admin panel) =====
app.get('/home', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../public/home.html'));
});

// ===== GET /kinolar → barcha kinolar (API) =====
app.get('/kinolar', (req, res) => {
    res.json(kinolar);
});

// ===== POST /admin → login tekshirish =====
app.post('/admin', (req, res) => {
    const { login, parol } = req.body;

    if (login === 'admin' && parol === '12345') {
        res.redirect('/home');
    } else {
        res.send(`
            <script>
                alert('Login yoki parol xato!');
                window.location.href = '/';
            </script>
        `);
    }
});

// ===== POST /qoshish → yangi kino qo'shish =====
app.post('/qoshish', (req, res) => {
    const { nomi, haqida, rasm } = req.body;

    const yangiKino = {
        id: kinolar.length + 1,
        nomi: nomi,
        haqida: haqida,
        rasm: rasm
    };

    kinolar.push(yangiKino);
    res.redirect('/home');
});

// ===== DELETE /ochirish/:id → kino o'chirish =====
app.delete('/ochirish/:id', (req, res) => {
    const id = parseInt(req.params.id);
    kinolar = kinolar.filter(k => k.id !== id);
    res.json({ success: true, message: "O'chirildi" });
});

// ===== POST /ochirish (form uchun) =====
app.post('/ochirish', (req, res) => {
    const id = parseInt(req.body.id);
    kinolar = kinolar.filter(k => k.id !== id);
    res.redirect('/home');
});

module.exports.handler = serverless(app);