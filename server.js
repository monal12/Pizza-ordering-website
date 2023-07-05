require('dotenv').config()
const express=require('express')
const app= express()
const ejs=require('ejs')
const path=require('path')
const  expressLayout= require('express-ejs-layouts')
const PORT= process.env.PORT || 3300
const mongoose=require('mongoose')
const session=require('express-session')
const flash= require('express-flash')
const MongoDbStore= require('connect-mongo')(session)
const passport= require('passport')


// const url='mongodb://127.0.0.1:27017/pizza';

// mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
// const connection = mongoose.connection;
// connection.on('error',console.error.bind(console,'connection error:'));
// connection.once('open', function(){
//     console.log('Database connected...');
// });
mongoose.connect('mongodb://127.0.0.1:27017/pizza', { useNewUrlParser: true, useCreateIndex:true, useUnifiedTopology: true, useFindAndModify : true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Database connected...');
}).catch(err => {
    console.log('Connection failed...')
});

// Session store
let mongoStore = new MongoDbStore({
    mongooseConnection: connection,
    collection: 'sessions'
})


//Session config
app.use(session({
secret: process.env.COOKIE_SECRET,
resave: false,
store: mongoStore,
saveUninitialized: false,
cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hour
}))


// Session config
// app.use(session({
//     secret: process.env.COOKIE_SECRET,
//     resave: false,
//     store: MongoDbStore.create({
//         mongoUrl: url,
//         mongooseConnection: connection,
//         collection: 'sessions'
//     }),
//     saveUninitialized: false,
//     cookie: {maxAge: 1000*60*60*24}  //24 hours
// }))


//passport config
const passportInit = require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())


app.use(flash())
app.use(express.json())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))

//global middlewares
app.use((req,res,next)=>{
    res.locals.session=req.session
    res.locals.user=req.user
    next()
})
//set template engine
app.use(expressLayout)
app.set('views',path.join(__dirname,'/resources/views'))
app.set('view engine','ejs')

require('./routes/web')(app)



app.listen(PORT,()=>{
    console.log(`Listening on port ${PORT}`)
})