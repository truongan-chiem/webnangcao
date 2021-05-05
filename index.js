const express = require('express');
const app = express();
const hbs = require('express-handlebars');
const path = require('path')
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const flash = require('connect-flash');
const dateFormat = require('dateformat')
const methodOverride = require('method-override')
const port = process.env.PORT || 3000;
const Router = require('./routers')
const db = require('./configs/db')
const socketio = require('socket.io')
//method
app.use(methodOverride('_method'))
//middleware
app.engine('.hbs',hbs({extname:'.hbs',
                        helpers:{
                            xif:function(var1,operator,var2,options){
                                switch(operator){
                                    case '==':
                                        return (var1 == var2) ? options.fn(this) : options.inverse(this);
                                    case '!=':
                                        return (var1 != var2) ? options.fn(this) : options.inverse(this);
                                    default:
                                        return options.inverse(this);
                                }
                            },
                        }                        
}))
app.set('view engine','.hbs')
app.use(express.static(path.join(__dirname,'public')))
//cauhinhpassport
app.use(session({
    secret : 'CTA',
}))
app.use(cookieParser());
app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}))
app.use(passport.initialize());
app.use(passport.session());
//connect db
db.connect();
//passport
require('./configs/passport')(passport)
//routers
Router(app)
const sever = app.listen(process.env.PORT,()=>{
    console.log(`http://localhost:${port}`)
})
const io = socketio(sever)

io.on('connection',function(client){
    client.on('thongbao',function(data){
        client.broadcast.emit('sever-emit',data)
    })
})