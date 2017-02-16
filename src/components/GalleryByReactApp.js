'use strict';

var React = require('react/addons');

// CSS
require('normalize.css');
require('../styles/main.scss');
//��ȡjson��ʽͼƬ����
var imageDatas = require('../data/imagDatas.json');
//������ִ�к�����ͼƬ��Ϣת��ΪͼƬURL·����Ϣ
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

//��ȡ�����ڵ�һ�����ֵ
function getRangeRandom(low,high){
  return Math.ceil(Math.random() * (high - low) +low);
}
var ImgFigure = React.createClass({
  render: function(){
    return (
        <figure className = "img-figure">
            <img src = {this.props.data.imageURL} alt = {this.props.data.title}/>
            <figcaption>
              <h2 className = "img-title">{this.props.data.title}</h2>
            </figcaption>
        </figure>
    );
  }
});
var GalleryByReactApp = React.createClass({
  Constant:{
    centerPos:{
      left:0,
      right:0
    },
    hPosRange:{//ˮƽ�����ȡֵ��Χ
      leftSecx:[0,0],
      rightSecx:[0,0],
      y:[0,0]
    },
    vPosRange:{//��ֱ�����ȡֵ��Χ
      x:[0,0],
      topY:[0,0]
    }
  },
  //��װ���������²�������ͼƬ��centerIndexָ�������Ų��Ǹ�ͼƬ
  rearrange : function (centerIndex){
    var imgsArrangeArr = this.stage.imgsArrangeArr,
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
        topImgNum = Math.ceil(Math.random() * 2), //������ȡһ����0��ͼƬ
        topImgSpliceIndex = 0,
        imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);//�������ͼƬ״̬��Ϣ
        //���Ⱦ���centerIndex��ͼƬ
        imgsArrangeCenterArr[0].pos = centerPos;
        //ȡ�������ϲ��ͼƬ��״̬��Ϣ
        topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);
        //����λ���ϲ��ͼƬ
        imgsArrangeTopArr.forEach(function(value,index){
          imgsArrangeTopArr[index].pos = {
            top:getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
            left:getRangeRandom(vPosRangeX[0],vPosRangeX[1])
          }
        });
    //�������������ͼƬ
  },
  //��ȡ״̬��Ϣ
  getInitialState : function(){
    return {
      imgsArrangeArr : [
        /*{
          pos : {
         left : "0",
         top : "0"
         }
        }*/
      ]
    };
  },
  //��������Ժ�Ϊÿ��ͼƬ������λ�÷�Χ
  componentDidMount : function(){
    //��̨�Ĵ�С
    var stageDOM = React.findDOMNode(this.refs.stage),
        stageW = stageDOM.scrollWidth,
        stageH = stageDOM.scrollHeight,
        halfStageW = Math.ceil(stageW / 2),
        halfStageH = Math.ceil(stageH / 2);
    //��һ��ImgFigure�Ĵ�С
    var imgFigureDOM = React.findDOMNode(this.refs.imgFigure0),
        imgW = imgFigureDOM.scrollWidth,
        imgH = imgFigureDOM.scrollHeight,
        halfImgW = Math.ceil(imgW / 2),
        halfImgH = Math.ceil(imgH / 2);
    //��������ͼƬλ�õ�
    this.Constant.centerPos = {
      left : halfStageW - halfImgW,
      right : halfStageH - halfImgH
    }
    this.Constant.hPosRange.leftSecx[0] = -halfImgW;
    this.Constant.hPosRange.leftSecx[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecx[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecx[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;

    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfImgW - imgW;
    this.Constant.vPosRange.x[1] = halfImgW;

    this.rearrange(0);//����һ��ͼƬ����
  },
  render: function() {
    var controllerUnits = [],
        imgFigures = [];
    imageDatas.forEach(function(value,index){
      if(!this.stage.imgsArrangeArr[index])
      {
        this.stage.imgsArrangeArr[index] = {
          pos : {
            left : 0,
            top : 0
          }
        }
      }
      imgFigures.push(<ImgFigure data={value} ref={"imgFigure" + index}/>);
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
