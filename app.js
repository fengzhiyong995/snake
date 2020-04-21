//app.js
App({
  onLaunch:function(){
    wx.getSystemInfo({
      complete: (res) => {
        this.device.width = res.windowWidth;
        this.device.height = res.windowHeight
        
      },
    })
  },
  device:{
    width:null,
    height:null
  }
})