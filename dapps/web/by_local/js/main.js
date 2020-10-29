var ZTIMES = ZTIMES || {};

ZTIMES.VIEW = {
  init: function(){
    this.createStruct();
    this.createObj();
    this.setup();
  },
  test: function(){
  },
  createStruct: function(){
    this.BtnDot = ZTIMES.SCREEN.AddStruct({
      name:'BtnDot',
      merge_Link:ZTIMES.BUILTIN.Button,
      shape:{
        radius:10,
      },
      text:'',
      colors:ZTIMES.BUILTIN.COLORS.WHITE_GREEN_,
    });
  },
  createObj: function(){
    const areaOpe = ZTIMES.SCREEN.AddObj({
      name:'areaOpe',
      merge_Link:ZTIMES.BUILTIN.Area,
      shape:{
        gridW:'#Max',gridH:8,
        r:0,
      },
    });
    const areaDraw = ZTIMES.SCREEN.AddObj({
      name:'areaDraw',
      merge_Link:ZTIMES.BUILTIN.Area,
      shape:{
        gridW:'#Max',gridH:'#Max',
        r:0,
        offsetY:areaOpe.params.shape.bottom,
        offsetH: -1*areaOpe.params.shape.bottom,
      },
    });

    const layerTrace = ZTIMES.SCREEN.AddObj({
      name:'layerTrace',
      merge_Link:ZTIMES.SCREEN.Layer,
      shape:{
        offsetY:areaOpe.params.shape.y,
        offsetH:-1*areaOpe.params.shape.y,
      },
    });
    const layerUI = ZTIMES.SCREEN.AddObj({
      name:'layerUI',
      merge_Link:ZTIMES.SCREEN.Layer,
      shape:{
        offsetY:areaOpe.params.shape.y,
        offsetH:-1*areaOpe.params.shape.y,
      },
      children:{
        'sampleCurve':{
          children:{
            'S':{
              merge_Link:ZTIMES.BUILTIN.Dot,
              shape:{
                gridX:-1,gridY:2,
                offsetX:-5,offsetY:0,
              },
            },
            'E':{
              merge_Link:ZTIMES.BUILTIN.Dot,
              shape:{
                gridX:1,gridY:2,
                offsetX:5,offsetY:0,
              },
            },
            'A':{
              merge_Link:ZTIMES.BUILTIN.Dot,
              shape:{
                gridX:-1,gridY:5,
                offsetX:0,offsetY:5,
              },
              colors:ZTIMES.BUILTIN.COLORS.WHITE_BLUE_,
            },
            'B':{
              merge_Link:ZTIMES.BUILTIN.Dot,
              shape:{
                gridX:1,gridY:5,
                offsetX:0,offsetY:5,
              },
              colors:ZTIMES.BUILTIN.COLORS.WHITE_BLUE_,
            },
            'curve':{
              merge_Link:ZTIMES.BUILTIN.Curve,
              shape:{
                nameDotS:'layerUI sampleCurve S',
                nameDotE:'layerUI sampleCurve E',
                nameDotA:'layerUI sampleCurve A',
                nameDotB:'layerUI sampleCurve B',
              },
            },
          },
        },
        'btnCoodinate':{
          merge_Link:ZTIMES.BUILTIN.Button,
          shape:{
            gridW:'#Max',
            h:areaDraw.params.shape.h,r:0,
            offsetY:areaDraw.params.shape.top,
          },
          colors:ZTIMES.BUILTIN.COLORS.TRANSPARENT,
          events:{
            '#Pressed':function(self,commands){
              ZTIMES.DRAWER.SetDot(commands.coodinates.x,commands.coodinates.y);
            },
          },
        },
        'btnDotS':{
          merge_Link:this.BtnDot,
          shape:{
            gridX:-3,gridY:2,
            offsetX:5,offsetY:-10,
          },
          text:'S',
          events:{
            '#Pressed':function(self,commands){
              ZTIMES.DRAWER.InitDotAll();
            },
          },
        },
        'btnDotE':{
          merge_Link:this.BtnDot,
          shape:{
            gridX:2,gridY:2,
            offsetX:-5,offsetY:-10,
          },
          text:'E',
          events:{
            '#Pressed':function(self,commands){
              ZTIMES.DRAWER.isAutoNext = false;
              ZTIMES.DRAWER.SelectDotKind('E');
            }
          },
        },
        'btnDotA':{
          merge_Link:this.BtnDot,
          shape:{
            gridX:-3,gridY:5,
            offsetX:10,offsetY:-5,
          },
          text:'A',
          events:{
            '#Pressed':function(self,commands){
              ZTIMES.DRAWER.isAutoNext = false;
              ZTIMES.DRAWER.SelectDotKind('A');
            }
          },
        },
        'btnDotB':{
          merge_Link:this.BtnDot,
          shape:{
            gridX:2,gridY:5,
            offsetX:-10,offsetY:-5,
          },
          text:'B',
          events:{
            '#Pressed':function(self,commands){
              ZTIMES.DRAWER.isAutoNext = false;
              ZTIMES.DRAWER.SelectDotKind('B');
            }
          },
        },
        'btnInit':{
          merge_Link:ZTIMES.BUILTIN.Button,
          shape:{
            gridX:-7,gridY:1,
          },
          text:'Init',
          events:{
            '#Pressed':function(self,commands){
              ZTIMES.DRAWER.InitDotAll();
            }
          },
        },
        'btnEtoS':{
          merge_Link:ZTIMES.BUILTIN.Button,
          shape:{
            gridX:-7,gridY:5,gridW:3,gridH:2,
            r:15,
            images:{
              src:'./images/etos.png',
              // scalePercent:100,
              // scaleFullW:true,
              // scaleFullH:true,
            },
          },
          events:{
            '#Pressed':function(self,commands){
              ZTIMES.DRAWER.MoveDotEtoS();
            }
          },
        },
        'btnMenu':{
          merge_Link:ZTIMES.BUILTIN.Button,
          shape:{
            gridX:4,gridY:1,
          },
          text:'menu',
          events:{
            '#Pressed':function(self,commands){
              const layerMenu = ZTIMES.SCREEN.GetStructObj('layerMenu');
              if(layerMenu.params.visible === '#Show'){
                ZTIMES.SCREEN.SetDomVisible('layerMenu','#Hide');
              }
              else{
                ZTIMES.SCREEN.SetDomVisible('layerMenu','#Show');
              }
            }
          },
        },
        'btnDraw':{
          merge_Link:ZTIMES.BUILTIN.Button,
          shape:{
            gridX:4,gridY:4,
            radius:30,
          },
          text:'Draw',
          font:'20px Times New Roman',
          colors:ZTIMES.BUILTIN.COLORS.WHITE_GREEN_,
          events:{
            '#Pressed':function(self,commands){
              ZTIMES.DRAWER.DrawCurve();
            }
          },
        },
        'title':{
          merge_Link:ZTIMES.BUILTIN.Label,
          shape:{
            gridX:'#Center',gridY:6,gridW:4,gridH:1,
            offsetY:10,
          },
          colors:{font:'DarkGray'},
          text:'Bezier Curve Drawer',
        },
      },
    });
    const layerMenu = ZTIMES.SCREEN.AddObj({
      name:'layerMenu',
      parent_Link:layerUI,
      merge_Link:ZTIMES.SCREEN.Layer,
      visible:'#Hide',
      shape:{
        offsetY:areaDraw.params.shape.y,
        offsetH:-1*areaDraw.params.shape.y,
      },
      colors:{background:'LightGray',globalAlpha:0.3},
      children:{
        'domFileOpen':{
          merge_Link:ZTIMES.SCREEN.DomNode,
          shape:{
            gridX:-3,gridY:0,
          },
          children:{
            'inputImageFile':{
              // <input type="file" onchange="ZTIMES.DRAWER.ShowImage(this)"><br>
              merge_Link:ZTIMES.SCREEN.DomNode,
              shape:{
                x:-100,
                gridY:1,
              },
              doms:{
                tag:'input',
                attrs:{
                  'type':'file',
                  'onchange':'ZTIMES.DRAWER.ShowImage(this)',
                },
                isLineBreak:true,
              },
            },
          },
        },
        'btnReload':{
          merge_Link:ZTIMES.BUILTIN.Button,
          shape:{
            gridX:-1,gridY:3,gridW:6,gridH:2,
            r:5,
            offsetX:5,
          },
          text:'Reload',
          font:'20px Times New Roman',
          events:{
            '#Pressed':function(self,commands){
              document.location.reload();
            },
          },
        },
        'btnHideMenu':{
          merge_Link:ZTIMES.BUILTIN.Button,
          shape:{
            gridX:6,gridY:1,
            radius:30,
          },
          text:'Hide',
          font:'20px Times New Roman',
          events:{
            '#Pressed':function(self,commands){
              ZTIMES.SCREEN.SetDomVisible('layerMenu','#Hide');
            },
          },
        },
        'btnDeleteCurve':{
          merge_Link:ZTIMES.BUILTIN.Button,
          shape:{
            gridX:-1,gridY:6,gridW:10,gridH:1,
            r:5,
            offsetH:5,
          },
          text:'Delete Curve',
          events:{
            '#Pressed':function(self,commands){
              const matrixCurve = ZTIMES.SCREEN.GetStructObj('layerMenu tableCurve matrix');
              const selectedDataIndex = matrixCurve.params.selectedDataIndex;
              if(selectedDataIndex !== undefined){
                console.log(selectedDataIndex);
                ZTIMES.DRAWER.RemoveCurve(selectedDataIndex);
              }
            },
          },
        },
        'tableCurve':{
          merge_Link:ZTIMES.BUILTIN.Table,
          shape:{
            gridX:-1,gridY:8,gridW:10,gridH:12,
          },
          children:{
            'matrix':{
              clms:{
                gridW:10,
                gridH:1,
                offsetH:5,
                dispNum:2,
                shapeList:[
                  {gridW:2,text:'No'},
                  {gridW:8,text:'Thumbnail'}
                ],
              },
              rows:{
                gridW:10,
                gridH:1,
                offsetH:5,
                dispNum:4,
                dataListList:[
                  // ['i000','h000'],
                  // ['i111','h111'],
                  // ['i222','h222'],
                  // ['i333','h333'],
                  // ['i444','h444'],
                  // ['i555','h555'],
                  // ['i666','h666'],
                  // ['i777','h777'],
                  // ['i888','h888'],
                  // ['i999','h999']
                ],
              },
              selectedDataIndex: undefined,
              colors:ZTIMES.BUILTIN.COLORS.BLACK__GRAY_BLUE,
              events:{
                '#Selected':function(self,commands){
                  const dataIndex = commands.dataIndex;
                  self.params.selectedDataIndex = dataIndex;
                  const curve = ZTIMES.DRAWER.GetCurve(dataIndex);
                  if(curve === undefined){
                    return;
                  }
                  const layerUI = ZTIMES.SCREEN.GetStructObj('layerUI');
                  const areaDraw = ZTIMES.SCREEN.GetStructObj('areaDraw');
                  const shapeAreaDraw = areaDraw.params.shape;
                  ZTIMES.BUILTIN.RECT.EraseArea(layerUI,shapeAreaDraw.x,shapeAreaDraw.y,shapeAreaDraw.w,shapeAreaDraw.h);
                  const dotS = curve['S'];
                  const dotE = curve['E'];
                  const dotA = curve['A'];
                  const dotB = curve['B'];
                  ZTIMES.BUILTIN.CURVE.ShowCurve(layerUI,'Red',dotS,dotE,dotA,dotB);
                },
              },
            },
          },
          events:{
            '#Setup':function(self){
            },
          },
        },
        'btnGenCode':{
          merge_Link:ZTIMES.BUILTIN.Button,
          shape:{
            gridX:0,gridY:20,gridW:8,gridH:2,
            r:5,
          },
          text:'Generate Code',
          font:'20px Times New Roman',
          events:{
            '#Setup':function(self){
              self.params.elDownloadText = document.createElement('a');
            },
            '#Pressed':function(self,commands){
              const code = ZTIMES.DRAWER.GenerateCode();
              self.params.elDownloadText.href = 'data:text/plain,' + encodeURIComponent(code + '\n');
              self.params.elDownloadText.download = 'curveCode.js';
              self.params.elDownloadText.click();
            },
          },
        },
        'btnClearDB':{
          merge_Link:ZTIMES.BUILTIN.Button,
          shape:{
            gridX:-8,gridY:20,gridW:6,gridH:2,
            r:5,
          },
          text:'All Reset',
          font:'20px Times New Roman',
          events:{
            '#Pressed':function(self,commands){
              const that = ZTIMES.SECRETDB;
              ZTIMES.SECRETDB.deleteDatabase(that).then(()=>{
                document.location.reload();
              });
            },
          },
        },
      },
    });
  },
  setup: function(){
    ZTIMES.DRAWER.Setup();
  },
};

ZTIMES.RUN = {
  debug: function(){
    ZTIMES.SCREEN.DebugSetStructObj([
      // 'layerMenu',
      // 'layerMenu tableCurve',
      // 'layerMenu tableCurve matrix',
    ],function(name){
      console.log('[Debug] '+name);      //BreakPoint here!
    });
  },
  init: function(){
    ZTIMES.CRYPTOGRAPH.init();
    ZTIMES.SECRETDB.init();
    ZTIMES.GRID.init();
    ZTIMES.SCREEN.init();
    ZTIMES.BUILTIN.init();
    ZTIMES.DRAWER.init();
    ZTIMES.VIEW.init();
  },
  test: function(){
    ZTIMES.SCREEN.test();
    ZTIMES.DRAWER.test();
    ZTIMES.VIEW.test();
  },
};
ZTIMES.RUN.debug();
ZTIMES.RUN.init();
ZTIMES.RUN.test();
