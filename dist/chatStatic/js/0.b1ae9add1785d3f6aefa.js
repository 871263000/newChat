webpackJsonp([0],{112:function(e,a,t){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var s=t(0),o=t(1),r=(t(19),t(3));s.a.component("asyncModal",function(e){t.e(9).then(function(){var a=[t(105)];e.apply(null,a)}.bind(this)).catch(t.oe)}),s.a.component("imgFd",function(e){t.e(1).then(function(){var a=[t(99)];e.apply(null,a)}.bind(this)).catch(t.oe)});var i=0;a.default={data:function(){return{p:1,showModal:this.show,messagesLog:[],scrollHeight:0,showImg:!1,imgfdBoxinfo:""}},computed:t.i(o.b)({user:function(e){return e.user},dig:function(e){return e.currentSession},currentSessionType:function(e){return e.currentSessionType}}),props:["show"],methods:{content:function(e){return t.i(r.a)(e)},loadMroe:function(e){0==e.target.scrollTop&&this.getMessage()},getMessage:function(){var e="";e="message"==this.currentSessionType?"friend":"group",this.$http.get("/omsIm/demo/json/getList.php",{params:{p:this.p,id:this.dig.id,type:e,class:"page"}}).then(function(e){var a=this;e.data&&(this.p++,this.messagesLog.unshift.apply(this.messagesLog,e.data.data.reverse()),this.$nextTick(function(){a.$refs.scrollBox.scrollTop=a.$refs.scroll.offsetHeight-i,i=a.$refs.scroll.offsetHeight}))})},imgFd:function(e){if("IMG"==e.target.nodeName){var a=e.target.src;this.imgfdBoxinfo=a,this.showImg=!0}}},created:function(){this.$nextTick(function(){this.getMessage()})}}},119:function(e,a,t){a=e.exports=t(96)(!1),a.push([e.i,'@media screen and (max-width:500px){.message-log[data-v-0e6a421e]{padding:5px;overflow:auto;height:100%}}.message-log[data-v-0e6a421e]{padding:5px;overflow:auto;height:400px}.message-log ul[data-v-0e6a421e]::-webkit-scrollbar{width:100px;display:block;width:10px;height:10px}.message-log ul[data-v-0e6a421e]::-webkit-scrollbar-track{background:transparent}.message-log ul[data-v-0e6a421e]::-webkit-scrollbar-thumb{background:rgba(0,0,0,.5);border-radius:10px}.message-log ul[data-v-0e6a421e]::-webkit-scrollbar-corner{background:#82afff}.message-log ul[data-v-0e6a421e]::-webkit-scrollbar-resizer{background:#ff0bee}.message-log ul[data-v-0e6a421e]::scrollbar{width:100px;display:block;width:10px;height:10px}.message-log ul[data-v-0e6a421e]::scrollbar-track{background:transparent}.message-log ul[data-v-0e6a421e]::scrollbar-thumb{background:rgba(0,0,0,.5);border-radius:10px}.message-log ul[data-v-0e6a421e]::scrollbar-corner{background:#82afff}.message-log ul[data-v-0e6a421e]::scrollbar-resizer{background:#ff0bee}.message-log li[data-v-0e6a421e]{margin-bottom:15px}.message-log .time[data-v-0e6a421e]{margin:7px 0;text-align:center}.message-log .time>span[data-v-0e6a421e]{display:inline-block;padding:0 18px;font-size:12px;color:#fff;border-radius:2px;background-color:#dcdcdc}.message-log .avatar[data-v-0e6a421e]{float:left;margin:0 10px 0 0;border-radius:3px}.message-log .text[data-v-0e6a421e]{display:inline-block;position:relative;padding:0 10px;max-width:calc(100% - 80px);min-height:30px;line-height:2;font-size:16px;text-align:left;word-break:break-all;background-color:#fafafa;border-radius:4px}.message-log .text[data-v-0e6a421e]:before{content:" ";position:absolute;top:9px;right:100%;border:6px solid transparent;border-right-color:#fafafa}.message-log .self[data-v-0e6a421e]{text-align:right}.message-log .self .avatar[data-v-0e6a421e]{float:right;margin:0 0 0 10px}.message-log .self .text[data-v-0e6a421e]{background-color:#b2e281}.message-log .self .text[data-v-0e6a421e]:before{right:inherit;left:100%;border-right-color:transparent;border-left-color:#b2e281}',""])},130:function(e,a,t){var s=t(119);"string"==typeof s&&(s=[[e.i,s,""]]),s.locals&&(e.exports=s.locals);t(97)("93dc3d28",s,!0)},144:function(e,a){e.exports={render:function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("div",[e.showImg?t("imgFd",{attrs:{imgSrc:e.imgfdBoxinfo},on:{close:function(a){e.showImg=!1}}}):e._e(),e._v(" "),e.show?t("asyncModal",{on:{close:function(a){e.$emit("close")}}},[t("div",{slot:"header"},[e._v("\r\n\t\t\t聊天记录\r\n\t\t")]),e._v(" "),t("div",{ref:"scrollBox",staticClass:"message-log",on:{scroll:function(a){e.loadMroe(a)}},slot:"body"},[e.messagesLog?t("ul",{directives:[{name:"scroll-bottom",rawName:"v-scroll-bottom",value:e.messagesLog,expression:"messagesLog"}],ref:"scroll"},e._l(e.messagesLog,function(a){return t("li",[t("p",{staticClass:"time"},[t("span",[e._v(e._s(a.timestamp))])]),e._v(" "),t("div",{staticClass:"main",class:{self:a.id==e.user.id},attrs:{idt:e.user.id}},[t("img",{staticClass:"avatar",attrs:{width:"30",height:"30",src:a.id==e.user.id?e.user.img:a.avatar}}),e._v(" "),t("div",{staticClass:"text",domProps:{innerHTML:e._s(e.content(a.content))},on:{click:function(a){e.imgFd(a)}}})])])})):e._e()])]):e._e()],1)},staticRenderFns:[]}},21:function(e,a,t){t(130);var s=t(2)(t(112),t(144),"data-v-0e6a421e",null);e.exports=s.exports}});