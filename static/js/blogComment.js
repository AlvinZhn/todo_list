// COMMENT API
// 获取所有 blogComment
var apiBlogCommentAll = function (callback) {
    var path = '/api/blogComment/all'
    ajax('GET', path, '', callback)
}

var apiBlogCommentAdd = function (form, callback) {
    var path = '/api/blogComment/add'
    ajax('POST', path, form, callback)
}

var apiBlogCommentDelete = function (id, callback) {
    var path = `/api/blogComment/delete?id=${id}`
    ajax('GET', path, '', callback)
}

var apiBlogCommentEdit = function (form, callback) {
    var path = '/api/blogComment/update'
    ajax('POST', path, form, callback)
}

var blogCommentTemplate = function (blogComment) {
    t = `
        <div class="blogComment">
            <div class="blogComment-content" data-id="${blogComment.id}">${blogComment.content}</div>
            <button data-id="${blogComment.id}" class="blogComment-delete">删除评论</button>
            <button data-id="${blogComment.id}" class="blogComment-update">更新评论</button>
        </div>
    `
    return t;
}

function removeBlogCommentForm() {
    var updateForm = e('.blogComment-update-form')
    updateForm.remove()
    blogCommentUpdateFormHide = true
}

var blogCommentUpdateTemplate = function (blogCommentId) {
    t = `
        <div class="blogComment-update-form">
            <input class="blogComment-update-input" placeholder="请输入新的blogComment">
            <button data-id="${blogCommentId}" class="blogComment-edit">修改</button>
            <button onclick="removeBlogCommentForm()">取消</button>
        </div>
    `
    return t;
}

var insertBlogComment = function (blogComment) {
    var blogCommentCell = blogCommentTemplate(blogComment)
    var blogId = blogComment.blog_id
    // log('blog id:',blogId)
    var blogList = e('.blog-list')
    var blogCommentWeibo = e(`.blog-cell[data-id="${blogId}"]`)
    if (blogCommentWeibo != null) {
        var blogCommentList = blogCommentWeibo.querySelector('.blogComment-list')
        // log('blogCommentList', blogCommentList)
        blogCommentList.insertAdjacentHTML('beforeEnd', blogCommentCell)
    }
}

var loadBlogComments = function () {
    apiBlogCommentAll(function (r) {
        var blogComments = JSON.parse(r)
        if (blogComments !== null) {
            for (var i = 0; i < blogComments.length; i++) {
                insertBlogComment(blogComments[i])
            }
        }
    })
}

var bindEventBlogCommentAdd = function () {
    var blogList = e('.blogComment-list')
    blogList.addEventListener('click', function (event) {
        var self = event.target
        if (self.classList.contains('button-addBlogComment')) {
            // var blogCommentAdd = self.closest('.blogComment-add')
            var blogCell = self.closest('.blog-cell')
            var blogId = blogCell.dataset.id
            var input = blogCell.querySelector('.blogComment-input')
            var content = input.value
            if (content.length > 0) {
                var form = {
                    blog_id: blogId,
                    content: content
                }
                apiBlogCommentAdd(form, function (r) {
                    var blogComment = JSON.parse(r)
                    insertBlogComment(blogComment)
                })
                input.value = ''
            } else {
                alertInfo('请输入文本...')
            }
        }
    })
}

var bindEventBlogCommentDelete = function () {
    var blogCommentList = e('.blogComment-list')
    blogCommentList.addEventListener('click', function (event) {
        // log(event)
        var self = event.target
        // log('被点击的对象', self)
        if (self.classList.contains('blogComment-delete')) {
            // log('点到了 删除按钮, id 是', self.dataset.id)
            apiBlogCommentDelete(self.dataset.id, function (r) {
                self.parentElement.remove()
            })
        } else {
            // log('点到了 blogComment update')
        }
    })
}

var blogCommentUpdateFormHide = true

var bindEventBlogCommentUpdate = function () {
    var blogList = e('.blog-list')
    blogList.addEventListener('click', function (event) {
        var self = event.target
        if (self.classList.contains('blogComment-update')) {
            var t = blogCommentUpdateTemplate(self.dataset.id)
            if (blogCommentUpdateFormHide) {
                self.parentElement.insertAdjacentHTML('beforeEnd', t)
                blogCommentUpdateFormHide = false
            }
        } else {
            // log('点到了 blogComment delete')
        }
    })
}

var bindEventBlogCommentEdit = function () {
    var blogList = e('.blog-list')
    blogList.addEventListener('click', function (event) {
        var self = event.target
        if (self.classList.contains('blogComment-edit')) {
            blogCommentId = self.dataset.id
            // log('点到了 修改 按钮, id 是', blogCommentId)
            var blogCell = self.closest('.blog-cell')
            var input = blogCell.querySelector('.blogComment-update-input')
            var form = {
                id: blogCommentId,
                content: input.value,
            }
            if (form['content'].length > 0) {
                apiBlogCommentEdit(form, function (r) {
                    var updateForm = blogCell.querySelector(`.blogComment-update-form`)
                    updateForm.remove()
                    blogCommentUpdateFormHide = true
                    var blogComment = JSON.parse(r)
                    var blogCommentTag = blogCell.querySelector(`.blogComment-content[data-id="${form.id}"]`)
                    var blogCommentUpdateTime = blogCell.querySelector('.blogComment-update-time')
                    blogCommentTag.innerHTML = blogComment.content
                    // blogCommentUpdateTime.innerHTML = blogComment.updated_time
                })
            } else {
                alertInfo('请输入文本...')
            }
        } else {
            // log('点到了 blogComment delete')
        }
    })
}

var bindEvents = function () {
    bindEventBlogCommentAdd()
    bindEventBlogCommentDelete()
    // bindEventBlogCommentUpdate()
    // bindEventBlogCommentEdit()
}

var __main = function () {
    bindEvents()
    loadBlogComments()
}

__main()
