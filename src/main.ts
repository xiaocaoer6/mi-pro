// 入口文件,将其他文件引入
import './main.css' // 普通css引入方式
import popup from './components/popup/popup'
import video from './components/video/video'

let listArr = document.querySelectorAll("#list li")

// 给li绑定点击事件
for (let i = 0; i < listArr.length; i++) {
  listArr[i].addEventListener('click', function(){
    // 事件回调函数中的this就是事件源，便签自定义属性data-a的读取方式就是dataset.a
    let url = this.dataset.url
    let title = this.dataset.title
    console.log(url,title);
    
    popup({
      title,
      pos: "center",
      content: (ele)=>{
        console.log(ele);
        video({
          url,
          elem: ele,
          autoplay: true,
        })
      }
    })
  })
}