// WEIBO API
// 获取所有 weibo
var apiWeiboAll = function (callback) {
    var username = e('#id-title').textContent.split(' ')[0]
    var path = `/api/weibo/all/${username}`
    ajax('GET', path, '', callback)
}

var apiWeiboAdd = function (form, callback) {
    var path = '/api/weibo/add'
    ajax('POST', path, form, callback)
}

var apiWeiboDelete = function (id, callback) {
    var path = `/api/weibo/delete?id=${id}`
    ajax('GET', path, '', callback)
}

var apiWeiboEdit = function (form, callback) {
    var path = '/api/weibo/update'
    ajax('POST', path, form, callback)
}

var weiboTemplate = function(weibo) {
    var type = ['info', 'success', 'warning'][parseInt(3*Math.random())]
    t = `
    <div class="panel-group weibo-cell" data-id="${weibo.id}" id="${weibo.id}">
        <div class="panel panel-${type}">
            <div class="panel-heading">
                <h4 class="panel-title weibo-content" data-toggle="collapse" data-parent="#weiboId"
                       href="#weiboIdComment" align="left">
                    <a data-toggle="collapse" data-parent="#${weibo.id}"
                       href="#${weibo.id}Comment">
                    </a>
                </h4>
                <div class='pull-right haha'>
                    <input class="comment-input form-control">
                    <button class="button-addComment btn btn-info">添加评论</button>
                    <button data-id="${weibo.id}" class="weibo-update btn btn-success">更新微博</button>
                    <button data-id="${weibo.id}" class="weibo-delete btn btn-danger">删除微博</button>
                </div>
            </div>
            <div id="${weibo.id}Comment" class="panel-collapse collapse">
                <div class="panel-body">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>Content</th>
                                <th>Time</th>
                                <th>Author</th>
                                <th>Operation</th>
                            </tr>
                        </thead>
                        <tbody class="comment-list">

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    `
    return t;
}

function removeWeiboForm() {
    var updateForm = e('.weibo-update-form')
    updateForm.remove()
    weiboUpdateFormHide = true
}

var weiboUpdateTemplate = function(weiboId) {
    t = `
        <div class="weibo-update-form">
            <input class="weibo-update-input form-control input-sm" autofocus placeholder="请输入新的WEIBO">
            <button data-id="${weiboId}" class="weibo-edit btn btn-sm btn-success">确认修改</button>
            <button class="btn btn-sm btn-warning" onclick="removeWeiboForm()">关闭</button>
        </div>
    `
    return t;
}

var insertWeibo = function(weibo) {
    var weiboCell = weiboTemplate(weibo)
    var weiboList = e('.weibo-list')
    weiboList.insertAdjacentHTML('beforeEnd', weiboCell)
    e(`a[data-parent="#${weibo.id}"]`).textContent = weibo.content
}

var loadWeibos = function () {
    apiWeiboAll(function (r) {
        var weibos = JSON.parse(r)
        // log('weibos', weibos)
        if (weibos !== null) {
            for (var i = 0; i < weibos.length; i++) {
                insertWeibo(weibos[i])
            }
        }
    })
}

var bindEventWeiboAdd = function () {
    var button = e('#id-button-add')
    button.addEventListener('click', function() {
        var input = e('#id-input-weibo')
        // log('input', input)
        var content = input.value
        if (content.length > 0) {
            var form = {
                content : content
            }
            // log('form', form)
            apiWeiboAdd(form, function (r) {
                var weibo = JSON.parse(r)
                insertWeibo(weibo)
            })
            input.value = ''
        }  else {
            alertInfo('请输入文本...')
        }
    })
}

var bindEventWeiboDelete = function () {
    var weiboList = e('.weibo-list')
    weiboList.addEventListener('click', function(event) {
        var self = event.target
        if (self.classList.contains('weibo-delete')){
            apiWeiboDelete(self.dataset.id, function (r) {
                try {
                    var resonseId = JSON.parse(r)['id']
                    self.parentElement.parentElement.parentElement.remove()
                } catch (e) {
                    alertInfo('You can not delete others weibo!')
                }
            })
        } else {
            // log('点到了 weibo update')
        }
    })
}

var weiboUpdateFormHide = true

var bindEventWeiboUpdate = function () {
    var weiboList = e('.weibo-list')
    weiboList.addEventListener('click', function(event) {
        var self = event.target
        if (self.classList.contains('weibo-update')){
            var t = weiboUpdateTemplate(self.dataset.id)

            if (weiboUpdateFormHide) {
                self.parentElement.insertAdjacentHTML('beforeEnd', t)
                weiboUpdateFormHide = false
            } else {
                removeWeiboForm()
            }

        } else {
            // log('点到了 weibo delete')
        }
    })
}

var bindEventWeiboEdit = function () {
    var weiboList = e('.weibo-list')
    weiboList.addEventListener('click', function(event) {
        var self = event.target
        if (self.classList.contains('weibo-edit')){
            weiboId = self.dataset.id
            // log('点到了 修改 按钮, id 是', weiboId)
            var weiboCell = self.closest('.weibo-cell')
            var input = weiboCell.querySelector('.weibo-update-input')
            var form = {
                id : weiboId,
                content : input.value,
            }
            if (form['content'].length > 0) {
                apiWeiboEdit(form, function (r) {z
                    var updateForm = weiboCell.querySelector('.weibo-update-form')
                    updateForm.remove()
                    weiboUpdateFormHide = true

                    var weibo = JSON.parse(r)
                    var weiboTag = weiboCell.querySelector('.weibo-content')
                    weiboTag.innerHTML = weibo.content
                })
            }  else {
                alertInfo('请输入文本...')
            }
        } else {
            // log('点到了 weibo delete')
        }
    })
}

var bindEvents = function () {
    bindEventWeiboAdd()
    bindEventWeiboDelete()
    bindEventWeiboUpdate()
    bindEventWeiboEdit()
}

var __main = function () {
    bindEvents()
    loadWeibos()
}

__main()
