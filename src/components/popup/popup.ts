// import './popup.css' // 普通css引入方式,css模块化后这种方式不生效,
let styles = require('./popup.css').default // css模块化后node的引入方式
// import styles from './popup.css' // 这种需要配合css的声明文件，让ts认识模块化后的css

console.log(styles,'%%');

// 规范组件
interface componentSetting {
  tempContainer: HTMLElement,
  init: ()=>void,
  template: ()=>void,
  handle: ()=> void,
} 

// 限制配置项参数格式
interface PopupSetting {
  width?: string;
  height?: string;
  mask?: boolean; // 是否有遮罩
  pos?: string; // 位置，center,left,right,top
  title?: string;
  // content的作用是将弹层容器DOM节点暴露出去，用户可以自定义这个容器的内容
  content?: (ele: Element)=>void; // 没有返回值的函数，对弹层容器的配置 ()=>void表示函数类型
}

// 向外暴露函数，接收配置项参数
function popup(options: PopupSetting) {
  return new Popup(options)
}

// 采用类的方式创建组件
class Popup implements componentSetting{
  tempContainer;
  maskContainer;
  //  接受外部传参 private  直接将接受的参数写在实例上？ 结果就是可以在使用this读到
  // Object.assign合并两个对象，将第一个对象合并到第二个对象中
  constructor( private options: PopupSetting){
    // 设置参数初始值
    this.options = Object.assign({
      width: "800px",
      height: "500px",
      mask: true, // 是否有遮罩
      pos: "center", // 位置，center,left,right
      title: '',
      url: '',
      content: function(ele: Element){}, // 没有返回值的函数，对弹层容器的配置 容器中要渲染的内容
    },this.options)
    this.init()
  }
  init(){
    this.template()
    this.options.mask && this.createMask()
    this.handle()
    this.contentCallback()
  };
  template(){
    this.tempContainer = document.createElement('div')

    this.tempContainer.className = styles.pop
    this.tempContainer.style.width = this.options.width
    this.tempContainer.style.height = this.options.height

    this.tempContainer.innerHTML = `
    <div class="${styles['pop-title']}">
      <span>${this.options.title}</span>
      <i class="iconfont icon-guanbi"></i>
    </div>
    <div class="${styles['pop-content']}">
    </div>
    `
    document.body.appendChild(this.tempContainer)
    
    // 位置，必须在追加元素之后，否则读不到元素宽高
    if(this.options.pos === 'left'){
      this.tempContainer.style.left = 0
      this.tempContainer.style.top = (window.innerHeight - this.tempContainer.offsetHeight) +'px'
    }else if(this.options.pos === 'right'){
      this.tempContainer.style.right = 0
      this.tempContainer.style.top = (window.innerHeight - this.tempContainer.offsetHeight) +'px'
    }else {
      this.tempContainer.style.left = (window.innerWidth - this.tempContainer.offsetWidth) / 2 +'px'
      this.tempContainer.style.top = (window.innerHeight - this.tempContainer.offsetHeight) / 2 +'px'
    }
  };
  handle() {
  // 关闭按钮绑定事件
  let closeNode = document.querySelector('.icon-guanbi')
  //事件回调函数中的this是事件源，这里用箭头函数比较方便
  closeNode.addEventListener('click', () =>{
    document.body.removeChild(this.tempContainer);
    this.options.mask && document.body.removeChild(this.maskContainer);
  })
  }
  createMask(){
    this.maskContainer = document.createElement('div')
    document.body.appendChild(this.maskContainer)
    this.maskContainer.className = styles.mask
  }
  // 自定义弹层内容
  contentCallback(){
    let contentContainer = document.querySelector(`.${styles['pop-content']}`)
    this.options.content(contentContainer)
  }
}


export default popup



