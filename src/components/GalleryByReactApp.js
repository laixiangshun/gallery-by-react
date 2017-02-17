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

//获取区间内的一个随机值
function getRangeRandom(low, high){
  return Math.ceil(Math.random() * (high - low) + low);
}
var ImgFigure = React.createClass({
  render: function(){
      var styleObj = {};
      //如果props属性中指定了图片的位置信息，则直接使用
      if(this.props.arrange.pos)
      {
          styleObj = this.props.arrange.pos;
      }
    return (
        <figure className = "img-figure" style = {styleObj}>
            <img src = {this.props.data.imageURL} alt = {this.props.data.title}/>
            <figcaption>
              <h2 className = "img-title">{this.props.data.title}</h2>
            </figcaption>
        </figure>
    );
  }
});
var GalleryByReactApp = React.createClass({
   Constant: {
    centerPos: {
      left: 0,
      top: 0
    },
    hPosRange: {//水平方向的取值范围
      leftSecx: [0, 0],
      rightSecx: [0, 0],
      y: [0, 0]
    },
    vPosRange: {//垂直方向的取值范围
      x: [0, 0],
      topY: [0, 0]
    }
  },
  //封装方法：重新布局所以图片，centerIndex指定居中排布那个图片
  rearrange: function (centerIndex){
    var imgsArrangeArr = this.state.imgsArrangeArr,
        Constant = this.Constant,
        centerPos = Constant.centerPos,
        hPosRange = Constant.hPosRange,
        vPosRange = Constant.vPosRange,
        hPosRangeLeftSecX = hPosRange.leftSecx,
        hPosRangeRightSecX = hPosRange.rightSecx,
        hPosRangeY = hPosRange.y,
        vPosRangeTopY = vPosRange.topY,
        vPosRangeX = vPosRange.x,

        imgsArrangeTopArr = [],
        topImgNum = Math.ceil(Math.random() * 2), //上区域取一个或0个图片
        topImgSpliceIndex = 0,
        imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);//存放中心图片状态信息
        //首先居中centerIndex的图片
        imgsArrangeCenterArr[0].pos = centerPos;
        //取出布局上侧的图片的状态信息
        topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);
        //布局位于上侧的图片
        imgsArrangeTopArr.forEach(function(value, index){
          imgsArrangeTopArr[index].pos = {
            top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
            left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
          };
        });
    //布局左右两侧的图片
      for(var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++)
      {
            var hPosRangeLORX = null;
          //前半部分布局左边，后半部分布局右边
            if(i < k)
            {
                hPosRangeLORX = hPosRangeLeftSecX;
            }else
            {
                hPosRangeLORX = hPosRangeRightSecX;
            }
          imgsArrangeArr[i].pos = {
              top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
              left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
          };
      }
      if(imgsArrangeTopArr && imgsArrangeTopArr[0])
      {
          imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
      }
      imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

      this.setState({
         imgsArrangeArr: imgsArrangeArr
      });
  },
  //获取状态信息
  getInitialState: function(){
    return {
      imgsArrangeArr: [
        /*{
          pos : {
         left : "0",
         top : "0"
         }
        }*/
      ]
    };
  },
  //组件加载以后，为每张图片计算其位置范围
  componentDidMount: function(){
    //舞台的大小
    var stageDOM = React.findDOMNode(this.refs.stage),
        stageW = stageDOM.scrollWidth,
        stageH = stageDOM.scrollHeight,
        halfStageW = Math.ceil(stageW / 2),
        halfStageH = Math.ceil(stageH / 2);
    //拿一个ImgFigure的大小
    var imgFigureDOM = React.findDOMNode(this.refs.imgFigure0),
        imgW = imgFigureDOM.scrollWidth,
        imgH = imgFigureDOM.scrollHeight,
        halfImgW = Math.ceil(imgW / 2),
        halfImgH = Math.ceil(imgH / 2);
    //计算中心图片位置点
    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    };
    this.Constant.hPosRange.leftSecx[0] = -halfImgW;
    this.Constant.hPosRange.leftSecx[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecx[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecx[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;

    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;

    this.rearrange(0);//将第一张图片居中
  },
  render: function() {
    var controllerUnits = [],
        imgFigures = [];
    imageDatas.forEach(function(value, index){
      if(!this.state.imgsArrangeArr[index])
      {
        this.state.imgsArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          }
        };
      }
      imgFigures.push(<ImgFigure data = {value} ref={'imgFigure' + index} arrange = {this.state.imgsArrangeArr[index]}/>);
    }.bind(this));
    return (
        <section className="stage" ref="stage">
          <section className="img-sec">
            {imgFigures}
          </section>
          <nav className="controller-nav">
            {controllerUnits}
          </nav>
        </section>
    );
  }
});
React.render(<GalleryByReactApp />, document.getElementById('content')); // jshint ignore:line

module.exports = GalleryByReactApp;
