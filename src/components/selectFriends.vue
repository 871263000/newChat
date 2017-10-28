<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import vueR from 'vue-resource'

Vue.use(vueR);
// Vue.compoment('friendsList', function (resolve) {
//     require(['./friendsList'], resolve);
// })
Vue.component('add-grouper', function (resolve) {
  require(['./addGrouper'], resolve)
})
Vue.component('selectModel', function (resolve) {
    require(['./modal'], resolve);
})
export default {
    data () {
        return {
            data: [],
            ids: [],
            filterKey: ''
        };
    },
    props: ['id'],
    computed: {
        selected () {
            let data = [];
            if ( this.friends[0] ) {
                this.friends[0].list.forEach(i => {
                    if ( this.ids.indexOf(i.id) !== -1 ) {
                        data.push(i);
                    }
                })
            }
            if ( this.friends[1] ) {
                this.friends[1].list.forEach(i => {
                    if ( this.ids.indexOf(i.id) !== -1 ) {
                        data.push(i);
                    }
                });
            }
            
            return data;

        },
        ...mapState({
            friends (state)  {
                let fFriends = [];
                let ff = [{list: [], id:0, groupname: state.friends[1].groupname }, {list: [], id: 0, groupname: state.friends[2].groupname}];
                    ff[0].list = state.friends[1].list.filter((val) => {
                        return val.username.includes(this.filterKey);
                    });
                    ff[1].list = state.friends[2].list.filter((val) => {
                        return val.username.includes(this.filterKey);
                    });
                return ff;
            },
        })
    },
    methods: {
        addId (ids, oldIds) {
            let index  = 0;
            oldIds.forEach(id => {
                index = this.ids.indexOf(id);
                this.ids.splice(index, 1);
            });
            this.ids.push.apply(this.ids, ids);
        },
        close () {
            this.$emit('close');
        },
        submit () {
            if ( !this.selected.length ) {
                alert('还没有选择人！');
                return false;
            }
            this.$emit('selectedMan', this.selected, this.ids);
            
            this.$emit('close');
        }
    }
}
</script>

<template>
    <selectModel @close="close()">
        <div slot="header">
            选择你要转发的人员
        </div>
        <div class="add-grouper" slot="body">
            <div class="add-grouper-left">
                <div class="add-grouper-left-search">
                    <input type="text" placeholder="搜索" v-model="filterKey">
                </div>
                <div class="add-grouper-left-list">
                    <ul class="friend-list list-item">
                        <li v-for="(item,index) in friends" class="chat-friend-list" >
                            <add-grouper :item="item" @addIds="addId" :index="index"></add-grouper>
                            <!-- <img class="avatar"  width="30" height="30" >
                            <p class="name">{{'测试'}}</p> -->
                        </li>
                    </ul>
                </div>
            </div>
            <div class="add-grouper-right">
                <div class="add-grouper-right-container">
                    <ul>
                        <li v-for="item in selected">
                            <!-- <input type="checkbox" :value="item.id" v-model="ids"> -->
                            <img :src="item.avatar">
                            <p>{{ item.username }}</p>
                        </li>
                    </ul>
                </div>
            </div>
            <div style="clear: both;"></div>
            <div class="add-ok">
                <span @click="submit()">确定</span>
            </div>
        </div>
    </selectModel>
</template>
<style lang="less" scoped >
@media screen and (max-width: 500px) {
    .add-grouper {
        height: 340px;
    }
    .add-grouper-left{
        width: 100%;
        float: left;
        border-right: 1px solid #dedede;
        .chat-friend-list {
            cursor: pointer;
            transition: background-color .1s;
            position: relative;
            border-top: 1px solid #dedede;
        }
        .add-grouper-left-search {
            input {
                padding: 0 10px;
                font-size: 12px;
                color: #000;
                height: 30px;
                width: 100%;
                line-height: 30px;
                border: solid 1px #c3c3c3;
                border-radius: 4px;
                outline: none;
                /* background-color: #26292E; */
            }
        }
        .add-grouper-left-list {
                height: 256px;
                overflow: auto;
                width: 100%;
        }
    }
    .add-grouper-right {
        display: none;
        
    }
    .add-ok {
            text-align: center;
            margin: 20px;
            span {
                color: #fff;
            background-color: #286090;
                margin: 12px;
                padding:6px 12px;
            }
    }
}
@media screen and (min-width: 500px) {
    .add-grouper {
        height: 340px;
    }
    .add-grouper-left{
        width: 50%;
        float: left;
        border-right: 1px solid #dedede;
        .chat-friend-list {
            cursor: pointer;
            transition: background-color .1s;
            position: relative;
            border-top: 1px solid #dedede;
        }
        .add-grouper-left-search {
            input {
                padding: 0 10px;
                font-size: 12px;
                color: #000;
                height: 30px;
                width: 100%;
                line-height: 30px;
                border: solid 1px #c3c3c3;
                border-radius: 4px;
                outline: none;
                /* background-color: #26292E; */
            }
        }
        .add-grouper-left-list {
                height: 256px;
                overflow: auto;
                width: 100%;
        }
    }
    .add-grouper-right {
        width: 50%;
        float: right;
        height: 256px;
        overflow: auto;
        ul {
            li {
                padding: 12px;
                img {
                    width: 30px;
                    height: 30px;
                }
                p {
                    display: inline-block;
                    font-size: 18px;
                    margin: 0px;
                    width: 125px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
        }
        
    }
    .add-ok {
            text-align: center;
            margin: 20px;
            span {
                color: #fff;
            background-color: #286090;
                margin: 12px;
                padding:6px 12px;
            }
    }
}
</style>