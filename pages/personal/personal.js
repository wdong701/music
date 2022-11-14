// pages/personal/personal.js
import request from '../../utils/request'
let startY = 0;
let moveY = 0;
let moveDistance = 0;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        coverTransfrom: 'translateY(0)',
        coveTransition: '',
        userInfo: {},
        recentPlayList: [],
        isLogin: false 
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

        let userInfo = wx.getStorageSync('userInfo');
        if (userInfo) {
            // 更新userInfo的状态
            this.setData({
                userInfo: JSON.parse(userInfo),
                isLogin: true
            })

            // 获取播放记录
            this.getUserRecentPlayList(this.data.userInfo.userId)
        }
    },
    async getUserRecentPlayList(userId) {
        let recentPlayListData = await request('/user/record', { uid: userId, type: 0 });
        let index = 0;
        let recentPlayList = recentPlayListData.allData.splice(0, 10).map(item => {
            item.id = index++;
            return item;
        })
        this.setData({
            recentPlayList
        })
    },
    handleTouchStart(event) {
        this.setData({
                coveTransition: ''
            })
            // 起始坐标
        startY = event.touches[0].clientY;
    },
    handleTouchMove(event) {
        moveY = event.touches[0].clientY;
        moveDistance = moveY - startY;

        if (moveDistance <= 0) {
            return;
        }
        if (moveDistance >= 80) {
            moveDistance = 80;
        }
        // 更新coverTransform的状态值
        this.setData({
            coverTransform: `translateY(${moveDistance}rpx)`
        })
    },
    handleTouchEnd() {
        this.setData({
            coverTransform: `translateY(0rpx)`,
            coveTransition: 'transform 1s linear'
        })
    },
    toLogin() {
        wx.navigateTo({
            url: '/pages/login/login'
        })
    },
    logout(){
        let status = request('/logout');
        //删除客户端信息
        wx.removeStorageSync('userInfo')
        this.setData({
          userInfo: {},
          isLogin: false,
          recentPlayList:[]
        })
        wx.navigateTo({
          url: '/pages/login/login',
        })
        wx.showToast({
          title: '退出登录',
          icon: 'success'
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