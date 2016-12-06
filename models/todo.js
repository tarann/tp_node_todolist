const db = require('sqlite')

module.exports = {
  get: (todoId) => {
    return db.get('SELECT rowid, * FROM todos WHERE rowid = ?', todoId)
  },

  count: () => {
    return db.get('SELECT COUNT(*) as count FROM todos')
  },

  getAll: (limit, offset) => {
    return db.all('SELECT rowid, * FROM todos LIMIT ? OFFSET ?', limit, offset)
  },

  insert: (params) => {
  	var finished = false;
    return db.run(
      'INSERT INTO todos (userId, task, description, completed) VALUES (?, ?, ?, ?)',
      params.userId,
      params.task,
      params.description,
      finished
    )
  },

  update: (todoId, params) => {
    const possibleKeys = ['userId', 'task', 'description', 'completed']

    let dbArgs = []
    let queryArgs = []
    for (key in params) {
      if (-1 !== possibleKeys.indexOf(key)) {
        queryArgs.push(`${key} = ?`)
        dbArgs.push(req.body[key])
      }
    }

    if (!queryArgs.length) {
      let err = new Error('Bad Request')
      err.status = 400
      return Promise.reject(err)
    }

    dbArgs.push(todoId)
    dbArgs.unshift('UPDATE todos SET ' + queryArgs.join(', ') + ' WHERE rowid = ?')

    return db.run.apply(db, dbArgs).then((stmt) => {
      if (stmt.changes === 0){
        let err = new Error('Not found')
        err.status = 404
        return Promise.reject(err)
      }

      return stmt
    })
  },
 
  remove: (todoId) => {
    return db.run('DELETE FROM todos WHERE rowid = ?', todoId)
  }

}



































































































/*const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/todos', function(err) {
	if (err) {
		throw err;
	}
});


// schema

var todoSchema = new mongoose.Schema ({
  userId : String,
  task : String,
  description : String
});



// model
var todoModel = mongoose.model('todo',todoSchema);



// instanciation du model

var todo = new todoModel();
todo.userId = '17';
todo.task = 'nodeJS';
todo.description = 'Faire le tp de jeremy !';

// sauvegarde dans mongo

todo.save(function () {
	console.log('todo added !');
});*/