import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import store from '../redux/store'
import { roomMessages, qaMessages } from '../redux/aciton'
import WebIM from '../utils/WebIM';
import { JoinRoom, GetRoomInfo } from '../api/chatroom'
import { CHAT_TABS_KEYS } from '../components/MessageBox/constants'

// WebIM 注册监听回调
const useIMListen = ({ currentTab }) => {
    const history = useHistory();
    useEffect(() => {
        WebIM.conn.listen({
            onOpened: () => {
                JoinRoom();
                setTimeout(() => {
                    history.push('/chatroom')
                }, 500);
            },
            // 文本消息
            onTextMessage: (message) => {
                const { ext: { msgtype, asker } } = message
                if (msgtype === 0) {
                    store.dispatch(roomMessages(message, { showNotice: currentTab !== CHAT_TABS_KEYS.chat }))
                } else if ([1, 2].includes(msgtype)) {
                    store.dispatch(qaMessages(message, asker, { showNotice: currentTab !== CHAT_TABS_KEYS.qa && msgtype === 1 }))
                }
            },
            // 异常回调
            onError: (message) => {
                console.log('onError', message);
            },
            // 聊天室相关监听
            onPresence: (message) => {
                console.log('type-----', message.type);
                switch (message.type) {
                    case "memberJoinChatRoomSuccess":
                        GetRoomInfo(message.gid);
                        message.success(message.from + '已成功加入聊天室！');
                        setTimeout(() => {
                            message.destroy();
                        }, 3000);
                        break;
                    case "leaveChatRoom":
                        GetRoomInfo(message.gid);
                        message.success(message.from + '已离开聊天室！');
                        setTimeout(() => {
                            message.destroy();
                        }, 3000);
                        break;
                    default:
                        break;
                }
            },
            onCustomMessage: (message) => {
                console.log('CUSTOM--', message);
                // store.dispatch(roomMessages(message))
                store.dispatch(roomMessages(message, { showNotice: currentTab !== CHAT_TABS_KEYS.chat }))
            },
            onPictureMessage: (message) => {
                console.log('onPictureMessage', message);
                store.dispatch(qaMessages(message, message.ext.asker))
            }, //收到图片消息
            onCmdMessage: (message) => {
                console.log('onCmdMessage', message);
                store.dispatch(roomMessages(message))
                // store.dispatch(delectMessages(message))
            },
        })
    }, [history, currentTab])
}
export default useIMListen;