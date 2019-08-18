简介
HTML5 世界中有这样一位无名英雄：XMLHttpRequest。严格地说，XHR2 并不属于 HTML5。不过，它是浏览器供应商对于核心平台不断做出的改进中的一部分。我之所以将 XHR2 加入我们新的百宝囊中，就是因为它在如今复杂的网络应用中扮演了不可或缺的角色。

结果呢，我们这位老朋友来了个大变身，很多人都不知道它的新功能了。2 级 XMLHttpRequest 引入了大量的新功能（例如跨源请求、上传进度事件以及对上传/下载二进制数据的支持等），一举封杀了我们网络应用中的疯狂黑客。这使得 AJAX 可以与很多尖端的 HTML5 API 结合使用，例如 File System API、Web Audio API 和 WebGL。

此教程重点介绍 XMLHttpRequest 中的新功能，尤其是可用于处理文件的功能。

抓取数据
以前通过 XHR 抓取二进制 blob 形式的文件是很痛苦的事情。从技术上来说，这甚至是不可能的实现。有一种广为流传的一种技巧，是将 MIME 类型替换为由用户定义的字符集，如下所示：

提取图片的旧方法：

var xhr = new XMLHttpRequest();
xhr.open('GET', '/path/to/image.png', true);

// Hack to pass bytes through unprocessed.
xhr.overrideMimeType('text/plain; charset=x-user-defined');

xhr.onreadystatechange = function(e) {
  if (this.readyState == 4 && this.status == 200) {
    var binStr = this.responseText;
    for (var i = 0, len = binStr.length; i < len; ++i) {
      var c = binStr.charCodeAt(i);
      //String.fromCharCode(c & 0xff);
      var byte = c & 0xff;  // byte at offset i
    }
  }
};

xhr.send();
虽然这种方法可行，但是 responseText 中实际返回的并不是二进制 blob，而是代表图片文件的二进制字符串。我们要巧妙地让服务器在不作处理的情况下，将这些数据传递回去。虽然这个技巧有用，但是我不推荐大家走这种歪门邪道。只要是通过玩弄字符代码和字符串操控技巧，强行将数据转化成所需的格式，都会出现问题。

指定响应格式
在前一个示例中，我们通过替换服务器的 MIME 类型并将响应文本作为二进制字符串处理，下载了二进制“文件”形式的图片。现在，让我们利用 XMLHttpRequest 新增的 responseType 和 response 属性，告知浏览器我们希望返回什么格式的数据。

xhr.responseType
在发送请求前，根据您的数据需要，将 xhr.responseType 设置为“text”、“arraybuffer”、“blob”或“document”。请注意，设置（或忽略）xhr.responseType = '' 会默认将响应设为“text”。
xhr.response
成功发送请求后，xhr 的响应属性会包含 DOMString、ArrayBuffer、Blob 或 Document 形式（具体取决于 responseTyp 的设置）的请求数据。
凭借这个优秀的新属性，我们可以修改上一个示例：以 ArrayBuffer 而非字符串的形式抓取图片。将缓冲区移交给 BlobBuilder API 可创建 Blob：

BlobBuilder = window.MozBlobBuilder || window.WebKitBlobBuilder || window.BlobBuilder;

var xhr = new XMLHttpRequest();
xhr.open('GET', '/path/to/image.png', true);
xhr.responseType = 'arraybuffer';

xhr.onload = function(e) {
  if (this.status == 200) {
    var bb = new BlobBuilder();
    bb.append(this.response); // Note: not xhr.responseText

    var blob = bb.getBlob('image/png');
    ...
  }
};

xhr.send();
好多了！

ArrayBuffer 响应
ArrayBuffer 是二进制数据通用的固定长度容器。如果您需要原始数据的通用缓冲区，ArrayBuffer 就非常好用，但是它真正强大的功能是让您使用 JavaScript 类型数组创建底层数据的“视图”。实际上，可以通过单个 ArrayBuffer 来源创建多个视图。例如，您可以创建一个 8 位整数数组，与来自相同数据的现有 32 位整数数组共享同一个 ArrayBuffer。底层数据保持不变，我们只是创建其不同的表示方法。

例如，下面以 ArrayBuffer 的形式抓取我们相同的图片，但是现在，会通过该数据缓冲区创建无符号的 8 位整数数组。

var xhr = new XMLHttpRequest();
xhr.open('GET', '/path/to/image.png', true);
xhr.responseType = 'arraybuffer';

xhr.onload = function(e) {
  var uInt8Array = new Uint8Array(this.response); // this.response == uInt8Array.buffer
  // var byte3 = uInt8Array[4]; // byte at offset 4
  ...
};

xhr.send();
Blob 响应
如果您要直接处理 Blob 且/或不需要操作任何文件的字节，可使用 xhr.responseType='blob'：

