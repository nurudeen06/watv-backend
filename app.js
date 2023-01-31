const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');
//require('dotenv').config();

app.use(cors());
app.options('*', cors());

//Middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));
app.use(errorHandler);
//Routes
const categoriesRoutes = require('./routers/categories');
const listingRoutes = require('./routers/listing');
const usersRoutes = require('./routers/users');
const ordersRoutes = require('./routers/orders');


const api = '/api/v1';

app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/listing`, listingRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);

mongoose
.connect('mongodb+srv://newtonian:juiVvNSI13s8AMnf@cluster0.9jzejtz.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'whatsapptv',
})
.then(() => {
    console.log('Database Connection is ready...');
})
.catch((err) => {
    console.log(err);
});

//Development
// app.listen(3000, ()=>{
//     console.log(api);
//     console.log('server is running on port 3000');
// });

//Production
var server = app.listen(process.env.PORT || 3000, function () {
    var port = server.address().port;
    console.log('Express is working on port: '+ port);

})

