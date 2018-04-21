// BLOG API
// 增加 blog
var apiBlogAdd = function (form, callback) {
    var path = '/api/blog/add'
    ajax('POST', path, form, callback)
}

var bindEventBlogAdd = function () {
    var button = e('#id-button-add')
    button.addEventListener('click', function() {
        var title = e('#id-input-title').value
        var content = e('#id-input-content').value
        // log('title',title)
        // log('content',content)
        if (title.length > 0 && content.length > 0) {
            // 将用户输入的数据构成表单，通过api发送给后端
            var form = {
                title: title,
                content: content,
            }
            apiBlogAdd(form, function (r) {
                var blog = JSON.parse(r)
                window.location = blog.redirect
            })
        } else {
            alertInfo('请输入文本...')
        }
    })
}

var bindEvents = function () {
    bindEventBlogAdd()
}

var __main = function () {
    bindEvents()
}

__main()
