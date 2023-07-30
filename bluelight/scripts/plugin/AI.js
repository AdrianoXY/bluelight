var openAIModel = false;
function loadAIModel() {
    var span = document.createElement("SPAN")
    span.innerHTML =
        `<img class="AIModelimg" alt="AIModel" id="AIModel" src="../image/icon/black/Model_OFF.png" width="50" height="50">`;
    getByid("icon-list").appendChild(span);

    var span = document.createElement("SPAN")
    span.innerHTML =
        `<div id="AIModeldiv" style="background-color:#30306044;">
        <span style="color: white;" id="AIModelSpan">AI Model:</span>
        <select id="AIModelSelect">
        <option selected="selected"></option>
        <option id="AIModelYolo3">Yolo3</option>
        <option id="AIModelYolo8">Yolo8</option>
        </select>
      </div>`
    getByid("page-header").appendChild(span);
    getByid("AIModeldiv").style.display = "none";
}
loadAIModel();

getByid("AIModelSelect").onchange = function () {
    
}

getByid('AIModel').onclick = function () {
    openAIModel = !openAIModel;
    this.src = openAIModel ? "../image/icon/black/Model_ON.png" : "../image/icon/black/Model_OFF.png";
    if (openAIModel == true) {
        getByid('AIModeldiv').style.display = "";
    } else getByid('AIModeldiv').style.display = "none";
}