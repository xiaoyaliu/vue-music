/**
 * Created by liuxiaoya；
 *date 2017/9/25 0025.
 *description
 */
export const singer = state => state.singer
export const playing = state => state.playing
export const fullScreen = state => state.fullScreen
export const playlist = state => state.playlist
export const sequenceList = state => state.sequenceList
export const mode = state => state.mode
export const currentIndex = state => state.currentIndex
export const currentSong = (state )=>{
	return state.playlist[state.currentIndex] || {}
}
export const topList = state => state.topList
export const disc = state => state.disc