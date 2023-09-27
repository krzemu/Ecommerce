const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');
const adminProductRouter = require('./routes/admin/products');
const productRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');


const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
    name: 'session',
    keys: ['Afefn3F93j2mixX2q9e2sdadas']
}));
app.use(authRouter);
app.use(adminProductRouter);
app.use(productRouter);
app.use(cartsRouter);




app.listen(3000, () => {
});
