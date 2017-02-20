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
//获取0-30度之间的一个任意正负值
function get30DegRandom(){
    return ((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30));
}
var ImgFigure = React.createClass({
    /*
        *ImgFigure的点击处理函数
     */
    handleClick: function(e){
        if(this.props.arrange.isCenter)
        {
            this.props.inverse();
        }else{
            this.props.center();
        }
        e.stopPropagation();
        e.preventDefault();
    },
  render: function(){
      var styleObj = {};
      //如果props属性中指定了图片的位置信息，则直接使用
      if(this.props.arrange.pos)
      {
          styleObj = this.props.arrange.pos;
      }
      //如果图片的旋转角度有值并且不为零，则添加旋转角度
      if(this.props.arrange.rotate)
      {
          //加上浏览器前缀为了兼容不同的浏览器
          (['MozTransform', 'msTransform', 'WebkitTransform', 'transform']).forEach(function(value){
              styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)';
          }.bind(this));
      }
      if(this.props.arrange.isCenter)
      {
          styleObj.zIndex = 11;
      }
      var imgFigureClassName = 'img-figure';
          imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

    return (
        <figure className = {imgFigureClassName} style = {styleObj} onClick={this.handleClick}>
            <img src = {this.props.data.imageURL} alt = {this.props.data.title}/>
            <figcaption>
              <h2 className = "img-title">{this.props.data.title}</h2>
                <div className="img-back" onClick={this.handleClick}>
                    <p>
                        {this.props.data.desc}
                    </p>
                </div>
            </figcaption>
        </figure>
    );
  }
});

//图片控制区
var ControllerUnit = React.createClass({
    handleClick: function(e){
        //如果单击的是当前正在选中态的按钮，则翻转图片，否则居中图片
        if(this.props.arrange.isCenter)
        {
            this.props.inverse();
        }else{
            this.props.center();
        }
        e.preventDefault();
        e.stopPropagation();
    },
   render: function(){
       var controllerUnitClassName = 'controller-unit';
       //如果是居中图片则显示控制按钮的居中态
       if(this.props.arrange.isCenter)
       {
           controllerUnitClassName += ' is-center';
           //如果同时显示的是居中图片的翻转态则显示控制按钮的翻转态
           if(this.props.arrange.isInverse)
           {
               controllerUnitClassName += ' is-inverse';
           }
       }

       return (
           <span className={controllerUnitClassName} onClick={this.handleClick}></span>
       );
   }
});
var GalleryByReactApp = React.createClass({
   Constant: {
    centerPos: {//中心位置的取值范围
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
    /*
    *翻转图片：index是当前正在执行翻转的图片对应图片信息数组的Index的值，
    *return {function}，这是一个闭包函数，其中return一个真正待被执行的函数
    */
    inverse: function(index){
        return function(){
            var imgsArrangeArr = this.state.imgsArrangeArr;
            imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
            this.setState({
               imgsArrangeArr: imgsArrangeArr
            });
        }.bind(this);
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
        topImgNum = Math.floor(Math.random() * 2), //上区域取一个或0个图片
        topImgSpliceIndex = 0,
        imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);//存放中心图片状态信息
        //首先居中centerIndex的图片,居中的图片不需要旋转
        imgsArrangeCenterArr[0] = {
            pos: centerPos,
            rotate: 0,
            isCenter: true
        };
        //取出布局上侧的图片的状态信息
        topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);
        //布局位于上侧的图片
        imgsArrangeTopArr.forEach(function(value, index){
          imgsArrangeTopArr[index] = {
              pos: {
                  top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
                  left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
              },
            rotate: get30DegRandom(),
              isCenter: false
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
          imgsArrangeArr[i] = {
              pos: {
                  top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
                  left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
              },
             rotate: get30DegRandom(),
              isCenter: false
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

    /*
        *利用rarrange函数居中显示index函数
        * index：需要被居中显示的图片对应图片信息数组的index值
        * return：{function}
     */
    center: function(index){
      return function(){
          this.rearrange(index);
      }.bind(this);
    },
  //获取状态信息
  getInitialState: function(){
    return {
      imgsArrangeArr: [
        /*{
          pos : {
         left : "0",
         top : "0"
         },
         rotate: 0, //旋转角度
         isInverse: false, //图片正反面
         isCenter: false  //图片是否居中
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
        halfStageW = Math.floor(stageW / 2),
        halfStageH = Math.floor(stageH / 2);
    //拿一个ImgFigure的大小
    var imgFigureDOM = React.findDOMNode(this.refs.imgFigure0),
        imgW = imgFigureDOM.scrollWidth,
        imgH = imgFigureDOM.scrollHeight,
        halfImgW = Math.floor(imgW / 2),
        halfImgH = Math.floor(imgH / 2);
    //计算中心图片位置点
    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    };
      //计算左右区域的位置
    this.Constant.hPosRange.leftSecx[0] = -halfImgW;
    this.Constant.hPosRange.leftSecx[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecx[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecx[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;
    //计算上面区域的位置信息
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
          },
          rotate: 0,
            isInverse: false,
            isCenter: false
        };
      }
        //key：为每个component添加的标识，当react需要重新渲染的时候判断是否需要为对应的每个component渲染，提升性能
      imgFigures.push(<ImgFigure key={index} data = {value} ref={'imgFigure' + index} arrange = {this.state.imgsArrangeArr[index]}
          inverse = {this.inverse(index)} center={this.center(index)}/>);
        controllerUnits.push(<ControllerUnit key={index} arrange = {this.state.imgsArrangeArr[index]} inverse = {this.inverse(index)} center = {this.center(index)}/>);
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
