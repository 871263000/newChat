/**
 * Vuex
 * http://vuex.vuejs.org/zh-cn/intro.html
 */
import Vue from 'vue';
import Vuex from 'vuex';
import Websocket from './Websocket';
import { reverse } from './messageHandel';
import messageHandle from './messageHandel';
import  events from './modules/events';
import  video from './modules/video';
import axios from 'axios'

Vue.use(Vuex);
// Vue.prototype.$http = axios
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
const now = new Date();


let chatFind = function (callback) {
    
}
const store = new Vuex.Store({
    state: {
        // 当前用户
        user: {},
        friends: [
            { 
                "groupname": "全员", 
                "id": 1,
                'list': []
            }, 
            { 
                "groupname" : "好友", 
                "id": 2,
                'list': [

                ]
            }
        ],
        group: [],
        // 会话列表
        sessions: [],
        // tab index
        indexTab: 1,
        // 当前选中的会话
        currentSession: {
            id: '',
            name: '',
            img: ''

        },
                // 当前选中的会话 类型
        currentSessionType: 'message',
        // 过滤出只包含这个key的会话
        filterKey: '',
        searchFriend: [],
        userSet: {
            voice: 0,
            desktop: 0
        },
        iPhone: false,
        videoResAnswerCallBack: function () {

        }
    },
    mutations: {
        INIT_DATA (state, initData) {
            let isMobile = function(){
                let userAgentInfo = navigator.userAgent;
                let Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod")
                let flag = false;
                for (let v = 0; v < Agents.length; v++) {
                    if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = true; break; }
                };
                return flag;
            }();
            if(isMobile){
                state.iPhone = true;
            }
            state.user.id = initData.data.mine.id;
            state.user.name= initData.data.mine.username;
            state.user.omsId= initData.data.mine.oms_id;
            state.user.img= initData.data.mine.avatar ? initData.data.mine.avatar : '/chat/images/niming.png';
            state.friends= initData.data.friend;
            state.group= initData.data.group;


            let data = localStorage.getItem('vue-chat-session' + state.user.id );
            let userSet = localStorage.getItem('chat-set');
            let dataJson = [];
            let omsGroup = 'all' + state.user.omsId;
            if (data) {
                dataJson = JSON.parse(data);
                // 删除原有的群
                dataJson.forEach((item, index)=>{
                    if ( item.id == 'all' ) {
                        dataJson.splice(index, 1);
                    }
                })
                if ( !dataJson.find(item=>item.id == omsGroup ) ) {
                    let date = new Date();
                    dataJson.unshift({id: omsGroup, user: {name: '全员群', img: '/chat/images/ren.png'}, messageNum: 0, type: 'groupMessage', 'messages': [{"id":"5057","content":"所有人的群", img: '/chat/images/ren.png',name: '系统', date: date}]});
                }
            } else {
                let date = new Date();
                dataJson.push({id: omsGroup, user: {name: '全员群', img: '/chat/images/ren.png'}, messageNum: 0, type: 'groupMessage', 'messages': [{"id":"5057","content":"所有人的群",img: '/chat/images/ren.png',name: '系统', date: date}]});
            }
            state.sessions = dataJson;
            if ( userSet ) {
                // console.log(userSet);
                state.userSet = JSON.parse(userSet);
            };
        },
        // 收到消息
        SEND_MESSAGE ({sessions, currentSession, user, friends, currentSessionType }, data) {
            if (data.code == 0) {
                if ( data.type == 'groupMessage' ) {
                    sessions.forEach((item, index)=> {
                        if ( item.id == data.dialogueId ) {
                            sessions.splice(index, 1);
                        }
                    })
                }
                alert(data.msg);
                return false;
            }

            // 记录日志
            // let errorLog = {"t": 0, "data": data, "user": user.id};
            let errorLog = data;
            errorLog.t = 0;
            errorLog.user = user.id;


            
            if ( data.type == 'message' && data.accept_id != user.id &&  data.senderId != user.id) {
                errorLog.t = 1;
                axios({
                  url: '/omsIm/demo/json/errorLog.php',
                  method: 'post',
                  data: errorLog,
                  transformRequest: [function (data) {
                    // Do whatever you want to transform the data
                    let ret = ''
                    for (let it in data) {
                      ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                    }
                    return ret
                  }],
                  headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                  }
                })
                return ;
            }
            // if ( data.senderId != user.id ) {
            //     axios({
            //       url: '/omsIm/demo/json/errorLog.php',
            //       method: 'post',
            //       data: errorLog,
            //       transformRequest: [function (data) {
            //         // Do whatever you want to transform the data
            //         let ret = ''
            //         for (let it in data) {
            //           ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            //         }
            //         return ret
            //       }],
            //       headers: {
            //         'Content-Type': 'application/x-www-form-urlencoded'
            //       }
            //     })
            //     // let param = new URLSearchParams();
            //     // param.append('data',JSON.stringify(errorLog));
            //     // this.$http.post('/omsIm/demo/json/getList.php', errorLog, {emulateJSON:true})
            //     // axios.post('/omsIm/demo/json/errorLog.php', {params: errorLog}, {emulateJSON:true})
            //     //   .then(function (response) {
            //     //   })
            //     //   .catch(function (error) {
            //     //     console.log(error);
            //     //   });
            // }


            
// 记录日志end
            let saveMessage = {};
            let session = sessions.find(item => item.id == data.dialogueId && item.type === data.type );
            // data.content = reverse(data.content);
            if ( data.senderId == user.id  ) {
                saveMessage = {
                    id: data.id,
                    content: data.content,
                    date: new Date(),
                    self: true,
                    accept_id: data.accept_id
                }
            } else {
                let date = '';
                if ( data.date ) {
                    date = new Date(data.date*1000);
                }
                saveMessage = {
                    id: data.id,
                    name: data.name, 
                    img: data.img,
                    content: data.content,
                    date: date || new Date(),
                    accept_id: data.accept_id
                }
            }
            // 会话列表里有
            if ( session ) {
                // 发送者 和 聊天人 不是同一人
                if ( data.dialogueId != currentSession.id ) {
                    session.messageNum++;
                };
                // 消息只能保存十条
                if ( session.messages.length > 20 ) {
                    session.messages.shift();
                };
                session.messages.push(saveMessage);
                // 消息置顶
                let index = 0;
                for (let i in sessions  ) {
                    if ( sessions[i].id == data.dialogueId && sessions[i].type === data.type ) {
                        index = i;
                        break;
                    }
                }
                if ( index != 0 ) {
                    sessions.unshift(sessions.splice(index, 1)[0]);
                }
                 // 会话列表里没有
            } else {
                session = {
                    id: data.dialogueId,
                    user: {   
                        name: data.sessionName, 
                        img: data.sessionImg
                    },
                    messageNum: 0,
                    type: data.type,
                    messages: []
                }
                if ( data.dialogueId != currentSession.id ) {
                    session.messageNum++;
                };
                session.messages.push(saveMessage);
                sessions.unshift(session);
            }
            // console.log(data);

            // console.log(Vue.$http);
            // Vue.$http.post('/omsIm/demo/json/errorLog.php', errorLog, {emulateJSON:true}).then(res=> {
                 
            // });
            // if ( session && session.messageNum != 0 ) {
            //     Websocket.sendMessage({"type":"mes_close", "to_uid":data.id,  "session_no": data.id, "message_type": data.type});
            // };

        },
        MES_CLOSE ({state, sessions}, data) {
            let session = sessions.find(item => item.id == data.session_no && item.type === data.message_type );
            session.messageNum = 0;
        },
        // 选择会话
        SELECT_SESSION (state, data) {

            let session = state.sessions.find(item => item.id == data.id && item.type == data.type);
            // 服务器端消除消息
            if ( session && session.messageNum != 0 ) {
                Websocket.sendMessage({"type":"mes_close", "to_uid":data.id,  "session_no": data.id, "message_type": data.type});
            };
            if ( session && session.messageNum != 0 ) {
                session.messageNum = 0;
            };
            state.currentSession.id = data.id;
            state.currentSession.name = data.name;
            state.currentSession.img = data.img;
            state.currentSessionType = data.type;
        } ,
        // 后台接受的未读消息
        // ACCEP_MES (state, data) {
        //     console.log(data);
        // },
        DELSESSION (state, index) {
            state.sessions.splice(index,1);
        },
        // 选择 tab
        SELECT_TAB (state, index) {
            state.indexTab = index;
        },
        // 搜索
        SET_FILTER_KEY (state, value) {
            // console.log(4333);
            state.filterKey = value;
        },
        USER_SET (state, key , value) {
            // state.userSet[key] = value;
            console.log(state.userSet);
        },
        CLEAR_SESSION (state) {
            state.currentSession.id = '';
            state.currentSession.name = '';
            state.currentSession.img = '';
        },
        FRIEND_DEL (state, uid) {
            for (let i in state.friends[0].list) {
                if ( state.friends[0].list[i].id == uid ) {
                    state.friends[0].list.splice(i, 1);
                    break;
                }
            }
        },
        FRIENDS_STATE_CHANGE (state, uid) {
            for (let i in state.friends[0].list) {
                if ( state.friends[0].list[i].id == uid ) {
                    state.friends[0].list[i].state = 0;
                    break;
                }
            }
        }
        // 加载完成
        // COMPLETE (state, tf) {
        //     state.complete = tf;
        // }
    },
    actions: {
        initData: ({ commit, dispatch }, initData) => { 
             Websocket.on('open', function () {
                Websocket.sendMessage({"type": 'login', oms_id: initData.data.mine.oms_id, uid: initData.data.mine.id, header_img_url: initData.data.mine.avatar, token: initData.data.mine.token, client_name: initData.data.mine.username, room_id: initData.data.mine.oms_id });
            });
            Websocket.on('comeMessage', function (data) {
                let type = data.type;
                dispatch(type, data);
            });
            Websocket.connect();
            commit('INIT_DATA', initData);

        },
        sendMessage: ({ commit, state }, data) => {
            let sendMessage = {};
            let content = '';
            data.dialogueId = state.currentSession.id;

            data.senderId = state.user.id;
            data.name = state.currentSession.name;
            data.img = state.currentSession.img;
            data.type = state.currentSessionType;
            data.content = messageHandle(data.content);

            // 转换内容 

            sendMessage = {type:"sayUid", to_uid: state.currentSession.id, groupId: 0, accept_name: state.currentSession.name, message_type: state.currentSessionType, mes_types: 'text', content: data.content  };
            // console.log(sendMessage);return;
            if ( state.currentSessionType != 'message'  ) {
                sendMessage.session_no = state.currentSession.id;
            };
            Websocket.sendMessage(sendMessage);
        },
        videoRes: ({commit, state}, data) => {
            Websocket.sendMessage({'type': 'videoChat', to_uid: state.currentSession.id});
        },
        videoResAnswerIng: ({state}, data) => {
            Websocket.sendMessage({'type': 'videoResAnswer', to_uid: data.to_uid, token: data.token });
        },
         batchSendMessage: ({ commit, state }, data) => {
            let sendMessage;

            // 转换内容 

            sendMessage = {type:"sayUid", to_uid: data.id, groupId: 0, accept_name: data.name, message_type: data.type, mes_types: 'text', content: data.content  };
            // console.log(sendMessage);return;
            if ( data.type != 'message'  ) {
                sendMessage.session_no = data.id;
            };
            Websocket.sendMessage(sendMessage);
        },
        // 后台发来的未读消息，
        acceptMes: ({ commit, state }, data) => {
            let saveData;

            let name, sessionId,sessionName,img, sessionImg;
            if ( data ) {
                data.forEach(function ( d ) {
                    // return;
                    if ( d.message_type == 'message' ) {
                        sessionName = d.sender_name;
                        name = d.sender_name;
                        img =  d.chat_header_img,
                        sessionImg = d.chat_header_img,
                        sessionId = d.sender_id;
                    } else {
                        img = d.chat_header_img,
                        sessionImg =  '/chat/images/ren.png',
                        sessionName = d.accept_name;
                        name = d.sender_name;
                        sessionId = d.session_no;
                    }
                    // state.sessions.forEach(function () {
                    //     console.log(33);
                    // });
                    // let session = state.sessions;
                    // 是否存在这个消息
                    let session = state.sessions.find(item => item.id == sessionId && item.type === d.message_type );
                    if ( session ) {
                        let sessionSave = session.messages.find(item=>item.id == d.id);
                        if (sessionSave) {
                            return false;
                        }
                    }
                    saveData = {
                        id: d.id,
                        content: d.message_content,
                        senderId: d.sender_id,
                        dialogueId: sessionId,
                        name: name,
                        sessionName: sessionName,
                        sessionImg: sessionImg,
                        img: img,
                        type: d.message_type,
                        date: d.create_time,
                        accept_id: d.accept_id,
                        acceptMode: 'h'

                    };
                    saveData.code = 1;
                    commit('SEND_MESSAGE', saveData);
                    // console.log(saveData);
                });
            };
            // console.log(data);
            return false;

        },
        selectSession: ({ commit }, data) => {commit('SELECT_SESSION', data)},
        delSession: ({ commit }, index) => {
            commit('DELSESSION', index);
        },
        selectTab: ({ commit }, id) => commit('SELECT_TAB', id),
        search: ({ commit }, value) => commit('SET_FILTER_KEY', value),
        userSet: ({commit}, key, value) => commit('USER_SET', key, value),
        clearSession: ({commit}) => commit('CLEAR_SESSION'),
        friendDel: ({commit}, uid) => commit('FRIEND_DEL', uid),
        friendsStateChange: ({commit}, uid) => commit('FRIENDS_STATE_CHANGE', uid),
    },
    modules: {
        events,
        video
    }
});

store.watch(
    (state) => state.sessions,
    (val) => {
        let uid = store.state.user.id;
        localStorage.setItem('vue-chat-session' + uid , JSON.stringify(val));
    },
    {
        deep: true
    }
);
store.watch(
    (state) => state.currentSession,
    (val) => {
        let id = val.id;
        if (!id) {
            id = 0;
        }
        let send = {'type': 'selectSession', 'dialogueId': id};
        Websocket.sendMessage(send);
    },
    {
        deep: true
    }
);

export default store;
