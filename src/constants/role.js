
import { UserName } from '../utils/roomRole'

export const ROLE = {

    // 观众
    audience: {
        id: 0
    },
    // 老师
    teacher: {
        // hasEditPermisson: roomOwner,
        id: 1,
        tag: '主讲老师'
    },
    // 学生
    student: {
        id: 2
    },
    // 助教
    assistant: {
        // hasEditPermisson: roomAdmins.includes(userName),
        id: 3,
        tag: '助教老师'
    },

}