//index.js
//获取应用实例
const app = getApp();
Page({
  data: {
      score:{//积分板的数据
        fraction:0,
        length:0,
        maxScore:0,
        time:{
          minutes:0,
          seconds:0
        }
      },
      speed:null,//速度
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
        sR:null,
        apprar:1,
        xMove:null,
        yMove:null,
        deg:[],
        bgC:['#f47632','#4494d2','#45bf8d','#48af52','#dadc3c','#e74c40','#e1347d','#c83cdd','#f8f8fa','#d1d1d1'],
        bgCIndex:null
       },
        {
        x:null,
        y:null
      }],
      drawInter:null,//绘制定时器
      draw(c,v){//绘制开始的蛇-动画
        let r = this.snake[0].r;
        let bgC = this.snake[0].bgC[this.snake[0].bgCIndex];
        c.beginPath();
        c.setStrokeStyle(bgC);
        c.setLineCap("round");
        c.setLineJoin("round");
        c.setLineWidth(r);
        c.moveTo(this.snake[1].x,this.snake[1].y);
        for(var i = 0;i<v;i++){
          c.lineTo(this.snake[2][i].x,this.snake[2][i].y);
        }        
        c.stroke();   
        c.beginPath();
        c.setFillStyle(bgC);
        c.arc(this.snake[2][v-1].x,this.snake[2][v - 1].y,this.snake[0].sR,0,2*Math.PI);
        c.fill();
        c.draw()
      },
      food:{
        t:null,
        x:null,
        y:null,
        bgC:'#5656ff',
        r:null,
        fSize:{
          width:null,
          height:null
        }
      },
      sMap:{
        width:null,
        height:null
      },
      game:{
        bkC:true,
        start:true,
        goOn:false,
        end:false
      },
      ban:{
        deceleration:false,
        acceleration:false
      },
      timeInter:null
  },
  onLoad:function(){
    this.upStorage('maxScore',this.data.score.maxScore);
    this.upStorage('time',this.data.score.time);
    this.setData({
      'score.maxScore':wx.getStorageSync('maxScore'),
    });
  },
  makeSnake:function(){//生成蛇在画布的坐标组
    var that = this;
    let lll = that.data.snake[0].bgC.length - 1;
    let randd = Math.floor(Math.random() * lll);
    that.setData({
      speed:130,
      'snake[0].sLength':30,
      'snake[0].apprar':1,
      'snake[0].deg':[],
      'snake[1].x':340,
      'snake[1].y':119,
      'snake[0].bgCIndex':randd,
      timeInter:setInterval(()=>{
        that.liveInter()
      },1000)
    })
    const ctx = wx.createCanvasContext('snakeMapB');
    const ctxF = wx.createCanvasContext('snakeFood');
    const ctxS = wx.createCanvasContext('snakeMaps');
    const cSQ = wx.createSelectorQuery();
    let l = that.data.snake[0].sLength;
    let rand = Math.floor(Math.random() * 360);
    let b = Math.floor(rand / 90);
    let tureRand = rand - 90 * b; 
    let v = 2;
    let tan = null;
    tureRand <= 45?tan = Math.tan(Math.PI / 180 * tureRand) * v:tan = Math.tan(Math.PI / 180 * (90 - tureRand));
    let ss = [];
    let x,y;
    cSQ.select('#snakeMaps').boundingClientRect();
    cSQ.exec((r) => {
      that.setData({
        sMap:{
          width:r[0].width,
          height:r[0].height
        }
      });
      that.drawMaps(ctxS);
    })
    that.setData({
      'snake[0].xMove':v,
      'snake[0].yMove':tan,
      'snake[0].sR':that.data.snake[0].r * 0.55,
    })
    that.data.snake[0].deg.push(b+1,tureRand);
    this.upStorage('maxScore',this.data.score.maxScore);
    this.upStorage('time',this.data.score.time);
    this.setData({
      'score.maxScore':wx.getStorageSync('maxScore'),
    });
    switch(b){//以随机的角度为依据，写出初始蛇的出生方向
      case 0: 
        tureRand <= 45?(
          x = that.data.snake[1].x + v,
          y = that.data.snake[1].y + tan
        ):(
          x = that.data.snake[1].x + tan,
          y = that.data.snake[1].y + v
        );
        for(let yy = 1;yy<l;yy++){    
          let s = {};
          s.x = x;
          s.y = y;
          ss.push(s);
          x += v;
          y += tan;
        }
        that.data.snake[2] = ss;
        break;
      case 1: 
        tureRand <= 45?(
          x = that.data.snake[1].x - tan,
          y = that.data.snake[1].y + v
        ):(
          x = that.data.snake[1].x - v,
          y = that.data.snake[1].y + tan
        );

        for(let yy = 1;yy<l;yy++){    
          let s = {};
          s.x = x;
          s.y = y;
          ss.push(s);
          y += tan;
          x -= v;
        }
        that.data.snake[2] = ss;
        console.log(x,y,rand);
        break;
      case 2: 
        tureRand <= 45?(
          y = that.data.snake[1].y - tan,
          x = that.data.snake[1].x - v
        ):(
          y = that.data.snake[1].y - v,
          x = that.data.snake[1].x - tan
        );
        for(let yy = 1;yy<l;yy++){    
          let s = {};
          s.x = x;
          s.y = y;
          ss.push(s);
          x -= v;
          y -= tan;
        }
        that.data.snake[2] = ss;
        console.log(x,y,rand);
        break;
      case 3: 
        tureRand <= 45?(
          x = that.data.snake[1].x + tan,
          y = that.data.snake[1].y - v
        ):(
          x = that.data.snake[1].x + v,
          y = that.data.snake[1].y - tan
        );
        for(let yy = 1;yy<l;yy++){    
          let s = {};
          s.x = x;
          s.y = y;
          ss.push(s);
          y -= tan;
          x += v;
        }
        that.data.snake[2] = ss;
        console.log(x,y,rand);
        break;
      default: ;
    };
    that.makeFood(ctxF);
    that.eatFood(ctxF);
  },
  suspend:function(e){//暂停
    this.setData({
      'game.bkC':true,
      'game.goOn':true
    })
    clearInterval(this.data.drawInter);
    clearInterval(this.data.timeInter);
  },
  sMapXY:function(){//得到绘制小地图点的坐标
    let that = this;
    let XY = [];
    let ll = {
      x:that.data.food.x,
      y:that.data.food.y
    };
    let sL = that.data.snake[2][that.data.snake[2].length - 1]
    XY.push(sL,ll);
    return XY;
  },
  hitWall:function(){//检测撞墙
    let that = this;
    let s = that.data.snake;
    let a = app.device;
    let v = s[0].apprar;
    let x = s[2][v - 2].x;
    let y = s[2][v - 2].y;
    let r = s[0].sR;
    if(x - r <= 0 || y - r <= 0 || x + r >= a.width || y + r >= a.height){
      return true
    }
    else{
      return false
    }
  },
  drawMaps:function(c){//绘制小地图点
    let that = this;
    let xy = that.sMapXY();
    let d = app.device;
    c.beginPath();
    c.setFillStyle(that.data.food.bgC);
    for(let i = 1;i>=0;i--){
      c.arc(this.data.sMap.width * xy[i].x /d.width,this.data.sMap.height * xy[i].y / d.height,that.data.snake[0].r * 0.1,0,2*Math.PI);
      c.fill();
      if(i === 0){
        break;
      }
      c.beginPath();
      c.setFillStyle(that.data.snake[0].bgC[that.data.snake[0].bgCIndex]);
    }
    c.fill();
    c.draw();
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
  snakeMove:function(){//蛇全部出来后启用这个定时器
    clearInterval(this.data.drawInter);
    this.setData({
      drawInter:setInterval(() => {
        this.interMoveSnake();
      }, this.data.speed)
    })
  },
  makeFood:function(c){//生成食物
    let rr = this.data.snake[0].r * 1.5;
    let x = Math.floor((Math.random() * (app.device.width - 2 * rr) + rr));
    let y = Math.floor((Math.random() * (app.device.height - 2 * rr) + rr));
    let rS = Math.floor(Math.random() * 5 + 7);
    let r = Math.floor(Math.random() * 5 + 3);
    let p = Math.floor(Math.random() * 99);
    this.setData({
      food:{
        t:p%2,
        x:p%2 === 0?x+rS/2:x,
        y:p%2 === 0?y+rS/2:y,
        r:r,
        fSize:{
          width:rS,
          height:rS
        },
        bgC:this.data.food.bgC
      }
    })
    c.beginPath();
    c.setFillStyle(this.data.food.bgC);
    p%2 === 0? c.fillRect(this.data.food.x,this.data.food.y,this.data.food.fSize.width,this.data.food.fSize.height):c.arc(x,y,r,0,2*Math.PI);
    c.fill();
    c.draw();
  },
  eatFood:function(c){//吃掉食物
    let that = this;
    let l = that.data.snake[2].length;
    let sak = that.data.snake;
    let fod = that.data.food;
    (Math.abs(sak[2][l - 1].x - fod.x) <= sak[0].sR && Math.abs(sak[2][l - 1].y - fod.y) <= sak[0].sR)?(that.upSnakeLength(),that.scoring(),that.makeFood(c)):'';
  },
  scoring:function(){//更新计分板
    let h = [[7,8,9,10,11,12],[3,4,5,6,7,8]];
    let that = this;
    let rand = Math.floor(Math.random() * 100 + 100);
    let ii = null;
    let i = that.data.food.t;
    i === 0?ii = that.data.food.fSize.width:ii = that.data.food.r;
    let b = h[i].indexOf(ii);
    let bb = that.data.score.fraction + rand * b;
    bb > wx.getStorageSync('maxScore')?wx.setStorageSync('maxScore', bb):'';
    that.setData({
      "score.fraction":bb,
      "score.length":that.data.snake[0].apprar,
      "score.maxScore":wx.getStorageSync('maxScore')
    })
  },
  upSnakeLength:function(){//更新蛇的长度
    let h = [[7,8,9,10,11,12],[3,4,5,6,7,8]];
    let that = this;
    let ii = null;
    let i = that.data.food.t;
    i === 0?ii = that.data.food.fSize.width:ii = that.data.food.r;
    let b = h[i].indexOf(ii);
    let iX = that.data.snake[1].x - that.data.snake[2][0].x;
    let iY = that.data.snake[1].y - that.data.snake[2][0].y;
    let arry = [];
    let yyy = b + 1;
    let ins = that.data.snake[1];
    let len = that.data.snake[0].sLength;
    let lR = that.data.snake[0].apprar;
    for(;yyy>0;yyy--){
      let ar = {x:null,y:null};
      ar.x = ins.x + yyy * iX;
      ar.y = ins.y + yyy * iY;
      arry.push(ar);
    }
    that.data.snake[1].x = ins.x + (iX * ((b + 1) + 1));
    that.data.snake[1].y = ins.y + (iY * ((b + 1) + 1));
    that.data.snake[2].splice(0,0,...arry);
    that.data.snake[0].sLength = len + b + 1;
    that.data.snake[0].apprar = lR + b + 1;
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
  accelerationTouchS:function(e){//按下加速
    this.data.speed >= 70?(
      this.data.interval = setTimeout(() => {
          this.data.speed -= 10;
          clearInterval(this.data.drawInter);
          this.whereGoGame();
      },110)):'';
  },
  decelerationTouchS:function(e){//按下减速
    this.data.speed <= 200?(
      this.data.interval = setTimeout(() => {
          this.data.speed += 10;
          clearInterval(this.data.drawInter);
          this.whereGoGame();
      },110)):'';
  },
  interMoveSnake:function(){//蛇全部出来后的移动
    let that = this;
    let ctx = wx.createCanvasContext('snakeMapB');
    let ctxF = wx.createCanvasContext('snakeFood');
    let ctxS = wx.createCanvasContext('snakeMaps');
    let deg = that.data.snake[0].deg;
    let ll = that.data.snake[2].length;
    that.speedLimit();
    for(let i = 0;i<deg.length;i++){
      deg[i] = Number(deg[i]);
    }
    that.setData({
      'snake[1].x':that.data.snake[2][0].x,
      'snake[1].y':that.data.snake[2][0].y
    })
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
    if(that.hitWall()){
      that.setData({
        'game.bkC':true,
        'game.end':true
      })
      that.upStorageSync();
      clearInterval(that.data.drawInter);
      clearInterval(that.data.timeInter);
    }
    that.eatFood(ctxF);
    that.drawMaps(ctxS);
    that.data.draw(ctx,that.data.snake[0].apprar - 1);
  },
  interMoveSnakeStart:function(){//蛇还没全部出来的移动
    let ctx = wx.createCanvasContext('snakeMapB');
    let ctxF = wx.createCanvasContext('snakeFood');
    let ctxS = wx.createCanvasContext('snakeMaps');
    let that = this;
    that.data.draw(ctx,that.data.snake[0].apprar);
    that.eatFood(ctxF);
    that.drawMaps(ctxS);
    that.data.snake[0].apprar++;
    that.setData({
      'score.length':that.data.snake[0].apprar
    })
    if(that.hitWall()){
      that.setData({
        'game.bkC':true,
        'game.end':true
      })
      that.upStorageSync();
      clearInterval(that.data.drawInter);
      clearInterval(that.data.timeInter);
    }
    if( that.data.snake[0].apprar === that.data.snake[0].sLength){
      that.snakeMove();
    }
    that.speedLimit();
  },
  startGame:function(){//开始游戏
    let that = this;
    that.makeSnake();
    that.setData({
      'game.bkC':false,
      'game.start':false,
      drawInter:setInterval(() => {
        that.interMoveSnakeStart();
      }, that.data.speed),
    })
  },
  goGame:function(){//继续游戏
    this.setData({
      'game.bkC':false,
      'game.goOn':false,
      timeInter:setInterval(()=>{
          this.liveInter();
      },1000)
    })
    this.whereGoGame();
  },
  endGame:function(){//结束游戏
    this.setData({
      'game.start':true,
      'game.bkC':true,
      'game.end':false,
      "score.time.minutes":0,
      "score.time.seconds":0,
      'score.fraction':0
    })
    clearInterval(this.data.timeInter);
  },
  whereGoGame:function(){//重新开始计时，判断是从哪开始
    let a = this.data.snake[0].apprar;
    a < this.data.snake[0].sLength?(
      this.setData({
        drawInter:setInterval(() => {
          this.interMoveSnakeStart();
        }, this.data.speed)
      })):(
        this.setData({
          drawInter:setInterval(() => {
            this.interMoveSnake();
          }, this.data.speed)
        })
      );
  },
  speedLimit:function(){//根据速度决定加速和减速的状况
    let that = this;
    let s = that.data.speed;
    (s > 70)?(
      that.setData({
        "ban.acceleration":false
      })
    ):'';
    s <= 200?(
      that.setData({
        'ban.deceleration':false
      })
    ):"";
    if(that.data.speed <= 70){
      that.setData({
        "ban.acceleration":true
      })
    }
    if(that.data.speed > 200){
      that.setData({
        "ban.deceleration":true
      })
    }
  },
  liveInter:function(){
    let that = this;
    let s = ++that.data.score.time.seconds;
    s > 60?(
      that.setData({
        "score.time.minutes":++that.data.score.time.minutes,
        "score.time.seconds":1
      })
    ):(
      that.setData({
        "score.time.seconds":s
      })
    )
  },
  upStorage:function(e,v){
    try{
      let val = wx.getStorageSync(e)
      if(!val && val !== 0){
        wx.setStorageSync(e, v);
      }
    }catch(e){}
  },
  upStorageSync:function(){
    let val = wx.getStorageSync('time');
    let value = this.data.score.time;
    (value.minutes <= val.minutes && value.seconds > val.seconds)?wx.setStorageSync('time', value):'';
    (value.minutes > val.minutes)?wx.setStorageSync('time', value):'';
  }




  
})
