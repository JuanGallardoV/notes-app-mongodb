//? Juan Gallardo 28-03-2022
require('dotenv').config()
const express = require('express')
const path = require('path')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const session = require('express-session')
//? Inicializaciones
const app = express()
require('./database')
//? Configuraciones
app.set('port', process.env.PORT || 3000)
app.set('views', path.join(__dirname, 'views'))
app.engine('.hbs', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}))
app.set('view engine', '.hbs')
//? Middlewares
app.use(express.urlencoded({extended: false}))
app.use(methodOverride('_method'))
app.use(session({
    secret: 'mysecretapp',
    resave: true,
    saveUninitialized: true
}))

//? Variables globales

//? Rutas
app.use(require('./routes/index'))
app.use(require('./routes/notes'))
app.use(require('./routes/users'))
//? Archivos estaticos
app.use(express.static(path.join(__dirname, 'public')))
//? El servidor esta escuchando
app.listen(app.get('port'), () => {
    console.log('Server en puerto', app.get('port'))
})