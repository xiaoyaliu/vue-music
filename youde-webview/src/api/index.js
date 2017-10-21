/**
 * Created by liuxiaoya；
 *date 2017/10/11 0011.
 *description
 */
import axios from 'axios'
import {URL,VERSION} from './config.js'

export function getData(){
	const url=`${URL}androidApiNew.php?act=getIndexInfoNew&version=${VERSION}`;
	console.log(3333333)
	return axios.get(url).then((res)=>{
		console.log(1111111)
		return Promise.resolve(res.data)
	})
}