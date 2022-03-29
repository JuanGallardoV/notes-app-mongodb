const router = require('express').Router()

const Note = require('../models/Note')
const { isAuthenticated } = require('../helpers/auth')

router.get('/notes/add', isAuthenticated, (req,res) => {
    res.render('notes/addNote')
})

router.post('/notes/newNote', isAuthenticated, async (req,res) => {
    const { title, description } = req.body
    const errors = []
    if(!title) {
        errors.push({text: 'El titulo no puede estar vacio'})
    }
    if(!description) {
        errors.push({text: 'La descripcion no puede estar vacia'})
    }
    if(errors.length > 0) {
        res.render('notes/addNote', {
            errors,
            title,
            description
        })
    } else {
        const newNote = new Note({title, description})
        await newNote.save()
        req.flash('success_msg', 'Nota Agregada Correctamente')
        res.redirect('/notes')
    }
})

router.get('/notes', isAuthenticated, async (req, res) => {
    //! Sin el lean falla, ya que lo que hace el lean es transformar el documento de Mongo a un documento plano, y asi poder leerlo 
    const notes = await Note.find().lean().sort({date: 'desc'})
    res.render('notes/listNotes', { notes })
})

router.get('/notes/edit/:id', isAuthenticated, async (req, res) => {
    const note = await Note.findById(req.params.id).lean()
    res.render('notes/editNote', { note })
})

router.put('/notes/editNote/:id', isAuthenticated, async (req, res) => {
    const { title, description } = req.body
    await Note.findByIdAndUpdate(req.params.id, { title, description })
    req.flash('success_msg', 'Nota Actualizada Correctamente')
    res.redirect('/notes')
})

router.delete('/notes/delete/:id', isAuthenticated, async (req, res) => {
    await Note.findByIdAndDelete(req.params.id)
    req.flash('success_msg', 'Nota Eliminada Correctamente')
    res.redirect('/notes')
})

module.exports = router