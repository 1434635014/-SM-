
SM.extend({
    toBase64: function (obj) {
        var file = obj.file, src = obj.src, size = obj.size, success = obj.success
        var img = new Image();

        if (src){
            img.src = src
        }else{
            var reader = new FileReader();//读取客户端上的文件
            reader.onload = function () {
                var url = reader.result;//读取到的文件内容.这个属性只在读取操作完成之后才有效,并且数据的格式取决于读取操作是由哪个方法发起的.所以必须使用reader.onload，
                img.src = url;//reader读取的文件内容是base64,利用这个url就能实现上传前预览图片
            }
        }
        img.onload = function () {
            //生成比例
            var width = img.width, height = img.height;
            //计算缩放比例
            var rate = 1;
            if (size){
                if (width >= height) {
                    if (width > size) rate = size / width;
                } else {
                    if (height > size) rate = size / height;
                }
            }
            img.width = width * rate;
            img.height = height * rate;
            //生成canvas
            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext("2d");
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, img.width, img.height);
            var base64 = canvas.toDataURL('image/jpeg', 0.9);
            success(base64);
        };
        if(file) reader.readAsDataURL(file);
        if(src) reader.readAsDataURL(src);
    },
    toBSys: function (obj) {
        var src = obj.src, success = obj.success
        var xhr = new XMLHttpRequest();
        xhr.open("get", src, true);
        xhr.responseType = "blob";
        xhr.onload = function(res) {
            if (this.status == 200) {
                var blob = this.response;
                success(window.URL.createObjectURL(blob));
            }
        }
        xhr.send();
    }
})


