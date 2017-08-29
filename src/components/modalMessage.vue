<script>
import	Vue from 'vue';
import	{ mapState } from 'vuex';
import vueR from 'vue-resource';
import { reverse } from '../messageHandel';
Vue.component('asyncModal', function (resolve) {
  require(['./modal'], resolve)
});

// 图片放大
Vue.component('imgFd', function (resolve) {
  require(['./imgCat'], resolve)
});


let scrollHeight = 0;

export default {
	data () {
		return {
			p: 1,
			showModal: this.show,
			messagesLog: [],
            scrollHeight: 0,
            showImg: false,
            imgfdBoxinfo: '',
		}
	},
	computed: mapState({
		user: (state) => state.user,
		dig: (state) => state.currentSession,
        currentSessionType: (state) => state.currentSessionType
	}),
	props: ['show'],
	methods: {
        content ( content ) {
            return reverse(content);
        },
        loadMroe (e) {
            if ( e.target.scrollTop == 0 ) {
                this.getMessage();
            }
        },
        getMessage () {
            let type = '';
            if(this.currentSessionType == 'message') {
                type = 'friend';
            } else {
                type = 'group';
            }
            this.$http.get('/omsIm/demo/json/getList.php', {params: {
            // this.$http.get('/static/omsIm/demo/json/chatMessage.js', {params: {
                    p: this.p,
                    id: this.dig.id,
                    type: type,
                    class: 'page'

                }
            })
            .then(function (response) {
                // console.log(response);return;
                let vm = this;
                if ( response.data ) {
                    this.p ++;
                    this.messagesLog.unshift.apply(this.messagesLog, response.data.data.reverse());
                    this.$nextTick(function () {
                        vm.$refs.scrollBox.scrollTop = vm.$refs.scroll.offsetHeight - scrollHeight;
                        scrollHeight = vm.$refs.scroll.offsetHeight;
                    })
                }
                
            });
        },
        imgFd (e) {
            if ( e.target.nodeName == 'IMG' ) {
                let img = e.target.src;
                this.imgfdBoxinfo = img;
                this.showImg = true;
            }
        }
    },
	created () {
        this.$nextTick(function () {
           this.getMessage();

        })
	}
}

</script>
<template>
<div>
 <!-- img放大 -->
    <imgFd v-if="showImg" @close="showImg = false" :imgSrc="imgfdBoxinfo">
        <!-- <div slot="imgBody" v-html="imgfdBoxinfo"></div> -->
    </imgFd>
	<asyncModal v-if="show" @close="$emit('close')">
       
		<div slot="header">
			聊天记录
		</div>
		<div slot="body" ref="scrollBox" @scroll="loadMroe($event)"  class="message-log">
		    <ul v-if="messagesLog" ref="scroll" v-scroll-bottom="messagesLog">
		        <li v-for="item in messagesLog">
		            <p class="time">
		                <span>{{ item.timestamp}}</span>
		            </p>
		            <div class="main" :idt="user.id" :class="{ self: item.id == user.id  }">
		                <img class="avatar" width="30" height="30" :src="item.id == user.id ? user.img : item.avatar" />
		                <div class="text"  @click="imgFd($event)" v-html="content(item.content)"></div>
		            </div>
		        </li>
		    </ul>
		</div>
	</asyncModal>
</div>
</template>
<style lang="less" scoped>
@media screen and (max-width: 500px) {
    .message-log{
        padding: 5px;
        overflow: auto;
        height: 100%;
    }
}

.message-log{
    padding: 5px;
    overflow: auto;
    height: 400px;
    ul {
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
            background-color: #dcdcdc;
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
</style>