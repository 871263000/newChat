<script>
import { mapState } from 'vuex'
import Vue from 'vue';
import insertAtCursor from '../common/insertAtCursor';
import { reverse } from '../messageHandel';


import AlloyFinger from 'alloyfinger/alloy_finger' // 手势库
import AlloyFingerVue from 'alloyfinger/vue/alloy_finger'
Vue.use(AlloyFingerVue, {
  AlloyFinger
});

let G_SHOW = false;

Vue.component('messagesLog', function (resolve) {
  // 这个特殊的 require 语法告诉 webpack
  // 自动将编译后的代码分割成不同的块，
  // 这些块将通过 Ajax 请求自动下载。
  require(['./modalMessage'], resolve)
});


// 个人信息

Vue.component('persInfo', function (resolve) {
    require(['./persInfo'], resolve);
});
// 群信息

Vue.component('groupMan', function (resolve) {
    require(['./groupMan'], resolve);
});
// 
Vue.component('shareModel', function (resolve) {
  // 这个特殊的 require 语法告诉 webpack
  // 自动将编译后的代码分割成不同的块，
  // 这些块将通过 Ajax 请求自动下载。
  require(['./selectFriends'], resolve)
});




export default {
    data () {
        return {
            showMessageLog: false,
            // showImg: false,
            // imgfdBoxinfo: '',
            persInfo: false,
            groupManShow: false,
            shareShow: false,
            shareContent: '',
            playComplete: false,
            forwardInfo: {
                mouseLeftShow: false,
                forwardContent: '',
                forwardId: 0,
                messageOfSelf: false
            }
        }
    },
    computed:  mapState({
        user: (state) => state.user,
        session: (state) => state.sessions.find(session => session.id == state.currentSession.id && session.type == state.currentSessionType),
        dialogName: (state) => {
            return state.currentSession.name;
        },
        dialogImg: (state) => {
            return state.currentSession.img;
        },
        dialogId: (state) => {
            return state.currentSession.id;
        },
        dialogType: (state) => {
            return state.currentSessionType;
        },
        iPhone: (state) => state.iPhone, 
    }),
    filters: {
        // 将日期过滤为 hour:minutes
        time (date) {
            if (typeof date === 'string') {
                date = new Date(date);
            }
            return  date.getFullYear() + '-' + (parseInt(date.getMonth()) + 1) +'-' + date.getDate()+ ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
        }
    },
    methods: {
        content ( content, self ) {
            if ( content.indexOf('-voice-[') !== -1 ) {
               content =  content.replace(/-(voice)-\[(.*?)\]/g, function (f, i, z) {
                  let m = '';
                  let zArr = z.split('|');

                  if ( z[1] ) {
                    if ( self ) {
                      m = '<voice class="iconfont-chat" data-content="'+zArr[1]+'">&#xe604;<i class="playingRight"></i></voice>';
                    } else {
                      m = '<voice class="iconfont-chat" data-content="'+zArr[1]+'">&#xe605;<i class="playingLeft"></i></voice>';
                    } 
                  };
                  return m;
                });
               return content;
            }
            return reverse(content);
        },
        sendType (e) {
            let _this = this;
            if ( e.target.nodeName == 'IMG' ) {
                let img = e.target.src;

                // this.imgfdBoxinfo = img;
                this.$emit('enlarge', img);
                // this.showImg = true;
            }
            if (e.target.nodeName == 'SHARE') {

                this.shareContent = e.target.getAttribute('data-content');
                this.shareShow = true;
            }
            if ( e.target.nodeName == 'VOICE' ) {
                this.$refs.audio.onended = function() {
                    _this.playComplete = false;
                    e.target.children[0].style.display = 'none';
                };
                this.$refs.audio.src = e.target.getAttribute('data-content');
                e.target.children[0].style.display = 'inline-block';
                this.$refs.audio.play();
                this.playComplete = true;
                

            }
            e.currentTarget.parentNode.childNodes[0].style.display = 'none'
             G_SHOW = false;
            // console.log(e.target.nodeName);
            // console.log(e.target);
        },
        clearSession () {
            this.$emit('mainShow');
            this.$store.dispatch('clearSession');
        },
        userInfo () {
            if ( this.dialogType == 'groupMessage' ) {
                // if ( this.dialogId == 'all' + this.user.omsId ) {
                //     alert('全体人员的群！');
                //     return false;
                // }
                
                this.groupManShow = !this.groupManShow;
                return false;
            } else {
                this.persInfo = true
            }
        },
        appoint(name) {
            if ( this.dialogType == 'message' || !name ) {
                return ;
            }
            if ( this.iPhone ) {
                insertAtCursor(document.getElementById('chat-input'), '@'+name+ '  ');
            } else {
                insertAtCursor(document.getElementsByTagName('textarea')[0], '@'+name+ '  ');
            }
            // this.content = this.$refs.textarea.value;
        },
        mousedown (e, content) {
            if ( e.which == 3 ) {
            };
        },
        mouseLeft (e, content, id, self) {
            let posiX = e.pageX;
            let posiY = e.pageY;
            this.forwardInfo.mouseLeftShow = true;
            this.$nextTick(function () {
                this.$refs.mouseLeft.style.top = (posiY + 2) + 'px';
                this.$refs.mouseLeft.style.left = (posiX + 2) + 'px';
            });
            this.forwardInfo.forwardContent = content;
            this.forwardInfo.forwardId = id;
            this.forwardInfo.messageOfSelf = self;
            G_SHOW = true;

        },
        revoke () {
            this.$store.dispatch('revokeSend', this.forwardInfo.forwardId);

        },
        share (selectedMan) {
            let data = {};
            for (let i in selectedMan) {
                data.senderId = this.user.id;
                data.name = selectedMan[i].name;
                data.img = selectedMan[i].avatar;
                data.type = selectedMan[i].type;
                data.id =  selectedMan[i].id;
                data.content = this.shareContent;
                if ( data.content ) {
                    this.$store.dispatch('batchSendMessage', data);
                    alert('已分享！');
                    return ;
                }
                alert('分享失败！');
                return false;

            }
            
        },
        longTop (evt) {
            let el = evt.target;
            let parentEl = el.parentNode;

            for (let i = 0; i < 6; i++) {
                if ( parentEl.getAttribute('class') == 'content-box' ) {
                    
                    if ( parentEl.children[0].style.display == 'none' || parentEl.children[0].style.display == '' ) {
                        parentEl.children[0].style.display = 'block'
                    } else {
                        parentEl.children[0].style.display = 'none'
                    }
                    break;
                } else {
                    parentEl =  parentEl.parentNode;
                }
            }
            evt.stopPropagation();
            G_SHOW = true;
            // evt.target.getAttribute('data-content');

            // $event.appendChild($event);
            // console.log($event);
        },
        messageImgFd (img) {
             this.$emit('enlarge', img);
        },
        contentAct ( content, e) {
            let el = e.currentTarget;
            if ( el.children[0].style.display == 'none' || el.children[0].style.display == '' ) {
                el.children[0].style.display = 'block'
            } else {
                el.children[0].style.display = 'none'
            }
        },
        forward (content) {
            this.shareShow = true;
            this.shareContent = content;
        }

    },
    created () {
        document.addEventListener('click', (e)=> {
            this.groupManShow = false;
            this.forwardInfo.mouseLeftShow = false;
            G_SHOW = false;
        });
    }
}
Vue.directive('chat-drop', {
    bind: function (elm) {
        Vue.nextTick(() => {
            let dropEl = document.getElementById('chat-main');
            elm.onmousedown = function (e) {
                var e = e || window.event;
                let marginLeft = dropEl.offsetWidth/2;
                let disX = e.clientX - dropEl.offsetLeft - marginLeft;
                let disY = e.clientY - dropEl.offsetTop;
                document.onmousemove = function (e){
                    var e = e || window.event;
                    dropEl.style.left = (e.clientX - disX) + 'px';
                    dropEl.style.top = (e.clientY - disY) + 'px';
                };
                document.onmouseup = function (){
                    document.onmousemove = null;
                    document.onmouseup = null;
                };
            }
        })
    }
});

