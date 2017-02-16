'use strict';

var React = require('react/addons');

// CSS
require('normalize.css');
require('../styles/main.scss');
//获取json格式图片数据
var imageDatas = require('../data/imagDatas.json');
//利用自执行函数将图片信息转换为图片URL路径信息
 imageDatas = (function genImageURL(imageDataArr)
{
  for(var i = 0, j = imageDataArr.length; i < j; i++)
  {
    var singleImageData = imageDataArr[i];
    singleImageData.imageURL = require('../images/' + singleImageData.fileName);
    imageDataArr[i] = singleImageData;
  }
  return imageDataArr;
})(imageDatas);

var GalleryByReactApp = React.createClass({
  render: function() {
    return (
        <section className="stage">
          <section className="img-sec">

          </section>
          <nav className="controller-nav">

          </nav>
        </section>
    );
  }
});
React.render(<GalleryByReactApp />, document.getElementById('content')); // jshint ignore:line

module.exports = GalleryByReactApp;
