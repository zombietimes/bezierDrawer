var ZTIMES = ZTIMES || {};

ZTIMES.GRID = {
  baseX: 20,
  baseY: 15,
  init: function(){
  },
  SetBase: function(bases){
    this.baseX = bases.baseX;
    this.baseY = bases.baseY;
  },
  VerifyShape: function(params){
    const shape = params.shape;
    if(shape === undefined){
      return;
    }
    const layerInfo = this.parseLayer(params);
    this.parseShape(shape);
    this.parseCircle(shape);
    this.parseGridW(shape,layerInfo);
    this.parseGridH(shape,layerInfo);
    this.parseGridX(shape,layerInfo);
    this.parseGridY(shape,layerInfo);
    this.parseOffset(shape);
    this.parseLimit(shape,layerInfo);
  },
  VerifyTarget: function(targets){
    const name = targets.name;
    const shape = targets.target;
    const layer_Link = targets.layer_Link;
    const params = {
      name:name,
      shape:shape,
      layer_Link:layer_Link,
    };
    const layerInfo = this.parseLayer(params);
    this.parseShape(shape);
    this.parseCircle(shape);
    this.parseGridW(shape,layerInfo);
    this.parseGridH(shape,layerInfo);
    this.parseGridX(shape,layerInfo);
    this.parseGridY(shape,layerInfo);
    this.parseOffset(shape);
    this.parseShapeList({
      name:name,
      target:shape,
      layer_Link:layer_Link,
    });
    this.parseLimit(shape,layerInfo);
  },
  parseShapeList: function(targets){
    const it = this;
    if(targets.target.shapeList !== undefined){
      let cnt = 0;
      targets.target.shapeList.map((shape)=>{
        it.VerifyTarget({
          name:targets.name+cnt,
          target:shape,
          layer_Link:targets.layer_Link,
        });
        cnt += 1;
      });
    }
  },
  parseLayer: function(params){
    if(params.layer_Link === undefined){
      const layerMaxW = window.screen.availWidth;
      const layerMaxH = window.screen.availHeight;
      const layerCenterX = parseInt(layerMaxW/2);
      const layerInfo = {
        layerMaxW:layerMaxW,
        layerMaxH:layerMaxH,
        layerCenterX:layerCenterX,
      };
      return layerInfo;
    }
    else{
      const layerMaxW = params.layer_Link.params.shape.w;
      const layerMaxH = params.layer_Link.params.shape.h;
      const layerCenterX = parseInt(layerMaxW/2);
      const layerInfo = {
        layerMaxW:layerMaxW,
        layerMaxH:layerMaxH,
        layerCenterX:layerCenterX,
      };
      return layerInfo;
    }
  },
  parseShape: function(shape){
    shape.x = ZTIMES.LIB.SetValue(0,shape.x);
    shape.y = ZTIMES.LIB.SetValue(0,shape.y);
    shape.w = ZTIMES.LIB.SetValue(0,shape.w);
    shape.h = ZTIMES.LIB.SetValue(0,shape.h);
    shape.r = ZTIMES.LIB.SetValue(0,shape.r);
  },
  parseCircle: function(shape){
    if(shape.radius !== undefined){
      shape.w = shape.radius*2;
      shape.h = shape.radius*2;
      shape.r = shape.radius;
    }
  },
  parseGridW: function(shape,layerInfo){
    if(shape.gridW !== undefined){
      const gridW = shape.gridW;
      if(gridW === '#None'){
        delete shape.gridW;
      }
      else if(gridW === '#Max'){
        shape.w = '#Max';
      }
      else{
        if(gridW < 0){
          console.log('[ERR] parseGridW()');
        }
        shape.w = gridW * this.baseX;
      }
    }
    if(shape.w === '#Default'){
      shape.w = 320;
    }
    else if(shape.w === '#Max'){
      shape.w = layerInfo.layerMaxW;
    }
  },
  parseGridH: function(shape,layerInfo){
    if(shape.gridH !== undefined){
      const gridH = shape.gridH;
      if(gridH === '#None'){
        delete shape.gridH;
      }
      else if(gridH === '#Max'){
        shape.h = '#Max';
      }
      else{
        if(gridH < 0){
          console.log('[ERR] parseGridH()');
        }
        shape.h = gridH * this.baseY;
      }
    }
    if(shape.h === '#Default'){
      shape.h = 480;
    }
    else if(shape.h === '#Max'){
      shape.h = layerInfo.layerMaxH;
    }
  },
  parseGridX: function(shape,layerInfo){
    if(shape.gridX !== undefined){
      const gridX = shape.gridX;
      if(gridX === '#None'){
        delete shape.gridX;
      }
      else if(gridX === '#Center'){
        shape.x = layerInfo.layerCenterX - shape.w/2;
      }
      else if(gridX === '#Left'){
        shape.x = 0;
      }
      else if(gridX === '#Right'){
        shape.x = layerInfo.layerMaxW;
      }
      else{
        shape.x = gridX * this.baseX + layerInfo.layerCenterX;
      }
    }
  },
  parseGridY: function(shape,layerInfo){
    if(shape.gridY !== undefined){
      const gridY = shape.gridY;
      if(gridY === '#None'){
        delete shape.gridY;
      }
      else{
        if(gridY < 0){
          console.log('[ERR] parseGridY()');
        }
        else if(gridY === '#Next'){
        }
        else{
          shape.y = gridY * this.baseY;
        }
      }
    }
  },
  parseOffset: function(shape){
    if(shape.offsetX !== undefined){
      shape.x += shape.offsetX;
    }
    if(shape.offsetY !== undefined){
      shape.y += shape.offsetY;
    }
    if(shape.offsetW !== undefined){
      shape.w += shape.offsetW;
    }
    if(shape.offsetH !== undefined){
      shape.h += shape.offsetH;
    }
  },
  parseLimit: function(shape,layerInfo){
    if(shape.x < 0){shape.x = 0;}
    if(shape.y < 0){shape.y = 0;}
    if(shape.w < 0){shape.w = 0;}
    if(shape.h < 0){shape.h = 0;}
    if(shape.w > layerInfo.layerMaxW){shape.w = layerInfo.layerMaxW;}
    if(shape.h > layerInfo.layerMaxH){shape.h = layerInfo.layerMaxH;}
  },
  LogOut: function(params){
    const parent = params.parent_Link;
    const name = params.name;
    const shape = params.shape;
    if(shape !== undefined){
      const logText = '['+name+'] x:'+shape.x +' y:'+shape.y +' w:'+shape.w +' h:'+shape.h;
      if(parent === undefined){
        console.log(logText);
      }
      else{
        console.log('-['+parent.params.name+']' + logText);
      }
    }
  },
}
ZTIMES.SCREEN = {
  DEF:{
    DomRootName:'iCanvasRoot',
    GridBaseX:20,
    GridBaseY:15,
  },
  domRoot: undefined,
  init: function(){
    ZTIMES.GRID.SetBase({
      baseX:ZTIMES.SCREEN.DEF.GridBaseX,
      baseY:ZTIMES.SCREEN.DEF.GridBaseY,
    });
    this.domRoot = document.getElementById(ZTIMES.SCREEN.DEF.DomRootName);
    this.createPrimitive();
  },
  test: function(){
  },
  debug: {},
  DebugSetStructObj: function(nameList,func){
    this.debug.nameList = nameList;
    this.debug.func = func;
  },
  DebugCheckStructObj: function(name){
    const nameList = this.debug.nameList.length;
    for(let cnt=0;cnt<nameList;cnt+=1){
      if(this.debug.nameList[cnt] === name){
        return this.debug.func(name);
      }
    }
    return undefined;
  },
  createPrimitive: function(){
    ZTIMES.SCREEN.Layer = ZTIMES.SCREEN.AddStruct({
      name:'Layer',
      primitiveKind:'#Layer',
      zIndex:1,
      shape:{
        x:0,y:0,w:'#Max',h:'#Max',
        offsetY:0,
        offsetH:0,
      },
      ctx:undefined,
      pressedEvents:{},
    });
    ZTIMES.SCREEN.Element = ZTIMES.SCREEN.AddStruct({
      name:'Element',
      primitiveKind:'#Element',
      shape:{
        r:0,
        offsetX:0,
        offsetY:0,
        offsetW:0,
        offsetH:0,
      },
      colors:{},
      path2D:undefined,
      isOnEvent:false,
    });
    ZTIMES.SCREEN.DomNode = ZTIMES.SCREEN.AddStruct({
      name:'DomNode',
      primitiveKind:'#DomNode',
      zIndex:1,
      shape:{
        gridW:10,gridH:2,
        r:0,
      },
    });
  },
  structObjs: {},
  AddStruct: function(params){
    params.structObjKind = '#Struct';
    return this.addStructObj(params);
  },
  AddObj: function(params){
    params.structObjKind = '#Obj';
    return this.addStructObj(params);
  },
  addStructObj: function(params){
    const structObj = new this.STRUCTOBJ(params);
    this.structObjs[params.name] = structObj;
    return structObj;
  },
  GetStructObj: function(name){
    const structObj = this.structObjs[name];
    return structObj;
  },
  GetSibling: function(self,siblingName){
    const parent = self.params.parent_Link;
    const siblings = parent.params.children;
    for(let [key,value] of Object.entries(siblings)){
      if(key === siblingName){
        const fullName = value.name;
        const structObj = ZTIMES.SCREEN.GetStructObj(fullName);
        return structObj;
      }
    }
    return undefined;
  },
  STRUCTOBJ: function(params){
    this.params = {};
    this.init(params);
  },
  SetDomVisible: function(name,visible){
    const structObj = this.GetStructObj(name);
    if(structObj.params.primitiveKind === '#Element'){
      ZTIMES.SCREEN.ELEMENT.setDomVisible(structObj,visible);
    }
    else{
      ZTIMES.SCREEN.LAYER.setDomVisibleR(structObj,visible);
    }
  },
  LAYER: {
    //@ layer on root or layer : not on element
    CreateDom: function(self){
      const params = self.params;
      if(params.structObjKind === '#Struct'){}
      else if(params.structObjKind === '#Obj'){
        params.dom = document.createElement('canvas');
        params.dom.id = params.name;
        params.dom.style.zIndex = params.zIndex;
        params.dom.style.position = 'absolute';
        params.dom.style.left = ZTIMES.LIB.ToPx(params.shape.x);
        params.dom.style.top = ZTIMES.LIB.ToPx(params.shape.y);
        params.dom.width = params.shape.w;
        params.dom.height = params.shape.h;
        params.ctx = params.dom.getContext('2d');
        params.dom.style.visibility = 'hidden';
        ZTIMES.SCREEN.domRoot.appendChild(params.dom);
      }
    },
    Show: function(self){
      const params = self.params;
      if(params.structObjKind === '#Struct'){}
      else if(params.structObjKind === '#Obj'){
        this.showBackground(self);
      }
    },
    showBackground: function(self){
      const params = self.params;
      if(
        (params.colors === undefined)||
        (params.colors.background === undefined)
      ){
        return;
      }
      const ctx = params.ctx;
      if(params.colors.globalAlpha !== undefined){
        ctx.globalAlpha = params.colors.globalAlpha;
      }
      ctx.fillStyle = params.colors.background;
      ctx.fillRect(0,0,params.dom.width,params.dom.height);
      if(ctx.globalAlpha !== 1){
        ctx.globalAlpha = 1;
      }
    },
    setDomVisibleR: function(structObjLayer,visible){
      if((structObjLayer.params.primitiveKind === '#Layer')||
         (structObjLayer.params.primitiveKind === '#DomNode')){
        this.setDomVisible(structObjLayer,visible);
        const children = structObjLayer.params.children;
        if(children !== undefined){
          for(let [key,value] of Object.entries(children)){
            const childName = value.name;
            const structObjChildLayer = ZTIMES.SCREEN.GetStructObj(childName);
            this.setDomVisibleR(structObjChildLayer,visible);
          }
        }
      }
    },
    setDomVisible: function(structObjLayer,visible){
      const params = structObjLayer.params;
      if(params.dom !== undefined){
        params.visible = visible;
        if(visible === '#Hide'){
          params.dom.style.visibility = 'hidden';
        }
        else{
          params.dom.style.visibility = 'visible';
        }
      }
    },
    CreateEvent: function(self){
      const it = this;
      const params = self.params;
      const layerName = params.name;
      ZTIMES.LIB.EVENT.AddEventPressed(params.dom,function(eventInfo){
        const eventKind = eventInfo.type;
        if(eventKind === 'mouseup'){
          const coodinates = {};
          coodinates.x = eventInfo.offsetX;
          coodinates.y = eventInfo.offsetY;
          it.onPressedEvent(layerName,eventKind,coodinates);
        }
        else if(eventKind === 'touchend'){
          const touches = eventInfo.changedTouches;
          const touchesLen = touches.length;
          if(touchesLen > 0){
            const indelastX = touchesLen - 1;
            const rect = params.dom.getBoundingClientRect();
            const coodinates = {};
            coodinates.x = eventInfo.changedTouches[0].clientX - rect.left;
            coodinates.y = eventInfo.changedTouches[0].clientY - rect.top;
            it.onPressedEvent(layerName,eventKind,coodinates);
          }
        }
      });
    },
    onPressedEvent: function(layerName,eventKind,coodinates){
      const structObjLayer = ZTIMES.SCREEN.GetStructObj(layerName);
      const params = structObjLayer.params;
      Object.values(params.pressedEvents).forEach((pressedEvent)=>{
        const structObjElement = pressedEvent.element_Link;
        const beginX = structObjElement.params.shape.x;
        const beginY = structObjElement.params.shape.y;
        const endX = beginX + structObjElement.params.shape.w;
        const endY = beginY + structObjElement.params.shape.h;
        // console.log('*['+layerName+'] '+ '#Pressed('+eventKind+') x:' + coodinates.x + ' y:' + coodinates.y);
        if(structObjElement.params.isOnEvent === false){
          if(params.ctx.isPointInPath(structObjElement.params.path2D,coodinates.x,coodinates.y) === true){
            const elementName = structObjElement.params.name;
            console.log('['+elementName+'] '+ '#Pressed('+eventKind+') x:' + coodinates.x + ' y:' + coodinates.y);
            ZTIMES.SCREEN.DebugCheckStructObj(structObjElement.params.name);
            structObjElement.notifyEvent({
              eventKind:'#Pressed',
              coodinates:coodinates,
            });
          }
        }
      });
    },
    AddPressedEvent: function(structObjElement){
      if(structObjElement.params.events !== undefined){
        const eventHandler = structObjElement.params.events['#Pressed'];
        if(eventHandler !== undefined){
          const structObjLayer = structObjElement.params.layer_Link;
          const name = structObjElement.params.name;
          if(structObjLayer.params.pressedEvents[name] === undefined){
            structObjLayer.params.pressedEvents[name] = {
              element_Link:structObjElement,
            };
          }
          else{
            console.log("Duplicated name.");
          }
        }
      }
    },
    RemovePressedEvent: function(structObjElement){
      const structObjLayer = structObjElement.params.layer_Link;
      const name = structObjElement.params.name;
      if(structObjLayer.params.pressedEvents[name] === undefined){
        console.log("No name.");
      }
      else{
        delete structObjLayer.params.pressedEvents[name];
      }
    },
  },
  ELEMENT: {
    Create: function(self){
      //@ element on layer : not on element or root
      ZTIMES.SCREEN.LAYER.AddPressedEvent(self);
      if(self.params.structObjKind === '#Obj'){
        const svgs = self.params.shape.svgs;
        if(svgs !== undefined){
          const svgPath = svgs.region.svgPath;
          self.params.path2D = new Path2D(svgPath);
        }
        else {
          this.createPath2D(self);
        }
      }
    },
    GetLayer: function(self){
      const structObjParent = self.params.parent_Link;
      if(structObjParent !== undefined){
        const primitiveKind = structObjParent.params.primitiveKind;
        if(primitiveKind === '#Layer'){
          return structObjParent;
        }
        return this.GetLayer(structObjParent);
      }
    },
    createPath2D: function(self){
      self.params.path2D = new Path2D();
      const shape = self.params.shape;
      const x = shape.x;
      const y = shape.y;
      const w = shape.w;
      const h = shape.h;
      const r = ZTIMES.LIB.SetValue(0,shape.r);
      // Background
      self.params.path2D.moveTo(x, y+r);
      self.params.path2D.lineTo(x, y+h-r);
      self.params.path2D.arcTo(x, y+h, x+r, y+h, r);
      self.params.path2D.lineTo(x+w-r, y+h);
      self.params.path2D.arcTo(x+w, y+h, x+w, y+h-r, r);
      self.params.path2D.lineTo(x+w, y+r);
      self.params.path2D.arcTo(x+w, y, x+w-r, y, r);
      self.params.path2D.lineTo(x+r, y);
      self.params.path2D.arcTo(x, y, x, y+r, r);
      self.params.path2D.closePath();
    },
    Redraw: function(self){
      this.erase(self);
      this.Show(self);
    },
    setDomVisible: function(self,visible){
      if(self.params.visible === visible){
        return;
      }
      self.params.visible = visible;
      if(self.params.visible === '#Hide'){
        this.erase(self);
      }
      else{
        this.Show(self);
      }
    },
    Erase: function(layer,shape){
      const ctx = layer.params.ctx;
      ctx.clearRect(
        shape.x,
        shape.y,
        shape.w,
        shape.h
      );
    },
    erase: function(self){
      const structObjLayer = self.params.layer_Link;
      const ctx = structObjLayer.params.ctx;
      ctx.clearRect(
        self.params.shape.x,
        self.params.shape.y,
        self.params.shape.w,
        self.params.shape.h
      );
    },
    Show: function(self){
      if(self.params.shape.svgs !== undefined){
        this.showSvgs(self);
      }
      else if(self.params.shape.images !== undefined){
        this.showImage(self);
      }
      else{
        this.fillBackground(self);
        this.showText(self);
      }
    },
    showSvgs: function(self){
      const svgs = self.params.shape.svgs;
      const structObjLayer = self.params.layer_Link;
      if(structObjLayer !== undefined){
        const ctx = structObjLayer.params.ctx;
        for(let [key,value] of Object.entries(svgs)){
          if(value.showKind === '#Fill'){
            const orgFillStyle = ctx.fillStyle;
            ctx.fillStyle = value.color;
            const path2D = new Path2D(value.svgPath);
            ctx.fill(path2D);
            ctx.fillStyle = orgFillStyle;
          }
          else if(value.showKind === '#Stroke'){
            const orgStrokeStyle = ctx.strokeStyle;
            ctx.strokeStyle = value.color;
            const path2D = new Path2D(value.svgPath);
            ctx.stroke(path2D);
            ctx.strokeStyle = orgStrokeStyle;
          }
        }
      }
    },
    showImage: function(self){
      const structObjLayer = self.params.layer_Link;
      if(structObjLayer !== undefined){
        const it = this;
        const ctx = structObjLayer.params.ctx;
        const shape = self.params.shape;
        const images = self.params.shape.images;
        const elImage = new Image();
        elImage.src = images.src;
        elImage.onload = function(){
          if(images.scalePercent !== undefined){
            const fullW = shape.w;
            const fullH = shape.h;
            shape.w = elImage.width * images.scalePercent / 100;
            shape.h = elImage.height * images.scalePercent / 100;
            shape.x -= (shape.w-fullW)>0 ? (shape.w-fullW)/2 : 0;
            shape.y -= (shape.h-fullH)>0 ? (shape.h-fullH)/2 : 0;
          }
          else{
            if(images.scaleFullW === true){
              const scaleRate = elImage.width / shape.w;
              const fullH = shape.h;
              shape.h = elImage.height / scaleRate;
              shape.y += (fullH-shape.h)>0 ? (fullH-shape.h)/2 : 0;
            }
            if(images.scaleFullH === true){
              const scaleRate = elImage.height / shape.h;
              const fullW = shape.w;
              shape.w = elImage.width / scaleRate;
              shape.x += (fullW-shape.w)>0 ? (fullW-shape.w)/2 : 0;
            }
          }
          ctx.drawImage(elImage,shape.x,shape.y,shape.w,shape.h);
        };
      }
    },
    fillBackground: function(self,kind){
      if(self.params.colors === '#Transparent'){
        this.fillTransparent(self);
      }
      else if(self.params.colors === undefined){
        this.fillTransparent(self);
      }
      else{
        if(self.params.colors.background === undefined){
          this.fillTransparent(self);
        }
        else{
          if(kind === '#Pressed'){
            if(self.params.colors.pressedBackground === undefined){
              this.fillTransparent(self);
            }
            else{
              this.fill(self);
            }
          }
          else{
            this.fill(self);
          }
        }
      }
    },
    fillTransparent: function(self){
      const structObjLayer = self.params.layer_Link;
      if(structObjLayer !== undefined){
        const ctx = structObjLayer.params.ctx;
        ctx.globalAlpha = 0;
        ctx.fill(self.params.path2D);
        ctx.globalAlpha = 1;
      }
    },
    fill: function(self){
      const structObjLayer = self.params.layer_Link;
      if(structObjLayer !== undefined){
        const ctx = structObjLayer.params.ctx;
        const params = self.params;
        if(params.colors.globalAlpha !== undefined){
          ctx.globalAlpha = params.colors.globalAlpha;
        }
        const orgFillStyle = ctx.fillStyle;
        ctx.fillStyle = params.colors.background;
        ctx.fill(params.path2D);
        ctx.fillStyle = orgFillStyle;
        if(ctx.globalAlpha !== 1){
          ctx.globalAlpha = 1;
        }
      }
    },
    showText: function(self){
      if(self.params.text === undefined){
        return;
      }
      if(self.params.textDirection === '#Vertical'){
        this.showTextVertical(self);
      }
      else{
        this.showTextHorizonLR(self);
      }
    },
    ShowTextHorizonLR: function(targets){
      const layer_Link = targets.layer_Link;
      const shape = targets.shape;
      const font = targets.font;
      const fontColor = targets.fontColor;
      const text = targets.text;
      const structObjLayer = layer_Link;
      const ctx = structObjLayer.params.ctx;
      ctx.font = ZTIMES.LIB.SetValue('16px Times New Roman',font);
      const orgFillStyle = ctx.fillStyle;
      ctx.fillStyle = ZTIMES.LIB.SetValue('Black',fontColor);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const offsetY = 2;
      ctx.fillText(text, shape.x+shape.w/2, shape.y+shape.h/2+offsetY);
      ctx.fillStyle = orgFillStyle;
    },
    showTextHorizonLR: function(self){
      const structObjLayer = self.params.layer_Link;
      const ctx = structObjLayer.params.ctx;
      const params = self.params;
      const shape = self.params.shape;
      ctx.font = ZTIMES.LIB.SetValue('16px Times New Roman',params.font);
      const orgFillStyle = ctx.fillStyle;
      ctx.fillStyle = ZTIMES.LIB.SetValue('Black',params.colors.font);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const offsetY = 2;
      ctx.fillText(params.text, shape.x+shape.w/2, shape.y+shape.h/2+offsetY);
      ctx.fillStyle = orgFillStyle;
    },
    showTextVertical: function(self){
      const structObjLayer = self.params.layer_Link;
      const ctx = structObjLayer.params.ctx;
      const params = self.params;
      const shape = self.params.shape;
      ctx.font = ZTIMES.LIB.SetValue('16px Times New Roman', params.font);
      const orgFillStyle = ctx.fillStyle;
      ctx.fillStyle = ZTIMES.LIB.SetValue('Black',params.colors.font);
      const startX = shape.x + shape.w;
      const startY = shape.y;
      const baseChar = shape.text[0];
      const lineList = shape.text.split('\n');
      const charSize = ctx.measureText(baseChar).width;
      const charSpaceW = charSize * 0.5;
      const charSpaceH = charSize * 0.3;
      lineList.forEach((lineText,clm) => {
        Array.prototype.forEach.call(lineText,function(char,row) {
          const x = startX - (charSize + charSpaceW) * (clm + 1);
          const y = startY + (charSize + charSpaceH) * (row + 1);
          ctx.fillText(char,x,y);
        });
      });
      ctx.fillStyle = orgFillStyle;
    },
  },
  DOMLAYER: {
    getDomParent: function(self){
      const params = self.params;
      const structObjParent = params.parent_Link;
      if(structObjParent === undefined){
        return ZTIMES.SCREEN.domRoot;
      }
      else{
        if(structObjParent.params.primitiveKind === '#Layer'){
          return ZTIMES.SCREEN.domRoot;
        }
        else{
          return structObjParent.params.dom;
        }
      }
    },
    CreateDom: function(self){
      const params = self.params;
      const doms = params.doms;
      if(params.structObjKind === '#Struct'){}
      else if(params.structObjKind === '#Obj'){
        const domParent = this.getDomParent(self);
        if(doms === undefined){
          params.dom = document.createElement('div');
          params.dom.id = params.name;
          params.dom.style.zIndex = params.zIndex;
          params.dom.style.position = 'absolute';
          params.dom.style.left = ZTIMES.LIB.ToPx(params.shape.x);
          params.dom.style.top = ZTIMES.LIB.ToPx(params.shape.y);
          params.dom.width = params.shape.w;
          params.dom.height = params.shape.h;
          domParent.appendChild(params.dom);
        }
        else{
          const tag = doms.tag;
          params.dom = document.createElement(tag);
          const attrs = doms.attrs;
          for(let [key,value] of Object.entries(attrs)){
            params.dom.setAttribute(key,value);
          }
          params.dom.id = params.name;
          params.dom.style.position = 'relative';
          params.dom.style.left = ZTIMES.LIB.ToPx(params.shape.x);
          params.dom.style.top = ZTIMES.LIB.ToPx(params.shape.y);
          domParent.appendChild(params.dom);
          const isLineBreak = doms.isLineBreak;
          if(isLineBreak === true){
            const domBr = document.createElement('br');
            domParent.appendChild(domBr);
          }
        }
      }
    },
  },
};
ZTIMES.SCREEN.STRUCTOBJ.prototype = {
  init: function(params){
    ZTIMES.SCREEN.DebugCheckStructObj(params.name);
    this.params = this.mergeParams(params);
    this.initParams();
    this.setup();if(this.params.inInvalid){return;};
    this.addChildren();
    this.addParents();
  },
  mergeParams: function(params){
    let paramsTemp = {};
    if(params.merge_Link !== undefined){
      paramsTemp = ZTIMES.LIB.Override({
        base:paramsTemp,
        addition:params.merge_Link.params,
      });
    }
    if(params.mergeList_Link !== undefined){
      params.mergeList_Link.map((merge_Link)=>{
        paramsTemp = ZTIMES.LIB.Override({
          base:paramsTemp,
          addition:merge_Link.params,
        });
      });
    }
    const paramsOut = ZTIMES.LIB.Override({
      base:paramsTemp,
      addition:params,
    });
    if(paramsOut.merge_Link !== undefined){
      delete paramsOut.merge_Link;
    }
    if(paramsOut.mergeList_Link !== undefined){
      delete paramsOut.mergeList_Link;
    }
    return paramsOut;
  },
  initParams: function(){
    this.setLayer_Link();
    ZTIMES.GRID.VerifyShape(this.params);
  },
  setLayer_Link: function(){
    if(this.params.primitiveKind === '#Element'){
      const structObjLayer = ZTIMES.SCREEN.ELEMENT.GetLayer(this);
      if(structObjLayer !== undefined){
        this.params.layer_Link = structObjLayer;
      }
    }
  },
  setup: function(){
    if(this.params.structObjKind === '#Obj'){
      this.notifyEvent({eventKind:'#Setup'});if(this.params.inInvalid){return;};
      this.notifyEvent({eventKind:'#Setup2'});if(this.params.inInvalid){return;};
      this.notifyEvent({eventKind:'#Setup3'});if(this.params.inInvalid){return;};
    }
    const self = this;
    const primitiveKind = this.params.primitiveKind;
    const structObjKind = this.params.structObjKind;
    if(structObjKind === '#Obj'){
      if(primitiveKind === '#Layer'){
        this.setupLayerObj(self);
      }
      else if(primitiveKind === '#Element'){
        this.setupElementObj(self);
      }
      else if(primitiveKind === '#DomNode'){
        this.setupDomNodeObj(self);
      }
    }
    ZTIMES.GRID.LogOut(this.params);
  },
  notifyEvent: function(commands){
    const eventKind = commands.eventKind;
    const events = this.params.events;
    if(events !== undefined){
      const func = events[eventKind];
      if(func !== undefined){
        func(this,commands);
      }
    }
  },
  setupLayerObj: function(self){
    this.setLayerOffset(self);
    ZTIMES.SCREEN.LAYER.CreateDom(self);
    ZTIMES.SCREEN.LAYER.CreateEvent(self);
    self.params.visible = this.getParentVisibleR(self);
    ZTIMES.SCREEN.LAYER.setDomVisible(this,this.params.visible);
    if(self.params.showKind === '#Original'){
      ;
    }
    else{
      ZTIMES.SCREEN.LAYER.Show(self);
    }
  },
  setupElementObj: function(self){
    ZTIMES.SCREEN.ELEMENT.Create(self);
    if(self.params.showKind === '#Original'){
      ;
    }
    else{
      if(this.params.visible === '#Hide'){
        ZTIMES.SCREEN.ELEMENT.erase(self);
      }
      else{
        ZTIMES.SCREEN.ELEMENT.Show(self);
      }
    }
  },
  setupDomNodeObj: function(self){
    this.setLayerOffset(self);
    ZTIMES.SCREEN.DOMLAYER.CreateDom(self);
    self.params.visible = this.getParentVisibleR(self);
    ZTIMES.SCREEN.LAYER.setDomVisible(self,self.params.visible);
  },
  setLayerOffset: function(self){
    const structObjParent = self.params.parent_Link;
    if(structObjParent !== undefined){
      const primitiveKind = structObjParent.params.primitiveKind;
      if(primitiveKind === '#Layer'){
        const paramsParent = structObjParent.params;
        const paramsSelf = self.params;
        if((paramsParent.shape === undefined)||
           (paramsSelf.shape === undefined)){
          return;
        }
        paramsSelf.shape.x += paramsParent.shape.x;
        paramsSelf.shape.y += paramsParent.shape.y;
      }
    }
  },
  getParentVisibleR: function(self){
    if(self.params.visible === undefined){
      const structObjParent = self.params.parent_Link;
      if(structObjParent === undefined){
        return '#Show';
      }
      else{
        return this.getParentVisibleR(structObjParent);
      }
    }
    else{
      return self.params.visible;
    }
  },
  addChildren: function(){
    const children = this.params.children;
    if(children !== undefined){
      const name = this.params.name;
      const structObjKind = this.params.structObjKind;
      const zIndex = this.params.zIndex;
      for(let [key,value] of Object.entries(children)){
        const childName = name+' '+key;
        value.name = childName;
        value.structObjKind = structObjKind;
        value.parent_Link = this;
        value.zIndex = zIndex+1;
        ZTIMES.SCREEN.addStructObj(value);
      }
    }
  },
  addParents: function(){
    const structObjChild = this.params.child_Link;
    if(structObjChild !== undefined){
      const parentName = this.params.name;
      structObjChild.params.parents = ZTIMES.LIB.SetValue({},structObjChild.params.parents);
      structObjChild.params.parents[parentName] = {
        parent_Link:this,
      };
    }
  },
  Redraw: function(){
    const self = this;
    if(self.params.primitiveKind === '#Element'){
      if(self.params.showKind === '#Original'){
        ;
      }
      else{
        if(self.params.path2D === undefined){
          this.setup();if(self.params.inInvalid){return;};
          this.addChildren();
          this.addParents();
        }
      }
    }
    this.notifyEvent({eventKind:'#Redraw'});
    if(self.params.primitiveKind === '#Element'){
      if(self.params.showKind === '#Original'){
        ;
      }
      else{
        ZTIMES.SCREEN.ELEMENT.Redraw(self);
      }
    }
  },
};
