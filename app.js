const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');

const sequelize=require('./util/database')
const Product=require('./models/product')
const User=require('./models/user')

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res,next)=>{
    User.findByPk(1)
    .then(user=>{
        req.user=user // REQ.USER HERE HAS ALL THE METHODS (AS IT IS THE DIRECT SEQUELIZE INSTANCE OF USER MODEL)
        next()
    })
    .catch(err=>console.log(err))
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

Product.belongsTo(User,{constrains:true,onDelete:'CASCADE'})
User.hasMany(Product)


// sequelize.sync({force:true})
sequelize.sync()
.then(result=>{
    return User.findByPk(1)  //TRYING TO FIND THE USER IF EXIST
})
.then(user=>{
    if(!user){    //IF USER DOES NOT EXIST THEN CREATE A NEW USER AND RETURN IT
        return User.create({name:'Kalyan',mail:'kalyan12@gmail.com'})
    }
    return user
})
.then(user=>app.listen(3000)) //AFTER COMPLETING CREATION OF USER SERVER STARTS LISTENING
.catch(err=>console.log(err))
