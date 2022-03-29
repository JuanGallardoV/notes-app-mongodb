const router = require('express').Router()

const User = require('../models/User')

router.get('/users/signin', (req, res) => {
    res.render('users/signin')
})

router.get('/users/signup', (req,res) => {
    res.render('users/signup')
})

router.post('/users/signup', async (req, res) => {
    const { name, email, password, confirm_password } = req.body
    const errors = []
    if(name.length <= 0) {
        errors.push({text: 'Por favor ingrese un nombre'})
    }
    if(email.length <= 0) {
        errors.push({text: 'Por favor ingrese un correo'})
    }
    if(password.length <= 0 || confirm_password.length <= 0) {
        errors.push({text: 'Por favor ingrese una contraseña'})
    }
    if (password != confirm_password) {
        errors.push({text: 'Las contraseñas no coinciden'})
    }
    if(password.length < 4) {
        errors.push({text: 'La contraseña tiene que tener al menos 4 caracteres'})
    }
    if(errors.length > 0) {
        req.render('users/signup', {errors, name, email})
    } else {
        const emailUser = await User.findOne({email: email})
        if(emailUser) {
            req.flash('error_msg', 'El correo ya esta en uso')
            res.redirect('/users/signup')
        }
        const newUser = new User({name, email, password})
        newUser.password = await newUser.encryptPassword(password)
        await newUser.save()
        req.flash('success_msg', '!Estas Registrado!')
        res.redirect('/users/signin')
    }
})

module.exports = router