window.URL = window.URL || window.webkitURL;  // Take care of vendor prefixes.

var xhr = new XMLHttpRequest();
xhr.open('GET', '/path/to/image.png', true);
xhr.responseType = 'blob';

xhr.onload = function(e) {
  if (this.status == 200) {
    var blob = this.response;

    var img = document.createElement('img');
    img.onload = function(e) {
      window.URL.revokeObjectURL(img.src); // Clean up after yourself.
    };
    img.src = window.URL.createObjectURL(blob);
    document.body.appendChild(img);
    ...
  }
};

xhr.send();
Blob 可用于很多场合，包括保存到 indexedDB、写入 HTML5 文件系统 或创建 Blob 网址（如本例中所示）。

发送数据
能够下载各种格式的数据固然是件好事，但是如果不能将这些丰富格式的数据送回本垒（服务器），那就毫无意义了。XMLHttpRequest 有时候会限制我们发送 DOMString 或 Document (XML) 数据。但是现在不会了。现已替换成经过修改的 send() 方法，可接受以下任何类型：DOMString、Document、FormData、Blob、File、ArrayBuffer。本部分的其余内容中的示例演示了如何使用各类型发送数据。

发送字符串数据：xhr.send(DOMString)
function sendText(txt) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/server', true);
  xhr.onload = function(e) {
    if (this.status == 200) {
      console.log(this.responseText);
    }
  };

  xhr.send(txt);
}

sendText('test string'); function sendTextNew(txt) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/server', true);
  xhr.responseType = 'text';
  xhr.onload = function(e) {
    if (this.status == 200) {
      console.log(this.response);
    }
  };
  xhr.send(txt);
}

sendText2('test string');
这没有新内容，只是正确的代码段略有不同。其中设置了 responseType='text' 作为对比。再次说明，省略此行会得到同样的结果。

提交表单：xhr.send(FormData)
很多人可能习惯于使用 jQuery 插件或其他库来处理 AJAX 表单提交。而我们可以改用 FormData，这是另一种针对 XHR2 设计的新数据类型。使用 FormData 能够很方便地实时以 JavaScript 创建 HTML <form>。然后可以使用 AJAX 提交该表单：

function sendForm() {
  var formData = new FormData();
  formData.append('username', 'johndoe');
  formData.append('id', 123456);

  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/server', true);
  xhr.onload = function(e) { ... };

  xhr.send(formData);
}
实质上，我们只是动态创建了 <form>，并通过调用 append 方法为其附加了 <input> 值。

当然，您无需从一开始就创建 <form>。FormData 对象可通过页面上现有的 HTMLFormElement 进行初始化。例如：

<form id="myform" name="myform" action="/server">
  <input type="text" name="username" value="johndoe">
  <input type="number" name="id" value="123456">
  <input type="submit" onclick="return sendForm(this.form);">
</form>
function sendForm(form) {
  var formData = new FormData(form);

  formData.append('secret_token', '1234567890'); // Append extra data before send.

  var xhr = new XMLHttpRequest();
  xhr.open('POST', form.action, true);
  xhr.onload = function(e) { ... };

  xhr.send(formData);

  return false; // Prevent page from submitting.
}
HTML 表单可包含文件上传（例如 <input type="file">），而 FormData 也可以处理此操作。只需附加文件，浏览器就会在调用 send() 时构建 multipart/form-data 请求。

function uploadFiles(url, files) {
  var formData = new FormData();

  for (var i = 0, file; file = files[i]; ++i) {
    formData.append(file.name, file);
  }

  var xhr = new XMLHttpRequest();
  xhr.open('POST', url, true);
  xhr.onload = function(e) { ... };

  xhr.send(formData);  // multipart/form-data
}

document.querySelector('input[type="file"]').addEventListener('change', function(e) {
  uploadFiles('/server', this.files);
}, false);
上传文件或 blob：xhr.send(Blob)
我们也可以使用 XHR 发送 File 或 Blob。请注意，所有 File 都是 Blob，所以在此使用两者皆可。

该示例使用 BlobBuilder API 从头开始创建新的文本文件，并将该 Blob 上传到服务器。该代码还设置了一个处理程序，用于通知用户上传进度：

<progress min="0" max="100" value="0">0% complete</progress>
function upload(blobOrFile) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/server', true);
  xhr.onload = function(e) { ... };

  // Listen to the upload progress.
  var progressBar = document.querySelector('progress');
  xhr.upload.onprogress = function(e) {
    if (e.lengthComputable) {
      progressBar.value = (e.loaded / e.total) * 100;
      progressBar.textContent = progressBar.value; // Fallback for unsupported browsers.
    }
  };

  xhr.send(blobOrFile);
}

