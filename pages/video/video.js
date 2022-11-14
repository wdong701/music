// pages/video/video.js
import request from '../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        videoGroupList: [],
        navId: '',
        videoList: [],
        videoId: '',
        videoUpdataTime: [],
        isTriggered: false,
        arr:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.getVideoGroupListData();

    },
    async getVideoGroupListData() {
        let videoGroupListData = await request('/video/group/list');
        this.setData({
            videoGroupList: videoGroupListData.data.slice(0, 14),
            navId: videoGroupListData.data[0].id
        })
        this.getVideoList(this.data.navId);
    },

    async getVideoList(navId) {
        if (!navId) {
            return;
        }
        let videoListData = await request('/video/group', { id: navId });
        wx.hideLoading();

        let index = 0;
        let videoList = videoListData.datas.map(item => {
            item.id = index++;
            return item;
        })
        this.setData({
            videoList,
            isTriggered: false
        })

    },

    changeNav(event) {
        let navId = event.currentTarget.id;
        this.setData({
            navId: navId >>> 0,
            videoList: []
        })
        wx.showLoading({
            title: '正在加载',
        })
        this.getVideoList(this.data.navId)
    },
    handleId(event){
        let vid =event.currentTarget.id
        this.setData({
            videoId: vid
        })
        this.videoContext = wx.createVideoContext(vid);
    },
    handlePlay(event) {
        let vid =event.currentTarget.id
        // 判断是否播放过
        let { videoUpdataTime } = this.data;
        let videoItem = videoUpdataTime.find(item => item.vid === vid);
        if (videoItem) {
            this.videoContext.seek(videoItem.currentTime);
        }
        this.videoContext.play();


    },
    handleTimeUpdate(event) {
        let videoTimeObj = { vid: event.currentTarget.id, currentTarget: event.detail.currentTime };
        let { videoUpdataTime } = this.data;
        let videoItem = videoUpdataTime.find(item => item.vid === videoTimeObj.vid);
        if (videoItem) {
            videoItem.currentTime = event.detail.currentTime;
        } else {
            videoUpdataTime.push(videoTimeObj);
        }
        this.setData({
            videoUpdataTime
        })
    },
    handleEnded(event) {
        let { videoUpdataTime } = this.data;
        videoUpdataTime.splice(videoUpdataTime.findIndex(item => item.vid === event.currentTarget.id), 1);
        this.setData({
            videoUpdataTime
        })
    },
    handleRefresher() {
        this.getVideoList(this.data.navId)
    },
    async handleToLower() {  
      let arr = this.data.arr
        let start = 0;
       for (let i = 0; i < arr.length; i++) {
         start++
       }
         let navId = this.data.navId
         let getVideoMoreListData = await request('/video/group',{id:navId,offset:start}) 
         let index = 0
         let videoMoreList = getVideoMoreListData.datas.map(item => {
           item.id = index++
           return item
         })
       
        let videoList = this.data.videoList;
        videoList.push(...videoMoreList);
        this.setData({
            videoList
        })
    },
    toSearch() {
        wx.navigateTo({
            url: '/pages/search/search',
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
    onShareAppMessage: function({ from }) {
        return {
            title: '转发分享',
            page: '/pages/video/video',
            imageUrl: '/static/images/a.jpeg'
        }
    }
})