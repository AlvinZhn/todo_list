// COMMENT API
// 获取所有 comment
var apiCommentAll = function (callback) {
    var path = '/api/comment/all'
    ajax('GET', path, '', callback)
}

var apiCommentAdd = function (form, callback) {
    var path = '/api/comment/add'
    ajax('POST', path, form, callback)
}

var apiCommentDelete = function (id, callback) {
    var path = `/api/comment/delete?id=${id}`
    ajax('GET', path, '', callback)
}

var apiCommentEdit = function (form, callback) {
    var path = '/api/comment/update'
    ajax('POST', path, form, callback)
}

var commentTemplate = function(comment) {
    t = `
    <tr class="comment">
        <td class="comment-content" data-id="${comment.id}"></td>
        <td class="comment-time" data-id="${comment.id}">这里是更新时间</td>
        <td class="comment-username" data-id="${comment.id}">${comment.username}</td>
        <td>
            <button data-id="${comment.id}" class="comment-update btn btn-xs btn-success">更新评论</button>
            <button data-id="${comment.id}" class="comment-delete btn btn-xs btn-danger">删除评论</button>
        </td>
    </tr>
    `
    return t;
}

function removeCommentForm() {
    var updateForm = e('.comment-update-form')
    updateForm.remove()
    commentUpdateFormHide = true
}

var commentUpdateTemplate = function(commentId) {
    t = `
        <div class="comment-update-form">
            <input class="comment-update-input form-control input-sm" placeholder="请输入新的comment">
            <button data-id="${commentId}" class="comment-edit btn btn-xs btn-success">修改</button>
            <button class="btn btn-xs btn-warning" onclick="removeCommentForm()">关闭</button>
        </div>
    `
    return t;
}

var insertComment = function(comment) {
    var commentCell = commentTemplate(comment)
    var weiboId = comment.weibo_id
    // log('weibo id:',weiboId)
    var weiboList = e('.weibo-list')
    var commentWeibo = e(`.weibo-cell[data-id="${weiboId}"]`)
    if (commentWeibo != null) {
        var commentList = commentWeibo.querySelector('.comment-list')
        // log('commentList', commentList)
        commentList.insertAdjacentHTML('beforeEnd', commentCell)
        e(`.comment-content[data-id="${comment.id}"]`).textContent = comment.content
    }
}

var loadComments = function () {
    apiCommentAll(function (r) {
        var comments = JSON.parse(r)
        if (comments !== null) {
            for (var i = 0; i < comments.length; i++) {
                insertComment(comments[i])
            }
        }
    })
}

var bindEventCommentAdd = function () {
    var weiboList = e('.weibo-list')
    weiboList.addEventListener('click', function(event) {
        var self = event.target
        if (self.classList.contains('button-addComment')){
            var weiboCell = self.closest('.weibo-cell')
            var weiboId = weiboCell.dataset.id
            var input = weiboCell.querySelector('.comment-input')
            var content = input.value
            if (content.length > 0) {
                var form = {
                    weibo_id : weiboId,
                    content : content
                }
                apiCommentAdd(form, function (r) {
                    var comment = JSON.parse(r)
                    insertComment(comment)
                })
                input.value = ''
            } else {
                alertInfo('请输入文本...')
            }
        }
    })
}

var bindEventCommentDelete = function () {
    var commentList = e('.weibo-list')
    commentList.addEventListener('click', function(event) {
        var self = event.target
        if (self.classList.contains('comment-delete')){
            apiCommentDelete(self.dataset.id, function (r) {
                try {
                    var resonseId = JSON.parse(r)['id']
                    self.parentElement.parentElement.remove()
                } catch (e) {
                    alertInfo('You can not delete others comment!')
                }
            })
        } else {
            // log('点到了 comment update')
        }
    })
}

var commentUpdateFormHide = true

var bindEventCommentUpdate = function () {
    var weiboList = e('.weibo-list')
    weiboList.addEventListener('click', function(event) {
        var self = event.target
        if (self.classList.contains('comment-update')){
            var t = commentUpdateTemplate(self.dataset.id)
            if (commentUpdateFormHide) {
                self.parentElement.insertAdjacentHTML('beforeEnd', t)
                commentUpdateFormHide = false
            } else {
                removeCommentForm()
            }
        } else {
            // log('点到了 comment delete')
        }
    })
}

var bindEventCommentEdit = function () {
    var weiboList = e('.weibo-list')
    weiboList.addEventListener('click', function(event) {
    // var commentList = e('.comment-list')
        var self = event.target
        if (self.classList.contains('comment-edit')){
            commentId = self.dataset.id
            // log('点到了 修改 按钮, id 是', commentId)
            var weiboCell = self.closest('.weibo-cell')
            var input = weiboCell.querySelector('.comment-update-input')
            var form = {
                id : commentId,
                content : input.value,
            }
            if (form['content'].length > 0) {
                apiCommentEdit(form, function (r) {
                    var updateForm = weiboCell.querySelector(`.comment-update-form`)
                    updateForm.remove()
                    commentUpdateFormHide = true
                    var comment = JSON.parse(r)
                    var commentTag = weiboCell.querySelector(`.comment-content[data-id="${form.id}"]`)
                    var commentUpdateTime = weiboCell.querySelector('.comment-update-time')
                    commentTag.innerHTML = comment.content
                    // commentUpdateTime.innerHTML = comment.updated_time
                })
            } else {
                alertInfo('请输入文本...')
            }
        } else {
            // log('点到了 comment delete')
        }
    })
}

var bindEvents = function () {
    bindEventCommentAdd()
    bindEventCommentDelete()
    bindEventCommentUpdate()
    bindEventCommentEdit()
}

var __main = function () {
    bindEvents()
    loadComments()
}

__main()
