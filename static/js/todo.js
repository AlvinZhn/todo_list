// TODO API
// 获取所有 todo
var apiTodoAll = function (callback) {
    var path = '/api/todo/all'
    ajax('GET', path, '', callback)
}

// 函数接收一个 form 表单和一个 callback 函数。函数将 form 以 `POST` 形式
// 发送给 path，成功后执行 callback 函数
var apiTodoAdd = function (form, callback) {
    var path = '/api/todo/add'
    ajax('POST', path, form, callback)
}

var apiTodoDelete = function (id, callback) {
    var path = `/api/todo/delete?id=${id}`
    ajax('GET', path, '', callback)
}

var apiTodoEdit = function (form, callback) {
    var path = '/api/todo/update'
    ajax('POST', path, form, callback)
}

// 3. 编辑 todoTemplate 函数
var todoTemplate = function(todo) {
    t = `
        <tr class="todo-cell" data-id="${todo.id}">
            <td class="todo-title" data-id="${todo.id}"></td>
            <td>${todo.created_time}</td>
            <td class="todo-update-time">${todo.updated_time}</td>
            <td>
                <button type="button" data-id="${todo.id}" class="btn btn-success todo-update" type="submit">Update</button>
                <button type="button" data-id="${todo.id}" class="btn btn-danger todo-delete" type="submit">Delete</button>
            </td>
            <td>
                <button type="button" data-id="${todo.id}" class="btn btn-warning">Mark as Complete</button>
            </td>
        </tr>
    `
    return t;
}

function removeTodoForm() {
    var updateForm = e('.todo-update-form')
    updateForm.remove()
    todoUpdateFormHide = true
}

var updateTemplate = function(todoId) {
    t = `
        <div class="todo-update-form">
            <input class="todo-update-input form-control input-sm" placeholder="请输入新的TODO">
            <button data-id="${todoId}" class="todo-edit btn btn-success btn-sm">确认修改</button>
            <button onclick="removeTodoForm()" class="btn btn-warning btn-sm">关闭</button>
        </div>
    `
    return t;
}

// 4. 编辑 insertTodo 函数
var insertTodo = function(todo) {
    var todoCell = todoTemplate(todo)
    var todoList = e('.todo-list')
    todoList.insertAdjacentHTML('beforeEnd', todoCell)
    e(`.todo-title[data-id="${todo.id}"]`).textContent = todo.title

    // ${todo.title}
}

var loadTodos = function () {
    // 调用 ajax api 来载入所有的todo数据
    apiTodoAll(function (r) {
        var todos = JSON.parse(r)
        // log('todos', todos)
        // 循环添加到页面中
        if (todos !== null) {
            for (var i = 0; i < todos.length; i++) {
                insertTodo(todos[i])
            }
        }
    })
}

// 1. 绑定事件
var bindEventTodoAdd = function () {
    var button = e('#id-button-add')
    button.addEventListener('click', function() {
        var input = e('#id-input-todo')
        var title = input.value
        if (title.length > 0) {
            // 将用户输入的数据构成表单，通过api发送给后端
            var form = {
                title : title
            }
            apiTodoAdd(form, function (r) {
                var todo = JSON.parse(r)
                insertTodo(todo)
            })
            input.value = ''
        } else {
            alertInfo('请输入文本...')
        }
    })
}

var bindEventTodoDelete = function () {
    var todoList = e('.todo-list')
    todoList.addEventListener('click', function(event) {
        var self = event.target
        if (self.classList.contains('todo-delete')){
            // log('点到了 删除按钮, id 是', self.parentElement)
            apiTodoDelete(self.dataset.id, function (r) {
                e(`.todo-cell[data-id="${self.dataset.id}"]`).remove()
            })
        } else {
            // log('点到了 todo update')
        }
    })
}

var todoUpdateFormHide = true

var bindEventTodoUpdate = function () {
    var todoList = e('.todo-list')
    todoList.addEventListener('click', function(event) {
        var self = event.target
        if (self.classList.contains('todo-update')){
            // log('点到了 更新按钮, id 是', self.dataset.id)
            var t = updateTemplate(self.dataset.id)
            if (todoUpdateFormHide) {
                self.parentElement.insertAdjacentHTML('beforeEnd', t)
                todoUpdateFormHide = false
            } else {
                removeTodoForm()
            }
        } else {
            // log('点到了 todo delete')
        }
    })
}

var bindEventTodoEdit = function () {
    var todoList = e('.todo-list')
    todoList.addEventListener('click', function(event) {
        var self = event.target
        if (self.classList.contains('todo-edit')){
            todoId = self.dataset.id
            // log('点到了 修改 按钮, id 是', todoId)
            var todoCell = self.closest('.todo-cell')
            var input = todoCell.querySelector('.todo-update-input')
            // var input = e('.todo-update-input')
            // log('input:', input)
            var form = {
                id : todoId,
                title : input.value,
            }
            if (form['title'].length > 0) {

                apiTodoEdit(form, function (r) {
                    var updateForm = todoCell.querySelector('.todo-update-form')
                    updateForm.remove()
                    todoUpdateFormHide = true

                    var todo = JSON.parse(r)
                    var todoTag = todoCell.querySelector('.todo-title')
                    var todoUpdateTime = todoCell.querySelector('.todo-update-time')
                    todoTag.innerHTML = todo.title
                    todoUpdateTime.innerHTML = todo.updated_time
                })
            } else {
                alertInfo('请输入文本...')
            }
        } else {
            // log('点到了 todo delete')
        }
    })
}

var bindEvents = function () {
    bindEventTodoAdd()
    bindEventTodoDelete()
    bindEventTodoUpdate()
    bindEventTodoEdit()
}

var __main = function () {
    bindEvents()
    loadTodos()
}

__main()
