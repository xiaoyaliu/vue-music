/**
 * Created by liuxiaoya；
 *date 2017/9/25 0025.
 *description
 */
import {playMode} from 'common/js/config'

const state={
		singer:{},
		playing:false,//播放状态
		fullScreen: false,//播放器展开收起
		playlist: [],//播放列表
		sequenceList: [],//顺序列表
		mode: playMode.loop,//播放模式
		currentIndex: -1,//当前播放
		topList: {},//当前排行榜
		disc: {},
		searchHistory:{},
		playHistory: {},
		favoriteList: {}
}
export default state