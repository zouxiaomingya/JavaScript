#### video 事件

oncanplaythrough 事件在视频/音频（audio/video）可以正常播放且无需停顿和缓冲时触发。

在视频/音频（audio/video）加载过程中，事件的触发顺序如下:

1. onloadstart
2. ondurationchange
3. onloadedmetadata
4. onloadeddata
5. onprogress
6. oncanplay
7. oncanplaythrough

```javascript
const videoDom = document.getElementById("video-dom");
videoDom.onchange = (e) => {
  const file = e.target.files[0];
  var url = URL.createObjectURL(file);
  var videos = document.getElementById("audio_id");
  videos.src = url;

  // 视频开始加载时执行
  videos.onloadstart = () => {
    console.log(videos.duration, "onloadstart>>>>>>");
  };

  // ondurationchange 事件在视频/音频（audio/video）的时长发生变化时触发。
  // 当视频/音频（audio/video）已经加载后，视频/音频（audio/video）的时长从 "NaN" 修改为正在的时长。
  videos.ondurationchange = () => {
    console.log(videos.duration, "ondurationchange>>>>>>");
  };

  // 指定视频/音频（audio/video）的元数据加载后触发
  videos.onloadedmetadata = () => {
    console.log(videos.duration, "onloadedmetadata>>>>>>");
  };

  // 事件在当前帧的数据加载完成且还没有足够的数据播放视频/音频（audio/video）的下一帧时触发。
  videos.onloadeddata = () => {
    console.log(videos.duration, "onloadeddata>>>>>>");
  };

  // 事件在浏览器下载指定的视频/音频（audio/video）时触发。
  videos.onprogress = () => {
    console.log(videos.duration, "onprogress>>>>>>");
  };

  // 事件在用户可以开始播放视频/音频（audio/video）时触发。
  videos.oncanplay = () => {
    console.log(videos.duration, "oncanplay>>>>>>");
  };

  // 事件在视频/音频（audio/video）可以正常播放且无需停顿和缓冲时触发。
  videos.oncanplaythrough = () => {
    console.log(videos.duration, "oncanplaythrough>>>>>>");
  };
};
```

实际使用场景 获取视频的视频时常

```javascript
export const videoFileChangeImgFile: (file: File) => Promise<IResult> = (
  file
) => {
  return new Promise(function (resolve, reject) {
    const videoElem = document.createElement("video");
    const dataUrl = URL.createObjectURL(file);
    // 设置 auto 预加载数据， 否则会出现截图为黑色图片的情况
    videoElem.setAttribute("preload", "auto");
    videoElem.src = dataUrl;

    // 当前帧的数据是可用的
    videoElem.onloadeddata = function () {
      const canvasElem: any = document.createElement("canvas");
      const { videoWidth, videoHeight, duration } = videoElem;
      canvasElem.width = videoWidth;
      canvasElem.height = videoHeight;
      canvasElem
        .getContext("2d")
        .drawImage(videoElem, 0, 0, videoWidth, videoHeight);

      // 导出成blob文件
      canvasElem.toBlob((blob) => {
        // 将blob文件转换成png文件
        const imgFile = toThumbFile(blob);
        // 视频流用完释放内存
        URL.revokeObjectURL(dataUrl);
        resolve({ imgFile, duration });
      }, "image/png");
    };
    videoElem.onerror = function () {
      reject("video 后台加载失败");
    };
  });
};
```
