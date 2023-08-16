var openAIModel = false;
var yv3s = 0,
  yv3m = 0;
yv4s = 0;
yv4m = 0;
yv8s = 0;
yv8m = 0;
hfs = 0;
hfm = 0;
sm5 = 0;
let aimodelname, Multiple;
let aiInfoArray = [];
let handReport = [];

axios.defaults.baseURL = "http://192.168.20.133/ghlBackend/ghl/api/aimodel";

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
        </select>
        <span style="color: white;" id="AIModelSpan">AI Model:</span>
        <select id="AIModelSelect">
        <option selected="selected"></option>
        <option id="Yolo3">Yolo3</option>
        <option id="Yolo4">Yolo4</option>
        <option id="Yolo8">Yolo8</option>
        <option id="handFilter">handFilter</option>
        <option id="Smart5">SMART5</option>
        </select>
        <span style="color: white;" id="multiple">Multiple:</span>
        <Select id="mulSelect">
        <option selected="selected>""</option>
        <option id="single">Single</option>
        <option id="multi">Multiple</option>
        </select>
        <button id="runmodel">Run</button>
        <button id="rerunmodel">Rerun</button>
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
  getByid("Yolo3").style.display = "none";
  getByid("Yolo8").style.display = "none";
  getByid("Yolo4").style.display = "none";
  getByid("handFilter").style.display = "none";
  getByid("Smart5").style.display = "none";
  getByid("circle").style.display = "none";
  getByid("rerunmodel").style.display = "none";
}
loadAIModel();

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

function Hidden() {
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

  if (aimodelname == "Yolo4" && Multiple == "Single" && yv4s > 0) {
    getByid("rerunmodel").style.display = "";
  } else if (aimodelname == "Yolo4" && Multiple == "Single" && yv4s == 0) {
    getByid("rerunmodel").style.display = "none";
  }

  if (aimodelname == "Yolo8" && Multiple == "Multiple" && yv8m > 0) {
    getByid("rerunmodel").style.display = "";
  } else if (aimodelname == "Yolo8" && Multiple == "Multiple" && yv8m == 0) {
    getByid("rerunmodel").style.display = "none";
  }

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

  if (aimodelname == "SMART5" && sm5 > 0) {
    getByid("rerunmodel").style.display = "";
  } else if (aimodelname == "SMART5" && sm5 == 0) {
    getByid("rerunmodel").style.display = "none";
  }

  if (aimodelname == "SMART5") {
    getByid("mulSelect").style.display = "none";
    getByid("multiple").style.display = "none";
    getByid("mulSelect").value = "";
  } else if (aimodelname != "SMART5") {
    getByid("mulSelect").style.display = "";
    getByid("multiple").style.display = "";
  }
}

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

function deleteMark() {
  PatientMark = [];
  for (var i = 0; i < Viewport_Total; i++) {
    var sop = GetViewport(i).sop;
    loadAndViewImage(getImgaeIdFromSop(sop), i);
  }
}

getByid("Bodypart").onchange = function () {
  if (getByid("Bodypart").value == "Hand") {
    getByid("handFilter").style.display = "";
    getByid("Yolo3").style.display = "none";
    getByid("Yolo8").style.display = "none";
    getByid("Yolo4").style.display = "";
    getByid("Smart5").style.display = "none";
    getByid("AIModelSelect").value = "";
  } else if (getByid("Bodypart").value == "Brain") {
    getByid("Smart5").style.display = "";
    getByid("Yolo3").style.display = "none";
    getByid("Yolo8").style.display = "none";
    getByid("Yolo4").style.display = "none";
    getByid("AIModelSelect").value = "";
    getByid("handFilter").style.display = "none";
  } else if (getByid("Bodypart").value == "lung") {
    getByid("Yolo3").style.display = "";
    getByid("Yolo8").style.display = "";
    getByid("Yolo4").style.display = "none";
    getByid("handFilter").style.display = "none";
    getByid("Smart5").style.display = "none";
    getByid("AIModelSelect").value = "";
  }
};

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

getByid("AIModelSelect").onchange = function (e) {
  aimodelname = e.target.value;
  Hidden();
};

getByid("mulSelect").onchange = function (e) {
  Multiple = e.target.value;
  Hidden();
};

getByid("runmodel").onclick = function () {
  var StudyInstanceUID, SeriesInstanceUID, SOPInstanceUID, data;
  handReport = [];
  deleteMark();

  if (
    getByid("AIModelSelect").value == "" ||
    (getByid("mulSelect").value == "" &&
      getByid("AIModelSelect").value != "SMART5")
  ) {
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

  if (aimodelname == "SMART5") {
    data = {
      studyInstanceUid: StudyInstanceUID,
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

  if (aimodelname == "Yolo3") {
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
        getByid("circle").style.display = "none";
        console.error("請求失敗：", error);
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
        getByid("circle").style.display = "none";
        console.error("請求失敗：", error);
      });
  } else if (aimodelname == "Yolo4") {
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
        getByid("circle").style.display = "none";
        console.error("請求失敗：", error);
      });
  } else if (aimodelname == "handFilter") {
    console.log("1");
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
        getByid("circle").style.display = "none";
        console.error("請求失敗：", error);
      });
  } else if (aimodelname == "SMART5") {
    axios
      .post("smart5", data)
      .then(function (response) {
        getByid("circle").style.display = "none";
        getByid("rerunmodel").style.display = "";
        blob(response.data._streams[1].data);
        sm5++;
      })
      .catch(function (error) {
        getByid("circle").style.display = "none";
        console.error("請求失敗：", error);
      });
  }
};

getByid("rerunmodel").onclick = function () {
  var StudyInstanceUID, SeriesInstanceUID, SOPInstanceUID, data;
  handReport = [];
  deleteMark();

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

  if (aimodelname == "SMART5") {
    data = {
      studyInstanceUid: StudyInstanceUID,
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

  if (aimodelname == "Yolo3") {
    deleteMark();
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
        getByid("circle").style.display = "none";
        console.error("請求失敗：", error);
      });
  } else if (aimodelname == "Yolo8") {
    deleteMark();
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
        getByid("circle").style.display = "none";
        console.error("請求失敗：", error);
      });
  } else if (aimodelname == "Yolo4") {
    deleteMark();
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
        getByid("circle").style.display = "none";
        console.error("請求失敗：", error);
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
        getByid("circle").style.display = "none";
        console.error("請求失敗：", error);
      });
  } else if (aimodelname == "SMART5") {
    axios
      .post("smart5", data)
      .then(function (response) {
        getByid("circle").style.display = "none";
        getByid("rerunmodel").style.display = "";
        blob(response.data._streams[1].data);
      })
      .catch(function (error) {
        getByid("circle").style.display = "none";
        console.error("請求失敗：", error);
      });
  }
};

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
