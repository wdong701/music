// pages/search/search.js
import request from '../../utils/request'
let isSend = null;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        placeholderContent: '',
        hotList: [],
        searchContent: '',
        searchList: [],
        historyList: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {},

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        this.getInitData();
        this.getSearchHistory();
    },

    getSearchHistory() {
        let historyList = wx.getStorageSync('searchHistory')
        if (historyList) {
            this.setData({
                historyList
            })
        }
    },
    async getInitData() {
        let placeholderData = await request('/search/default');
        let hotListData = await request('/search/hot/detail');
        this.setData({
            placeholderContent: placeholderData.data.showKeyword,
            hotList: hotListData.data
        })
    },
    handleInputChange(event) {
        // 防抖
        if(isSend){
            clearTimeout(isSend) 
        }
          isSend = setTimeout(() => {
          // 更新数据
          this.setData({
            searchContent:event.detail.value.trim()
          })
          // 获取搜索数据
          this.getSearchList();
        },300) 
    },
    async getSearchList() {
        if (!this.data.searchContent) {
            this.setData({
                searchList: []
            })
            return;
        }
        let { searchContent, historyList } = this.data
        let searchListData = await request('/search', { keywords: searchContent, limit: 10 });
        this.setData({
            searchList: searchListData.result.songs
        })
        if (historyList.indexOf(searchContent) !== -1) {
            historyList.splice(historyList.indexOf(searchContent), 1)
        }
        historyList.unshift(searchContent);
        this.setData({
            historyList
        })
        wx.setStorageSync('searchHistory', historyList)

    },
    clearSearchContent() {
        this.setData({
            searchContent: '',
            searchList: []
        })
    },
    deleteSearchHistory() {
        wx.showModal({
            content: '确定要删除所有记录吗？',
            success: (res) => {
                if (res.confirm) {
                    this.setData({
                        historyList: []
                    })
                    wx.removeStorageSync('searchHistory')
                }
            }
        })

    },
    toPlay(event){
        wx.navigateTo({
            url: '/songPackage/pages/songDetail/songDetail?song=' + event.currentTarget.id
          })
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