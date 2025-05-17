import express from "express";

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('API is live!')
});

app.listen(port, () => {
    console.log(`API is live at http://localhost:3000 on port ${port}`)
});