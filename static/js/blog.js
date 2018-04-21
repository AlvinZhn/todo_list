// BLOG API
// 获取所有 blog
var apiBlogAll = function (callback) {
    var path = '/api/blog/all'
    ajax('GET', path, '', callback)
}

// 函数接收一个 form 表单和一个 callback 函数。函数将 form 以 `POST` 形式
// 发送给 path，成功后执行 callback 函数
var apiBlogAdd = function (form, callback) {
    var path = '/api/blog/add'
    ajax('POST', path, form, callback)
}

var apiBlogDelete = function (id, callback) {
    var path = `/api/blog/delete?id=${id}`
    ajax('GET', path, '', callback)
}

var apiBlogEdit = function (form, callback) {
    var path = '/api/blog/update'
    ajax('POST', path, form, callback)
}

// 3. 编辑 blogTemplate 函数
var blogTemplate = function(blog) {
    t = `
        <tr class="blog-cell">
            <td>
                <a href="/blog/detail?id=${blog.id}" class="blog-title">${blog.title}</a>
            </td>
            <td>${blog.created_time}</td>
            <td class="blog-update-time">${blog.updated_time}</td>
            <td>
                <button type="button" data-id="${blog.id}" class="btn btn-success blog-update form-group" type="submit">Update</button>
                <button type="button" data-id="${blog.id}" class="btn btn-danger blog-delete form-group" type="submit">Delete</button>
            </td>
        </tr>
    `
    return t;
}

function removeBlogForm() {
    var updateForm = e('.blog-update-form')
    updateForm.remove()
    blogUpdateFormHide = true
}

var updateTemplate = function(blogId) {
    t = `
        <div class="blog-update-form">
            <input class="blog-update-input form-control" placeholder="请输入新的BLOG">
            <button data-id="${blogId}" class="blog-edit btn btn-warning">Modify</button>
            <button onclick="removeBlogForm()" class="btn btn-primary">Cancel</button>
        </div>
    `
    return t;
}

// 4. 编辑 insertBlog 函数
var insertBlog = function(blog) {
    var blogCell = blogTemplate(blog)
    var blogList = e('.blog-list')
    blogList.insertAdjacentHTML('beforeEnd', blogCell)
}

var loadBlogs = function () {
    // 调用 ajax api 来载入所有的blog数据
    apiBlogAll(function (r) {
        var blogs = JSON.parse(r)
        // log('blogs', blogs)
        // 循环添加到页面中
        if (blogs !== null) {
            for (var i = 0; i < blogs.length; i++) {
                insertBlog(blogs[i])
            }
        }
    })
}

// 1. 绑定事件
var bindEventBlogAdd = function () {
    var button = e('#id-button-add')
    button.addEventListener('click', function() {
        var title = e('#id-input-title').value
        var content = e('#id-input-content').value
        log('title',title)
        log('content',content)
        if (title.length > 0 && content.length > 0) {
            // 将用户输入的数据构成表单，通过api发送给后端
            var form = {
                title: title,
                content: content,
            }
            // log('form', form)
            // 通过调用api函数，利用 Ajax 将数据传入后端服务器
            // 函数将 form 通过 POST 方式传到指定路径，
            // 成功后执行 Ajax 会返回服务器发回的 json 格式数据，
            // 然后将该数据传入 function 函数解析，随后插入 html 中
            apiBlogAdd(form, function (r) {
                var blog = JSON.parse(r)
                window.location = blog.redirect
            })
        } else {
            alertInfo('请输入文本...')
        }
    })
}

var bindEventBlogDelete = function () {
    var blogList = e('.blog-list')
    blogList.addEventListener('click', function(event) {
        // log(event)
        var self = event.target
        // log('被点击的对象', self)
        // log('classList', self.classList)
        if (self.classList.contains('blog-delete')){
            // log('点到了 删除按钮, id 是', self.parentElement)
            apiBlogDelete(self.dataset.id, function (r) {
                e('.blog-cell').remove()
            })
        } else {
            // log('点到了 blog update')
        }
    })
}

var blogUpdateFormHide = true

var bindEventBlogUpdate = function () {
    var blogList = e('.blog-list')
    blogList.addEventListener('click', function(event) {
        var self = event.target
        if (self.classList.contains('blog-update')){
            // log('点到了 更新按钮, id 是', self.dataset.id)
            var t = updateTemplate(self.dataset.id)
            if (blogUpdateFormHide) {
                self.parentElement.insertAdjacentHTML('beforeEnd', t)
                blogUpdateFormHide = false
            }
        } else {
            // log('点到了 blog delete')
        }
    })
}

var bindEventBlogEdit = function () {
    var blogList = e('.blog-list')
    blogList.addEventListener('click', function(event) {
        var self = event.target
        if (self.classList.contains('blog-edit')){
            blogId = self.dataset.id
            // log('点到了 修改 按钮, id 是', blogId)
            var blogCell = self.closest('.blog-cell')
            var input = blogCell.querySelector('.blog-update-input')
            // var input = e('.blog-update-input')
            // log('input:', input)
            var form = {
                id : blogId,
                title : input.value,
            }
            if (form['title'].length > 0) {

                apiBlogEdit(form, function (r) {
                    var updateForm = blogCell.querySelector('.blog-update-form')
                    updateForm.remove()
                    blogUpdateFormHide = true

                    var blog = JSON.parse(r)
                    var blogTag = blogCell.querySelector('.blog-title')
                    var blogUpdateTime = blogCell.querySelector('.blog-update-time')
                    blogTag.innerHTML = blog.title
                    blogUpdateTime.innerHTML = blog.updated_time
                })
            } else {
                alertInfo('请输入文本...')
            }
        } else {
            // log('点到了 blog delete')
        }
    })
}

var bindEvents = function () {
    bindEventBlogAdd()
    bindEventBlogDelete()
    // bindEventBlogUpdate()
    // bindEventBlogEdit()
}

var __main = function () {
    bindEvents()
    loadBlogs()
}

__main()
