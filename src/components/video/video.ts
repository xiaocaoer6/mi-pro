let styles = require('./video.css')

// 规范组件
interface componentSetting {
  tempContainer: HTMLElement,
  init: ()=>void,
  template: ()=>void,
  handle: ()=> void,
} 
// 限制配置项参数格式
interface VideoSetting {
  width?: string;
  height?: string;
  autoplay?: boolean;
  url: string;
  elem: string | HTMLElement | Element // 播放器组件嵌入的元素节点，或者代表该节点的选择器
}

function video(options: VideoSetting) {
  return new Video(options)
}


class Video implements componentSetting{
  tempContainer
  constructor(private options: VideoSetting){
    this.options = Object.assign({
      width: "200px",
      height: "200px",
      autoplay: false,
    }, this.options)
    this.init()
  }
  init(){
    this.template()
    this.handle()
  }
  template(){
    this.tempContainer = document.createElement('div')
    this.tempContainer.style.width = this.options.width
    this.tempContainer.style.height = this.options.height
    
    this.tempContainer.innerHTML = `
      <div class="${styles['video-container']}">
        <video src ="${this.options.url}"></video>
      </div>
      <div class="${styles['video-control']}">
        <div class="${styles['progress-container']}">
          <div class="${styles['video-progress']}"></div>
          <div class="${styles['video-play']}"></div>
          <div class="${styles['video-dot']}"></div>
        </div>
        <div class="${styles['progress-container']}">
          <i class="iconfont icon-iconset0481"></i>
          <span class="${styles['video-time']}">00:14 / </span>
          <span class="${styles['video-all']}">150:29</span>
          <div class="${styles['video-bt-right']}">
            <i class="iconfont icon-yinliang"></i>
            <div class="${styles['video-vol-progress']}"></div>
            <div class="${styles['video-vol-play']}"></div>
            <div class="${styles['video-vol-dot']}"></div>
          </div>
        </div>
      </div>
    `
    if(typeof this.options.elem === "string"){
      // string的话接收的就是一个选择器
       document.querySelector(`${this.options.elem}`).appendChild(this.tempContainer)
    }else {
      this.options.elem.appendChild(this.tempContainer)

    }
  }
  handle(){

  }
 }

export default video