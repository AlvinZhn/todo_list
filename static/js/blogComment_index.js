// COMMENT API
// 获取所有 blogComment
var apiBlogCommentAll = function (callback) {
    var blogId = window.location.search.split('=')[1]
    var path = `/api/blogComment/all/${blogId}`
    ajax('GET', path, '', callback)
}

var apiBlogCommentDelete = function (id, callback) {
    var path = `/api/blogComment/delete?id=${id}`
    ajax('GET', path, '', callback)
}

var insertBlogComment = function(blogComment) {
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

var bindEventBlogCommentDelete = function () {
    var blogCommentList = e('.blogComment-list')
    blogCommentList.addEventListener('click', function(event) {
        // log(event)
        var self = event.target
        // log('被点击的对象', self)
        if (self.classList.contains('blogComment-delete')){
            // log('点到了 删除按钮, id 是', self.parentElement)
            apiBlogCommentDelete(self.dataset.id, function (r) {
                try {
                    var resonseId = JSON.parse(r)['id']
                    self.parentElement.remove()
                } catch (e) {
                    alertInfo('You can not delete others comment!')
                }
            })
        } else {
            // log('点到了 blogComment update')
        }
    })
}

var bindEvents = function () {
    bindEventBlogCommentDelete()
}

var __main = function () {
    bindEvents()
    loadBlogComments()
}

__main()
