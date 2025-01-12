import { CHAT_TABS_KEYS } from '../components/MessageBox/constants'
const defaultState = {
    extData: {},        //iframe 传递过来的参数
    loginName: '',      //当前登陆ID
    loginInfo: {},      //当前的用户的信息
    room: {             //聊天室
        info: {},       //详情
        notice: "",     //公告
        users: [],      //成员
        admins: [],     //管理员
        muteList: []    //禁言列表
    },
    messages: {         //消息
        list: [],       //TXT/TEXT 消息、CMD 消息、CUSTOM 消息
        qaList: {},     // QA 消息
        notification: { //判断当前所在Tab
            [CHAT_TABS_KEYS.chat]: false,
            [CHAT_TABS_KEYS.qa]: false
        }
    },
    isUserMute: false,   //单人禁言
    isQa: false,        //是否为提问消息开关
    isReward: false,    //是否隐藏赞赏消息开关
    userListInfo: {}    //成员信息

}
const reducer = (state = defaultState, action) => {
    const { type, data, qaSender } = action;
    switch (type) {
        //iframe 传递过来的参数
        case 'SAVE_EXT_DATA':
            return {
                ...state,
                extData: data
            };
        //当前登陆的name
        case 'LOGIN_NAME':
            return {
                ...state,
                loginName: data
            };
        //聊天室详情
        case 'GET_ROOM_INFO':
            return {
                ...state,
                room: {
                    ...state.room,
                    info: data
                }
            };
        //修改聊天室公告
        case 'UPDATE_ROOM_NOTICE':
            return {
                ...state,
                room: {
                    ...state.room,
                    notice: data
                }
            };
        //获取聊天室管理员
        case 'GET_ROOM_ADMINS':
            return {
                ...state,
                room: {
                    ...state.room,
                    admins: data
                }
            };
        //获取聊天室成员
        case 'GET_ROOM_USERS':
            return {
                ...state,
                room: {
                    ...state.room,
                    users: data
                }
            };
        //聊天室禁言列表
        case 'GET_ROOM_MUTE_USERS':
            return {
                ...state,
                room: {
                    ...state.room,
                    muteList: data
                }
            };
        //聊天室单人禁言
        case 'IS_USER_MUTE':
            return {
                ...state,
                isUserMute: data
            };
        //聊天室消息
        case 'SAVE_ROOM_MESSAGES':
            const { showNotice } = action.options
            let msgs = state.messages.list.concat(data)
            if (data.ext.msgId) {
                msgs = msgs.filter((item) => item.id !== data.ext.msgId)
            }
            return {
                ...state,
                messages: {
                    ...state.messages,
                    list: msgs,
                    notification: {
                        ...state.messages.notification,
                        [CHAT_TABS_KEYS.chat]: showNotice
                    }
                }
            };
        //移除聊天框红点通知
        case 'REMOVE_CHAT_NOTIFICATION':
            return {
                ...state,
                messages: {
                    ...state.messages,
                    notification: {
                        ...state.messages.notification,
                        [CHAT_TABS_KEYS.chat]: data
                    }
                }
            };
        //提问消息开关
        case 'QA_MESSAGE_SWITCH':
            return {
                ...state,
                isQa: data
            };
        //隐藏赞赏
        case 'REWARD_MESSAGE_SWITCH':
            return {
                ...state,
                isReward: data
            };
        //提问消息
        case 'SAVE_QA_MESSAGE':
            const qaList = state.messages.qaList
            return {
                ...state,
                messages: {
                    ...state.messages,
                    qaList: {
                        ...qaList,
                        [qaSender]: [...(qaList[qaSender] || []), data],
                    },
                    notification: {
                        ...state.messages.notification,
                        [CHAT_TABS_KEYS.qa]: action.options.showNotice
                    }
                }
            };
        //移除提问框红点通知
        case 'REMOVE_QA_NOTIFICATION':
            return {
                ...state,
                messages: {
                    ...state.messages,
                    notification: {
                        ...state.messages.notification,
                        [CHAT_TABS_KEYS.qa]: data
                    }
                }
            };
        //当前登陆的用户属性
        case 'SAVE_LOGIN_INFO':
            return {
                ...state,
                loginInfo: data
            };
        //聊天室成员属性
        case 'SAVE_MEMBER_INFO':
            return {
                ...state,
                userListInfo: data
            }
        default:
            return state;
    }
}

export default reducer

