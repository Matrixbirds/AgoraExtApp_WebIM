import { useState, useEffect } from 'react'
import { Input, Switch, Tag } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Flex, Text, Image } from 'rebass'
import { useSelector } from 'react-redux'
import { GetRoomMuteList } from '../../../api/chatroom'
import WebIM from '../../../utils/WebIM'
import MuteList from './MuteList'
import { getUserInfo } from '../../../api/userInfo'
// import SearchMember from './SearchMember'
import './userList.css'

// 设置个人禁言
const setUserMute = (roomId, selectUser) => {
    let options = {
        chatRoomId: roomId, // 聊天室id
        username: selectUser,     // 被禁言的聊天室成员的id
        muteDuration: -1000       // 被禁言的时长，单位ms，如果是“-1000”代表永久
    };
    WebIM.conn.muteChatRoomMember(options).then((res) => {
        GetRoomMuteList(roomId)
    })
}
// 移除个人禁言
const removeUserMute = (roomId, selectUser) => {
    let options = {
        chatRoomId: roomId, // 聊天室id
        username: selectUser        // 解除禁言的聊天室成员的id
    };
    WebIM.conn.removeMuteChatRoomMember(options).then((res) => {
        GetRoomMuteList(roomId)
    })
}

const UserList = ({ userList }) => {
    // 禁言列表
    const [isTool, setIsTool] = useState(false);
    const [searchUser, setSearchUser] = useState('');
    const [selectUser, setSelectuser] = useState('');
    const roomId = useSelector((state) => state.room.info.id)
    const loginName = useSelector((state) => state.loginName);
    const roomOwner = useSelector((state) => state.room.info.owner);
    const roomAdmins = useSelector((state) => state.room.admins);
    const roomMuteList = useSelector((state) => state.room.muteList) || [];
    const roomListInfo = useSelector((state) => state.userListInfo) || {};

    useEffect(() => {
        getUserInfo(userList)
    }, [userList])


    const getUserId = (key) => {
        console.log('getUserId--', key);
        setSelectuser(key)
    }
    // 禁言开关
    const onMute = checked => {
        setIsTool(checked);
    }
    // 搜索值
    const onSearch = e => {
        setSearchUser(e.target.value)
    }
    // 是否禁言
    const onSetMute = checked => {
        if (checked) {
            setUserMute(roomId, selectUser);
        } else {
            removeUserMute(roomId, selectUser);
        }
    }


    const newArr = [];
    return (
        <div>
            <div className='search-back'>
                <Input placeholder='请输入用户名' className='search-user' onChange={onSearch} />
                <SearchOutlined className='search-icon' />
            </div>
            <Flex justifyContent='flex-start' alignItems='center' mt='8px'>
                <Switch
                    size="small"
                    title="禁言"
                    onChange={onMute}
                />
                <Text className='only-mute'>只看禁言</Text>
            </Flex>
            {
                <div>
                    {
                        // 是否为禁言
                        isTool ? (
                            <MuteList searchUser={searchUser} roomMuteList={roomMuteList} isTool={isTool} />
                        ) : (
                                <div>
                                    {
                                        //是否搜索成员
                                        searchUser ? (
                                            <div>
                                                {Object.keys(roomListInfo).map(key => {
                                                    console.log('roomListInfo---', roomListInfo[key].nickname);
                                                    if (roomListInfo[key].nickname) {
                                                        newArr.push(roomListInfo[key].nickname)
                                                    }
                                                    console.log('newArr', newArr);
                                                    // return (<div>
                                                    //     {
                                                    //         newArr.map((item) => {
                                                    //             return (
                                                    //                 <Flex alignItems='center' mt='10px'>
                                                    //                     <Image className='msg-img'
                                                    //                         src={roomListInfo[key].avatarurl}
                                                    //                     />
                                                    //                     <Text className='username' ml='5px' >{item}</Text>
                                                    //                 </Flex>
                                                    //             )
                                                    //         })
                                                    //     }
                                                    // {/* {roomListInfo[key].nickname.includes(searchUser) && <Flex alignItems='center' mt='10px'>
                                                    //         <Image className='msg-img'
                                                    //             src={roomListInfo[key].avatarurl}
                                                    //         />
                                                    //         <Text className='username' ml='5px' >{roomListInfo[key].nickname}</Text>
                                                    //     </Flex>} */}
                                                    // </div>)
                                                })}
                                            </div>
                                        ) : (
                                                Object.keys(roomListInfo).map(key => {
                                                    console.log('Object', key);
                                                    return (
                                                        <Flex key={key} justifyContent='space-between' mt='5px' onClick={() => getUserId(key)}>
                                                            <Flex alignItems='center'>
                                                                <Image className='msg-img'
                                                                    src={roomListInfo[key].avatarurl || 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic4.zhimg.com%2F50%2Fv2-fde5891065510ef51e4c8dc19f6f3aff_hd.jpg&refer=http%3A%2F%2Fpic4.zhimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1624035646&t=52e70633abb73d7e2e0d2bd3f0446505'}
                                                                />
                                                                {loginName === roomOwner && <Tag className='tags'>主讲老师</Tag>}
                                                                {roomAdmins.includes(key) && <Tag className='tags'>助教老师</Tag>}
                                                                <Text className='username' ml='5px' >{roomListInfo[key].nickname || key}</Text>
                                                            </Flex>
                                                            <Switch
                                                                size="small"
                                                                title="禁言"
                                                                onChange={onSetMute}
                                                            />
                                                        </Flex>
                                                    )
                                                })
                                            )
                                    }
                                </div>
                            )
                    }
                </div>
            }
        </div >
    )
}

export default UserList;