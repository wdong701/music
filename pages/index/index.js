import request from '../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        bannerList: [],
        recommendList: [],
        hotGroupList: [],
    navId: '',
    hotList: [],
    Img:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function(options) {

        let bannerListData = await request('/banner', { type: 2 });
        this.setData({
            bannerList: bannerListData.banners
        })
        let recommendListData = await request('/personalized', { limit: 10 });
        this.setData({
            recommendList: recommendListData.result
        })
        let hotGroupListData = await request('/toplist');
        this.setData({
            hotGroupList: hotGroupListData.list.slice(0, 5),
            navId: hotGroupListData.list[0].id
        })
        this.gethotList(this.data.navId);
    },
    change(current){
      let now = this.data.hotGroupList[current.detail.current].id;
      this.setData({
        navId: now
    })
    this.gethotList(this.data.navId);
    },
    toRecommendSong() {
        wx.navigateTo({
            url: '/songPackage/pages/recommendSong/recommendSong',
        })
    },
    toSongDetail(event){
      wx.navigateTo({
        url: '/songPackage/pages/songDetail/songDetail?song=' + event.currentTarget.id
      })
    },
    toPlayList(event){
        wx.navigateTo({
          url: '/pages/playList/playList?id=' + event.currentTarget.id
        })
      },
      toHotList(){
		wx.navigateTo({
			url: '/pages/hotList/hotList'
		})
  },
  async gethotList(navId) {
    if (!navId) {
        return;
    }
    let hotListData = await request('/playlist/detail', { id: navId });
    wx.hideLoading();
    let index = 0;
    this.setData({
        hotList:hotListData.playlist.tracks.slice(0, 5),
    })
},
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})