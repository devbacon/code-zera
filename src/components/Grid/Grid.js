import React from 'react';
import { fabric } from 'fabric';
import './Grid.css';

class Grid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const container = document.querySelector("#container");
    const canvas = new fabric.Canvas("canvas");

    // Set canvas dimenssions
    let containerWidth = container.offsetWidth;
    let containerHeight = container.offsetHeight;

    console.log(containerHeight, containerWidth);

    window.addEventListener("load", () => {
      expandContainerHeight();
      expandCanvas();
    });

    window.addEventListener("resize", () => {
      expandContainerHeight();
      expandCanvas();
    });

    const height = 100;
    const width = 100;
    const tileSize = 30;

    let canvasGrid = [];

    for (let i = 0; i < height; i++) {
      if (!canvasGrid[i]) canvasGrid[i] = [];
      for (let j = 0; j < width; j++) {
        let rect = new fabric.Rect({
          selectable: false,
          left: j * tileSize,
          top: i * tileSize,
          fill: 'white',
          stroke: 'gray',
          width: tileSize,
          height: tileSize
        });
        
        canvasGrid[i][j] = rect;
        canvas.add(rect);
      }
    }

    canvas.on('mouse:down', function(options) {
      if (options.target) {
        const tFill = options.target.fill;
        console.log(tFill);
        if (tFill == 'white') {
          options.target.set({fill: 'gray'});
        } else {
          options.target.set({fill: 'white'});
        }
      }
      canvas.renderAll();
    });


    const expandContainerHeight = () => {
      container.style.height = (window.innerHeight - 20) + "px";
    };

    const expandCanvas = () => { 
      canvas.setWidth(container.offsetWidth - 2);
      canvas.setHeight(container.offsetHeight - 2);
      canvas.renderAll();
    }

    canvas.on('mouse:down', function(opt) {
      var evt = opt.e;
      console.log(opt.e.which);
      if (evt.altKey === true) {
        this.isDragging = true;
        this.selection = false;
        this.lastPosX = evt.clientX;
        this.lastPosY = evt.clientY;
      }
    });

    canvas.on('mouse:move', function(opt) {
      if (this.isDragging) {
        var e = opt.e;
        this.viewportTransform[4] += e.clientX - this.lastPosX;
        this.viewportTransform[5] += e.clientY - this.lastPosY;
        this.requestRenderAll();
        this.lastPosX = e.clientX;
        this.lastPosY = e.clientY;
      }
    });

    canvas.on('mouse:up', function(opt) {
      this.isDragging = false;
      this.selection = true;
    });

    canvas.on('mouse:wheel', function(opt) {
      var delta = opt.e.deltaY;
      var zoom = canvas.getZoom();
      zoom = zoom - delta / 200;
      if (zoom > 10) zoom = 10;
      if (zoom < 0.5) zoom = 0.5;
      
      canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();
      var vpt = this.viewportTransform;
      
      if (zoom < 400 / 1000) {
        this.viewportTransform[4] = 200 - 1000 * zoom / 2;
        this.viewportTransform[5] = 200 - 1000 * zoom / 2;
      } else {
        if (vpt[4] >= 0) {
          this.viewportTransform[4] = 0;
        } else if (vpt[4] < canvas.getWidth() - 1000 * zoom) {
          this.viewportTransform[4] = canvas.getWidth() - 1000 * zoom;
        }
        if (vpt[5] >= 0) {
          this.viewportTransform[5] = 0;
        } else if (vpt[5] < canvas.getHeight() - 1000 * zoom) {
          this.viewportTransform[5] = canvas.getHeight() - 1000 * zoom;
        }
      }
    });
  }

  render() {
    return (
      <div id="container">
        <canvas id="canvas"/>
      </div>
    );
  }
}

export default Grid;
