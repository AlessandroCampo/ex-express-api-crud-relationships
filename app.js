const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;
const globalErrorHandler = require('./middlewares/globalErrorHandler');

//routers import
const postRouter = require('./routers/postRouter.js');
const userRouter = require('./routers/userRouter.js');

//middlewares

app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use('/posts', postRouter);
app.use('/users', userRouter);





app.use((req, res, next) => {
    res.status(404).json({ error: `Could not find route  ${req.originalUrl}` });
});

app.use(globalErrorHandler);


app.listen(port, () => {
    console.log(`server listening on http://localhost:${port}`)
})