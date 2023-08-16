let PLUGIN = {};
PLUGIN.List = [];

PLUGIN.loadScript = function (path, name, scriptType) {
    if (scriptType && scriptType == "module") {
        var script = document.createElement('script');
        script.src = path;
        script.type = 'module';
        document.getElementsByTagName('head')[0].appendChild(script);
        PLUGIN[name] = true;
    } else {
        var script = document.createElement('script');
        script.src = path;
        script.type = 'text/javascript';
        document.getElementsByTagName('head')[0].appendChild(script);
        PLUGIN[name] = true;
    }
}

window.addEventListener("load", function (event) {
    PLUGIN.loadScript("../scripts/plugin/oauth.js", "oauth");
	PLUGIN.loadScript("../scripts/plugin/mpr2.js", "MPR");
	PLUGIN.loadScript("../scripts/plugin/mpr.js", "MPR");
	PLUGIN.loadScript("../scripts/plugin/vr.js", "VR");
	PLUGIN.loadScript("../scripts/plugin/xml_format.js", "xml_format");
    PLUGIN.loadScript("../scripts/plugin/graphic_annotation.js", "graphic_annotation");
    PLUGIN.loadScript("../scripts/plugin/rtss.js", "rtss");
    PLUGIN.loadScript("../scripts/plugin/seg.js", "seg");
    PLUGIN.loadScript("../scripts/plugin/tag.js", "tag");
    PLUGIN.loadScript("../scripts/plugin/xnat.js", "tag");
	PLUGIN.loadScript("../scripts/plugin/AI.js", "AI");
    /*PLUGIN.loadScript("../scripts/plugin/mpr.js", "MPR");
    PLUGIN.loadScript("../scripts/plugin/vr.js", "VR");
    PLUGIN.loadScript("../scripts/plugin/xml_format.js", "xml_format");
    PLUGIN.loadScript("../scripts/plugin/graphic_annotation.js", "graphic_annotation");
    PLUGIN.loadScript("../scripts/plugin/rtss.js", "rtss");
    PLUGIN.loadScript("../scripts/plugin/seg.js", "seg");*/
});

PLUGIN.PushLoadViewportList = function (fun) {
    VIEWPORT[fun.name] = fun;
    VIEWPORT.loadViewportList.push(fun.name);
}

PLUGIN.RemoveLoadViewportList = function (funName) {
    VIEWPORT.loadViewportList = VIEWPORT.loadViewportList.filter(name => name != funName);
}

PLUGIN.PushMarkList = function (fun) {
    MARKER[fun.name] = fun;
    MARKER.drawMarkList.push(fun.name);
}

PLUGIN.RemoveMarkList = function (funName) {
    MARKER.drawMarkList = MARKER.drawMarkList.filter(name => name != funName);
}