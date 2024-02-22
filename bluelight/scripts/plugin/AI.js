var openAIModel = false;
//計數參數
var yv4s = 0;
yv4m = 0;
hfs = 0;
hfm = 0;
yv7s = 0;
yv7m = 0;
yv7os = 0;
yv7om = 0; //手部
sm5 = 0;
ich = 0;
bt = 0; //腦部
(yv3s = 0), (yv3m = 0);
yv8s = 0;
yv8m = 0; //肺部
bc = 0; //胸部

var markX = 0,
  markY = 0,
  markW = 0,
  markH = 0;
let aimodelname, Multiple;
let aiInfoArray = [];
let handReport = [];

//設定呼叫後端的API
axios.defaults.baseURL = "http://localhost:3002/api/aimodel";

//前端畫面顯示
function loadAIModel() {
  var span = document.createElement("SPAN");
  span.innerHTML = `<img class="AIModelimg" alt="AIModel" id="AIModel" src="../image/icon/black/Model_OFF.png" width="50" height="50">`;
  getByid("icon-list").appendChild(span);

  var style = document.createElement("style");
  style.innerHTML = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`;
  document.head.appendChild(style);

  var span = document.createElement("SPAN");
  span.innerHTML = `<div id="AIModeldiv" style="background-color:#30306044;">
        <span style="color: white;" id="bodypartSpan">Body Part:</span>
        <select id="Bodypart">
        <option selected="selected"></option>
        <option id="hand">Hand</option>
        <option id="brain">Brain</option>
        <option id="lung">lung</option>
        <option id="breast">Breast</option>
        </select>
        <span style="color: white;" id="AIModelSpan">AI Model:</span>
        <select id="AIModelSelect">
        <option selected="selected"></option>
        <option id="Yolo4">Yolo4</option>
        <option id="handFilter">handFilter</option>
        <option id="Yolo7">Yolo7</option>
        <option id="Yolo7Original">Yolo7Original</option>

        <option id="Smart5">SMART5</option>
        <option id="ich">ICH</option>
        <option id="bt">BrainTumors</option>

        <option id="Yolo3">Yolo3</option>
        <option id="Yolo8">Yolo8</option>
        
        <option id="bc">BC</option>
        </select>
        <span style="color: white;" id="multiple">Multiple:</span>
        <Select id="mulSelect">
        <option selected="selected>""</option>
        <option id="single">Single</option>
        <option id="multi">Multiple</option>
        </select>
        <button id="runmodel">Run</button>
        <button id="rerunmodel">Rerun</button>
        <span style="color: red;" id="errorMessage"></span>
        <div id="circle" style="border: 8px solid #f3f3f3;
        border-top: 8px solid #3498db;
        border-radius: 50%;
        width: 12px;
        height: 12px;
        animation: spin 2s linear infinite;" />
      </div>
      `;
  getByid("page-header").appendChild(span);
  getByid("AIModeldiv").style.display = "none";

  //手部
  getByid("Yolo4").style.display = "none";
  getByid("handFilter").style.display = "none";
  getByid("Yolo7").style.display = "none";
  getByid("Yolo7Original").style.display = "none";

  //腦部
  getByid("Smart5").style.display = "none";
  getByid("ich").style.display = "none";
  getByid("bt").style.display = "none";

  //肺部
  getByid("Yolo3").style.display = "none";
  getByid("Yolo8").style.display = "none";

  //胸部
  getByid("bc").style.display = "none";

  getByid("circle").style.display = "none";
  getByid("rerunmodel").style.display = "none";
  getByid("errorMessage").style.display = "none";
}
loadAIModel();

//handFilter報告內容
function handFilterReport() {
  var span = document.createElement("SPAN");
  span.innerHTML = `
  <div id="handFilterReport"
    style="background-color:#30306044;float:right;display: none;flex-direction: column;position: absolute;left:130px;top:200px;z-index: 20;"
    width="100">
    <div style="background-color:#889292;">
    <h4 color="white">AI Result</h4>
      <font color="white">Report:</font><span id="Report"></span>
      <br />
      </div>
  </div>`;
  getByid("form-group").appendChild(span);
  getByid("handFilterReport").style.display = "none";
}
handFilterReport();

//ICH選取查看區塊
function markZone() {
  if (BL_mode == "markZone") {
    DeleteMouseEvent();

    Mousedown = function (e) {
      // deleteMark();
      if (e.which == 1) MouseDownCheck = true;
      else if (e.which == 3) rightMouseDown = true;
      var currX = getCurrPoint(e)[0];
      var currY = getCurrPoint(e)[1];
      windowMouseX = GetmouseX(e);
      windowMouseY = GetmouseY(e);
      GetViewport().originalPointX = getCurrPoint(e)[0];
      GetViewport().originalPointY = getCurrPoint(e)[1];
      if (!rightMouseDown && getByid("GspsPOLYLINE").selected == true) {
        var currX = getCurrPoint(e)[0];
        var currY = getCurrPoint(e)[1];
        if (Graphic_pounch(currX, currY) == true) {
          displayMark();
        }
      }
      markX = currX;
      markY = currY;
    };

    Mousemove = function (e) {
      var currX = getCurrPoint(e)[0];
      var currY = getCurrPoint(e)[1];
      var labelXY = getClass("labelXY");
      {
        let angle2point = rotateCalculation(e);
        labelXY[viewportNumber].innerText =
          "X: " + parseInt(angle2point[0]) + " Y: " + parseInt(angle2point[1]);
      }
      // if (rightMouseDown == true) {
      //      scale_size(e, currX, currY);
      // }

      if (openLink == true) {
        for (var i = 0; i < Viewport_Total; i++) {
          GetViewport(i).newMousePointX = GetViewport().newMousePointX;
          GetViewport(i).newMousePointY = GetViewport().newMousePointY;
        }
      }
      putLabel();
      for (var i = 0; i < Viewport_Total; i++) displayRuler(i);

      if (MouseDownCheck == true && getByid("GspsCIRCLE").selected == true) {
        //flag
        let Uid = SearchNowUid();
        var dcm = {};
        dcm.study = Uid.studyuid;
        dcm.series = Uid.sreiesuid;
        dcm.color = GetGSPSColor();
        dcm.mark = [];
        dcm.showName = getByid("GspsName").value; //"" + getByid("xmlMarkNameText").value;
        dcm.hideName = dcm.showName;
        dcm.mark.push({});
        dcm.sop = Uid.sopuid;
        var DcmMarkLength = dcm.mark.length - 1;
        dcm.mark[DcmMarkLength].type = "CIRCLE";
        dcm.mark[DcmMarkLength].markX = [];
        dcm.mark[DcmMarkLength].markY = [];
        dcm.mark[DcmMarkLength].markX.push(GetViewport().originalPointX);
        dcm.mark[DcmMarkLength].markY.push(GetViewport().originalPointY);
        dcm.mark[DcmMarkLength].markX.push(
          GetViewport().originalPointX +
            Math.sqrt(
              Math.pow(Math.abs(GetViewport().originalPointX - currX), 2) +
                Math.pow(Math.abs(GetViewport().originalPointY - currY), 2) / 2
            )
        );
        dcm.mark[DcmMarkLength].markY.push(
          GetViewport().originalPointY +
            Math.sqrt(
              Math.pow(Math.abs(GetViewport().originalPointX - currX), 2) +
                Math.pow(Math.abs(GetViewport().originalPointY - currY), 2) / 2
            )
        );
        PatientMark.push(dcm);
        refreshMark(dcm);
        for (var i = 0; i < Viewport_Total; i++) displayMark(i);
        displayAngleRuler();
        PatientMark.splice(PatientMark.indexOf(dcm), 1);
      }
      if (MouseDownCheck == true && getByid("GspsLINE").selected == true) {
        let Uid = SearchNowUid();
        var dcm = {};
        dcm.study = Uid.studyuid;
        dcm.series = Uid.sreiesuid;
        dcm.color = GetGSPSColor();
        dcm.mark = [];
        dcm.showName = "" + getByid("GspsName").value; //"" + getByid("xmlMarkNameText").value;
        dcm.hideName = dcm.showName;
        dcm.mark.push({});
        dcm.sop = Uid.sopuid;
        var DcmMarkLength = dcm.mark.length - 1;
        dcm.mark[DcmMarkLength].type = "POLYLINE";
        dcm.mark[DcmMarkLength].markX = [];
        dcm.mark[DcmMarkLength].markY = [];
        dcm.mark[DcmMarkLength].markX.push(GetViewport().originalPointX);
        dcm.mark[DcmMarkLength].markY.push(GetViewport().originalPointY);
        dcm.mark[DcmMarkLength].markY.push(currY);
        dcm.mark[DcmMarkLength].markX.push(currX);
        PatientMark.push(dcm);
        refreshMark(dcm);
        for (var i = 0; i < Viewport_Total; i++) displayMark(i);
        displayAngleRuler();
        PatientMark.splice(PatientMark.indexOf(dcm), 1);
      }
      if (
        (openWriteGraphic == true ||
          getByid("GspsPOLYLINE").selected == true) &&
        (MouseDownCheck == true || rightMouseDown == true)
      ) {
        if (currX <= 0) currX = 0;
        if (currY <= 0) currY = 0;
        if (currX > GetViewport().imageWidth) currX = GetViewport().imageWidth;
        if (currY > GetViewport().imageHeight)
          currY = GetViewport().imageHeight;
        if (GetViewport().originalPointX <= 0) GetViewport().originalPointX = 0;
        if (GetViewport().originalPointY <= 0) GetViewport().originalPointY = 0;
        if (GetViewport().originalPointX > GetViewport().imageWidth)
          GetViewport().originalPointX = GetViewport().imageWidth;
        if (GetViewport().originalPointY > GetViewport().imageHeight)
          GetViewport().originalPointY = GetViewport().imageHeight;
        if (!Graphic_now_choose && MouseDownCheck == true) {
          let Uid = SearchNowUid();
          var dcm = {};
          dcm.study = Uid.studyuid;
          dcm.series = Uid.sreiesuid;
          dcm.color = GetGraphicColor();
          if (getByid("GspsPOLYLINE").selected == true)
            dcm.color = GetGSPSColor();
          dcm.mark = [];
          dcm.showName = GetGraphicName(); //"" + getByid("xmlMarkNameText").value;
          dcm.hideName = dcm.showName;
          if (getByid("GspsPOLYLINE").selected == true)
            dcm.showName = getByid("GspsName").value;
          dcm.mark.push({});
          dcm.sop = Uid.sopuid;
          var DcmMarkLength = dcm.mark.length - 1;
          dcm.mark[DcmMarkLength].type = "POLYLINE";
          dcm.mark[DcmMarkLength].markX = [];
          dcm.mark[DcmMarkLength].markY = [];
          dcm.mark[DcmMarkLength].markX.push(GetViewport().originalPointX);
          dcm.mark[DcmMarkLength].markY.push(GetViewport().originalPointY);
          dcm.mark[DcmMarkLength].markX.push(GetViewport().originalPointX);
          dcm.mark[DcmMarkLength].markY.push(currY);
          dcm.mark[DcmMarkLength].markX.push(currX);
          dcm.mark[DcmMarkLength].markY.push(currY);
          dcm.mark[DcmMarkLength].markX.push(currX);
          dcm.mark[DcmMarkLength].markY.push(GetViewport().originalPointY);
          dcm.mark[DcmMarkLength].markX.push(GetViewport().originalPointX);
          dcm.mark[DcmMarkLength].markY.push(GetViewport().originalPointY);
          PatientMark.push(dcm);
          refreshMark(dcm);
          for (var i = 0; i < Viewport_Total; i++) displayMark(i);
          displayAngleRuler();
          PatientMark.splice(PatientMark.indexOf(dcm), 1);
        } else {
          if (rightMouseDown == true) {
            if (
              Math.abs(currY - GetViewport().originalPointY) >
              Math.abs(currX - GetViewport().originalPointX)
            ) {
              if (
                !Graphic_now_choose.mark ||
                !Graphic_now_choose.mark.RotationAngle
              )
                Graphic_now_choose.mark.RotationAngle = 0;
              if (currY < GetViewport().originalPointY - 1)
                Graphic_now_choose.mark.RotationAngle += parseInt(
                  (GetViewport().originalPointY - currY) / 3
                );
              else if (currY > GetViewport().originalPointY + 1)
                Graphic_now_choose.mark.RotationAngle -= parseInt(
                  (currY - GetViewport().originalPointY) / 3
                );
            } else if (
              Math.abs(currX - GetViewport().originalPointX) >
              Math.abs(currY - GetViewport().originalPointY)
            ) {
              if (
                !Graphic_now_choose.mark ||
                !Graphic_now_choose.mark.RotationAngle
              )
                Graphic_now_choose.mark.RotationAngle = 0;
              if (currX < GetViewport().originalPointX - 1)
                Graphic_now_choose.mark.RotationAngle += parseInt(
                  (GetViewport().originalPointX - currX) / 3
                );
              else if (currX > GetViewport().originalPointX + 1)
                Graphic_now_choose.mark.RotationAngle -= parseInt(
                  (currX - GetViewport().originalPointX) / 3
                );
            }
            if (Graphic_now_choose.mark.RotationAngle > 360)
              Graphic_now_choose.mark.RotationAngle -= 360;
            if (Graphic_now_choose.mark.RotationAngle < 0)
              Graphic_now_choose.mark.RotationAngle += 360;
            GetViewport().originalPointX = currX;
            GetViewport().originalPointY = currY;
          } else if (MouseDownCheck == true) {
            var Graphic_point = Graphic_now_choose.point;
            if (Graphic_now_choose.value == "up") {
              for (var p = 0; p < Graphic_point.length; p++) {
                Graphic_now_choose.mark.markY[Graphic_point[p]] = currY;
              }
            } else if (Graphic_now_choose.value == "down") {
              for (var p = 0; p < Graphic_point.length; p++) {
                Graphic_now_choose.mark.markY[Graphic_point[p]] = currY;
              }
            } else if (Graphic_now_choose.value == "left") {
              for (var p = 0; p < Graphic_point.length; p++) {
                Graphic_now_choose.mark.markX[Graphic_point[p]] = currX;
              }
            } else if (Graphic_now_choose.value == "right") {
              for (var p = 0; p < Graphic_point.length; p++) {
                Graphic_now_choose.mark.markX[Graphic_point[p]] = currX;
              }
            }
          }
          if (Graphic_now_choose.mark.RotationAngle >= 0)
            Graphic_now_choose.mark.RotationPoint = getRotationPoint(
              Graphic_now_choose.mark,
              true
            );
          //Graphic_now_choose.mark.RotationPoint = [Graphic_now_choose.middle[0], Graphic_now_choose.middle[1]];
          displayMark();
        }
      }
    };
    Mouseup = function (e) {
      var currX = getCurrPoint(e)[0];
      var currY = getCurrPoint(e)[1];
      MouseDownCheck = false;
      rightMouseDown = false;
      if (getByid("GspsLINE").selected == true) {
        let Uid = SearchNowUid();
        var dcm = {};
        dcm.study = Uid.studyuid;
        dcm.series = Uid.sreiesuid;
        dcm.color = GetGSPSColor();
        dcm.mark = [];
        dcm.showName = "" + getByid("xmlMarkNameText").value; //"" + getByid("xmlMarkNameText").value;
        dcm.hideName = dcm.showName;
        dcm.mark.push({});
        dcm.sop = Uid.sopuid;
        var DcmMarkLength = dcm.mark.length - 1;
        dcm.mark[DcmMarkLength].type = "POLYLINE";
        dcm.mark[DcmMarkLength].markX = [];
        dcm.mark[DcmMarkLength].markY = [];
        dcm.mark[DcmMarkLength].markX.push(GetViewport().originalPointX);
        dcm.mark[DcmMarkLength].markY.push(GetViewport().originalPointY);
        dcm.mark[DcmMarkLength].markY.push(currY);
        dcm.mark[DcmMarkLength].markX.push(currX);
        PatientMark.push(dcm);
        refreshMark(dcm);
        for (var i = 0; i < Viewport_Total; i++) displayMark(i);
        displayAngleRuler();
        Graphic_now_choose = {
          reference: dcm,
        };
      } //flag
      if (getByid("GspsCIRCLE").selected == true) {
        let Uid = SearchNowUid();
        var dcm = {};
        dcm.study = Uid.studyuid;
        dcm.series = Uid.sreiesuid;
        dcm.color = GetGSPSColor();
        dcm.mark = [];
        dcm.showName = getByid("GspsName").value;
        dcm.hideName = dcm.showName;
        dcm.mark.push({});
        dcm.sop = Uid.sopuid;
        var DcmMarkLength = dcm.mark.length - 1;
        dcm.mark[DcmMarkLength].type = "CIRCLE";
        dcm.mark[DcmMarkLength].markX = [];
        dcm.mark[DcmMarkLength].markY = [];
        dcm.mark[DcmMarkLength].markX.push(GetViewport().originalPointX);
        dcm.mark[DcmMarkLength].markY.push(GetViewport().originalPointY);
        dcm.mark[DcmMarkLength].markX.push(
          GetViewport().originalPointX +
            Math.sqrt(
              Math.pow(Math.abs(GetViewport().originalPointX - currX), 2) +
                Math.pow(Math.abs(GetViewport().originalPointY - currY), 2) / 2
            )
        );
        dcm.mark[DcmMarkLength].markY.push(
          GetViewport().originalPointY +
            Math.sqrt(
              Math.pow(Math.abs(GetViewport().originalPointX - currX), 2) +
                Math.pow(Math.abs(GetViewport().originalPointY - currY), 2) / 2
            )
        );
        PatientMark.push(dcm);
        refreshMark(dcm);
        for (var i = 0; i < Viewport_Total; i++) displayMark(i);
        displayAngleRuler();
        Graphic_now_choose = {
          reference: dcm,
        };
      }
      if (
        (openWriteGraphic == true && !Graphic_now_choose) ||
        (getByid("GspsPOLYLINE").selected == true && !Graphic_now_choose)
      ) {
        if (currX <= 0) currX = 0;
        if (currY <= 0) currY = 0;
        if (currX > GetViewport().imageWidth) currX = GetViewport().imageWidth;
        if (currY > GetViewport().imageHeight)
          currY = GetViewport().imageHeight;
        if (GetViewport().originalPointX <= 0) GetViewport().originalPointX = 0;
        if (GetViewport().originalPointY <= 0) GetViewport().originalPointY = 0;
        if (GetViewport().originalPointX > GetViewport().imageWidth)
          GetViewport().originalPointX = GetViewport().imageWidth;
        if (GetViewport().originalPointY > GetViewport().imageHeight)
          GetViewport().originalPointY = GetViewport().imageHeight;
        let Uid = SearchNowUid();
        var dcm = {};
        dcm.study = Uid.studyuid;
        dcm.series = Uid.sreiesuid;
        dcm.color = GetGraphicColor();
        if (getByid("GspsPOLYLINE").selected == true)
          dcm.color = GetGSPSColor();
        dcm.mark = [];
        dcm.showName = GetGraphicName(); //"" + getByid("xmlMarkNameText").value;
        dcm.hideName = dcm.showName;
        if (getByid("GspsPOLYLINE").selected == true)
          dcm.showName = getByid("GspsName").value;

        dcm.mark.push({});
        dcm.sop = Uid.sopuid;
        var DcmMarkLength = dcm.mark.length - 1;
        dcm.mark[DcmMarkLength].type = "POLYLINE";
        dcm.mark[DcmMarkLength].markX = [];
        dcm.mark[DcmMarkLength].markY = [];
        dcm.mark[DcmMarkLength].markX.push(GetViewport().originalPointX);
        dcm.mark[DcmMarkLength].markY.push(GetViewport().originalPointY);
        dcm.mark[DcmMarkLength].markX.push(GetViewport().originalPointX);
        dcm.mark[DcmMarkLength].markY.push(currY);
        dcm.mark[DcmMarkLength].markX.push(currX);
        dcm.mark[DcmMarkLength].markY.push(currY);
        dcm.mark[DcmMarkLength].markX.push(currX);
        dcm.mark[DcmMarkLength].markY.push(GetViewport().originalPointY);
        dcm.mark[DcmMarkLength].markX.push(GetViewport().originalPointX);
        dcm.mark[DcmMarkLength].markY.push(GetViewport().originalPointY);
        PatientMark.push(dcm);
        Graphic_pounch(currX, (currY + GetViewport().originalPointY) / 2, dcm);
        for (var i = 0; i < Viewport_Total; i++) displayMark(i);
        displayAngleRuler();
        //set_Graphic_context();
        refreshMark(dcm);
      }
      calculateSquareCoordinates(markX, markY, currX, currY);
    };
  }
  AddMouseEvent();
}

//ICH計算座標
function calculateSquareCoordinates(x1, y1, x2, y2) {
  var minX = Math.min(x1, x2);
  var minY = Math.min(y1, y2);
  var maxX = Math.max(x1, x2);
  var maxY = Math.max(y1, y2);

  markX = minX;
  markY = minY;
  markW = maxX - minX;
  markH = maxY - minY;
}

//設定是否出現rerun
function Hidden() {
  //手部
  //Yolo4
  if (aimodelname == "Yolo4" && Multiple == "Single" && yv4s > 0) {
    getByid("rerunmodel").style.display = "";
  } else if (aimodelname == "Yolo4" && Multiple == "Single" && yv4s == 0) {
    getByid("rerunmodel").style.display = "none";
  }

  if (aimodelname == "Yolo4" && Multiple == "Multiple" && yv4m > 0) {
    getByid("rerunmodel").style.display = "";
  } else if (aimodelname == "Yolo4" && Multiple == "Multiple" && yv4m == 0) {
    getByid("rerunmodel").style.display = "none";
  }

  //handFilter
  if (aimodelname == "handFilter" && Multiple == "Single" && hfs > 0) {
    getByid("rerunmodel").style.display = "";
  } else if (aimodelname == "handFilter" && Multiple == "Single" && hfs == 0) {
    getByid("rerunmodel").style.display = "none";
  }

  if (aimodelname == "handFilter" && Multiple == "Multiple" && hfm > 0) {
    getByid("rerunmodel").style.display = "";
  } else if (
    aimodelname == "handFilter" &&
    Multiple == "Multiple" &&
    hfm == 0
  ) {
    getByid("rerunmodel").style.display = "none";
  }

  //Yolo7
  if (aimodelname == "Yolo7" && Multiple == "Single" && yv7s > 0) {
    getByid("rerunmodel").style.display = "";
  } else if (aimodelname == "Yolo7" && Multiple == "Single" && yv7s == 0) {
    getByid("rerunmodel").style.display = "none";
  }

  if (aimodelname == "Yolo7" && Multiple == "Multiple" && yv7m > 0) {
    getByid("rerunmodel").style.display = "";
  } else if (aimodelname == "Yolo7" && Multiple == "Multiple" && yv7m == 0) {
    getByid("rerunmodel").style.display = "none";
  }
  //Yolo7Original
  if (aimodelname == "Yolo7Original" && Multiple == "Single" && yv7os > 0) {
    getByid("rerunmodel").style.display = "";
  } else if (
    aimodelname == "Yolo7Original" &&
    Multiple == "Single" &&
    yv7os == 0
  ) {
    getByid("rerunmodel").style.display = "none";
  }

  if (aimodelname == "Yolo7Original" && Multiple == "Multiple" && yv7om > 0) {
    getByid("rerunmodel").style.display = "";
  } else if (
    aimodelname == "Yolo7Original" &&
    Multiple == "Multiple" &&
    yv7om == 0
  ) {
    getByid("rerunmodel").style.display = "none";
  }
  //手部

  //腦部
  //SMART5
  if (aimodelname == "SMART5" && sm5 > 0) {
    getByid("rerunmodel").style.display = "";
  } else if (aimodelname == "SMART5" && sm5 == 0) {
    getByid("rerunmodel").style.display = "none";
  }
  //ICH
  if (aimodelname == "ICH" && ich > 0) {
    getByid("rerunmodel").style.display = "";
  } else if (aimodelname == "ICH" && ich == 0) {
    getByid("rerunmodel").style.display = "none";
  }
  //brainTumors
  if (aimodelname == "BrainTumors" && bt > 0) {
    getByid("rerunmodel").style.display = "";
  } else if (aimodelname == "BrainTumors" && bt == 0) {
    getByid("rerunmodel").style.display = "none";
  }
  //腦部

  //肺部
  //Yolo3
  if (aimodelname == "Yolo3" && Multiple == "Single" && yv3s > 0) {
    getByid("rerunmodel").style.display = "";
  } else if (aimodelname == "Yolo3" && Multiple == "Single" && yv3s == 0) {
    getByid("rerunmodel").style.display = "none";
  }

  if (aimodelname == "Yolo3" && Multiple == "Multiple" && yv3m > 0) {
    getByid("rerunmodel").style.display = "";
  } else if (aimodelname == "Yolo3" && Multiple == "Multiple" && yv3m == 0) {
    getByid("rerunmodel").style.display = "none";
  }

  //Yolo8
  if (aimodelname == "Yolo8" && Multiple == "Single" && yv8s > 0) {
    getByid("rerunmodel").style.display = "";
  } else if (aimodelname == "Yolo8" && Multiple == "Single" && yv8s == 0) {
    getByid("rerunmodel").style.display = "none";
  }

  if (aimodelname == "Yolo8" && Multiple == "Multiple" && yv8m > 0) {
    getByid("rerunmodel").style.display = "";
  } else if (aimodelname == "Yolo8" && Multiple == "Multiple" && yv8m == 0) {
    getByid("rerunmodel").style.display = "none";
  }
  //肺部

  //胸部
  //BC
  if (aimodelname == "BC" && bc > 0) {
    getByid("rerunmodel").style.display = "";
  } else if (aimodelname == "BC" && bc == 0) {
    getByid("rerunmodel").style.display = "none";
  }
  //胸部

  //多張單張欄位顯示
  if (
    aimodelname == "SMART5" ||
    aimodelname == "ICH" ||
    aimodelname == "BC" ||
    aimodelname == "BrainTumors"
  ) {
    getByid("mulSelect").style.display = "none";
    getByid("multiple").style.display = "none";
    getByid("mulSelect").value = "";
  } else if (
    aimodelname != "SMART5" ||
    aimodelname == "ICH" ||
    aimodelname != "BrainTumors"
  ) {
    getByid("mulSelect").style.display = "";
    getByid("multiple").style.display = "";
  }
}

//解析dicom檔案
async function blob(streamsData) {
  try {
    resetViewport();
    var arrayBuffer = new Uint8Array(streamsData).buffer;
    var blob = new Blob([arrayBuffer]);
    const url = URL.createObjectURL(blob);

    await load(100);

    loadAndViewImage("wadouri:" + url);

    await new Promise((resolve) => {
      setTimeout(() => {
        readXML(url);
        readDicom(url, PatientMark, true);
        resolve();
      }, 100);
    });
  } catch (err) {
    console.error(err);
  }
}

function load(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

//handFilter 報告處理
function handFilter(reportData) {
  for (let i = 0; i < reportData.length; i++) {
    var newData = {
      SOPInstanceUID: reportData[i].SOPInstanceUID,
      Report: reportData[i].report,
    };

    handReport.push(newData);
  }

  showhandFilterReport();
}

function showhandFilterReport() {
  var SOPInstanceUID, Report;
  for (var i = 0; i < GetViewport().DicomTagsList.length; i++) {
    if (GetViewport().DicomTagsList[i][1] == "SOPInstanceUID") {
      SOPInstanceUID = GetViewport().DicomTagsList[i][2];
    }
  }

  for (var i = 0; i < handReport.length; i++) {
    if (SOPInstanceUID == handReport[i].SOPInstanceUID) {
      Report = handReport[i].Report;
    }
  }
  updateReport(SOPInstanceUID, Report);
}

function updateReport(SOPInstanceUID, Report) {
  var ViewportSOPUID;
  for (var i = 0; i < GetViewport().DicomTagsList.length; i++) {
    if (GetViewport().DicomTagsList[i][1] == "SOPInstanceUID") {
      ViewportSOPUID = GetViewport().DicomTagsList[i][2];
    }
  }

  if (Report && ViewportSOPUID == SOPInstanceUID) {
    handFilterReport();
    getByid("Report").textContent = Report;
    getByid("handFilterReport").style.display = "block";
  } else {
    getByid("handFilterReport").style.display = "none";
  }
}
//handFilter 報告處理

//更新時刪除標記
function deleteMark() {
  PatientMark = [];
  for (var i = 0; i < Viewport_Total; i++) {
    var sop = GetViewport(i).sop;
    loadAndViewImage(getImgaeIdFromSop(sop), i);
  }
}

//選擇部位時顯示的model模型
getByid("Bodypart").onchange = function () {
  getByid("errorMessage").innerHTML = "";
  if (getByid("Bodypart").value == "Hand") {
    getByid("Yolo4").style.display = "";
    getByid("handFilter").style.display = "";
    getByid("Yolo7").style.display = "";
    getByid("Yolo7Original").style.display = "";

    getByid("Smart5").style.display = "none";
    getByid("ich").style.display = "none";
    getByid("bt").style.display = "none";

    getByid("Yolo3").style.display = "none";
    getByid("Yolo8").style.display = "none";

    getByid("bc").style.display = "none";

    getByid("AIModelSelect").value = "";
  } else if (getByid("Bodypart").value == "Brain") {
    getByid("Smart5").style.display = "";
    getByid("bt").style.display = "";
    getByid("ich").style.display = "";

    getByid("Yolo4").style.display = "none";
    getByid("handFilter").style.display = "none";
    getByid("Yolo7").style.display = "none";
    getByid("Yolo7Original").style.display = "none";

    getByid("Yolo3").style.display = "none";
    getByid("Yolo8").style.display = "none";

    getByid("bc").style.display = "none";

    getByid("AIModelSelect").value = "";
  } else if (getByid("Bodypart").value == "lung") {
    getByid("Yolo3").style.display = "";
    getByid("Yolo8").style.display = "";

    getByid("Yolo4").style.display = "none";
    getByid("handFilter").style.display = "none";
    getByid("Yolo7").style.display = "none";
    getByid("Yolo7Original").style.display = "none";

    getByid("Smart5").style.display = "none";
    getByid("bt").style.display = "none";
    getByid("ich").style.display = "none";

    getByid("bc").style.display = "none";

    getByid("AIModelSelect").value = "";
  } else if (getByid("Bodypart").value == "Breast") {
    getByid("bc").style.display = "";

    getByid("Yolo4").style.display = "none";
    getByid("handFilter").style.display = "none";
    getByid("Yolo7").style.display = "none";
    getByid("Yolo7Original").style.display = "none";

    getByid("Smart5").style.display = "none";
    getByid("bt").style.display = "none";
    getByid("ich").style.display = "none";

    getByid("Yolo3").style.display = "none";
    getByid("Yolo8").style.display = "none";

    getByid("AIModelSelect").value = "none";
  }
};

//前端顯示圖示更改
getByid("AIModel").onclick = function () {
  openAIModel = !openAIModel;
  this.src = openAIModel
    ? "../image/icon/black/Model_ON.png"
    : "../image/icon/black/Model_OFF.png";
  if (openAIModel == true) {
    getByid("AIModeldiv").style.display = "";
  } else {
    getByid("AIModeldiv").style.display = "none";
  }
};

//AImodel Select onChange事件
getByid("AIModelSelect").onchange = function (e) {
  aimodelname = e.target.value;
  getByid("errorMessage").innerHTML = "";
  Hidden();
  if (this.value == "BC") {
    set_BL_model("markZone");
    markZone();
  } else {
    set_BL_model("MouseTool");
    mouseTool();
    // deleteMark();
  }
};

//單張多張 onChange事件
getByid("mulSelect").onchange = function (e) {
  Multiple = e.target.value;
  getByid("errorMessage").innerHTML = "";
  Hidden();
};

//執行AI Model 事件
getByid("runmodel").onclick = function () {
  var StudyInstanceUID, SeriesInstanceUID, SOPInstanceUID, data;
  handReport = [];
  //   deleteMark();
  getByid("errorMessage").style.display = "";
  getByid("errorMessage").innerHTML = "";

  if (
    getByid("AIModelSelect").value == "" ||
    (getByid("mulSelect").value == "" &&
      getByid("AIModelSelect").value != "SMART5" &&
      getByid("AIModelSelect").value != "ICH" &&
      getByid("AIModelSelect").value != "BC" &&
      getByid("AIModelSelect").value != "BrainTumors") ||
    (getByid("AIModelSelect").value == "BC" && markH == 0 && markW == 0)
  ) {
    getByid("errorMessage").innerHTML = "資料有誤，請重新使用一次";
    return;
  }

  getByid("circle").style.display = "";
  getByid("handFilterReport").style.display = "none";

  for (var i = 0; i < GetViewport().DicomTagsList.length; i++) {
    if (GetViewport().DicomTagsList[i][1] == "StudyInstanceUID") {
      StudyInstanceUID = GetViewport().DicomTagsList[i][2];
    } else if (GetViewport().DicomTagsList[i][1] == "SeriesInstanceUID") {
      SeriesInstanceUID = GetViewport().DicomTagsList[i][2];
    } else if (GetViewport().DicomTagsList[i][1] == "SOPInstanceUID") {
      SOPInstanceUID = GetViewport().DicomTagsList[i][2];
    }
  }

  if (
    aimodelname == "SMART5" ||
    aimodelname == "ICH" ||
    aimodelname == "BrainTumors"
  ) {
    data = {
      studyInstanceUid: StudyInstanceUID,
    };
  } else if (aimodelname == "BC") {
    data = {
      studyInstanceUid: StudyInstanceUID,
      seriesInstanceUid: SeriesInstanceUID,
      sopInstanceUid: SOPInstanceUID,
      coordinate: { x: markX, y: markY, w: markW, h: markH },
      reload: "true",
    };
  } else if (Multiple == "Single") {
    data = {
      studyInstanceUid: StudyInstanceUID,
      seriesInstanceUid: SeriesInstanceUID,
      sopInstanceUid: SOPInstanceUID,
    };
  } else if (Multiple == "Multiple") {
    var data = {
      studyInstanceUid: StudyInstanceUID,
      seriesInstanceUid: SeriesInstanceUID,
    };
  }

  //手部
  if (aimodelname == "Yolo4") {
    axios
      .post("yolov4", data)
      .then(function (response) {
        if (response.status == 200 && Multiple == "Single") {
          getByid("circle").style.display = "none";
          getByid("rerunmodel").style.display = "";
          blob(response.data._streams[1].data);
          yv4s++;
        } else if (response.status == 200 && Multiple == "Multiple") {
          getByid("circle").style.display = "none";
          getByid("rerunmodel").style.display = "";
          var j = 0;
          for (var i = 0; i < response.data._streams.length; i += 3) {
            aiInfoArray[j] = response.data._streams[i + 1].data;
            j++;
          }
          for (var i = 0; i < aiInfoArray.length; i++) {
            blob(aiInfoArray[i]);
          }
          yv4m++;
        }
      })
      .catch(function (error) {
        if (error.status == 400) {
          getByid("circle").style.display = "none";
          getByid("errorMessage").innerHTML = "PACS No such file";
          console.error("Request Error：", error);
        } else if (error.status == 422) {
          getByid("circle").style.display = "none";
          getByid("errorMessage").innerHTML = "MongoDB Error";
          console.error("Request Error：", error);
        } else if (error.status == 500) {
          getByid("circle").style.display = "none";
          getByid("errorMessage").innerHTML = "AI Server Error";
          console.error("Request Error：", error);
        }
      });
  } else if (aimodelname == "handFilter") {
    axios
      .post("handfilter", data)
      .then(function (response) {
        if (response.status == 200 && Multiple == "Single") {
          getByid("circle").style.display = "none";
          getByid("rerunmodel").style.display = "";
          handFilter(response.data);
          hfs++;
        } else if (response.status == 200 && Multiple == "Multiple") {
          getByid("circle").style.display = "none";
          getByid("rerunmodel").style.display = "";
          handFilter(response.data);
          hfm++;
        }
      })
      .catch(function (error) {
        if (error.status == 400) {
          getByid("circle").style.display = "none";
          getByid("errorMessage").innerHTML = "PACS No such file";
          console.error("Request Error：", error);
        } else if (error.status == 422) {
          getByid("circle").style.display = "none";
          getByid("errorMessage").innerHTML = "MongoDB Error";
          console.error("Request Error：", error);
        } else if (error.status == 500) {
          getByid("circle").style.display = "none";
          getByid("errorMessage").innerHTML = "AI Server Error";
          console.error("Request Error：", error);
        }
      });
  } else if (aimodelname == "Yolo7") {
    axios
      .post("yolov7", data)
      .then(function (response) {
        if (response.status == 200 && Multiple == "Single") {
          getByid("circle").style.display = "none";
          getByid("rerunmodel").style.display = "";
          blob(response.data._streams[1].data);
          yv7s++;
        } else if (response.status == 200 && Multiple == "Multiple") {
          getByid("circle").style.display = "none";
          getByid("rerunmodel").style.display = "";
          var j = 0;
          for (var i = 0; i < response.data._streams.length; i += 3) {
            aiInfoArray[j] = response.data._streams[i + 1].data;
            j++;
          }
          for (var i = 0; i < aiInfoArray.length; i++) {
            blob(aiInfoArray[i]);
          }
          yv7m++;
        }
      })
      .catch(function (error) {
        if (error.status == 400) {
          getByid("circle").style.display = "none";
          getByid("errorMessage").innerHTML = "PACS No such file";
          console.error("Request Error：", error);
        } else if (error.status == 422) {
          getByid("circle").style.display = "none";
          getByid("errorMessage").innerHTML = "MongoDB Error";
          console.error("Request Error：", error);
        } else if (error.status == 500) {
          getByid("circle").style.display = "none";
          getByid("errorMessage").innerHTML = "AI Server Error";
          console.error("Request Error：", error);
        }
      });
  } else if (aimodelname == "Yolo7Original") {
    axios
      .post("yolov7Origin", data)
      .then(function (response) {
        if (response.status == 200 && Multiple == "Single") {
          getByid("circle").style.display = "none";
          getByid("rerunmodel").style.display = "";
          blob(response.data._streams[1].data);
          yv7os++;
        } else if (response.status == 200 && Multiple == "Multiple") {
          getByid("circle").style.display = "none";
          getByid("rerunmodel").style.display = "";
          var j = 0;
          for (var i = 0; i < response.data._streams.length; i += 3) {
            aiInfoArray[j] = response.data._streams[i + 1].data;
            j++;
          }
          for (var i = 0; i < aiInfoArray.length; i++) {
            blob(aiInfoArray[i]);
          }
          yv7om++;
        }
      })
      .catch(function (error) {
        if (error.status == 400) {
          getByid("circle").style.display = "none";
          getByid("errorMessage").innerHTML = "PACS No such file";
          console.error("Request Error：", error);
        } else if (error.status == 422) {
          getByid("circle").style.display = "none";
          getByid("errorMessage").innerHTML = "MongoDB Error";
          console.error("Request Error：", error);
        } else if (error.status == 500) {
          getByid("circle").style.display = "none";
          getByid("errorMessage").innerHTML = "AI Server Error";
          console.error("Request Error：", error);
        }
      });
  }
  //腦部
  else if (aimodelname == "SMART5") {
    axios
      .post("smart5", data)
      .then(function (response) {
        getByid("circle").style.display = "none";
        getByid("rerunmodel").style.display = "";
        blob(response.data._streams[1].data);
        sm5++;
      })
      .catch(function (error) {
        if (error.status == 400) {
          getByid("circle").style.display = "none";
          getByid("errorMessage").innerHTML = "PACS No such file";
          console.error("Request Error：", error);
        } else if (error.status == 422) {
          getByid("circle").style.display = "none";
          getByid("errorMessage").innerHTML = "MongoDB Error";
          console.error("Request Error：", error);
        } else if (error.status == 500) {
          getByid("circle").style.display = "none";
          getByid("errorMessage").innerHTML = "AI Server Error";
          console.error("Request Error：", error);
        }
      });
  } else if (aimodelname == "ICH") {
    axios
      .post("ich", data)
      .then(function (response) {
        getByid("circle").style.display = "none";
        getByid("rerunmodel").style.display = "";
        var j = 0;
        for (var i = 0; i < response.data._streams.length; i += 3) {
          aiInfoArray[j] = response.data._streams[i + 1].data;
          j++;
        }
        for (var i = 0; i < aiInfoArray.length; i++) {
          blob(aiInfoArray[i]);
        }
        ich++;
      })
      .catch(function (error) {
        if (error.status == 400) {
          getByid("circle").style.display = "none";
          getByid("errorMessage").innerHTML = "PACS No such file";
          console.error("Request Error：", error);
        } else if (error.status == 422) {
          getByid("circle").style.display = "none";
          getByid("errorMessage").innerHTML = "MongoDB Error";
          console.error("Request Error：", error);
        } else if (error.status == 500) {
          getByid("circle").style.display = "none";
          getByid("errorMessage").innerHTML = "AI Server Error";
          console.error("Request Error：", error);
        }
      });
  } else if (aimodelname == "BrainTumors") {
    axios
      .post("brainTumors", data)
      .then(function (response) {
        getByid("circle").style.display = "none";
        getByid("rerunmodel").style.display = "";
        blob(response.data._streams[1].data);
        bt++;
      })
      .catch(function (error) {
        if (error.status == 400) {
          getByid("circle").style.display = "none";
          getByid("errorMessage").innerHTML = "PACS No such file";
          console.error("Request Error：", error);
        } else if (error.status == 422) {
          getByid("circle").style.display = "none";
          getByid("errorMessage").innerHTML = "MongoDB Error";
          console.error("Request Error：", error);
        } else if (error.status == 500) {
          getByid("circle").style.display = "none";
          getByid("errorMessage").innerHTML = "AI Server Error";
          console.error("Request Error：", error);
        }
      });
  }
  //肺部
  else if (aimodelname == "Yolo3") {
    axios
      .post("yolov3", data)
      .then(function (response) {
        if (response.status == 200 && Multiple == "Single") {
          getByid("circle").style.display = "none";
          getByid("rerunmodel").style.display = "";
          blob(response.data._streams[1].data);
          yv3s++;
        } else if (response.status == 200 && Multiple == "Multiple") {
          getByid("circle").style.display = "none";
          getByid("rerunmodel").style.display = "";
          var j = 0;
          for (var i = 0; i < response.data._streams.length; i += 3) {
            aiInfoArray[j] = response.data._streams[i + 1].data;
            j++;
          }
          for (var i = 0; i < aiInfoArray.length; i++) {
            blob(aiInfoArray[i]);
          }
          yv3m++;
        }
      })
      .catch(function (error) {
        if (error.status == 400) {
          getByid("circle").style.display = "none";
          getByid("errorMessage").innerHTML = "PACS No such file";
          console.error("Request Error：", error);
        } else if (error.status == 422) {
          getByid("circle").style.display = "none";
          getByid("errorMessage").innerHTML = "MongoDB Error";
          console.error("Request Error：", error);
        } else if (error.status == 500) {
          getByid("circle").style.display = "none";
          getByid("errorMessage").innerHTML = "AI Server Error";
          console.error("Request Error：", error);
        }
      });
  } else if (aimodelname == "Yolo8") {
    axios
      .post("yolov8", data)
      .then(function (response) {
        if (response.status == 200 && Multiple == "Single") {
          getByid("circle").style.display = "none";
          getByid("rerunmodel").style.display = "";
          blob(response.data._streams[1].data);
          yv8s++;
        } else if (response.status == 200 && Multiple == "Multiple") {
          getByid("circle").style.display = "none";
          getByid("rerunmodel").style.display = "";
          var j = 0;
          for (var i = 0; i < response.data._streams.length; i += 3) {
            aiInfoArray[j] = response.data._streams[i + 1].data;
            j++;
          }
          for (var i = 0; i < aiInfoArray.length; i++) {
            blob(aiInfoArray[i]);
          }
          yv8m++;
        }
      })
      .catch(function (error) {
        if (error.status == 400) {
          getByid("circle").style.display = "none";
          getByid("errorMessage").innerHTML = "PACS No such file";
          console.error("Request Error：", error);
        } else if (error.status == 422) {
          getByid("circle").style.display = "none";
          getByid("errorMessage").innerHTML = "MongoDB Error";
          console.error("Request Error：", error);
        } else if (error.status == 500) {
          getByid("circle").style.display = "none";
          getByid("errorMessage").innerHTML = "AI Server Error";
          console.error("Request Error：", error);
        }
      });
  }
  //胸部
  else if (aimodelname == "BC") {
    axios
      .post("breast", data)
      .then(function (response) {
        getByid("circle").style.display = "none";
        getByid("rerunmodel").style.display = "";
        blob(response.data._streams[1].data);
        bc++;
      })
      .catch(function (error) {
        if (error.status == 400) {
          getByid("circle").style.display = "none";
          getByid("errorMessage").innerHTML = "PACS No such file";
          console.error("Request Error：", error);
        } else if (error.status == 422) {
          getByid("circle").style.display = "none";
          getByid("errorMessage").innerHTML = "MongoDB Error";
          console.error("Request Error：", error);
        } else if (error.status == 500) {
          getByid("circle").style.display = "none";
          getByid("errorMessage").innerHTML = "AI Server Error";
          console.error("Request Error：", error);
        }
      });
  }
};

getByid("rerunmodel").onclick = function () {
  var StudyInstanceUID, SeriesInstanceUID, SOPInstanceUID, data;
  handReport = [];
  //   deleteMark();

  getByid("errorMessage").style.display = "";
  getByid("errorMessage").innerHTML = "";

  getByid("circle").style.display = "";
  getByid("handFilterReport").style.display = "none";

  if (
    getByid("AIModelSelect").value == "" ||
    (getByid("mulSelect").value == "" &&
      getByid("AIModelSelect").value != "SMART5" &&
      getByid("AIModelSelect").value != "ICH" &&
      getByid("AIModelSelect").value != "BC" &&
      getByid("AIModelSelect").value != "BrainTumors") ||
    (getByid("AIModelSelect").value == "BC" && markH == 0 && markW == 0)
  ) {
    getByid("errorMessage").innerHTML = "Error,Please Try Again Later";
    return;
  }

  for (var i = 0; i < GetViewport().DicomTagsList.length; i++) {
    if (GetViewport().DicomTagsList[i][1] == "StudyInstanceUID") {
      StudyInstanceUID = GetViewport().DicomTagsList[i][2];
    } else if (GetViewport().DicomTagsList[i][1] == "SeriesInstanceUID") {
      SeriesInstanceUID = GetViewport().DicomTagsList[i][2];
    } else if (GetViewport().DicomTagsList[i][1] == "SOPInstanceUID") {
      SOPInstanceUID = GetViewport().DicomTagsList[i][2];
    }
  }

  if (
    aimodelname == "SMART5" ||
    aimodelname == "ICH" ||
    aimodelname == "BrainTumors"
  ) {
    data = {
      studyInstanceUid: StudyInstanceUID,
      reload: "true",
    };
  } else if (aimodelname == "BC") {
    data = {
      studyInstanceUid: StudyInstanceUID,
      seriesInstanceUid: SeriesInstanceUID,
      sopInstanceUid: SOPInstanceUID,
      coordinate: { x: markX, y: markY, w: markW, h: markH },
      reload: "true",
    };
  } else if (Multiple == "Single") {
    data = {
      studyInstanceUid: StudyInstanceUID,
      seriesInstanceUid: SeriesInstanceUID,
      sopInstanceUid: SOPInstanceUID,
      reload: "true",
    };
  } else if (Multiple == "Multiple") {
    var data = {
      studyInstanceUid: StudyInstanceUID,
      seriesInstanceUid: SeriesInstanceUID,
      reload: "true",
    };
  }

  //手部
  if (aimodelname == "Yolo4") {
    // deleteMark();
    axios
      .post("yolov4", data)
      .then(function (response) {
        if (response.status == 200 && Multiple == "Single") {
          getByid("circle").style.display = "none";
          blob(response.data._streams[1].data);
        } else if (response.status == 200 && Multiple == "Multiple") {
          getByid("circle").style.display = "none";
          var j = 0;
          for (var i = 0; i < response.data._streams.length; i += 3) {
            aiInfoArray[j] = response.data._streams[i + 1].data;
            j++;
          }
          for (var i = 0; i < aiInfoArray.length; i++) {
            blob(aiInfoArray[i]);
          }
        }
      })
      .catch(function (error) {
        if (error.status == 400) {
          getByid("circle").style.display = "none";
          getByid("errorMessage").innerHTML = "PACS No such file";
          console.error("Request Error：", error);
        } else if (error.status == 422) {
          getByid("circle").style.display = "none";
          getByid("errorMessage").innerHTML = "MongoDB Error";
          console.error("Request Error：", error);
        } else if (error.status == 500) {
          getByid("circle").style.display = "none";
          getByid("errorMessage").innerHTML = "AI Server Error";
          console.error("Request Error：", error);
        }
      });
  } else if (aimodelname == "handFilter") {
    handReport = [];
    axios
      .post("handfilter", data)
      .then(function (response) {
        if (response.status == 200 && Multiple == "Single") {
          getByid("circle").style.display = "none";
          getByid("rerunmodel").style.display = "";
          handFilter(response.data);
        } else if (response.status == 200 && Multiple == "Multiple") {
          getByid("circle").style.display = "none";
          getByid("rerunmodel").style.display = "";
          handFilter(response.data);
        }
      })
      .catch(function (error) {
        if (error.status == 400) {
          getByid("circle").style.display = "none";
          getByid("errorMessage").innerHTML = "PACS No such file";
          console.error("Request Error：", error);
        } else if (error.status == 422) {
          getByid("circle").style.display = "none";
          getByid("errorMessage").innerHTML = "MongoDB Error";
          console.error("Request Error：", error);
        } else if (error.status == 500) {
          getByid("circle").style.display = "none";
          getByid("errorMessage").innerHTML = "AI Server Error";
          console.error("Request Error：", error);
        }
      });
  } else if (aimodelname == "Yolo7") {
    // deleteMark();
    axios
      .post("yolov7", data)
      .then(function (response) {
        if (response.status == 200 && Multiple == "Single") {
          getByid("circle").style.display = "none";
          blob(response.data._streams[1].data);
        } else if (response.status == 200 && Multiple == "Multiple") {
          getByid("circle").style.display = "none";
          var j = 0;
          for (var i = 0; i < response.data._streams.length; i += 3) {
            aiInfoArray[j] = response.data._streams[i + 1].data;
            j++;
          }
          for (var i = 0; i < aiInfoArray.length; i++) {
            blob(aiInfoArray[i]);
          }
        }
      })
      .catch(function (error) {
        if (error.status == 400) {
          getByid("circle").style.display = "none";
          getByid("errorMessage").innerHTML = "PACS No such file";
          console.error("Request Error：", error);
        } else if (error.status == 422) {
          getByid("circle").style.display = "none";
          getByid("errorMessage").innerHTML = "MongoDB Error";
          console.error("Request Error：", error);
        } else if (error.status == 500) {
          getByid("circle").style.display = "none";
          getByid("errorMessage").innerHTML = "AI Server Error";
          console.error("Request Error：", error);
        }
      });
  } else if (aimodelname == "Yolo7Original") {
    // deleteMark();
    axios
      .post("yolov7Origin", data)
      .then(function (response) {
        if (response.status == 200 && Multiple == "Single") {
          getByid("circle").style.display = "none";
          blob(response.data._streams[1].data);
        } else if (response.status == 200 && Multiple == "Multiple") {
          getByid("circle").style.display = "none";
          var j = 0;
          for (var i = 0; i < response.data._streams.length; i += 3) {
            aiInfoArray[j] = response.data._streams[i + 1].data;
            j++;
          }
          for (var i = 0; i < aiInfoArray.length; i++) {
            blob(aiInfoArray[i]);
          }
        }
      })
      .catch(function (error) {
        if (error.status == 400) {
          getByid("circle").style.display = "none";
          getByid("errorMessage").innerHTML = "PACS No such file";
          console.error("Request Error：", error);
        } else if (error.status == 422) {
          getByid("circle").style.display = "none";
          getByid("errorMessage").innerHTML = "MongoDB Error";
          console.error("Request Error：", error);
        } else if (error.status == 500) {
          getByid("circle").style.display = "none";
          getByid("errorMessage").innerHTML = "AI Server Error";
          console.error("Request Error：", error);
        }
      });
  }
  //腦部
  else if (aimodelname == "SMART5") {
    axios
      .post("smart5", data)
      .then(function (response) {
        getByid("circle").style.display = "none";
        getByid("rerunmodel").style.display = "";
        blob(response.data._streams[1].data);
      })
      .catch(function (error) {
        if (error.status == 400) {
          getByid("circle").style.display = "none";
          getByid("errorMessage").innerHTML = "PACS No such file";
          console.error("Request Error：", error);
        } else if (error.status == 422) {
          getByid("circle").style.display = "none";
          getByid("errorMessage").innerHTML = "MongoDB Error";
          console.error("Request Error：", error);
        } else if (error.status == 500) {
          getByid("circle").style.display = "none";
          getByid("errorMessage").innerHTML = "AI Server Error";
          console.error("Request Error：", error);
        }
      });
  } else if (aimodelname == "ICH") {
    axios
      .post("ich", data)
      .then(function (response) {
        getByid("circle").style.display = "none";
        getByid("rerunmodel").style.display = "";
        var j = 0;
        for (var i = 0; i < response.data._streams.length; i += 3) {
          aiInfoArray[j] = response.data._streams[i + 1].data;
          j++;
        }
        for (var i = 0; i < aiInfoArray.length; i++) {
          blob(aiInfoArray[i]);
        }
      })
      .catch(function (error) {
        if (error.status == 400) {
          getByid("circle").style.display = "none";
          getByid("errorMessage").innerHTML = "PACS No such file";
          console.error("Request Error：", error);
        } else if (error.status == 422) {
          getByid("circle").style.display = "none";
          getByid("errorMessage").innerHTML = "MongoDB Error";
          console.error("Request Error：", error);
        } else if (error.status == 500) {
          getByid("circle").style.display = "none";
          getByid("errorMessage").innerHTML = "AI Server Error";
          console.error("Request Error：", error);
        }
      });
  } else if (aimodelname == "BrainTumors") {
    axios
      .post("brainTumors", data)
      .then(function (response) {
        getByid("circle").style.display = "none";
        getByid("rerunmodel").style.display = "";
        blob(response.data._streams[1].data);
      })
      .catch(function (error) {
        if (error.status == 400) {
          getByid("circle").style.display = "none";
          getByid("errorMessage").innerHTML = "PACS No such file";
          console.error("Request Error：", error);
        } else if (error.status == 422) {
          getByid("circle").style.display = "none";
          getByid("errorMessage").innerHTML = "MongoDB Error";
          console.error("Request Error：", error);
        } else if (error.status == 500) {
          getByid("circle").style.display = "none";
          getByid("errorMessage").innerHTML = "AI Server Error";
          console.error("Request Error：", error);
        }
      });
  }
  //肺部
  else if (aimodelname == "Yolo3") {
    // deleteMark();
    axios
      .post("yolov3", data)
      .then(function (response) {
        if (response.status == 200 && Multiple == "Single") {
          getByid("circle").style.display = "none";
          blob(response.data._streams[1].data);
        } else if (response.status == 200 && Multiple == "Multiple") {
          getByid("circle").style.display = "none";
          var j = 0;
          for (var i = 0; i < response.data._streams.length; i += 3) {
            aiInfoArray[j] = response.data._streams[i + 1].data;
            j++;
          }
          for (var i = 0; i < aiInfoArray.length; i++) {
            blob(aiInfoArray[i]);
          }
        }
      })
      .catch(function (error) {
        if (error.status == 400) {
          getByid("circle").style.display = "none";
          getByid("errorMessage").innerHTML = "PACS No such file";
          console.error("Request Error：", error);
        } else if (error.status == 422) {
          getByid("circle").style.display = "none";
          getByid("errorMessage").innerHTML = "MongoDB Error";
          console.error("Request Error：", error);
        } else if (error.status == 500) {
          getByid("circle").style.display = "none";
          getByid("errorMessage").innerHTML = "AI Server Error";
          console.error("Request Error：", error);
        }
      });
  } else if (aimodelname == "Yolo8") {
    // deleteMark();
    axios
      .post("yolov8", data)
      .then(function (response) {
        if (response.status == 200 && Multiple == "Single") {
          getByid("circle").style.display = "none";
          blob(response.data._streams[1].data);
        } else if (response.status == 200 && Multiple == "Multiple") {
          getByid("circle").style.display = "none";
          var j = 0;
          for (var i = 0; i < response.data._streams.length; i += 3) {
            aiInfoArray[j] = response.data._streams[i + 1].data;
            j++;
          }
          for (var i = 0; i < aiInfoArray.length; i++) {
            blob(aiInfoArray[i]);
          }
        }
      })
      .catch(function (error) {
        if (error.status == 400) {
          getByid("circle").style.display = "none";
          getByid("errorMessage").innerHTML = "PACS No such file";
          console.error("Request Error：", error);
        } else if (error.status == 422) {
          getByid("circle").style.display = "none";
          getByid("errorMessage").innerHTML = "MongoDB Error";
          console.error("Request Error：", error);
        } else if (error.status == 500) {
          getByid("circle").style.display = "none";
          getByid("errorMessage").innerHTML = "AI Server Error";
          console.error("Request Error：", error);
        }
      });
  }
  //胸部
  else if (aimodelname == "BC") {
    // deleteMark();
    axios
      .post("breast", data)
      .then(function (response) {
        getByid("circle").style.display = "none";
        blob(response.data._streams[1].data);
      })
      .catch(function (error) {
        if (error.status == 400) {
          getByid("circle").style.display = "none";
          getByid("errorMessage").innerHTML = "PACS No such file";
          console.error("Request Error：", error);
        } else if (error.status == 422) {
          getByid("circle").style.display = "none";
          getByid("errorMessage").innerHTML = "MongoDB Error";
          console.error("Request Error：", error);
        } else if (error.status == 500) {
          getByid("circle").style.display = "none";
          getByid("errorMessage").innerHTML = "AI Server Error";
          console.error("Request Error：", error);
        }
      });
  }
};
//執行AI Model 事件

window.addEventListener("wheel", () => {
  if (!handReport || handReport.length === 0) {
    return;
  }

  var SOPInstanceUID, Report;
  for (var i = 0; i < GetViewport().DicomTagsList.length; i++) {
    if (GetViewport().DicomTagsList[i][1] == "SOPInstanceUID") {
      SOPInstanceUID = GetViewport().DicomTagsList[i][2];
    }
  }

  for (var i = 0; i < handReport.length; i++) {
    if (SOPInstanceUID == handReport[i].SOPInstanceUID) {
      Report = handReport[i].Report;
    }
  }
  updateReport(SOPInstanceUID, Report);
});

window.addEventListener("click", () => {
  if (!handReport || handReport.length === 0) {
    return;
  }

  var SOPInstanceUID, Report;
  for (var i = 0; i < GetViewport().DicomTagsList.length; i++) {
    if (GetViewport().DicomTagsList[i][1] == "SOPInstanceUID") {
      SOPInstanceUID = GetViewport().DicomTagsList[i][2];
    }
  }

  for (var i = 0; i < handReport.length; i++) {
    if (SOPInstanceUID == handReport[i].SOPInstanceUID) {
      Report = handReport[i].Report;
    }
  }
  updateReport(SOPInstanceUID, Report);
});
