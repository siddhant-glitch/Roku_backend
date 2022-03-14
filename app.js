import express from 'express';

const port = process.env.PORT || 3000;

const app = express();

app.get('/', (req, res) => {
    res.json({ message: "hello ffrom express"})
})

app.listen(port, () => {
    console.log(`app is up and running on ${port}`)
})