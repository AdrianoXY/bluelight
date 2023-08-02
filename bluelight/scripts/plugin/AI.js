var openAIModel = false;
let aimodelname, Multiple;
let aiInfoArray = [];
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
        <span style="color: white;" id="AIModelSpan">AI Model:</span>
        <select id="AIModelSelect">
        <option selected="selected"></option>
        <option id="AIModelYolo3">Yolo3</option>
        <option id="AIModelYolo8">Yolo8</option>
        </select>
        <span style="color: white;" id="multiple">Multiple:</span>
        <Select id="mulSelect">
        <option selected="selected>""</option>
        <option id="single">Single</option>
        <option id="multi">Multiple</option>
        </select>
        <button id="runmodel">Run</button>
        <div id="circle" style="border: 8px solid #f3f3f3;
        border-top: 8px solid #3498db;
        border-radius: 50%;
        width: 12px;
        height: 12px;
        animation: spin 2s linear infinite;"></div>
      </div>`;
  getByid("page-header").appendChild(span);
  getByid("AIModeldiv").style.display = "none";
  getByid("circle").style.display = "none";
}
loadAIModel();

getByid("AIModelSelect").onchange = function (e) {
  aimodelname = e.target.value;
};

getByid("mulSelect").onchange = function (e) {
  Multiple = e.target.value;
};

getByid("AIModel").onclick = function () {
  openAIModel = !openAIModel;
  this.src = openAIModel
    ? "../image/icon/black/Model_ON.png"
    : "../image/icon/black/Model_OFF.png";
  if (openAIModel == true) {
    getByid("AIModeldiv").style.display = "";
  } else getByid("AIModeldiv").style.display = "none";
};

getByid("runmodel").onclick = function () {
  var StudyInstanceUID, SeriesInstanceUID, SOPInstanceUID, data;
  getByid("circle").style.display = "";
  for (var i = 0; i < GetViewport().DicomTagsList.length; i++) {
    if (GetViewport().DicomTagsList[i][1] == "StudyInstanceUID") {
      StudyInstanceUID = GetViewport().DicomTagsList[i][2];
    } else if (GetViewport().DicomTagsList[i][1] == "SeriesInstanceUID") {
      SeriesInstanceUID = GetViewport().DicomTagsList[i][2];
    } else if (GetViewport().DicomTagsList[i][1] == "SOPInstanceUID") {
      SOPInstanceUID = GetViewport().DicomTagsList[i][2];
    }
  }

  if (Multiple == "Single") {
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
      .post("http://127.0.0.1:3002/api/aimodel/yolov3", data)
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
    axios
      .post("http://127.0.0.1:3002/api/aimodel/yolov8", data)
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
  }
};

async function blob(streamsData) {
  try {
    resetViewport();
    var arrayBuffer = new Uint8Array(streamsData).buffer;
    console.log(arrayBuffer);
    var blob = new Blob([arrayBuffer]);
    console.log(blob);
    const url = URL.createObjectURL(blob);
    console.log(url);

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
