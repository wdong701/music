// pages/hotList/hotList.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotGroupList: [],
    navId: '',
    hotList: [],
    Img:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHotGroupListData();
  },
  async getHotGroupListData() {
    let hotGroupListData = await request('/toplist');
    this.setData({
        hotGroupList: hotGroupListData.list.slice(0, 7),
        navId: hotGroupListData.list[0].id
    })
    this.gethotList(this.data.navId);
},
changeNav(event) {
  let navId = event.currentTarget.id;
  this.setData({
      navId: navId >>> 0,
      hotList: []
  })
  wx.showLoading({
      title: '正在加载',
  })
  this.gethotList(this.data.navId)
},
async gethotList(navId) {
    if (!navId) {
        return;
    }
    let hotListData = await request('/playlist/detail', { id: navId });
    wx.hideLoading();
    let index = 0;
    // let hotList = hotListData.playlist.tracks.map(item => {
    //     item.id = index++;
    //     return item;
    // })
    this.setData({
        hotList:hotListData.playlist.tracks,
        // isTriggered: false
    })
},
toSongDetail(event){
  wx.navigateTo({
    url: '/songPackage/pages/songDetail/songDetail?song=' + event.currentTarget.id
  })
},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})