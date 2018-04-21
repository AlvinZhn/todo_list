// BLOG API
// 增加 blog
var apiBlogCommentAdd = function (form, callback) {
    var path = '/api/blogComment/add'
    ajax('POST', path, form, callback)
}

var blogCommentTemplate = function(blogComment) {

    t = `
        <li class="list-group-item blogComment" data-id="${blogComment.id}">
            <div class="blogComment-content" data-id="${blogComment.id}"></div>
            <button data-id="${blogComment.id}" class="blogComment-update btn btn-success pull-right">更新评论</button>
            <button data-id="${blogComment.id}" class="blogComment-delete btn btn-danger pull-right">删除评论</button>
        </li>
    `
    return t;
}

var insertBlogComment = function(blogComment) {
    var blogCommentCell =  blogCommentTemplate(blogComment)
    // log('weibo id:',window.location.search)
    var commentList = e(`.blogCommentCell`)
    // log('commentList', commentList)
    commentList.insertAdjacentHTML('beforeEnd', blogCommentCell)
    var m = marked(blogComment.content)

    if (m == blogComment.content) {
        e(`.blogComment-content[data-id="${blogComment.id}"]`).innerText = m
    } else {
        e(`.blogComment-content[data-id="${blogComment.id}"]`).innerHTML = m
    }
}

var bindEventBlogCommentAdd = function () {
    var button = e('#id-button-add')
    var blogId = parseInt(window.location.search.split('=')[1])
    button.addEventListener('click', function() {
        var content = e('#id-input-content').value
        if (content.length > 0) {
            // 将用户输入的数据构成表单，通过api发送给后端
            var form = {
                blog_id : blogId,
                content: content,
            }
            apiBlogCommentAdd(form, function (r) {
                var blogComment = JSON.parse(r)
                insertBlogComment(blogComment)
            })
            e('#id-input-content').value = ''
        } else {
            alertInfo('请输入文本...')
        }
    })
}

var bindEvents = function () {
    bindEventBlogCommentAdd()
}

var __main = function () {
    bindEvents()
}

__main()
