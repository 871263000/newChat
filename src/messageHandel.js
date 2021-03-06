import emojis from './common/emojis';
const handelMessage = function ( content ) {
	 content = content.replace(/\n/g, '&lbrg')
  .replace(/\t/g, ' ');
   //转义换行 
	return content;
}
export const reverse = function ( content ) {
  if ( !content ) {
    return ;
  };
  // console.log(content);return false;
	content = content.replace(/&lbrg/g, '<br>') 
  .replace(/(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)[^\]]/g, function (y, u) {
      if ( y.indexOf('7xq4o9') != -1 ) {
        return y;
      }
      let a = '<a href="'+y+'" target="_blank">'+y+'</a>';
      return a;
    })
   //  转义换行
	.replace(/face\[([^\s\[\]]+?)\]/g, function(face){  //转义表情
      var alt = face.replace(/^face/g, '');
      return '<img alt="'+ alt +'" title="'+ alt +'" src="' + faces[alt] + '">';
    })
    .replace(/【(.*?)】/g, function ( f, v ) {
      let em = emojis.find(em => {
          return em.name == v;
      });
      if ( !em ) {
        return f;
      }
      let img = '<img width="20px"  src="http://www.omso2o.com/chatStatic/emoji/'+em.num+'@2x.png" alt="'+em.name+'" />'
      return img;
    }).
    replace(/-(file|img|video)-\[(.*?)\]$/g, function (f, i, z) {
      let m = '';
      let zArr = z.split('|');

      if ( z[1] ) {
        if ( zArr[0].indexOf('MOV') !== -1 ) {
            zArr[1] = zArr[1] + '?attname=' + zArr[0].replace('MOV', 'mp4');
        }
        if ( i == 'img' ) {
            m = '<img style="max-width: 200px;" class="chat-img" src="'+zArr[1]+'" alt="'+zArr[0]+'" />';
        } else if ( i == 'file' ) {
          m = '<div class="chat-file"><share class="iconfont-chat chat-share" data-content="'+f+'">&#xe6cb;</share><a title="'+zArr[0]+'" href="'+zArr[1]+'" download target="_blank"><i class="iconfont-chat">&#xe662;</i><p title="'+zArr[0]+'">'+zArr[0]+'</p></a></div>';
        } else if ( i == 'video' ) {
           m =  '<video controls="controls" style="width: 200px; height: 200px" src="' +zArr[1] + '"></video>';
          // m = '<div class="chat-file"><share class="iconfont-chat chat-share" data-content="'+f+'">&#xe6cb;</share><a title="'+zArr[0]+'" href="'+zArr[1]+'" download target="_blank"><i class="iconfont-chat">&#xe662;</i><p title="'+zArr[0]+'">'+zArr[0]+'</p></a></div>';
        }
      };
      return m;
    })
    
    return content;
}
export default handelMessage;