// Take care of vendor prefixes.
BlobBuilder = window.MozBlobBuilder || window.WebKitBlobBuilder || window.BlobBuilder;

var bb = new BlobBuilder();
bb.append('hello world');

upload(bb.getBlob('text/plain'));
上传字节：xhr.send(ArrayBuffer)
最后也是相当重要的一点就是，我们能以 XHR 的有效负载形式发送 ArrayBuffer。

function sendArrayBuffer() {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/server', true);
  xhr.onload = function(e) { ... };

  var uInt8Array = new Uint8Array([1, 2, 3]);

  xhr.send(uInt8Array.buffer);
}
跨源资源共享 (CORS)
CORS 允许一个域上的网络应用向另一个域提交跨域 AJAX 请求。启用此功能非常简单，只需由服务器发送一个响应标头即可。

启用 CORS 请求
假设您的应用已经在 example.com 上了，而您想要从 www.example2.com 提取数据。一般情况下，如果您尝试进行这种类型的 AJAX 调用，请求将会失败，而浏览器将会出现“源不匹配”的错误。利用 CORS，www.example2.com 只需添加一个标头，就可以允许来自 example.com 的请求：

Access-Control-Allow-Origin: http://example.com
可将 Access-Control-Allow-Origin 添加到某网站下或整个域中的单个资源。要允许任何域向您提交请求，请设置如下：

Access-Control-Allow-Origin: *
其实，该网站 (html5rocks.com) 已在其所有网页上均启用了 CORS。启用开发人员工具后，您就会在我们的响应中看到 Access-Control-Allow-Origin 了：

Access-Control-Allow-Origin header on html5rocks.com
html5rocks.com 上的 Access-Control-Allow-Origin 标头
启用跨源请求是非常简单的，因此如果您的数据是公开的，请务必启用 CORS！

提交跨域请求
如果服务器端已启用了 CORS，那么提交跨域请求就和普通的 XMLHttpRequest 请求没什么区别。例如，现在 example.com 可以向 www.example2.com 提交请求了：

var xhr = new XMLHttpRequest();
xhr.open('GET', 'http://www.example2.com/hello.json');
xhr.onload = function(e) {
  var data = JSON.parse(this.response);
  ...
}
xhr.send();
实际示例：
下载文件并保存到 HTML5 文件系统
假设您有一个图片库，想要提取一些图片，然后使用 HTML5 文件系统本地保存这些图片。一种方法是以 ArrayBuffer 形式请求图片，通过数据构建 Blob，并使用 FileWriter 写入 blob：

window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;

function onError(e) {
  console.log('Error', e);
}

var xhr = new XMLHttpRequest();
xhr.open('GET', '/path/to/image.png', true);
xhr.responseType = 'arraybuffer';

xhr.onload = function(e) {

  window.requestFileSystem(TEMPORARY, 1024 * 1024, function(fs) {
    fs.root.getFile('image.png', {create: true}, function(fileEntry) {
      fileEntry.createWriter(function(writer) {

        writer.onwrite = function(e) { ... };
        writer.onerror = function(e) { ... };

        var bb = new BlobBuilder();
        bb.append(xhr.response);

        writer.write(bb.getBlob('image/png'));

      }, onError);
    }, onError);
  }, onError);
};

xhr.send();
请注意：要使用此代码，请参阅“探索 FileSystem API”教程中的浏览器支持和存储限制。

分割文件并上传各个部分
使用 File API，我们可以将操作简化为上传大文件。我们采用的技术是：将要上传的文件分割成多个部分，为每个部分生成一个 XHR，然后在服务器上将各部分组合成文件。这类似于 Gmail 快速上传大附件的方法。使用这种技术还可以规避 Google 应用引擎对 http 请求的 32 MB 限制。

window.BlobBuilder = window.MozBlobBuilder || window.WebKitBlobBuilder ||
                     window.BlobBuilder;

function upload(blobOrFile) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/server', true);
  xhr.onload = function(e) { ... };
  xhr.send(blobOrFile);
}

document.querySelector('input[type="file"]').addEventListener('change', function(e) {
  var blob = this.files[0];

  const BYTES_PER_CHUNK = 1024 * 1024; // 1MB chunk sizes.
  const SIZE = blob.size;

  var start = 0;
  var end = BYTES_PER_CHUNK;

  while(start < SIZE) {

    // Note: blob.slice has changed semantics and been prefixed. See http://goo.gl/U9mE5.
    if ('mozSlice' in blob) {
      var chunk = blob.mozSlice(start, end);
    } else {
      var chunk = blob.webkitSlice(start, end);
    }

    upload(chunk);

    start = end;
    end = start + BYTES_PER_CHUNK;
  }
}, false);

})();
用于在服务器上重组文件的代码并未在此显示。