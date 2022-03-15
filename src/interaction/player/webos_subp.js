import Keypad from '../keypad'
import Storage from '../../utils/storage'
import Arrays from '../../utils/arrays'

let subparams

let listener = function(e){
    if(e.code == 405) getWebosmediaId(setSubtitleColor)
    if(e.code == 406) getWebosmediaId(setSubtitleBackgroundColor)
    if(e.code == 403) getWebosmediaId(setSubtitleFontSize)
    if(e.code == 404) getWebosmediaId(setSubtitlePosition)
}

Keypad.listener.follow('keydown', listener)


function luna(params, call, fail){
    if(call) params.onSuccess = call

    params.onFailure = (result)=>{
        console.log('WebOS',params.method + " [fail][" + result.errorCode + "] " + result.errorText )

        if(fail) fail()
    }
    console.log('webos','send luna:',params)
    webOS.service.request("luna://com.webos.media", params)
}

function initStorage(){
    if(!subparams){
        subparams = Storage.get('webos_subs_params','{}')

        Arrays.extend(subparams,{
            color: 2,
            font_size: 1,
            bg_color: 'black',
            position: -1
        })
    }
}

function subCallParams(mediaId, method, func_params){
    let parameters = { 
        mediaId
    }

    Arrays.extend(parameters, func_params)

    luna({
        parameters,
        method
    })

    Storage.set('webos_subs_params', subparams)
}

function getWebosmediaId(func) {
    let video = document.querySelector('video')

    if(video && video.mediaId){
        initStorage()

        setTimeout(()=>{
            subCallParams(video.mediaId, func.name, func())
        },300)
    }
}

function setSubtitleColor(){
    subparams.color++

    if(subparams.color == 6) subparams.color = 0

    return {
        color: subparams.color
    }
}

function setSubtitleBackgroundColor(){
    let bgcolors = ['black','white','yellow','red','green','blue']
    let ixcolors = bgcolors.indexOf(subparams.color)

    ixcolors++

    if(ixcolors == -1) ixcolors = 0

    subparams.bg_color = bgcolors[ixcolors]

    return {
        bgColor: subparams.bg_color
    }
}

function setSubtitleFontSize(){
    subparams.font_size++

    if(subparams.font_size == 5) subparams.font_size = 0

    return {
        fontSize: subparams.font_size
    }
}

function setSubtitlePosition(){
    subparams.position++

    if(subparams.position == 5) subparams.position = -3

    return {
        position: subparams.position
    }
}


function initialize(){
    let video = document.querySelector('video')

    if(video && video.mediaId){
        initStorage()

        let methods = ['setSubtitleColor','setSubtitleBackgroundColor','setSubtitleFontSize','setSubtitlePosition']

        let parameters = { 
            mediaId: video.mediaId,
            color: subparams.color,
            bgColor: subparams.bg_color,
            position: subparams.position,
            fontSize: subparams.font_size
        }
    
        Arrays.extend(parameters, subparams)

        methods.forEach(method=>{
            luna({
                parameters,
                method
            })
        })
        
    }
}

export default {
    initialize
}