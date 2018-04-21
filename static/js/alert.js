var alertInfo = function(text){
    var alert = `
    <div class="alert alert-warning">
        <a id="num" href="#" class="close" data-dismiss="alert">
            &times
        </a>
        <strong>提示！</strong>${text}
    </div>
    `
    e('main').insertAdjacentHTML('afterBegin', alert)
    var close = function (){
        $(".alert").fadeOut("slow")
        $(".alert").alert('close')
    }
    setTimeout(close, 3000)
}