Vue.directive('scroll-bottom', function(el, bind) {
    Vue.nextTick(() => {
            let allImg = el.getElementsByTagName('img');
            let imgLength = 0;
            let imgLengthT = 0;
            for (let i = 0; i <= allImg.length -1; i++ ) {
                if ( allImg[i].getAttribute('class') == 'chat-img' ) {
                    imgLength++;
                    allImg[i].onload = function () {
                        loadCom();
                    }
                }
            }
            let loadCom = function () {
                imgLengthT++;
                if ( imgLengthT == imgLength ) {
                    el.scrollTop = el.scrollHeight - el.clientHeight;
                }

            }
            if ( G_SHOW ) {
                return false;
            }
            el.scrollTop = el.scrollHeight - el.clientHeight;
    });
})
</script>

<template>
<div class="message">
    <audio ref="audio"></audio>
    <!-- 分享 -->
    <shareModel @selectedMan="share" :group="true" v-if="shareShow" @close="shareShow =false"></shareModel>
<!-- 群里的人 -->
    <transition name="slide-groupMan">
        <div class="groupMan"  v-if="groupManShow">
            <groupMan @imgShow="messageImgFd"></groupMan>
        </div>
    </transition>
<!-- 个人信息 -->
  <persInfo v-if="persInfo" @imgShow="messageImgFd" @close="persInfo = false"></persInfo>

