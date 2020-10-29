var ZTIMES = ZTIMES || {};

ZTIMES.DRAWER = {
  dotKind: undefined,
  dots: {'S':undefined,'E':undefined,'A':undefined,'B':undefined},
  isLoaded: false,
  isAutoNext: true,
  isDrawn: false,
  curveList: [],
  dataListList: [],
  matrixData: [],
  init: function(){
  },
  test: function(){
  },
  Setup: function(){
    this.getMatrixData();
    this.loadCurveList();
    this.InitDotAll();
    this.setupImageArea();
  },
  setupImageArea: function(){
    const areaDraw = ZTIMES.SCREEN.GetStructObj('areaDraw');
    const shapeAreaDraw = areaDraw.params.shape;
    const domImage = document.getElementById("iImage");
    domImage.style.left = ZTIMES.LIB.ToPx(shapeAreaDraw.x);
    domImage.style.top = ZTIMES.LIB.ToPx(shapeAreaDraw.y);
  },
  ShowImage: function(input){
    // ZTIMES.SECRETDB.ShowImage(input);
    const file = input.files[0];
    const domImage = document.getElementById("iImage");
    if(file === undefined){
      domImage.src = "";
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function() {
      const blobURL = reader.result;
      domImage.src = blobURL;
    };
    reader.onerror = function() {
      console.log(reader.error);
    };
  },
  InitDotAll: function(){
    const layerTrace = ZTIMES.SCREEN.GetStructObj('layerTrace');
    if(this.isDrawn === false){
      this.eraseDotAll(layerTrace);
    }
    else{
      this.dots['S'] = undefined;
      this.dots['E'] = undefined;
      this.eraseDot(layerTrace,'A');
      this.eraseDot(layerTrace,'B');
    }
    this.isAutoNext = true;
    this.SelectDotKind('S');
    this.isDrawn = false;
  },
  SetDot: function(x,y){
    if(this.dotKind === 'S'){
      this.InitDotAll();
    }
    this.drawDot(x,y);
  },
  eraseDotAll: function(layerTrace){
    this.eraseDot(layerTrace,'S');
    this.eraseDot(layerTrace,'E');
    this.eraseDot(layerTrace,'A');
    this.eraseDot(layerTrace,'B');
  },
  eraseDot: function(layerTrace,dotKind){
    const dot = this.dots[dotKind];
    if(dot !== undefined){
      ZTIMES.BUILTIN.DOT.EraseDot(layerTrace,dot.x,dot.y);
      this.dots[dotKind] = undefined;
    }
  },
  drawDot: function(x,y){
    const layerTrace = ZTIMES.SCREEN.GetStructObj('layerTrace');
    if(this.dotKind === 'S'){
      this.dots[this.dotKind] = {x:x,y:y};
      ZTIMES.BUILTIN.DOT.ShowDot(layerTrace,'Green',x,y);
      if(this.isAutoNext === true){
        this.SelectDotKind('E');
      }
    }
    else if(this.dotKind === 'E'){
      this.dots[this.dotKind] = {x:x,y:y};
      ZTIMES.BUILTIN.DOT.ShowDot(layerTrace,'Green',x,y);
      if(this.isAutoNext === true){
        this.SelectDotKind('A');
      }
    }
    else if(this.dotKind === 'A'){
      this.dots[this.dotKind] = {x:x,y:y};
      ZTIMES.BUILTIN.DOT.ShowDot(layerTrace,'Blue',x,y);
      if(this.isAutoNext === true){
        this.SelectDotKind('B');
      }
    }
    else if(this.dotKind === 'B'){
      this.dots[this.dotKind] = {x:x,y:y};
      ZTIMES.BUILTIN.DOT.ShowDot(layerTrace,'Blue',x,y);
      if(this.isAutoNext === true){
        this.SelectDotKind('S');
      }
    }
  },
  SelectDotKind: function(dotKind){
    const oldDotKind = this.dotKind;
    if(oldDotKind === dotKind){
      return;
    }
    const layerTrace = ZTIMES.SCREEN.GetStructObj('layerTrace');
    this.focusBtnDot(layerTrace,dotKind);
    this.unFocusBtnDot(layerTrace,oldDotKind);
    this.dotKind = dotKind;
  },
  focusBtnDot: function(layer,dotKind){
    if(dotKind === undefined){
      return;
    }
    const btnDotName = 'layerUI btnDot'+dotKind;
    const btnDot =ZTIMES.SCREEN.GetStructObj(btnDotName);
    const shape = btnDot.params.shape;
    const centerX = shape.x+shape.w/2;
    const centerY = shape.y+shape.h/2;
    const radius = 13;
    ZTIMES.BUILTIN.CIRCLE.ShowCircleStroke(layer,'Green',centerX,centerY,radius);
  },
  unFocusBtnDot: function(layer,dotKind){
    if(dotKind === undefined){
      return;
    }
    const btnDotName = 'layerUI btnDot'+dotKind;
    const btnDot =ZTIMES.SCREEN.GetStructObj(btnDotName);
    const shape = btnDot.params.shape;
    const centerX = shape.x+shape.w/2;
    const centerY = shape.y+shape.h/2;
    const radius = 13;
    ZTIMES.BUILTIN.CIRCLE.EraseCircle(layer,centerX,centerY,radius);
  },
  MoveDotEtoS: function(){
    const dotE = this.dots['E'];
    this.InitDotAll();
    this.dots['S'] = dotE;
    ZTIMES.DRAWER.SelectDotKind('E');
  },
  DrawCurve: function(){
    const layerTrace = ZTIMES.SCREEN.GetStructObj('layerTrace');
    const dotS = this.dots['S'];
    const dotE = this.dots['E'];
    const dotA = this.dots['A'];
    const dotB = this.dots['B'];
    ZTIMES.BUILTIN.CURVE.ShowCurve(layerTrace,'Green',dotS,dotE,dotA,dotB);
    this.isDrawn = true;
    this.saveCurve(dotS,dotE,dotA,dotB);
  },
  loadCurveList: function(){
    const it = this;
    const that = ZTIMES.SECRETDB;
    that.loadSecret(that).then(()=>{
      that.loadDatabase(that).then((dbListLen)=>{
        console.log(that.dbCaches);
        if(dbListLen !== 0){
          it.fromDB().then(()=>{
            it.showCurveList();
          });
        }
        it.isLoaded = true;
      });
    });
  },
  saveCurve: function(dotS,dotE,dotA,dotB){
    if((dotS === undefined)||(dotE === undefined)){
      return;
    }
    const curve = {
     'S':{x:dotS.x ,y:dotS.y},
     'E':{x:dotE.x ,y:dotE.y},
    }
    if(dotA !== undefined){
      curve['A'] = {x:dotA.x ,y:dotA.y};
    }
    if(dotB !== undefined){
      curve['B'] = {x:dotB.x ,y:dotB.y};
    }
    const index = this.curveList.push(curve);
    this.setMatrixData(index,curve);
    this.updateMatrixData();
    if(this.isLoaded === true){
      this.toDB(index,curve).then();
    }
    else{
      console.log('Failed to save it to the indexedDB.');
    }
  },
  toDB: function(index,curve){
    const content = JSON.stringify(curve);
    const record0 = {recordKey:index, content:content};
    const params = {
      dbName:'/Ether0/BezierCurve',
      version:1,
      tables:{
        // tableName : recordList
        '/Ether0/BezierCurve/CurveList':[record0],
      },
    };
    const that = ZTIMES.SECRETDB;
    const promise = that.StoreDatabase(that,params);
    return promise;
  },
  fromDB: function(){
    const it = this;
    const dbName = '/Ether0/BezierCurve';
    const tableName = '/Ether0/BezierCurve/CurveList';
    const that = ZTIMES.SECRETDB;
    const promise = that.GetRecordList(dbName,tableName).then((recordList)=>{
      // console.log(recordList);
      const recordListLen = recordList.length;
      for(let cnt=0;cnt<recordListLen;cnt+=1){
        const record = recordList[cnt];
        const curve = JSON.parse(record.content);
        it.curveList.push(curve);
        const index = cnt+1;
        it.setMatrixData(index,curve);
      }
      it.updateMatrixData();
    });
    return promise;
  },
  getMatrixData: function(){
    const matrixCurve = ZTIMES.SCREEN.GetStructObj('layerMenu tableCurve matrix');
    this.matrixData = matrixCurve.params.rows.dataListList;
  },
  setMatrixData: function(index,curve){
    const thumbnail = curve.S.x+':'+curve.S.y +' '+curve.E.x+':'+curve.E.y +' ...';
    this.matrixData.unshift([index,thumbnail]);
  },
  updateMatrixData: function(){
    const matrixCurve = ZTIMES.SCREEN.GetStructObj('layerMenu tableCurve matrix');
    matrixCurve.params.reset(matrixCurve);
  },
  showCurveList: function(){
    const it = this;
    const layerTrace = ZTIMES.SCREEN.GetStructObj('layerTrace');
    this.curveList.map((curve)=>{
      const dotS = curve['S'];
      const dotE = curve['E'];
      const dotA = curve['A'];
      const dotB = curve['B'];
      if((dotA !== undefined)&&(dotB !== undefined)){
        console.log('<Bezier3>' +
          ' S:' + dotS.x + ':' + dotS.y +
          ' E:' + dotE.x + ':' + dotE.y +
          ' A:' + dotA.x + ':' + dotA.y +
          ' B:' + dotB.x + ':' + dotB.y
        );
      }
      else if((dotA !== undefined)&&(dotB === undefined)){
        console.log('<Bezier2>' +
          ' S:' + dotS.x + ':' + dotS.y +
          ' E:' + dotE.x + ':' + dotE.y +
          ' A:' + dotA.x + ':' + dotA.y
        );
      }
      else if((dotA === undefined)&&(dotB !== undefined)){
        console.log('<Bezier2>' +
          ' S:' + dotS.x + ':' + dotS.y +
          ' E:' + dotE.x + ':' + dotE.y +
          ' B:' + dotB.x + ':' + dotB.y
        );
      }
      else if((dotA === undefined)&&(dotB === undefined)){
        console.log('<Line>' +
          ' S:' + dotS.x + ':' + dotS.y +
          ' E:' + dotE.x + ':' + dotE.y
        );
      }
      ZTIMES.BUILTIN.CURVE.ShowCurve(layerTrace,'Green',dotS,dotE,dotA,dotB);
    });
  },
  GetCurve: function(index){
    const curveListLen = this.curveList.length;
    const cnt = curveListLen-index-1;
    const curve = this.curveList[cnt];
    return curve;
  },
  RemoveCurve: function(index){
    const layerUI = ZTIMES.SCREEN.GetStructObj('layerUI');
    const layerTrace = ZTIMES.SCREEN.GetStructObj('layerTrace');
    const areaDraw = ZTIMES.SCREEN.GetStructObj('areaDraw');
    const shapeAreaDraw = areaDraw.params.shape;
    ZTIMES.BUILTIN.RECT.EraseArea(layerUI,shapeAreaDraw.x,shapeAreaDraw.y,shapeAreaDraw.w,shapeAreaDraw.h);
    ZTIMES.BUILTIN.RECT.EraseArea(layerTrace,shapeAreaDraw.x,shapeAreaDraw.y,shapeAreaDraw.w,shapeAreaDraw.h);

    const curveListLen = this.curveList.length;
    const cnt = curveListLen-index-1;
    this.curveList.splice(cnt,1);
    this.showCurveList();

    this.matrixData.splice(index,1);
    const it = this;
    const that = ZTIMES.SECRETDB;
    ZTIMES.SECRETDB.deleteDatabase(that).then(()=>{
      const curveListLen = it.curveList.length;
      for(let cnt=0;cnt<curveListLen;cnt+=1){
        const curve = it.curveList[cnt];
        it.toDB(cnt,curve).then();
      }
      it.updateMatrixData();
    });
  },
  GenerateCode: function(){
    const codeList = [];
    this.curveList.map((curve)=>{
      const dotS = curve['S'];
      const dotE = curve['E'];
      const dotA = curve['A'];
      const dotB = curve['B'];
      if((dotA !== undefined)&&(dotB !== undefined)){
        codeList.push("ctx.strokeStyle = 'Green';");
        codeList.push("ctx.beginPath();");
        codeList.push("ctx.moveTo(" + dotS.x + "," + dotS.y + ");");
        codeList.push("ctx.bezierCurveTo(" + dotA.x + "," + dotA.y + "," +
          dotB.x + "," + dotB.y + "," +
          dotE.x + "," + dotE.y + ");");
        codeList.push("ctx.stroke();");
        codeList.push("");
      }
      else if((dotA !== undefined)&&(dotB === undefined)){
        codeList.push("ctx.strokeStyle = 'Green';");
        codeList.push("ctx.beginPath();");
        codeList.push("ctx.moveTo(" + dotS.x + "," + dotS.y + ");");
        codeList.push("ctx.quadraticCurveTo(" + dotA.x + "," + dotA.y + "," +
          dotE.x + "," + dotE.y + ");");
        codeList.push("ctx.stroke();");
        codeList.push("");
      }
      else if((dotA === undefined)&&(dotB !== undefined)){
        codeList.push("ctx.strokeStyle = 'Green';");
        codeList.push("ctx.beginPath();");
        codeList.push("ctx.moveTo(" + dotS.x + "," + dotS.y + ");");
        codeList.push("ctx.quadraticCurveTo(" + dotB.x + "," + dotB.y + "," +
          dotE.x + "," + dotE.y + ");");
        codeList.push("ctx.stroke();");
        codeList.push("");
      }
      else if((dotA === undefined)&&(dotB === undefined)){
        codeList.push("ctx.strokeStyle = 'Green';");
        codeList.push("ctx.beginPath();");
        codeList.push("ctx.moveTo(" + dotS.x + "," + dotS.y + ");");
        codeList.push("ctx.lineTo(" + dotE.x + "," + dotE.y + ");");
        codeList.push("ctx.stroke();");
        codeList.push("");
      }
    });
    const code = codeList.join('\n');
    return code;
  },
};
