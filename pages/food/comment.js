var app = getApp();

Page({
    data: {
        items: [
          { name: '好评', value: '好评', checked: 'true' },
          { name: '中评', value: '中评' },
          { name: '差评', value: '差评' },

        ],
        score:"好评",
        content:""
    },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      score:e.detail.value
    })
  },
  onLoad(e){
    this.setData({
      id:e.id
    })
  },
  textBind(e){
    this.setData({
      content:e.detail.value
    })
  },
  addComment(){

    var comment = app.getCache("comment") || [];
    var commentReal = [];
    comment.forEach(el=>{
      if(el.id == this.data.id){
        commentReal = el.commentList || []
      }
    })
    if(commentReal.length == 0){
      console.log(this.data.score)
      console.log(this.data.content)
      commentReal.push(
        {
          "score": this.data.score,
          "date": "2017-10-11 10:20:00",
          "content": this.data.content,
          "user": {
            "avatar_url": "/images/more/logo.png",
            "nick": "angellee"
          }
        }
      )
      comment.push({
        id:this.data.id,
        commentList:commentReal
      })
      app.setStorage("comment",comment)
    }else{
      var newComment = []
      comment.forEach(el=>{
        if(el.id != this.data.id){
          newComment.push(el);
        }else{
          console.log(this.data.score)
          console.log(this.data.content)
          el.commentList.push({
            "score": this.data.score,
            "date": "2020-4-29 10:20:00",
            "content": this.data.content,
            "user": {
              "avatar_url": "/images/more/logo.png",
              "nick": "angellee"
            }
          })
          newComment.push(el)
        }
      })

      app.setStorage("comment",newComment)
    }
  
    
    
    wx.navigateTo({
      url: '/pages/food/info?id='+this.data.id,
    })


  }
})