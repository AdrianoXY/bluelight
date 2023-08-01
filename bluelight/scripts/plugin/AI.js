var openAIModel = false;
let aimodelname, Multiple, aiInfo, url;
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
        <div id="circle" style="border: 8px solid #f3f3f3; /* Light grey */
        border-top: 8px solid #3498db; /* Blue */
        border-radius: 50%;
        width: 12px;
        height: 12px;
        animation: spin 2s linear infinite;"
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
          aiInfo = response.data.airesult;
          console.log(aiInfo);
        } else if (response.status == 200 && Multiple == "Multiple") {
          getByid("circle").style.display = "none";
          for (var i = 0; i < response.data.length; i++) {
            aiInfoArray[i] = response.data[i].airesult;
          }
          console.log(aiInfoArray);
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
          console.log(response.data);
          loadImageFromArrayBuffer(response.data);
        } else if (response.status == 200 && Multiple == "Multiple") {
          getByid("circle").style.display = "none";
          for (var i = 0; i < response.data.length; i++) {
            aiInfoArray[i] = response.data[i].airesult;
          }
          console.log(aiInfoArray);
        }
      })
      .catch(function (error) {
        getByid("circle").style.display = "none";
        console.error("請求失敗：", error);
      });
  }
};

function loadImageFromArrayBuffer(response) {
  // Assuming '_streams' contains the array of streams
  var streams = response._streams;

  // Assuming the second element in the 'streams' array contains the .dcm file data
  var dcmBuffer = streams[1].data;

  // Use dicomParser to parse the .dcm file
  var dataSet = dicomParser.parseDicom(new Uint8Array(dcmBuffer));

  // Get the pixel data
  var pixelDataElement = dataSet.elements.x7fe00010;
  var pixelData = new Uint8Array(
    dataSet.byteArray.buffer,
    pixelDataElement.dataOffset,
    pixelDataElement.length
  );

  // Assuming the image width and height are known, you can replace them with actual values
  var width = 512;
  var height = 512;

  // Create a canvas element and set its width and height
  var canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  // Append the canvas to the DOM
  document.body.appendChild(canvas);

  // Get the 2D context of the canvas
  var ctx = canvas.getContext("2d");

  // Create an ImageData object with the pixel data
  var imageData = ctx.createImageData(width, height);
  imageData.data.set(pixelData);

  // Draw the image data on the canvas
  ctx.putImageData(imageData, 0, 0);
}

function loadFileFromURL(url) {
  function basename(path) {
    return path.split(".").reverse()[0];
  }

  if (basename(url) == "mht") {
    wadorsLoader(url);
  } else {
    loadAndViewImage("wadouri:" + url);

    function load(time) {
      return new Promise((resolve) => setTimeout(resolve, time));
    }

    load(100).then(() => {
      readXML(url);
      readDicom(url, PatientMark, true);
    });
  }
}

function processFormData(formData) {
  var file = formData.get("file"); // 假設檔案的 key 是 "file"，請根據實際情況修改 key

  if (file instanceof File) {
    // 如果是 File 物件，則處理為 URL 並加載檔案
    var url = URL.createObjectURL(file);
    loadFileFromURL(url);
  } else {
    // 若不是 File 物件，請處理對應的資料型態
    console.error("無效的檔案資料");
  }
}
