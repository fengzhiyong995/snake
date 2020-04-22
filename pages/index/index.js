//index.js
//获取应用实例
const app = getApp();
Page({
  data: {
      score:{//积分板的数据
        fraction:null,
        length:null
      },
      speed:50,//速度
      direction:{//虚拟轮盘的位置
        x:null,
        y:null
      },
      directionInit:{//初始的轮盘位置
        x:null,
        y:null,
        top:null,
        left:null,
        r1:null,
        r2:null
      },
      interval:null,//速度定时器
      snake:[{
        length:100,
        r:15,
        apprar:1
       },
        {
        x:340,
        y:119
      }],
      drawInter:null,//绘制定时器
      draw(c,v){//绘制开始的蛇-动画
        let r = this.snake[0].r;
        c.beginPath();
        c.setStrokeStyle('red');
        c.setLineCap("round");
        c.setLineJoin("round");
        c.setLineWidth(r);
        c.moveTo(this.snake[1].x,this.snake[1].y);
        for(var i = 0;i<v;i++){
          c.lineTo(this.snake[2][i].x,this.snake[2][i].y);
        }        
        c.stroke();   
        c.beginPath();
        c.setFillStyle('red');
        c.arc(this.snake[2][v-1].x,this.snake[2][v - 1].y,0.55*r,0,2*Math.PI);
        c.fill();
        c.draw()
      }
  },
  onLoad:function(){
    var that = this;
    const ctx = wx.createCanvasContext('snakeMapB');
    let l = that.data.snake[0].length;
    let rand = Math.floor(Math.random() * 360);
    let b = Math.floor(rand / 90);
    let tureRand = rand - 90 * b;
    let tan = Math.tan(Math.PI / 180 * tureRand);
    let v = 0.2;
    let ss = [];
    let x,y;
    switch(b){//以随机的角度为依据，写出初始蛇的出生方向
      case 0: 
        tureRand === 90?v = 0:'';
        x = that.data.snake[1].x + v;
        y = that.data.snake[1].y + tan;
        for(let yy = 1;yy<l;yy++){    
          let s = {};
          s.x = x;
          s.y = y;
          ss.push(s);
          x += v;
          y += tan;
        }
        that.data.snake.push(ss);
        that.setData({
          drawInter:setInterval(() => {
            that.data.draw(ctx,that.data.snake[0].apprar);
            that.data.snake[0].apprar++;
            if( that.data.snake[0].apprar === that.data.snake[0].length){
              clearInterval(that.data.drawInter);
              that.setData({
                drawInter:setInterval(() => {
                  that.data.snake[1].x += v;
                  that.data.snake[1].y += tan;
                  that.data.snake[2].forEach(function(e){
                    e.x += v;e.y += tan;
                  });    
                  that.data.draw(ctx,that.data.snake[0].apprar - 1);
                }, that.data.speed)
              })
            }
          }, that.data.speed),
        })
        break;
      case 1: 
        tureRand === 90?tan = 0:'';
        x = that.data.snake[1].x - v;
        y = that.data.snake[1].y + tan;
        for(let yy = 1;yy<l;yy++){    
          let s = {};
          s.x = x;
          s.y = y;
          ss.push(s);
          y += tan;
          x -= v;
        }
        that.data.snake.push(ss);
        console.log(x,y,rand);
        that.setData({
          drawInter:setInterval(() => {
            that.data.draw(ctx,that.data.snake[0].apprar);
            that.data.snake[0].apprar++;
            if( that.data.snake[0].apprar === that.data.snake[0].length){
              clearInterval(that.data.drawInter);
              that.setData({
                drawInter:setInterval(() => {
                  that.data.snake[1].x -= v;
                  that.data.snake[1].y += tan;
                  that.data.snake[2].forEach(function(e){
                    e.x -= v;e.y += tan;
                  });    
                  that.data.draw(ctx,that.data.snake[0].apprar - 1);
                }, that.data.speed)
              })
            }
          }, that.data.speed),
        })
        break;
      case 2: 
        tureRand === 90?v = 0:'';
        y = that.data.snake[1].y - tan;
        x = that.data.snake[1].x - v;
        for(let yy = 1;yy<l;yy++){    
          let s = {};
          s.x = x;
          s.y = y;
          ss.push(s);
          x -= v;
          y -= tan;
        }
        that.data.snake.push(ss);
        console.log(x,y,rand);
        that.setData({
          drawInter:setInterval(() => {
            that.data.draw(ctx,that.data.snake[0].apprar);
            that.data.snake[0].apprar++;
            if( that.data.snake[0].apprar === that.data.snake[0].length){
              clearInterval(that.data.drawInter);
              that.setData({
                drawInter:setInterval(() => {
                  that.data.snake[1].x -= v;
                  that.data.snake[1].y -= tan;
                  that.data.snake[2].forEach(function(e){
                    e.x -= v;e.y -= tan;
                  });    
                  that.data.draw(ctx,that.data.snake[0].apprar - 1);
                }, that.data.speed)
              })
            }
          }, that.data.speed),
        })
        break;
      case 3: 
        tureRand === 90?tan = 0:'';
        x = that.data.snake[1].x + v;
        y = that.data.snake[1].y - tan;
        for(let yy = 1;yy<l;yy++){    
          let s = {};
          s.x = x;
          s.y = y;
          ss.push(s);
          y -= tan;
          x += v;
        }
        that.data.snake.push(ss);
        console.log(x,y,rand);
        that.setData({
          drawInter:setInterval(() => {
            that.data.draw(ctx,that.data.snake[0].apprar);
            that.data.snake[0].apprar++;
            if( that.data.snake[0].apprar === that.data.snake[0].length){
              clearInterval(that.data.drawInter);
              that.setData({
                drawInter:setInterval(() => {
                  that.data.snake[1].x += v;
                  that.data.snake[1].y -= tan;
                  that.data.snake[2].forEach(function(e){
                    e.x += v;e.y -= tan;
                  });    
                  that.data.draw(ctx,that.data.snake[0].apprar - 1);
                }, that.data.speed)
              })
            }
          }, that.data.speed),
        })
        break;
      default: ;
    };

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
    console.log(this.data.snake[0].apprar);
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
