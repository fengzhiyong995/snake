//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
      score:{//积分板的数据
        fraction:'',
        length:''
      },
      speed:1000,//速度
      direction:{//虚拟轮盘的位置
        x:'',
        y:''
      },
      directionInit:{//初始的轮盘位置
        x:"",
        y:"",
        top:'',
        left:'',
        r1:'gg',
        r2:'ss'
      },
      interval:null
  },
  directionTouchS:function(e){//虚拟轮盘的触摸开始事件，获得初始的位置
    let that = this;
    let x = e.touches[0].pageX;
    let y = e.touches[0].pageY;
    let left = e.target.offsetLeft;
    let top = e.target.offsetTop;
    let nn = wx.createSelectorQuery();
    nn.select('.snakeDirection').boundingClientRect();
    nn.select('.snakeDirection .top').boundingClientRect();
    nn.exec(r =>{
      console.log(r);
      this.setData({
        directionInit:{
          x:x,
          y:y,
          top:top,
          left:left,
          r1:r[0].width/2,
          r2:r[1].width/2
        }
      })
    })
  },
  directionTouchM:function(e){//虚拟轮盘的触摸移动事件，获得初始的位置更新位置
    let x = e.touches[0].pageX;
    let y = e.touches[0].pageY;
    let lX = e.target.offsetLeft;
    let tY = e.target.offsetTop;
    let x1 = this.data.directionInit.x;
    let y1 = this.data.directionInit.y;
    let r1 = this.data.directionInit.r1;
    let r2 = this.data.directionInit.r2;
    let initLeft = this.data.directionInit.left;
    let initTop = this.data.directionInit.top;
    let mX = initLeft + x - x1;
    let mY = initTop + y - y1;
    let tureX = mX + r2 - r1;
    let tureY = -(mY + r2 - r1);
    Math.pow(tureX,2) + Math.pow(tureY,2) <= (Math.pow(r1,2) + r2 * 2)?(
      this.setData({//限制在轮盘内
      direction:{
        x:mX,
        y:mY
      }
    })
    ):(
      this.setData({
        direction:{
          // x:initLeft,
          // y:initTop
        }
      })
    );

  },
  directionTouchE:function(e){//轮播触摸结束事件，轮播回到初始位置
    let x = this.data.directionInit.left;
    let y = this.data.directionInit.top;
    this.setData({
      direction:{
        x:x,
        y:y
      }
    })
  },
  accelerationTouchS:function(e){//长按加速
    // clearInterval(this.data.interval);
    this.setData({
      // speed:1
      interval:setInterval(() => {
        this.setData({
          speed:++this.data.speed
        });
        this.data.speed > 4000?clearInterval(this.data.interval):'';
        console.log('我触发了',this.data.speed);
      }, 100)
    })


  },
  clearinter:function(e){//没按加速或者减速就清除定时器
    clearInterval(this.data.interval);
  },
  decelerationTouchS:function(e){//长按减速
    this.setData({
      interval:setInterval(() => {
          this.setData({
            speed:--this.data.speed
          });
          this.data.speed < 300 ?clearInterval(this.data.interval):'';
              console.log('我离开了',this.data.speed)
      }, 100),
    })
  }




  
})