<!-- 聊天信息 -->
    <messagesLog :show="showMessageLog" @imgShow="messageImgFd" @close="showMessageLog = false" v-if="showMessageLog"></messagesLog>
    <div class="mouseLeft" ref="mouseLeft" v-if="forwardInfo.mouseLeftShow">
        <ul>
            <li @click="revoke()" v-if="forwardInfo.messageOfSelf">撤回</li>
            <li @click ="forward(forwardInfo.forwardContent)">转发</li>
        </ul>
    </div>
    <!-- 手机 title -->
    <div class="dialog-title" v-chat-drop>
        <i class="backSession" @click="clearSession()"></i>

        <span class="text-left dialogue-title-name">{{ dialogName }}</span>
        <!-- 个人信息 -->
        <i class=""class="iconfont-chat man-info" @click.stop="userInfo()" v-if="dialogName">&#xe686;</i>
    </div>
    <!--聊天信息 -->
    <ul v-if="session" v-scroll-bottom="showMessageLog">
        <li v-if="session.messages.length > 20" @click="showMessageLog = true" class="catMul">查看更多</li>
        <li v-for="item in session.messages">
            <p class="time">
                <span>{{ item.date | time }}</span>
            </p>
            <div class="main" :class="{ self: item.self }">
                <img class="avatar" width="40" height="40" :src="item.self ? user.img : item.img" @click="appoint(item.name)" />
                <div v-if="dialogType == 'groupMessage' && !item.self" class="groupName">{{item.name}}</div>
                
                <div class="content-box" :data-content="item.content">
                    <div :class="{'content-act': true, 'content-act-right': !item.self, 'content-act-left': item.self}" >
                        <div :class="{'content-act-list': true, 'content-box-d': item.self}">
                            <ul>
                                <li @click="revoke()" v-if="item.self">撤回</li>
                                <li @click.stop="forward(item.content)"><span>转发</span></li>
                            </ul>
                        </div>
                    </div>

                    <div v-if="!item.revokeState" class="text" @contextmenu = "mouseLeft($event, item.content, item.id, item.self)"  @click="sendType($event)"  v-finger:long-tap="longTop" v-oncontextmenu ="item.content" v-html="content(item.content, item.self)">
                        
                    </div>
                    <div v-else class="messageRevoke">
                        
                        {{item.self ? '你撤销了一条消息' : item.name + '撤销了一条消息'}}
                    </div>
                </div>
            </div>
        </li>
    </ul>
</div>
</template>

<style lang="less">
    .message {
        a{
            text-decoration: none;
        }
        voice {
            cursor: pointer;
            font-size: 28px;
            height: 35px;
            line-height: 35px;
        }
        .playingLeft {

            display: none;
            position: absolute;
            right: -25px;
            top: 17px;
            width: 10px;
            height: 10px;
            border-radius: 10px;
            background-color: red;
        }
        .playingRight {
            display: none;
            position: absolute;
            left: -25px;
            top: 17px;
            width: 10px;
            height: 10px;
            border-radius: 10px;
            background-color: red;
        }
        .chat-file{
            text-align: center;
            width: 180px;
            position: relative;
            .chat-share {
                position: absolute;
                font-size: 20px;
                top: 0;
                right: 0;
                padding: 10px;
                cursor: pointer;
            }
            i {
                width: 56px;
                height: 56px;
                display: inline-block;
                font-size: 58px;
                text-align: center;
                line-height: 56px;
                padding: 5px;
                color: #000;
            }
        }
        .main {
            p{
                max-width:100%; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
                text-align:center
            }
        }
        .text {
            a {
                text-decoration:underline;
            }
        }
    }

