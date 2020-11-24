let styles = require('./video.css').default

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
      width: "800px",
      height: "440px",
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
    this.tempContainer.className = styles.video
    this.tempContainer.innerHTML = `
      <div class="${styles['video-container']}">
        <video src ="${this.options.url}"></video>
      </div>
      <div class="${styles['video-control']}">
        <div class="${styles['progress-container-1']}">
          <div class="${styles['video-progress']}"></div>
          <div class="${styles['video-play']}"></div>
          <div class="${styles['video-dot']}"></div>
        </div>
        <div class="${styles['progress-container']}">
          <div  class="${styles['video-bt-left']}">
            <i class="iconfont icon-zanting"></i>
            <span class="${styles['video-time']}">00:00 / </span>
            <span class="${styles['video-all']}">00:00</span>
          </div>
          <div class="${styles['video-bt-right']}">
            <i class="iconfont icon-yinliang"></i>
            <div  class="${styles['video-vol-progress-container']}">
              <div class="${styles['video-vol-progress']}"></div>
              <div class="${styles['video-vol-play']}"></div>
              <div class="${styles['video-vol-dot']}"></div>
            </div>
            <i class="iconfont icon-quanping"></i>
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
    // 获取元素节点
    let videoContent: HTMLVideoElement = document.querySelector(`.${styles['video-container']} video` )
    let playOrPause =  document.querySelector(`.${styles['video-bt-left']} i`)
    let timeNodes = document.querySelectorAll(`.${styles['video-bt-left']} span`)
    let volumeOrFullNodes = document.querySelectorAll(`.${styles['video-bt-right']} i`)
    let playProgress = document.querySelectorAll(`.${styles['progress-container-1']} div`) as NodeListOf<HTMLElement>
    let timer
    
    //视频加载完毕事件
    videoContent.addEventListener('canplay',()=>{
      // 设置总时间,默认单位是秒，可能会有小数
      console.log(videoContent.duration);
      timeNodes[1].innerHTML = handleTime(videoContent.duration)
    })

    // 播放视频，将按钮转为暂停
    videoContent.addEventListener('play',()=>{
      playOrPause.className = "iconfont icon-zanting1"
      timer = setInterval(playing, 1000)
    })

    // 播放暂停，将按钮转为播放
    videoContent.addEventListener('pause',()=>{
      playOrPause.className = "iconfont  icon-zanting"
      clearInterval(timer)
    })

    // 点击按钮，播放暂停视频
    playOrPause.addEventListener('click',()=>{
      if(videoContent.paused){
        videoContent.play()
      }else {
        videoContent.pause()
      }
    })

    // 全屏
    volumeOrFullNodes[1].addEventListener('click', ()=>{
      videoContent.requestFullscreen()
    })

    // 正在播放的定时器监听回调
    function playing() {
     // 播放的进度比例
     let scale = videoContent.currentTime / videoContent.duration
     let scaleSuc = videoContent.buffered.end(0) / videoContent.duration
     console.log(videoContent);
     
     
     playProgress[0].style.width =  scaleSuc * 100 +'%'
     playProgress[1].style.width =  scale * 100 +'%'
     playProgress[2].style.left =  scale * 100 +'%'
     timeNodes[0].innerHTML = handleTime(videoContent.currentTime) + '/'

    }

    // 处理视频总时间
    function handleTime(param: number):string {
      // 四舍五入
      console.log(param,'param');
      
      param = Math.round(param)
      // 将秒数转为分钟
      let min = Math.floor( param / 60 )
      let sec = param % 60
      return  `${setZero(min)}:${setZero(sec)}`
    }

    // 处理视频总时间
    function setZero(param: number):string {
      if(param < 10){
        return '0'+param
      }else{
        return ''+param
      }
    }
 
  }

 }

export default video