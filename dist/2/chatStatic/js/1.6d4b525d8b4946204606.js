webpackJsonp([1],{140:function(e,t,i){i(195);var r=i(3)(i(159),i(210),"data-v-bc7eb39c",null);e.exports=r.exports},159:function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=i(33),d=i.n(r),a=i(1),o=i(2),n=i(32);a.a.use(n.a),a.a.component("add-grouper",function(e){i.e(15).then(function(){var t=[i(197)];e.apply(null,t)}.bind(this)).catch(i.oe)}),a.a.component("selectModel",function(e){i.e(14).then(function(){var t=[i(150)];e.apply(null,t)}.bind(this)).catch(i.oe)}),t.default={data:function(){return{data:[],ids:[],filterKey:""}},props:["id","group"],computed:d()({selected:function(){var e=this,t=[];return this.ids.forEach(function(i){console.log(i.index),e.friends[i.index].list.forEach(function(e){i.id==e.id&&("m"==i.type?(e.name=e.username,e.type="message"):(e.name=e.groupname,e.type="groupMessage"),t.push(e))})}),t}},i.i(o.b)({friends:function(e){var t=this,i=[{list:[],type:"m",id:0,groupname:e.friends[1].groupname},{list:[],id:0,type:"m",groupname:e.friends[2].groupname}];if(i[0].list=e.friends[1].list.filter(function(e){return e.username.includes(t.filterKey)}),i[1].list=e.friends[2].list.filter(function(e){return e.username.includes(t.filterKey)}),this.group){i.push({list:[],type:"g",id:0,groupname:"群"}),i[2].list=e.group;var r="all"+e.user.omsId;i[2].list.unshift({groupname:"全员群",id:r,avatar:"/chat/images/ren.png"})}return i}})),methods:{addId:function(e,t){for(var i=[],r=0;r<this.ids.length;r++)this.ids[r].index!=t&&i.push(this.ids[r]);i.push.apply(i,e),this.ids=i},close:function(){this.$emit("close")},submit:function(){if(!this.selected.length)return alert("还没有选择人！"),!1;this.$emit("selectedMan",this.selected),this.$emit("close")}}}},178:function(e,t,i){t=e.exports=i(137)(!1),t.push([e.i,"@media screen and (max-width:500px){.add-grouper[data-v-bc7eb39c]{height:340px}.add-grouper-left[data-v-bc7eb39c]{width:100%;float:left;border-right:1px solid #dedede}.add-grouper-left .chat-friend-list[data-v-bc7eb39c]{cursor:pointer;transition:background-color .1s;position:relative;border-top:1px solid #dedede}.add-grouper-left .add-grouper-left-search input[data-v-bc7eb39c]{padding:0 10px;font-size:12px;color:#000;height:30px;width:100%;line-height:30px;border:1px solid #c3c3c3;border-radius:4px;outline:none}.add-grouper-left .add-grouper-left-list[data-v-bc7eb39c]{height:256px;overflow:auto;width:100%}.add-grouper-right[data-v-bc7eb39c]{display:none}.add-ok[data-v-bc7eb39c]{text-align:center;cursor:pointer;margin:20px}.add-ok span[data-v-bc7eb39c]{color:#fff;background-color:#286090;margin:12px;padding:6px 12px}}@media screen and (min-width:500px){.add-grouper[data-v-bc7eb39c]{height:340px}.add-grouper-left[data-v-bc7eb39c]{width:50%;float:left;border-right:1px solid #dedede}.add-grouper-left .chat-friend-list[data-v-bc7eb39c]{cursor:pointer;transition:background-color .1s;position:relative;border-top:1px solid #dedede}.add-grouper-left .add-grouper-left-search input[data-v-bc7eb39c]{padding:0 10px;font-size:12px;color:#000;height:30px;width:100%;line-height:30px;border:1px solid #c3c3c3;border-radius:4px;outline:none}.add-grouper-left .add-grouper-left-list[data-v-bc7eb39c]{height:256px;overflow:auto;width:100%}.add-grouper-right[data-v-bc7eb39c]{width:50%;float:right;height:256px;overflow:auto}.add-grouper-right ul li[data-v-bc7eb39c]{padding:12px}.add-grouper-right ul li img[data-v-bc7eb39c]{width:30px;height:30px}.add-grouper-right ul li p[data-v-bc7eb39c]{display:inline-block;font-size:18px;margin:0;width:125px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.add-ok[data-v-bc7eb39c]{text-align:center;margin:20px;cursor:pointer}.add-ok span[data-v-bc7eb39c]{color:#fff;background-color:#286090;margin:12px;padding:6px 12px}}",""])},195:function(e,t,i){var r=i(178);"string"==typeof r&&(r=[[e.i,r,""]]),r.locals&&(e.exports=r.locals);i(138)("425c52fd",r,!0)},210:function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("selectModel",{on:{close:function(t){e.close()}}},[i("div",{slot:"header"},[e._v("\n        请选择人员\n    ")]),e._v(" "),i("div",{staticClass:"add-grouper",slot:"body"},[i("div",{staticClass:"add-grouper-left"},[i("div",{staticClass:"add-grouper-left-search"},[i("input",{directives:[{name:"model",rawName:"v-model",value:e.filterKey,expression:"filterKey"}],attrs:{type:"text",placeholder:"搜索"},domProps:{value:e.filterKey},on:{input:function(t){t.target.composing||(e.filterKey=t.target.value)}}})]),e._v(" "),i("div",{staticClass:"add-grouper-left-list"},[i("ul",{staticClass:"friend-list list-item"},e._l(e.friends,function(t,r){return i("li",{staticClass:"chat-friend-list"},[i("add-grouper",{attrs:{item:t,type:"m",index:r},on:{addIds:e.addId}})],1)}))])]),e._v(" "),i("div",{staticClass:"add-grouper-right"},[i("div",{staticClass:"add-grouper-right-container"},[i("ul",e._l(e.selected,function(t){return i("li",[i("img",{attrs:{src:t.avatar}}),e._v(" "),i("p",[e._v(e._s(t.name))])])}))])]),e._v(" "),i("div",{staticStyle:{clear:"both"}}),e._v(" "),i("div",{staticClass:"add-ok"},[i("span",{on:{click:function(t){e.submit()}}},[e._v("确定")])])])])},staticRenderFns:[]}}});