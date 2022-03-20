// 下载视频的方法
// 思路是新建了一个<a>标签，然后代码触发点击
let handleDownloadVideo = () => {
    fetch(`/downloads/?file_type=video&file_name=${this.state.video_id}`, {
    headers: {'Authorization': `${this.props.token}`},}).then((response) => {
        response.blob().then(blob => {
            let blobUrl = window.URL.createObjectURL(blob);
            const aElement = document.createElement('a');
            document.body.appendChild(aElement);
            let filename = `${this.state.video_id}`;
            aElement.href = blobUrl;
            aElement.download = filename;
            aElement.click();
            document.body.removeChild(aElement);
        })
    }).catch(e => {
        console.log(e);
        alert('文件下载失败!');
    })
}