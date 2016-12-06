const router = require('express').Router()
const Todo = require('../models/todo')


/*Todo : operation*/
router.get('/', function(req, res, next) {
  let limit = parseInt(req.query.limit) || 20
  let offset = parseInt(req.query.offset) || 0
  if (limit > 100) limit = 100

  Promise.all([
    Todo.getAll(limit, offset),
    Todo.count()
  ]).then((results) => {
    res.format({
      html: () => {
        res.render('todos/index', {
          todos: results[0],
          count: results[1].count,
          limit: limit,
          offset: offset
        })
      },
      json: () => {
        res.send({
          data: results[0],
          meta: {
            count: results[1].count
          }
        })
      }
    })
  }).catch(next)
})

router.post('/', (req, res, next) => {
  if (
    !req.body.task || req.body.task === '' ||
    !req.body.description || req.body.description === '' ||
    !req.body.userId || req.body.userId === ''
  ) {
    let err = new Error('Bad Request')
    err.status = 400
    return next(err)
  }

  Todo.insert(req.body).then(() => {
    res.format({
      html: () => { res.redirect('/todos') },
      json: () => { res.status(201).send({message: 'success'}) }
    })
  }).catch(next)
})


router.get('/add', function(req, res, next) {
  res.format({
    html: () => {
      res.render('todos/edit', {
        todo: {},
        action: '/todos'
      })
    },
    json: () => {
      let error = new Error('Bad Request')
      error.status = 400
      next(error)
    }
  })
})

router.get('/:todoId(\\d+)/edit', function(req, res, next) {
  Todo.get(req.params.todoId).then((todo) => {
    if (!todo) return next()

    res.format({
      html: () => {
        res.render('todos/edit', {
          todo: todo,
          action: `/todos/${todo.rowid}?_method=put`
        })
      },
      json: () => {
        let error = new Error('Bad Request')
        error.status = 400
        next(error)
      }
    })
  }).catch(next)
})

router.put('/:todoId(\\d+)', (req, res, next) => {
  Todo.update(req.params.todoId, req.body).then(() => {
    res.format({
      html: () => { res.redirect(`/todos/${req.params.todoId}`) },
      json: () => { res.status(200).send({ message: 'success' }) }
    })
  }).catch(next)
})

router.delete('/:todoId(\\d+)', (req, res, next) => {
  Todo.remove(req.params.todoId).then(() => {
    res.format({
      html: () => { res.redirect(`/todos`) },
      json: () => { res.status(200).send({ message: 'success' }) }
    })
  }).catch(next)
})

module.exports = router