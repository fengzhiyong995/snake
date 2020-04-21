//index.js
//获取应用实例
const app = getApp();
Page({
  data: {
      score:{//积分板的数据
        fraction:'',
        length:''
      },
      speed:100,//速度
      direction:{//虚拟轮盘的位置
        x:'',
        y:''
      },
      directionInit:{//初始的轮盘位置
        x:"",
        y:"",
        top:'',
        left:'',
        r1:'',
        r2:''
      },
      interval:null,//速度定时器
      snake:{
        x:300,
        y:150,
        width:'',
        length:''
      },
      drawInter:null,//绘制定时器
      draw(c,x,y){//绘制开始的蛇-动画
        c.beginPath();
        c.moveTo(this.snake.x,this.snake.y);
        c.lineTo(x,y);
        c.stroke();        
        c.draw(true)
      }
  },
  onLoad:function(){
    var that = this;
    const ctx = wx.createCanvasContext('snakeMapB');
    ctx.setStrokeStyle('red');
    ctx.setLineCap("round");
    ctx.setLineJoin("round");
    ctx.setLineWidth(15);
    let rand = Math.floor(Math.random() * 360);
    let b = Math.floor(rand / 90);
    let tureRand = rand - 90 * b;
    let tan = Math.tan(Math.PI / 180 * tureRand);
    let v = 0.2;
    switch(b){//以随机的角度为依据，写出初始蛇的出生方向
      case 0: 
        var x = that.data.snake.x + v;
        var y = that.data.snake.y + tan; 
        tureRand === 90?x = that.data.snake.x:'';
        that.data.draw(ctx,x,y);
        console.log(x,y,rand);
        var i = 1;
        that.setData({
          drawInter:setInterval(() => {
            that.data.draw(ctx,x,y);
            tureRand === 90?'': x = ++x;
            y = y +  tan;
            i++;
            i === 30 ?clearInterval(that.data.drawInter):'';
          }, that.data.speed),
        })
        break;
      case 1: 
        var x = that.data.snake.x - v;
        var y = that.data.snake.y + tan;
        tureRand === 90?y = that.data.snake.y:'';
        that.data.draw(ctx,x,y);
        console.log(x,y,rand);
        var i = 1;
        that.setData({
          drawInter:setInterval(() => {
            that.data.draw(ctx,x,y);
            tureRand === 90?'':y = y + tan;
            x = --x;
            i++;
            i === 30 ?clearInterval(that.data.drawInter):'';
          }, that.data.speed),
        })
        break;
      case 2: 
        var x = that.data.snake.x -v;
        var y = that.data.snake.y - tan;
        tureRand === 90?x = that.data.snake.x:'';
        that.data.draw(ctx,x,y);
        console.log(x,y,rand);
        var i = 1;
        that.setData({
          drawInter:setInterval(() => {
            that.data.draw(ctx,x,y);
            tureRand === 90?'':x = --x;
            y = y - tan;
            i++;
            i === 30 ?clearInterval(that.data.drawInter):'';
          }, that.data.speed),
        })
        break;
      case 3: 
        var x = that.data.snake.x + v;
        var y = that.data.snake.y - tan;
        tureRand === 90?y = that.data.snake.y:'';
        that.data.draw(ctx,x,y);
        console.log(x,y,rand);
        var i = 1;
        that.setData({
          drawInter:setInterval(() => {
            that.data.draw(ctx,x,y);
            tureRand === 90?'':y = y - tan;
            x = ++x;
            i++;
            i === 30 ?clearInterval(that.data.drawInter):'';
          }, that.data.speed),
        })
        break;
      default: console.log(22);
    }
  },
  draw:function(c,x,y){
      // c.clearRect(0,0,app.device.width,app.device.height);
      // c.beginPath();
      // c.setFillStyle('green');
      // c.fillRect(x,y,100,100);
      // c.draw();
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
