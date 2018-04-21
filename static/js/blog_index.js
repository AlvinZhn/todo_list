// BLOG API
// 获取所有 blog
var apiBlogAll = function (callback) {
    var username = e('#id-title').textContent.split(' ')[0]
    var path = `/api/blog/all/${username}`
    ajax('GET', path, '', callback)
}

var apiBlogDelete = function (id, callback) {
    var path = `/api/blog/delete?id=${id}`
    ajax('GET', path, '', callback)
}

var blogTemplate = function (blog) {
    t = `
        <tr data-id="${blog.id}" class="blog-cell">
            <td>
                <a href="/blog/detail?id=${blog.id}" data-id="${blog.id}" class="blog-title"></a>
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

var insertBlog = function (blog) {
    var blogCell = blogTemplate(blog)
    var blogList = e('.blog-list')
    blogList.insertAdjacentHTML('beforeEnd', blogCell)
    e(`.blog-title[data-id="${blog.id}"]`).textContent = blog.title
}

var loadBlogs = function () {
    apiBlogAll(function (r) {
        var blogs = JSON.parse(r)
        if (blogs !== null) {
            for (var i = 0; i < blogs.length; i++) {
                insertBlog(blogs[i])
            }
        }
    })
}

var bindEventBlogDelete = function () {
    var blogList = e('.blog-list')
    blogList.addEventListener('click', function (event) {
        var self = event.target
        var blogId = self.dataset.id
        if (self.classList.contains('blog-delete')) {
            apiBlogDelete(blogId, function (r) {
                try {
                    var resonseId = JSON.parse(r)['id']
                    e(`.blog-cell[data-id="${resonseId}"]`).remove()
                } catch (e) {
                    alertInfo('You can not delete others blog!')
                }
            })
        } else {
        }
    })
}

var bindEvents = function () {
    bindEventBlogDelete()
}

var __main = function () {
    bindEvents()
    loadBlogs()
}

__main()