</style>
<style lang="less" scoped>
.messageRevoke {
    text-align: center;
    color: #6b6969;
}


@media screen and (max-width: 500px) {


.mouseLeft {
    display: none;
}
.content-box-d {
    width: 100px !important;
}
.content-box {
    position: relative;
    .content-act-left{
        left: 10px !important;
        right: inherit !important;
         .content-act-list {
            left: 100%;
            right: inherit !important;
            margin-left: 13px;
         }
    }
    .content-act {
        cursor: pointer;
        display: none;
        position: absolute;
        right: 10px;
        top: 5px;
        z-index: 999;
        box-shadow: 0 0 10px #ccc;

        .content-act-list {
            position: absolute;
            width: 200px;
            height: 35px;
            right: 100%;
            top: -7px;
            margin-right: 13px;
            background-color: #fff;
            background-color: #000;
            color: #fff;
            ul {
                height: 100%;
                top: 0;
                li {
                    float: left;
                    height: 100%;
                    margin: 0;
                    padding: 10px;
                    border-right: 1px solid #ccc;
                    width: 100px;
                    text-align: center;
                }
            }
        }
        i {
            font-size: 21px;
            color: #000;
            border-radius: 10px;
            background-color: #fff;
        }
    }
}
.dialog-title {
    height: 45px;
    border-bottom: 1px solid #ccc;
    cursor: move;
    background-color: rgb(48, 48, 54);
    color: #fff;
    text-align: center;
    .dialogue-title-name {
        height: 100%;
        line-height: 45px;
        font-size: 20px;
        display: inline-block;
        width: 135px;
        display: inline-block;
        margin: 0 0 0 15px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: center;
    }
    .backSession {
        position: absolute;
        top: 0;
        left: 10px;
        display: inline-block;
        width:32px;
        height:45px;
        line-height: 45px;
        background: url('../assets/xyjt.png') center no-repeat;
    }
    .man-info {
        position: absolute;
        top: 0;
        right: 10px;
        display: inline-block;
        width:32px;
        height:45px;
        line-height: 45px;
        font-size: 26px;
    }
}
.message {
    width: 100%;
    position: absolute;
    top: 0;
    bottom: 50px;
    .catMul{
        text-align: center;
        padding: 10px 0;
        font-size: 16px;
        cursor: pointer;
        color: #082f84;
    }

    .groupName {
        color: #908f8f;
        padding: 5px;
    }
    ul {
        position: absolute;
        bottom: 0;
        top:50px;
        width:100%;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        li {
            padding: 10px;
        }
    }

    li {
        margin-bottom: 15px;
    }
    .time {
        margin: 7px 0;
        text-align: center;

        > span {
            display: inline-block;
            padding: 0 18px;
            font-size: 12px;
            color: #fff;
            border-radius: 2px;
            background-color: #af9a9a;
        }
    }
    .avatar {
        float: left;
        margin: 0 10px 0 0;
        border-radius: 3px;
    }
    .text {
        display: inline-block;
        position: relative;
        padding: 3px 5px;
        max-width: ~'calc(100% - 80px)';
        min-height: 30px;
        font-size: 18px;
        text-align: left;
        word-break: break-all;
        background-color: #fafafa;
        border-radius: 4px;
        line-height: 25px;
        font-family:微软雅黑;
        &:before {
            content: " ";
            position: absolute;
            top: 9px;
            right: 100%;
            border: 6px solid transparent;
            border-right-color: #fafafa;
        }
    }

    .self {
        text-align: right;

        .avatar {
            float: right;
            margin: 0 0 0 10px;
        }
        .text {
            background-color: #b2e281;

            &:before {
                right: inherit;
                left: 100%;
                border-right-color: transparent;
                border-left-color: #b2e281;
            }
        }
    }
}
}
@media screen and (min-width: 500px) {
    .groupMan {
        position: absolute;
        right: 0;
        top: 55px;
        width: 200px;
        bottom: 0;
        background-color: #fff;
        z-index: 9999;
        border-left: 1px solid #ccc;
        border-top: 1px solid #ccc;
        overflow: auto;
        
    }
    .mouseLeft {
        position: fixed;
        z-index: 99;
        width: 100px;
        background-color: #fff;
        text-align: center;
        box-shadow: 0px 0px 10px #3c3b3b;
        cursor: pointer;
        ul {
            li {
                padding: 10px;
                border-bottom: 1px solid #ccc;
                margin: 0;
            }
        }
    }
.slide-groupMan-enter, .slide-groupMan-leave{
    -webkit-transition: all 1;
    transition: all 1;
    translateY: (8);
    opacity: 0;

}
.content-box {
    position: relative;
    .content-act-left{
        left: 10px !important;
        right: inherit !important;
         .content-act-list {
            left: 100%;
            right: inherit !important;
            margin-left: 13px;
         }
    }
    .content-act {
        cursor: pointer;
        display: none;
        position: absolute;
        right: 10px;
        top: 5px;
        z-index: 999;
        box-shadow: 0 0 10px #ccc;

        .content-act-list {
            position: absolute;
            width: 100px;
            height: 35px;
            right: 100%;
            top: -7px;
            margin-right: 13px;
            background-color: #fff;
            display: none;
            background-color: #000;
            color: #fff;
            ul {
                height: 100%;
                li {
                    float: left;
                    height: 100%;
                    margin: 0;
                    padding: 10px;
                    border-right: 1px solid #ccc;
                    width: 100%;
                    text-align: center;
                }
            }
        }
        i {
            font-size: 21px;
            color: #000;
            border-radius: 10px;
            background-color: #fff;
        }
    }
}

.dialog-title {
    height: 40px;
    border-bottom: 1px solid #ccc;
    cursor: move;
    .dialogue-title-name {
        height: 100%;
        line-height: 40px;
        font-size: 20px;
        display: inline-block;
    }
}
.message {
    .catMul{
        text-align: center;
        padding: 10px 0;
        font-size: 16px;
        cursor: pointer;
        color: #082f84;
    }
    .backSession{ display: none; }
    .man-info {
        position: absolute;
        top: 0;
        right: 40px;
        display: inline-block;
        width:32px;
        height:45px;
        line-height: 45px;
        font-size: 26px;
    }
    padding: 10px 15px;
    .groupName {
        color: #908f8f;
        padding: 5px;
    }
    ul {
        overflow-y: auto;
        height: ~'calc(100% - 32px)';
        &::-webkit-scrollbar{width:100px ;display: block;}
        &::-webkit-scrollbar{width:10px;height:10px}
        &::-webkit-scrollbar-track{background:rgba(0,0,0,0)}
        &::-webkit-scrollbar-thumb{background:rgba(0,0,0,0.5);border-radius:10px}
        &::-webkit-scrollbar-corner{background:#82afff}
        &::-webkit-scrollbar-resizer{background:#ff0bee}
        &::scrollbar{width:100px ;display: block;}
        &::scrollbar{width:10px;height:10px}

        &::scrollbar-track{background:rgba(0,0,0,0)}
        &::scrollbar-thumb{background:rgba(0,0,0,0.5);border-radius:10px}
        &::scrollbar-corner{background:#82afff}
        &::scrollbar-resizer{background:#ff0bee}
    }

    li {
        margin-bottom: 15px;
    }
    .time {
        margin: 7px 0;
        text-align: center;

        > span {
            display: inline-block;
            padding: 0 18px;
            font-size: 12px;
            color: #fff;
            border-radius: 2px;
            background-color: #af9a9a;
        }
    }
    .avatar {
        float: left;
        margin: 0 10px 0 0;
        border-radius: 3px;
    }
    .text {
        display: inline-block;
        position: relative;
        padding: 0 10px;
        max-width: ~'calc(100% - 80px)';
        min-height: 30px;
        line-height: 2.0;
        font-size: 16px;
        text-align: left;
        word-break: break-all;
        background-color: #fafafa;
        border-radius: 4px;
        &:before {
            content: " ";
            position: absolute;
            top: 9px;
            right: 100%;
            border: 6px solid transparent;
            border-right-color: #fafafa;
        }
    }

    .self {
        text-align: right;

        .avatar {
            float: right;
            margin: 0 0 0 10px;
        }
        .text {
            background-color: #b2e281;

            &:before {
                right: inherit;
                left: 100%;
                border-right-color: transparent;
                border-left-color: #b2e281;
            }
        }
    }
}
}

</style>