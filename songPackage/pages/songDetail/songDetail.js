import PubSub from 'pubsub-js';
import moment from 'moment'
import request from '../../../utils/request'
// 获取全局实例
const appInstance = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isPlay: false,
        song: {}, 
        musicId: '',
        musicLink: '',
        currentTime: '00:00', 
        durationTime: '00:00', 
        currentWidth: 0, 
        lyric: [],
        lyricTime: 0,
        currentLyric: "",
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
      console.log(options);
      let musicId = options.musicId||options.song;
        this.setData({
                musicId,
            })
        this.getMusicInfo(musicId);
        this.getLyric(musicId);
        if (appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === musicId) {
            this.setData({
                isPlay: true
            })
        }else if(appInstance.globalData.isMusicPlay &&appInstance.globalData.musicId != musicId){  
          this.setData({
            musicId,
        })
        this.getMusicInfo(musicId);
        this.getLyric(musicId);
        this.handleMusicPlay()
        }

        this.backgroundAudioManager = wx.getBackgroundAudioManager();
        this.backgroundAudioManager.onPlay(() => {
            this.changePlayState(true);
            appInstance.globalData.musicId = musicId;
        });
        this.backgroundAudioManager.onPause(() => {
            this.changePlayState(false);
        });
        this.backgroundAudioManager.onStop(() => {
            this.changePlayState(false);
        });

        this.backgroundAudioManager.onEnded(() => {
            PubSub.publish('switchType', 'next')

            this.setData({
              currentWidth: 0,
              currentTime: '00:00',
              lyric: [],
              lyricTime: 0,
              isPlay: false,
              currentLyric: ""
            })
            this.getMusicInfo(musicId);
      this.getLyric(musicId);
      this.musicControl(true,musicId);
        });

        this.backgroundAudioManager.onTimeUpdate(() => {
          let lyricTime = Math.ceil(this.backgroundAudioManager.currentTime); 
            let currentTime = moment(this.backgroundAudioManager.currentTime * 1000).format('mm:ss')
            let currentWidth = this.backgroundAudioManager.currentTime / this.backgroundAudioManager.duration * 450;
            this.setData({
              lyricTime,
                currentTime,
                currentWidth
            })
            this.getCurrentLyric();
        })
    },
    changePlayState(isPlay) {
        this.setData({
            isPlay
        })
        appInstance.globalData.isMusicPlay = isPlay;
    },

    async getMusicInfo(musicId) {
        let songData = await request('/song/detail', { ids: musicId });
        let durationTime = moment(songData.songs[0].dt).format('mm:ss');
        this.setData({
            song: songData.songs[0],
            durationTime
        })
        wx.setNavigationBarTitle({
            title: this.data.song.name
        })
    },

    handleMusicPlay() {
        let isPlay = !this.data.isPlay;
        let { musicId, musicLink } = this.data;
        this.musicControl(isPlay, musicId, musicLink);
    },

    async musicControl(isPlay, musicId, musicLink) {
        if (isPlay) {
            if (!musicLink) {
                let musicLinkData = await request('/song/url', { id: musicId });
                musicLink = musicLinkData.data[0].url;
                if(musicLink === null){
                  wx.showToast({
                    title: '由于版权或会员问题暂获取不到此资源',
                    icon: 'none'
                  })
                  return;
                }
                this.setData({
                    musicLink,
                    isPlay
                })
            }
            this.backgroundAudioManager.src = musicLink;
            this.backgroundAudioManager.title = this.data.song.name;
        } else {
            this.backgroundAudioManager.pause();
        }

    },

    handleSwitch(event) {
        let type = event.currentTarget.id;
        this.backgroundAudioManager.stop();
        this.setData({
          currentTime: 0,
          currentWidth: 0,
          lyric: [],
          lyricTime: 0,
          currentLyric: "",
      }),
        PubSub.subscribe('musicId', (msg, musicId) => {
                this.getMusicInfo(musicId);
                this.getLyric(musicId);
                this.musicControl(true, musicId);
                PubSub.unsubscribe('musicId');
            })
        PubSub.publish('switchType', type)
    },
    async getLyric(musicId){
      let lyricData = await request("/lyric", {id: musicId});
      let lyric = this.formatLyric(lyricData.lrc.lyric);
    },
  
    formatLyric(text) {
      let result = [];
      let arr = text.split("\n");
      let row = arr.length; 
      for (let i = 0; i < row; i++) {
        let temp_row = arr[i]; 
        let temp_arr = temp_row.split("]");
        let text = temp_arr.pop(); 
        temp_arr.forEach(element => {
          let obj = {};
          let time_arr = element.substr(1, element.length - 1).split(":");
          let s = parseInt(time_arr[0]) * 60 + Math.ceil(time_arr[1]); 
          obj.time = s;
          obj.text = text;
          result.push(obj); 
        });
      }
      result.sort(this.sortRule) 
      this.setData({
        lyric: result
      })
    },
    sortRule(a, b) { 
      return a.time - b.time;
    },

    getCurrentLyric(){
      let j;
      for(j=0; j<this.data.lyric.length-1; j++){
        if(this.data.lyricTime == this.data.lyric[j].time){
          this.setData({
            currentLyric : this.data.lyric[j].text
          })
        }
      }
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