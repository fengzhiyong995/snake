//index.js
//获取应用实例
const app = getApp();
Page({
  data: {
      score:{//积分板的数据
        fraction:null,
        length:null
      },
      speed:150,//速度
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
        sLength:30,
        r:15,
        apprar:1,
        xMove:null,
        yMove:null,
        deg:[],
        bgC:null
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
      },
      food:{
        x:null,
        y:null,
        bgC:null,
        r:null,
        fSize:{
          width:null,
          height:null
        }
      }
  },
  onLoad:function(){
    var that = this;
    const ctx = wx.createCanvasContext('snakeMapB');
    const ctxF = wx.createCanvasContext('snakeFood');
    let l = that.data.snake[0].sLength;
    let rand = Math.floor(Math.random() * 360);
    let b = Math.floor(rand / 90);
    let tureRand = rand - 90 * b; 
    let v = 2;
    let tan = Math.tan(Math.PI / 180 * tureRand) * v;
    let ss = [];
    let x,y;
    that.data.snake[0].xMove = v;
    that.data.snake[0].yMove = tan;
    that.data.snake[0].deg.push(b+1,tureRand);
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
            if( that.data.snake[0].apprar === that.data.snake[0].sLength){
              that.snakeMove(ctx);
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
            if( that.data.snake[0].apprar === that.data.snake[0].sLength){
              that.snakeMove(ctx);
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
            if( that.data.snake[0].apprar === that.data.snake[0].sLength){
              that.snakeMove(ctx);
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
            if( that.data.snake[0].apprar === that.data.snake[0].sLength){
              that.snakeMove(ctx);
            }
          }, that.data.speed),
        })
        break;
      default: ;
    };
    that.makeFood(ctxF);
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
    let deg = [];
    for(let i = 0;i<=90;i++){//角度预存
      deg.push(i)
    }
    let x = e.touches[0].pageX;
    let y = e.touches[0].pageY;
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
    //找到移动的角度
    let dd = [];
    let Deg = [];
    x >= x1 && y >= y1?Deg.push('1'):'';
    x <= x1 && y >= y1?Deg.push('2'):'';
    x <= x1 && y <= y1?Deg.push('3'):'';
    x >= x1 && y <= y1?Deg.push('4'):'';
    deg.forEach(function(ee){
      ((x >= x1 && y >= y1) || (x <= x1 && y <= y1))?(
          dd.push(Math.abs(Math.tan(Math.PI/180*ee) - Math.abs((y - y1) / (x - x1))))
        ):'';
      ((x <= x1 && y >= y1) || (x >= x1 && y <= y1))?(
        dd.push(Math.abs(Math.tan(Math.PI/180*ee) - Math.abs((x - x1) / (y - y1))))
      ):'';
    })
    for(let y = 0;y<dd.length;y++){
      if(Math.min(...dd) === dd[y]){
        Deg.push(deg[y]);
        dd = null;
        break;
      }
    };
    //更新蛇的坐标
    let kk = this.data.snake[0].apprar;
    let kl = this.data.snake[2].length;
    let vk = this.data.snake[2][kk - 1];
    let vX = null;
    let vY = null;
    let rr = Math.sqrt(Math.pow(this.data.snake[0].xMove,2) + Math.pow(this.data.snake[0].yMove,2));
    vY = Math.sin(Math.PI / 180 * Deg[1]) * rr;
    vX = Math.cos(Math.PI /180 * Deg[1]) * rr;
    if(Deg[0] === '1'){
      for(let vv = 1;kk<kl;kk++,vv++){
        this.data.snake[2][kk].x = vk.x + vX * vv;
        this.data.snake[2][kk].y = vk.y + vY * vv;
      };
      this.data.snake[0].xMove = vX;
      this.data.snake[0].yMove = vY;
      this.data.snake[0].deg = Deg;
    };
    if(Deg[0] === '2'){
      for(let vv = 1;kk<kl;kk++,vv++){
        this.data.snake[2][kk].x = vk.x - vY * vv;
        this.data.snake[2][kk].y = vk.y + vX * vv;
      };
      this.data.snake[0].xMove = vY;
      this.data.snake[0].yMove = vX;
      this.data.snake[0].deg = Deg;
    }
    if(Deg[0] === '3'){
      for(let vv = 1;kk<kl;kk++,vv++){
        this.data.snake[2][kk].x = vk.x - vX * vv;
        this.data.snake[2][kk].y = vk.y - vY * vv;
      };
      this.data.snake[0].xMove = vX;
      this.data.snake[0].yMove = vY;
      this.data.snake[0].deg = Deg;
    }
    if(Deg[0] === '4'){
      for(let vv = 1;kk<kl;kk++,vv++){
        this.data.snake[2][kk].x = vk.x + vY * vv;
        this.data.snake[2][kk].y = vk.y - vX * vv;
      };
      this.data.snake[0].xMove = vY;
      this.data.snake[0].yMove = vX;
      this.data.snake[0].deg = Deg;
    }
    ////限制在轮盘内
    Math.pow(tureX,2) + Math.pow(tureY,2) <= (Math.pow(r1,2) + r2 * 2)?(
      this.setData({
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
  snakeMove:function(c){//蛇全部出来后启用这个定时器
    clearInterval(this.data.drawInter);
    this.setData({
      drawInter:setInterval(() => {
        let that = this;
        let deg = that.data.snake[0].deg;
        let ll = that.data.snake[2].length;
        for(let i = 0;i<deg.length;i++){
          deg[i] = Number(deg[i]);
        }
        that.data.snake[1].x = that.data.snake[2][0].x;
        that.data.snake[1].y = that.data.snake[2][0].y;
        for(let ii = 0;ii<ll;ii++){
          if(ii < ll - 1){
            that.data.snake[2][ii].x = that.data.snake[2][ii + 1].x;
            that.data.snake[2][ii].y = that.data.snake[2][ii + 1].y;
          }
          else{
            deg[0] === 1?(
              that.data.snake[2][ii].x += that.data.snake[0].xMove,
              that.data.snake[2][ii].y += that.data.snake[0].yMove
            ):'';
            deg[0] === 2?(
              that.data.snake[2][ii].x -= that.data.snake[0].xMove,
              that.data.snake[2][ii].y += that.data.snake[0].yMove
            ):'';
            deg[0] === 3?(
              that.data.snake[2][ii].x -= that.data.snake[0].xMove,
              that.data.snake[2][ii].y -= that.data.snake[0].yMove
            ):'';
            deg[0] === 4?(
              that.data.snake[2][ii].x += that.data.snake[0].xMove,
              that.data.snake[2][ii].y -= that.data.snake[0].yMove
            ):'';
          }
        }
        that.data.draw(c,that.data.snake[0].apprar - 1);
      }, this.data.speed)
    })
  },
  makeFood:function(c){//生成食物
    let x = Math.floor((Math.random() * app.device.width));
    let y = Math.floor((Math.random() * app.device.height));
    let w = Math.floor(Math.random() + 10 - 3);
    let h = Math.floor(Math.random() + 10 - 3);
    let r = Math.floor(Math.random() + 10 - 7);
    let p = Math.floor(Math.random() + 99);
    console.log(x,y,w,h);
    this.setData({
      food:{
        x:x,
        y:y,
        r:r,
        fSize:{
          width:w,
          height:h
        }
      }
    })
    c.beginPath();
    c.setFillStyle('blue');
    p%2 === 0? c.fillRect(this.data.food.x,this.data.food.y,this.data.food.fSize.width,this.data.food.fSize.height):c.arc(x,y,r,0,2*Math.PI);
    c.fill();
    c.draw();
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
