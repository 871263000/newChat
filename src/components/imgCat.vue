<script>
import Vue from 'vue';
import AlloyFinger from 'alloyfinger/alloy_finger' // 手势库
import AlloyFingerVue from 'alloyfinger/vue/alloy_finger'
Vue.use(AlloyFingerVue, {
  AlloyFinger
})
export default {
  data () {
    return {
      zoom: 0
    }
  },
  props: ['imgSrc'],
  methods: {
    pinch: function(evt) { 
      let img = this.$refs.img;

      img.style.WebkitTransform="scale("+evt.zoom+","+evt.zoom+")";
      img.style.transform="scale("+evt.zoom+","+evt.zoom+")";
    },
    pressMove: function(evt) {
        let Ml = parseInt(this.$refs.imgCatBox.style.marginLeft) + evt.deltaX;
        let MT = parseInt(this.$refs.imgCatBox.style.marginTop) + evt.deltaY;
        this.$refs.imgCatBox.style.marginLeft = Ml + 'px'; 
        this.$refs.imgCatBox.style.marginTop = MT + 'px';  
    },
    pcRotate (direction) {
        let base = 90;
        let transform  = this.$refs.img.style.transform;
        if ( transform ) {
          let deg = transform.match(/-?\d+/)[0];
          if (direction === 'left') {
            base += parseInt(deg);
          } else {
             base = parseInt(deg) -  base;
          }
          
          if ( base == 360 || base == -360 ) {
            base = 0;
          }
        } 

        this.$refs.img.style.transform = "rotate("+base+"deg)";
        this.$refs.img.style.WebkitTransform =  "rotate("+base+"deg)";
    },
    voidFun () {
      return  false;
    }
  },
  created () {
    this.$nextTick( () => {




let img = this.$refs.img;
let mm = this.$refs.mm;
let _this = this;
 let scrollFunc = function(e) {
    // e是FF的事件。window.event是chrome/ie/opera的事件
    let ee = e || window.event;
    let fx = 0;
     e.preventDefault();
    // console.log(ee); //可以看看ee.wheelDelta和e.detail在浏览器中的值；
    if(ee.wheelDelta) { //IE/Opera/Chrome   
       fx = ee.wheelDelta;
    } else if(ee.detail) { //Firefox    
        fx = ee.detail;
    }

    let transform = _this.$refs.img.style.transform;


    let mul = 0;
    let rotate = '';
    let deg = 0;
    if ( transform ) {
      rotate = transform.match(/rotate\(\d+deg\)/);
      let scale = transform.match(/scale\((-?\d+(\.\d+)?)/);

      if ( scale ) {
        deg = Number(scale[1]).toFixed(1);
        if ( fx > 0 ) {
          deg = parseFloat( deg) + 0.1;
        } else {
           deg = parseFloat( deg) -0.1;
        }
        if ( rotate  ) {
          _this.$refs.img.style.transform = rotate[0] + ' scale('+deg+', '+deg+')';
        } else {
           _this.$refs.img.style.transform = 'scale('+deg+', '+deg+')';
        }
      } else {
        _this.$refs.img.style.transform = rotate[0] + ' scale(1.1, 1.1)';
        
      }

    } else {
      _this.$refs.img.style.transform = 'scale(1.1, 1.1)';

    }
    // if ( mul ) {
    //   _this.$refs.img.style.transform = 'scale()';
    //   console.log(333);
    // } else {

    // }
    // console.log(transform);
}

// /*注册事件*/
// if(mm.addEventListener) {
//     //W3C FF
//     mm.addEventListener('DOMMouseScroll', scrollFunc, false);
// } 
// //IE/Opera/Chrome/Safari
// mm.onmousewheel = img.onmousewheel = scrollFunc; 



// mm.onmousedown = function (e) {
//     var e = e || window.event;
//     // let marginLeft = dropEl.offsetWidth/2;
//     // console.log(dropEl.offsetWidth);
//     // console.log(dropEl.offsetLeft);
//     let disX = e.clientX - img.offsetLeft;
//     let disY = e.clientY - img.offsetTop;
//     document.onmousemove = function (e){
//         var e = e || window.event;
//          e.preventDefault();
//         img.style.left = (e.clientX - disX) + 'px';
//         img.style.top = (e.clientY - disY) + 'px';
//     };
//     document.onmouseup = function (){
//         document.onmousemove = null;
//         document.onmouseup = null;
//     };
// }



      let clientWidth = document.body.clientWidth;
      let clientHeight = document.body.clientHeight;

      let imgWidth = this.$refs.img.width;
      let imgHeight = this.$refs.img.height;

      let clientScale = clientWidth/clientHeight;
      let imgScale = imgWidth/imgHeight;

      if ( imgWidth >  clientWidth || imgHeight > clientHeight  ) {

          if ( imgScale > clientScale ) {
              this.$refs.img.width = clientWidth;
              imgWidth = clientWidth;
              imgHeight = clientWidth/imgScale;
          } else {
              this.$refs.img.height = clientHeight;
              imgHeight = clientHeight;
              imgWidth = clientHeight * imgScale;
          }
          
      }
      this.$refs.imgCatBox.style.marginLeft = -imgWidth/2 + 'px'; 
      this.$refs.imgCatBox.style.marginTop = -imgHeight/2 + 'px'; 
    })
  }
}

</script>
<template>
<transition name="modal">
	<div class="modal-mask" ref="mm" @click.stop ="$emit('close')">
    <div class="img-cat-box" ref="imgCatBox" @click.stop="voidFun()">
      <img :src="imgSrc" ref="img" v-finger:pinch="pinch"
    v-finger:press-move="pressMove">  
<!--       	<slot name="body">
        		没有数据！
      	</slot> -->
    </div>
    <div class="img-handle">
      <ul class="">
        <li @click.stop="pcRotate('left')"><span class="left-rotate"><i class="iconfont-chat">&#xe626;</i></span></li>
        <li @click.stop="pcRotate('right')"><span class="right-rotate"><i class="iconfont-chat">&#xe63c;</i></span></li>
      </ul>
    </div>
  </div>
</transition>
</template>
<style lang="less" scoped>
@media screen and (max-width: 500px) {
  .img-handle {
    display: none;
  }
}
.modal-mask {
  position: fixed;
  z-index: 999999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
  display: table;
  transition: opacity .3s ease;
  .img-handle {
    width: 600px;
    height: 50px;
    background-color: rgba(0, 0, 0, 0.5);
    margin: auto;
    position: absolute;
    bottom: 0;
    left: 50%;
    z-index: 999;
    margin-left: -300px;
    box-shadow: 0 0 20px #2d2d2d;
    border-radius: 7px;
    text-align:center;
    ul {
      display: inline-block;
      li {
        width: 160px;
        height: 50px;
        line-height: 50px;
        display: inline-block;
        text-align: center;
        cursor: pointer;
        i {
          font-size: 33px;
          color: #fff;
        }
      }
    }
  }
}
.img-cat-box {
  position: fixed;
  z-index: 1;
  top: 50%;
  left: 50%;
  img {
        left: 0px;
    top: 0px;
    position: absolute;
  }
}

.modal-wrapper {
  margin-top: 20px;
  //display: table-cell;
  vertical-align: middle;
}

.modal-container {
  max-width: 400px;
  width: 100%;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
}
.modal-header{
  text-align: center;
  font-size: 18px;
}
.modal-footer {
  text-align: right;
}
.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
    color: #fff;
    background-color: #5bc0de;
    border-color: #46b8da;
  display: inline-block;
  padding: 6px 12px;
  margin-bottom: 0;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.42857143;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  -ms-touch-action: manipulation;
  touch-action: manipulation;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background-image: none;
  border: 1px solid transparent;
  border-radius: 4px;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>