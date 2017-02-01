var NULL = null;

Array.prototype.indexOf = function(obj) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == obj)
      return i;
  }
  return -1;
}

function GetWindowSize() {
  var iWidth = 0,
    iHeight = 0;
  if (window != window.top) {
    try {
      var aFrames = parent.document.getElementsByTagName("IFRAME");
      for (var iLup = 0; iLup < aFrames.length; iLup++) {
        if (aFrames[iLup].contentWindow == window) {
          iWidth = parseInt(aFrames[iLup].style.width, 10);
          if (!iWidth || isNaN(iWidth))
            iWidth = aFrames[iLup].getAttribute("width") * 1;
          if (!iWidth || isNaN(iWidth))
            iWidth = aFrames[iLup].offsetWidth;
          iHeight = parseInt(aFrames[iLup].style.height, 10);
          if (!iHeight || isNaN(iHeight))
            iHeight = aFrames[iLup].getAttribute("height") * 1;
          if (!iHeight || isNaN(iHeight))
            iHeight = aFrames[iLup].offsetHeight;
          return { "width": iWidth, "height": iHeight };
        }
      }
    } catch (e) {}
  }
  if (typeof(window.innerWidth) == "number") {
    iWidth = window.innerWidth;
    iHeight = window.innerHeight;
  } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
    iWidth = document.documentElement.clientWidth;
    iHeight = document.documentElement.clientHeight;
  } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
    iWidth = document.body.clientWidth;
    iHeight = document.body.clientHeight;
  }
  return { "width": iWidth, "height": iHeight };
}

function GetViewportSize() {
  var iWidth = 0,
    iHeight = 0;
  if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
    iWidth = document.documentElement.clientWidth;
    iHeight = document.documentElement.clientHeight;
  } else if (typeof(window.innerWidth) == "number") {
    iWidth = window.innerWidth;
    iHeight = window.innerHeight;
  } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
    iWidth = document.body.clientWidth;
    iHeight = document.body.clientHeight;
  }
  return { "width": iWidth, "height": iHeight }
}

var g_oOverflowLayer = null;

function OverflowLayerInit() {
  g_oOverflowLayer = document.getElementById("OverflowLayer");
  if (g_oOverflowLayer) {
    if ((IsIPad() || IsIPhone()) && window.top != window) {
      g_oOverflowLayer.style.overflow = "auto";
      // GB: Do not use webkitOverflowScrolling = "touch" because it breaks iframes on the iPad
      //g_oOverflowLayer.style.webkitOverflowScrolling = "touch";
      OverflowLayerResize();
      AddEventHandler(window, "resize", OverflowLayerResize);
    } else
      g_oOverflowLayer.style.display = "";
  }
}

function OverflowLayerResize(evt) {
  var oSize = GetWindowSize();
  g_oOverflowLayer.style.width = oSize.width + "px";
  g_oOverflowLayer.style.height = oSize.height + "px";
  g_oOverflowLayer.style.display = "";
}

function GetElemOffsets(oElem) {
  var iOffsetLeft = oElem.offsetLeft;
  var iOffsetTop = oElem.offsetTop;
  var iScrollTop = oElem.scrollTop;
  while (oElem.offsetParent) {
    iOffsetLeft += oElem.offsetParent.offsetLeft;
    iOffsetTop += oElem.offsetParent.offsetTop;
    iScrollTop += oElem.offsetParent.scrollTop;
    oElem = oElem.offsetParent;
  }
  if (oElem.nodeName == "BODY" && oElem.ownerDocument && oElem.ownerDocument.documentElement)
    iScrollTop += oElem.ownerDocument.documentElement.scrollTop;

  var oOffset = { Left: iOffsetLeft, Top: iOffsetTop, ScrollTop: iScrollTop };
  return oOffset;
}

function GetWindowOffsets(oWindow) {
  if (oWindow && oWindow.frameElement) {
    var oElem = oWindow.frameElement;
    var oOffset = GetElemOffsets(oElem);

    if (oWindow.parent.frameElement &&
      oWindow.parent.frameElement.contentWindow) {
      var oParentOffset = GetWindowOffsets(oWindow.parent.frameElement.contentWindow);
      oOffset.Left += oParentOffset.Left;
      oOffset.Top += oParentOffset.Top;
      oOffset.ScrollTop += oParentOffset.ScrollTop;
    }
    return oOffset;
  }
  return { Left: 0, Top: 0, ScrollTop: 0 };
}

function StringReplace(cSearch, cFind, cReplace) {
  if (cSearch) {
    if (!cReplace)
      cReplace = "";
    var iPos = cSearch.indexOf(cFind);
    while (iPos > -1) {
      cSearch = cSearch.substr(0, iPos) + cReplace + cSearch.substr(iPos + cFind.length);
      iPos = cSearch.indexOf(cFind, iPos + cReplace.length);
    }
  }
  return cSearch;
}

function RandomizeURL(cURL, bCheckQuestion) {
  var dDate = new Date();
  var iPos = cURL.indexOf("&RandomValue=");
  if (iPos > 0) {
    var iPos2 = cURL.indexOf("&", iPos + 1);
    if (iPos2 > -1)
      cURL = cURL.substr(0, iPos) + cURL.substr(iPos2);
    else
      cURL = cURL.substr(0, iPos);
  }

  cURL += (((cURL.indexOf("?") == -1) && (bCheckQuestion)) ? "?" : "&") + "RandomValue=" + dDate.valueOf();

  return cURL;
}

function GetURLParamValue(cParamName, oWin) {
  var cHRef = "";

  if (oWin == null)
    cHRef = document.location.href;
  else
    cHRef = oWin.document.location.href;

  var iPos = cHRef.indexOf("?");
  if (iPos > -1) {
    cHRef = cHRef.substr(iPos + 1);
    var aValues = cHRef.split("&");
    var aParamInfo;
    for (var iLup = 0; iLup < aValues.length; iLup++) {
      aParamInfo = aValues[iLup].split("=");
      if (aParamInfo && aParamInfo[0] == cParamName)
        return aParamInfo[1];
    }
  }

  return "";
}

function GenerateCenteredWindowLeftTop(iWindowWidth, iWindowHeight) {
  var iLeft = Math.round((window.screen.width - iWindowWidth) / 2);
  var iTop = Math.round((window.screen.height - iWindowHeight) / 2);
  return "top=" + iTop + ",left=" + iLeft;
}

function GetInnerHTML(oElem) {
  var sHTML = oElem.innerHTML;
  while (sHTML.indexOf("©") > -1)
    sHTML = sHTML.replace("©", "&copy;");
  while (sHTML.indexOf("®") > -1)
    sHTML = sHTML.replace("®", "&reg;");
  while (sHTML.indexOf("™") > -1)
    sHTML = sHTML.replace("™", "&trade;");
  return sHTML;
}

function HexToRGB(cHex) {
  var cRGB = "rgb(0,0,0)";
  if (typeof(cHex) == "string") {
    cHex = cHex.replace("#", "");
    try {
      var r = parseInt(cHex.substring(0, 2), 16);
      var g = parseInt(cHex.substring(2, 4), 16);
      var b = parseInt(cHex.substring(4, 6), 16);
      cRGB = "rgb(" + r + "," + g + "," + b + ")";
    } catch (e) {}
  }
  return cRGB;
}

function RGBToHex(cRGB) {
  cRGB = cRGB.toLowerCase();
  var cHex = "#000000";
  if (cRGB.match(/\brgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g)) {
    var aRGB = cRGB.match(/(\d+)/g);
    cHex = "#" + (0x100 | parseInt(aRGB[0], 10)).toString(16).substr(1) +
      (0x100 | parseInt(aRGB[1], 10)).toString(16).substr(1) +
      (0x100 | parseInt(aRGB[2], 10)).toString(16).substr(1);
  }
  return cHex;
}

function URLEncode(cValue) {
  if (cValue == null)
    return "";
  else
    return encodeURIComponent(cValue);
}

function JSONEncode(oObj) {
  if (oObj.tagName)
    return ((oObj.id && oObj.id.length) ? "document.getElementById(\"" + oObj.id + "\")" : "");
  var cName = "",
    iCount = 0;
  var cText = "{";
  for (cName in oObj) {
    if (iCount)
      cText += ",";
    cText += "\"" + cName + "\":" + JSONValueEncode(oObj[cName]);
    iCount++;
  }
  cText += "}";
  return cText;
}


function JSONStringEncode(cStr) {
  cStr = StringReplace(cStr, "\\", "\\\\");
  cStr = StringReplace(cStr, "\r", "\\r");
  cStr = StringReplace(cStr, "\n", "\\n");

  cStr = StringReplace(cStr, "\"", "\\\"");

  return cStr;
}

function JSONValueEncode(oObj) {
  if (typeof(oObj) == "number")
    return oObj.toString();
  else if (typeof(oObj) == "string")
    return "\"" + JSONStringEncode(oObj.toString()) + "\"";
  else if (typeof(oObj) == "boolean")
    return (oObj ? "true" : "false");
  else if (oObj && typeof(oObj) == "object") {
    if (oObj.length != undefined)
      return JSONArrayEncode(oObj);
    else
      return JSONEncode(oObj);
  } else
    return "null";
}

function JSONArrayEncode(oObj) {
  var cName = "",
    iCount = 0;
  var cText = "[";
  for (cName in oObj) {
    if (cName != "indexOf") {
      if (iCount)
        cText += ",";
      cText += JSONValueEncode(oObj[cName]);
      iCount++;
    }
  }
  cText += "]";
  return cText;
}

function Replicate(cText, iCount) {
  var cString = "";
  for (var iLup = 0; iLup < iCount; iLup++)
    cString += cText;
  return cString;
}

function ObjectToString(oObj, iIndent, iDepth) {
  if (iDepth == 0)
    return "";
  if (iDepth == undefined)
    iDepth = 2;
  var cText = "";
  var cName;
  for (cName in oObj)
    cText += (cText.length ? "\n" : "") + Replicate("  ", iIndent) + cName + ": " + (typeof(oObj[cName]) == "object" ? ObjectToString(oObj[cName], iIndent + 1, iDepth - 1) : oObj[cName]);
  return cText;
}

function ObjectToHTML(oObj, iIndent, iDepth) {
  if (iDepth == 0)
    return "";
  if (iDepth == undefined)
    iDepth = 2;
  var cHTML = "";
  var cName, bObj;
  for (cName in oObj) {
    bObj = (typeof(oObj[cName]) == "object");
    try {
      cHTML += (cHTML.length ? "</p>" : "") + "<p>" + Replicate("&nbsp;", iIndent) +
        (bObj ? "<hr noshade /><em><b>" + cName + "</b></em>" : "<b>" + cName + ":</b> ") +
        (bObj ? ObjectToHTML(oObj[cName], iIndent + 1, iDepth - 1) : oObj[cName]);
    } catch (e) {}
  }
  return cHTML;
}

function ObjectToURL(oObj, iDepth) {
  if (iDepth == 0)
    return "";
  if (iDepth == undefined)
    iDepth = 2;
  var cText = "";
  var cName;
  for (cName in oObj)
    cText += (cText.length ? "&" : "") + cName + "=" + (typeof(oObj[cName]) == "object" ? ObjectToURL(oObj[cName], iDepth - 1) : oObj[cName]);
  return cText;
}

function AddClass(oNode, cClass) {
  var aClass;
  try {
    aClass = oNode.getAttribute("class").split(" ");
    if (aClass.indexOf(cClass) == -1)
      aClass.push(cClass);
  } catch (e) {
    aClass = [cClass];
  }
  oNode.setAttribute("class", (aClass.length > 1 ? aClass.join(" ") : aClass[0]));
}

function RemoveClass(oNode, cClass) {
  var aClass;
  try {
    aClass = oNode.getAttribute("class").split(" ");
    var iIndex = aClass.indexOf(cClass);
    if (iIndex > -1)
      aClass.splice(iIndex, 1);
    if (!aClass.length)
      oNode.removeAttribute("class");
    else
      oNode.setAttribute("class", (aClass.length > 1 ? aClass.join(" ") : aClass[0]));
  } catch (e) {}
}

function SetLinkTargets(cTarget, oParent, aAllowedTargets) {
  if (!cTarget || typeof(cTarget) != "string")
    cTarget = "_blank";
  if (!oParent || typeof(oParent) != 'object')
    oParent = document;
  if (typeof(aAllowedTargets) != 'object' || !aAllowedTargets.length)
    aAllowedTargets = null;

  var aLinks = oParent.getElementsByTagName("A");
  for (var iLinkLup = 0; iLinkLup < aLinks.length; iLinkLup++) {
    if (aLinks[iLinkLup].href.indexOf("#") > -1)
      continue;
    if (!aAllowedTargets || (aAllowedTargets.indexOf(aLinks[iLinkLup].target) == -1))
      aLinks[iLinkLup].target = cTarget;
  }
}

function NavigateWindow(oWin, cURL, bUseCached) {
  if (oWin == null)
    oWin = window;
  if (cURL == null || cURL == "") {
    if (oWin.location)
      cURL = oWin.location.href;
    else
      cURL = oWin.src;
  }

  if (!bUseCached && cURL.indexOf("?") > -1)
    cURL = RandomizeURL(cURL);

  if (IsIE() && oWin.navigate)
    oWin.navigate(cURL);
  else {
    if (oWin.location)
      oWin.location = cURL;
    else
      oWin.src = cURL;
  }
}

function GetFirstChild(oElem) {
  if (!oElem || !oElem.childNodes)
    return null;
  for (var iLup = 0; iLup < oElem.childNodes.length; iLup++) {
    if (oElem.childNodes[iLup].nodeType == 1)
      return oElem.childNodes[iLup];
  }
  return null;
}

function GetLastChild(oElem) {
  if (!oElem || !oElem.childNodes)
    return null;
  for (var iLup = oElem.childNodes.length - 1; iLup >= 0; iLup--) {
    if (oElem.childNodes[iLup].nodeType == 1)
      return oElem.childNodes[iLup];
  }
  return null;
}

function GetChildCount(oElem) {
  var iCount = 0;
  if (oElem && oElem.childNodes) {
    for (var iLup = 0; iLup < oElem.childNodes.length; iLup++)
      iCount += (oElem.childNodes[iLup].nodeType == 1 ? 1 : 0);
  }
  return iCount;
}

function GetNextSibling(oElem) {
  do
    oElem = oElem.nextSibling;
  while (oElem && oElem.nodeType != 1);
  return oElem;
}

function GetPrevSibling(oElem) {
  do
    oElem = oElem.previousSibling;
  while (oElem && oElem.nodeType != 1);
  return oElem;
}

function FindChildElem(oParentElem, cElemName) {
  var oElem;
  var oChild = GetFirstChild(oParentElem);
  while (oChild) {
    if (oChild.name == cElemName || oChild.id == cElemName)
      return oChild;

    if (GetChildCount(oChild))
      oElem = FindChildElem(oChild, cElemName);

    if (oElem)
      return oElem;

    oChild = GetNextSibling(oChild);
  }
  return null;
}

function FindChildElems(oParentElem, cElemName, aChildElem) {
  var bReturn = false;
  if (!aChildElem) {
    bReturn = true;
    aChildElem = new Array();
  }

  var oChild = GetFirstChild(oParentElem);
  while (oChild) {
    if (oChild.name == cElemName || oChild.id == cElemName)
      aChildElem.push(oChild);

    if (GetChildCount(oChild))
      FindChildElems(oChild, cElemName, aChildElem);

    oChild = GetNextSibling(oChild);
  }
  if (bReturn)
    return aChildElem;
}

function FindChildElemWithAttribute(oParentElem, cAttrName, cAttrValue) {
  var oElem;
  var oChild = GetFirstChild(oParentElem);
  while (oChild) {
    if (oChild.getAttribute(cAttrName) == cAttrValue)
      return oChild;

    if (GetChildCount(oChild))
      oElem = FindChildElemWithAttribute(oChild, cAttrName, cAttrValue);

    if (oElem)
      return oElem;

    oChild = GetNextSibling(oChild);
  }
  return null;
}

function GetInnerText(oElem) {
  return (typeof(oElem.textContent) == "string" ? oElem.textContent : oElem.innerText);
}

function SetInnerText(oElem, cText) {
  if (typeof(oElem.textContent) == "string")
    oElem.textContent = cText;
  else
    oElem.innerText = cText;
}

function StripHTML(cString) {
  if (typeof(cString) != "string" || !cString.length)
    return cString;
  var iStart = cString.indexOf("<");
  var iEnd = cString.indexOf(">", iStart);
  while (iStart > -1 && iEnd > -1) {
    cString = cString.replace(cString.substring(iStart, iEnd + 1), "");
    iStart = cString.indexOf("<");
    iEnd = cString.indexOf(">", iStart);
  }
  return cString;
}

function TrimUnits(cValue) {
  if (cValue == null || cValue == "")
    return 0;

  var iPos = cValue.indexOf("px");
  if (iPos > -1)
    cValue = cValue.substr(0, iPos);

  return (cValue * 1);
}

function EventObj(oEvent) {
  if (!oEvent && window.event)
    oEvent = window.event;

  this.m_oEvent = oEvent;
  this.m_bCancelBubble = false;
  this.m_bReturnValue = null;

  this.ReturnValue = function(bReturnValue) {
    this.m_bReturnValue = bReturnValue;
    if (this.m_oEvent) {
      this.m_oEvent.returnValue = bReturnValue;
      if (!bReturnValue && this.m_oEvent.preventDefault)
        this.m_oEvent.preventDefault();
    }
  }

  this.CancelBubble = function(bCancel) {
    this.m_bCancelBubble = bCancel;
    if (this.m_oEvent) {
      this.m_oEvent.cancelBubble = bCancel;
      if (bCancel && this.m_oEvent.stopPropagation)
        this.m_oEvent.stopPropagation();
    }
  }

  this.GetCancelBubble = function() { return this.m_bCancelBubble; }
  this.GetReturnValue = function() { return this.m_bReturnValue; }

  if (oEvent) {
    this.type = oEvent.type;
    this.srcElement = (oEvent.target ? oEvent.target : oEvent.srcElement);
    this.fromElement = (oEvent.relatedTarget ? oEvent.relatedTarget : oEvent.fromElement);
    this.toElement = (oEvent.currentTarget ? oEvent.currentTarget : oEvent.toElement);
    this.altKey = oEvent.altKey;
    this.ctrlKey = oEvent.ctrlKey;
    this.shiftKey = oEvent.shiftKey;
    this.keyCode = (oEvent.keyCode ? oEvent.keyCode : oEvent.charCode);
    this.clientX = oEvent.clientX;
    this.clientY = oEvent.clientY;
    this.screenX = oEvent.screenX;
    this.screenY = oEvent.screenY;
  } else {
    this.type = null;
    this.srcElement = null;
    this.fromElement = null;
    this.toElement = null;
    this.altKey = false;
    this.ctrlKey = false;
    this.shiftKey = false;
    this.keyCode = 0;
    this.clientX = 0;
    this.clientY = 0;
    this.screenX = 0;
    this.screenY = 0;
  }
}

function WindowClose(InstanceID) {
  if (IsBadFirefox())
    NavigateWindow(window, "Server.nxp?LASCmd=AI:" + InstanceID + ";O:FirefoxWinClose.htm");
  else
    window.close();
}

function AddEventHandler(oElem, cEvent, fnHandler) {
  if (oElem.addEventListener)
    oElem.addEventListener(cEvent, fnHandler, false);
  else if (oElem.attachEvent)
    oElem.attachEvent("on" + cEvent, fnHandler);
}

function RemoveEventHandler(oElem, cEvent, fnHandler) {
  if (oElem.removeEventListener)
    oElem.removeEventListener(cEvent, fnHandler, false);
  else if (oElem.detachEvent)
    oElem.detachEvent("on" + cEvent, fnHandler);
}

function LoadScript(cSrc, fnOnLoad) {
  var oScript = document.createElement("script");
  oScript.setAttribute("type", "text/javascript");
  oScript.setAttribute("src", cSrc);
  if (typeof(fnOnLoad) == "function")
    AddEventHandler(oScript, "load", fnOnLoad);
  document.getElementsByTagName("head")[0].appendChild(oScript);
}

function LoadStylesheet(cSrc) {
  var oSheet = document.createElement("link");
  oSheet.setAttribute("type", "text/css");
  oSheet.setAttribute("rel", "stylesheet");
  oSheet.setAttribute("href", cSrc);
  document.getElementsByTagName("head")[0].appendChild(oSheet);
}

function HasStyleSheet(cSrc) {
  for (var x in document.styleSheets) {
    if (document.styleSheets.item(x) == cSrc)
      return true;
  }
  return false;
}

/////////////////////////////////////////////////////////////////
// Video

function GetExtension(cPath) {
  return cPath.substr(cPath.lastIndexOf(".") + 1).toUpperCase();
}

function SetExtension(cPath, cExt) {
  return cPath.substr(0, Math.max(cPath.lastIndexOf("."), 0)) + cExt;
}

function FlashInstalled() {
  var bRetval = false;

  if (navigator.plugins != null && navigator.plugins.length > 0) {
    if (navigator.plugins["Shockwave Flash"])
      bRetval = true;
  } else if (navigator.userAgent.toLowerCase().indexOf("webtv/2.6") != -1) {
    bRetval = true;
  } else if (IsIE() || (window.navigator.userAgent.indexOf("Trident/") > -1 && window.navigator.userAgent.indexOf("rv:11") > -1)) {
    try {
      var oF = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");
      if (oF)
        bRetval = true;
    } catch (e) {}
  }

  return bRetval;
}


function SilverlightInstalled() {
  var bRetval = false;

  try {
    try {
      var oControl = new ActiveXObject('AgControl.AgControl');
      if (oControl)
        bRetval = true;
    } catch (e) {
      var oPlugin = navigator.plugins["Silverlight Plug-In"];
      if (oPlugin)
        bRetval = true;
    }
  } catch (e) {}

  return bRetval;
}

/////////////////////////////////////////////////////////////////
// Checks and Flags (browser, flash, os)

function IsWindows() {
  return (window.navigator.platform.toLowerCase().indexOf("win") > -1 ? true : false);
}

function IsMac() {
  return (window.navigator.platform.toLowerCase().indexOf("mac") > -1 ? true : false);
}

function IsLinux() {
  return (window.navigator.platform.toLowerCase().indexOf("linux") > -1 ? true : false);
}

function IsIPad() {
  return (window.navigator.platform.toLowerCase().indexOf("ipad") > -1 ? true : false);
}

function IsIPhone() {
  return (window.navigator.appVersion.toLowerCase().indexOf("iphone") > -1 && window.navigator.appVersion.toLowerCase().indexOf("windows phone") < 0 ? true : false);
}

function IsIOS() {
  return /(ipad|iphone|ipod)/g.test(window.navigator.appVersion.toLowerCase());
}

function IsIOS7() {
  return (window.navigator.appVersion.toLowerCase().indexOf("iphone os 7") > -1 || window.navigator.appVersion.toLowerCase().indexOf("ipad; cpu os 7") > -1 ? true : false);
}

function IsAndroid() {
  return (window.navigator.appVersion.toLowerCase().indexOf("android") > -1 && window.navigator.appVersion.toLowerCase().indexOf("windows phone") < 0 ? true : false);
}

function IsAndroidTablet() {
  return (IsAndroid() && window.navigator.userAgent.toLowerCase().indexOf("mobile") <= -1 ? true : false);
}

function IsWindowsPhone() {
  return (window.navigator.appVersion.toLowerCase().indexOf("windows phone") > -1 ? true : false);
}

function IsBBM10() {
  return (window.navigator.appVersion.toLowerCase().indexOf("bbm10") > -1 ? true : false);
}

function IsIE() {
  return (window.navigator.userAgent.indexOf("MSIE") > -1 || window.navigator.userAgent.indexOf("IEMobile") > -1 ? true : false);
}

function IsEdge() {
  return (window.navigator.userAgent.indexOf("Edge/") > -1 ? true : false);
}

function IsIETouch() {
  return (window.navigator.userAgent.toLowerCase().indexOf("msie") > -1 && window.navigator.userAgent.toLowerCase().indexOf("touch") > -1 ? true : false);
}

function IsSafari() {
  return (window.navigator.userAgent.indexOf("Safari/") > -1 ? true : false);
}

function IsFirefox() {
  return (window.navigator.userAgent.indexOf("Firefox") > -1 ? true : false);
}

function IsNetscape() {
  return (window.navigator.userAgent.indexOf("Netscape") > -1 ? true : false);
}

function IsChrome() {
  return (window.navigator.userAgent.indexOf("Chrome/") > -1 ? true : false);
}

function IsOpera() {
  return (window.navigator.userAgent.indexOf("Opera") > -1 ? true : false);
}

function IEVersion() {
  var cUserAgent = window.navigator.userAgent;

  // Test values; Uncomment to check result …

  // IE 10
  // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';

  // IE 11
  // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';

  // Edge 12 (Spartan)
  // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';

  // Edge 13
  // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';

  var iMSIE = cUserAgent.indexOf('MSIE ');
  if (iMSIE > 0) {
    // IE 10 or older => return version number
    return (parseFloat(window.navigator.appVersion.split("MSIE")[1]));
  }

  var iTrident = cUserAgent.indexOf('Trident/');
  if (iTrident > 0) {
    // IE 11 => return version number
    var iRV = cUserAgent.indexOf('rv:');
    return parseInt(cUserAgent.substring(iRV + 3, cUserAgent.indexOf('.', iRV)), 10);
  }

  var iEdge = cUserAgent.indexOf('Edge/');
  if (iEdge > 0) {
    // Edge (IE 12+) => return version number
    return parseInt(cUserAgent.substring(iEdge + 5, cUserAgent.indexOf('.', iEdge)), 10);
  }

  // other browser
  return -1;
}

function IsBadFirefox() {

  var bBadFirefox = false;

  if (/Firefox[\/\s](\d+\.\d+.\d+.\d+)/.test(window.navigator.userAgent)) {
    var FFVersion = new String(RegExp.$1);
    if (FFVersion == "2.0.0.13")
      bBadFirefox = true;
  }

  return bBadFirefox;
}

function GetFlashVersion() {
  var iMajorVersion = -1;
  var iMinorVersion = -1;
  var iRevision = -1;
  //
  if (navigator.plugins && navigator.plugins.length > 0) {
    var cType = "application/x-shockwave-flash";
    var oMimeTypes = navigator.mimeTypes;
    if (oMimeTypes && oMimeTypes[cType] && oMimeTypes[cType].enabledPlugin && oMimeTypes[cType].enabledPlugin.description) {
      var aDescParts = oMimeTypes[cType].enabledPlugin.description.split(/ +/);
      var aMajorMinor = aDescParts[2].split(/\./);
      var cRevisionStr = aDescParts[3];

      iMajorVersion = parseInt(aMajorMinor[0], 10);
      iMinorVersion = parseInt(aMajorMinor[1], 10);
      iRevision = parseInt(cRevisionStr.replace(/[a-zA-Z]/g, ""), 10);
    }
  } else if (window.execScript && IsIE() && IsWindows() && !IsOpera()) {
    var oActiveX;
    var cVersion = "-1 -1,-1,-1";

    try {
      // version will be set for 7.X or greater players
      oActiveX = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");
      cVersion = oActiveX.GetVariable("$version");
    } catch (e) {}

    if (!cVersion) {
      try {
        // version will be set for 6.X players only
        oActiveX = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");

        // installed player is some revision of 6.0
        // GetVariable("$version") crashes for versions 6.0.22 through 6.0.29,
        // so we have to be careful. 

        // default to the first public version
        cVersion = "WIN 6,0,21,0";

        // throws if AllowScripAccess does not exist (introduced in 6.0r47)
        oActiveX.AllowScriptAccess = "always";

        // safe to call for 6.0r47 or greater
        cVersion = oActiveX.GetVariable("$version");
      } catch (e) {}
    }

    var aVersionArray = cVersion.split(",");
    iMajorVersion = parseInt(aVersionArray[0].split(" ")[1], 10);
    iMinorVersion = parseInt(aVersionArray[1], 10);
    iRevision = parseInt(aVersionArray[2], 10);
  }

  return { "major": iMajorVersion, "minor": iMinorVersion, "revision": iRevision };
}

function IsMobile() {
  var cAgent = window.navigator.userAgent;
  var bMobile = false;
  if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(cAgent) ||
    /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(cAgent.substr(0, 4)))
    bMobile = true;
  return bMobile;
}

function GetWindowsPhoneOS() {
  var cUserAgent = window.navigator.userAgent;
  var cRegex = /Windows Phone \d+.\d+/;
  var acResult = cRegex.exec(cUserAgent);
  if (acResult) {
    cRegex = /\d+.\d+/;
    acResult = cRegex.exec(acResult[0]);
    if (acResult)
      return acResult[0];
  }
  return null;
}

function GetAndroidOS() {
  var cUserAgent = window.navigator.userAgent;
  var cRegex = /Android\s([0-9\.]*)/;
  var acResult = cRegex.exec(cUserAgent);
  return acResult ? acResult[1] : false;
}

function GetIOSOS() {
  var cUserAgent = window.navigator.userAgent;
  var cRegex = /OS ([0-9\_]*)/;
  var acResult = cRegex.exec(cUserAgent);
  return acResult ? StringReplace(acResult[1], "_", ".") : false;
}

function SupportsHTML5Video() {
  return !!document.createElement('video').canPlayType;
}

function SupportsH264() {
  if (!SupportsHTML5Video())
    return false;
  var oElem = document.createElement("video");
  return "" !== oElem.canPlayType('video/mp4; "codecs="avc1.42E01E, mp4a.40.2"');
}

function SupportsOgg() {
  if (!SupportsHTML5Video())
    return false;
  var oElem = document.createElement("video");
  return "" !== oElem.canPlayType('video/ogg; codecs="theora, vorbis"');
}

function SupportsHls() {
  if (!SupportsHTML5Video())
    return false;
  var oElem = document.createElement("video");
  return "" !== oElem.canPlayType('application/vnd.apple.mpegURL; "codecs="avc1.42E01E, mp4a.40.2"' || 'application/x-mpegURL; "codecs="avc1.42E01E, mp4a.40.2"');
}

function SupportsWebm() {
  if (!SupportsHTML5Video())
    return false;
  var oElem = document.createElement("video");
  return "" !== oElem.canPlayType('video/webm; codecs="vp8, vorbis"');
}

function SupportDASH() {
  return (window.Promise && window.Uint8Array);
}

//CSS Override Object
var g_oRulesOverride = {};

function GetRules(cSheet, bForceNewSheet) {
  var aStyleSheets = document.styleSheets;
  var iSheetCount = aStyleSheets.length;
  var aRules;
  var oSheet, oStyleSheet, oReturnSheet;
  var iRuleLen, iLup, inLup;
  var bFound = false;
  var cSheetName;
  var iNameIndex;

  if (!bForceNewSheet) {
    for (iLup = 0; iLup < iSheetCount; iLup++) {
      if (aStyleSheets[iLup].href) {
        if (aStyleSheets[iLup].href.indexOf(window.location.host) < 0)
          continue;

        iNameIndex = aStyleSheets[iLup].href.lastIndexOf("/");
        cSheetName = aStyleSheets[iLup].href.substring(iNameIndex + 1, aStyleSheets[iLup].href.length);
        g_oRulesOverride[cSheetName] = {};
        try {
          aRules = (aStyleSheets[iLup].cssRules) ? aStyleSheets[iLup].cssRules : aStyleSheets[iLup].rules; //firefox just likes to fail sometimes
        } catch (e) {
          continue;
        }
        if (!aRules)
          continue;
        iRuleLen = aRules.length;
        g_oRulesOverride[cSheetName].Rules = {};
        for (inLup = 0; inLup < iRuleLen; inLup++)
          g_oRulesOverride[cSheetName].Rules[aRules[inLup].selectorText] = aRules[inLup];

        g_oRulesOverride[cSheetName].Rules.length = iRuleLen;
        g_oRulesOverride[cSheetName].Sheet = aStyleSheets[iLup];
      } else {
        g_oRulesOverride["DynamicStyleSheet"] = {};
        aRules = (aStyleSheets[iLup].cssRules) ? aStyleSheets[iLup].cssRules : aStyleSheets[iLup].rules;
        iRuleLen = aRules.length;
        g_oRulesOverride["DynamicStyleSheet"].Rules = {};
        for (inLup = 0; inLup < iRuleLen; inLup++)
          g_oRulesOverride["DynamicStyleSheet"].Rules[aRules[inLup].selectorText] = aRules[inLup];

        g_oRulesOverride["DynamicStyleSheet"].Rules.length = iRuleLen;
        g_oRulesOverride["DynamicStyleSheet"].Sheet = aStyleSheets[iLup];
      }
    }

    if (g_oRulesOverride[cSheet]) {
      oReturnSheet = g_oRulesOverride[cSheet];
      bFound = true;
    }
  }

  if (!bFound) {
    g_oRulesOverride[cSheet] = {};
    oSheet = document.createElement("STYLE");
    document.getElementsByTagName("HEAD")[0].appendChild(oSheet);
    if (IsSafari())
      oSheet.appendChild(document.createTextNode(''));

    oStyleSheet = (oSheet.sheet ? oSheet.sheet : oSheet.styleSheet);
    g_oRulesOverride[cSheet].Sheet = oStyleSheet;
    g_oRulesOverride[cSheet].Rules = {};
    g_oRulesOverride[cSheet].Rules.length = 0;
    oReturnSheet = g_oRulesOverride[cSheet];
  }

  return oReturnSheet;
};

function SetRule(cSheet, cSelector, cStyle, cValue, bForceNewSheet) {
  var bFound = false;
  var oSheet;
  var oRules;
  var aRules;
  var oRuleObj;
  var cSelectorUC = cSelector.toUpperCase();
  var cSelectorLC = cSelector.toLowerCase();

  if (!cSheet) {
    if (document.styleSheets.length == 0)
      return;
  }

  if (typeof cSheet == "object" && cSheet != null && (cSheet.rules || cSheet.cssRules)) {
    oSheet = cSheet;
    aRules = oSheet.cssRules ? oSheet.cssRules : oSheet.rules;
  } else {
    if (cSheet == null)
      cSheet = "DynamicStyleSheet";

    if (g_oRulesOverride[cSheet]) {
      oRules = g_oRulesOverride[cSheet].Rules;
      oSheet = g_oRulesOverride[cSheet].Sheet;
    } else {
      oRuleObj = GetRules(cSheet, bForceNewSheet);
      if (oRuleObj) {
        oRules = oRuleObj.Rules;
        oSheet = oRuleObj.Sheet;
      }
    }
  }

  if (oRules) {
    if (oRules[cSelector]) {
      oRules[cSelector].style[cStyle] = cValue;
      bFound = true;
    } else if (oRules[cSelectorLC]) {
      oRules[cSelectorLC].style[cStyle] = cValue;
      bFound = true;
    } else if (oRules[cSelectorUC]) {
      oRules[cSelectorUC].style[cStyle] = cValue;
      bFound = true;
    }
  }

  if (aRules) {
    var aSelPieces, aSelTextPieces;
    var cSelectorText, cSelTextMod, cCompStr;
    var cSelMod = cSelector.replace(/[\[\]]+/g, " ");
    var bMatch = false;
    aSelTextPieces = cSelMod.split(/[+#.\s]+/g);
    var iRuleLen = aRules.length;
    var iLup;
    for (iLup = 0; iLup < iRuleLen; iLup++) {
      cSelectorText = aRules[iLup].selectorText;

      if (!cSelectorText)
        continue;

      if (cSelectorText == cSelector)
        bMatch = true;


      if (!bMatch) {
        try {
          cSelTextMod = cSelectorText.replace(/[\[\]]+/g, " ");
          aSelPieces = cSelTextMod.split(/[+#.\s]+/g);

          if (aSelPieces.length != aSelTextPieces.length)
            continue;

          while (cCompStr = aSelPieces.pop()) {
            if (aSelTextPieces.indexOf(cCompStr) >= 0) {
              bMatch = true;
            } else {
              bMatch = false;
              break;
            }
          }
        } catch (e) { continue; };
      }

      if (bMatch) {
        try {
          if (aRules[iLup].style.setProperty)
            aRules[iLup].style.setProperty(cStyle, cValue, null);
          else
            aRules[iLup].style.setAttribute(cStyle, cValue, null);
        } catch (e) {
          aRules[iLup].style[cStyle] = cValue;
        }

        bFound = true;
        break;
      }
    }
  }

  if (!bFound) {
    var iSelectorCount = 0;
    if (oRules)
      iSelectorCount = oRules.length;
    else
      iSelectorCount = aRules.length;

    if (oSheet && oSheet.insertRule)
      oSheet.insertRule(cSelector + "{" + cStyle + ":" + cValue + ";}", iSelectorCount);
    else if (oSheet && oSheet.addRule)
      oSheet.addRule(cSelector, cStyle + ":" + cValue, -1);

    if (oRules) {
      var oSSRule = oSheet.cssRules ? oSheet.cssRules[iSelectorCount] : oSheet.rules[oSheet.rules.length - 1];
      oRules[cSelector] = oSSRule;
      oRules.length++;
    }
  }

};

function GetRule(cSheet, cSelector, cStyle) {
  var aRules;
  var oRules;
  var oStyleText = null;
  var cSelectorUC = cSelector.toUpperCase();
  var cSelectorLC = cSelector.toLowerCase();

  if (typeof cSheet == "object" && cSheet != null && (cSheet.rules || cSheet.cssRules)) {
    oSheet = cSheet;
    aRules = oSheet.cssRules ? oSheet.cssRules : oSheet.rules;
  } else {
    if (cSheet == null)
      cSheet = "DynamicStyleSheet";

    if (g_oRulesOverride[cSheet]) {
      oRules = g_oRulesOverride[cSheet].Rules;
    } else {
      oRules = GetRules(cSheet).Rules;
    }
  }

  if (oRules) {
    if (oRules[cSelector])
      oStyleText = cStyle == null ? oRules[cSelector].style : oRules[cSelector].style[cStyle];
    else if (oRules[cSelectorLC])
      oStyleText = cStyle == null ? oRules[cSelectorLC].style : oRules[cSelectorLC].style[cStyle];
    else if (oRules[cSelectorUC])
      oStyleText = cStyle == null ? oRules[cSelectorUC].style : oRules[cSelectorUC].style[cStyle];
  }

  if (aRules) {
    var oRule;
    var iRuleLen = aRules.length;
    for (var iLup = 0; iLup < iRuleLen; iLup++) {
      oRule = aRules[iLup];
      if (oRule.type == oRule.STYLE_RULE) {
        var cSelectorText = oRule.selectorText;
        if (cSelectorText == cSelector)
          oStyleText = cStyle == null ? oRule.style : oRule.style[cStyle];
      }
    }
  }

  return oStyleText;
};

function CopyRule(cSheet, cSelector, cTargetSheet, cTargetSelector) {
  var oStyles = GetRule(cSheet, cSelector, null);
  var cSelector, cStyle;
  if (!oStyles)
    return false;
  for (var iLup = 0; iLup < oStyles.length; iLup++) {
    cSelector = oStyles[iLup];
    cStyle = oStyles[cSelector];
    SetRule(cTargetSheet, cTargetSelector, cSelector, cStyle);
  }
  return true;
};

function RequestAnimationFrame() {
  return window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
}

// Shell notifications transfer /////////////////////////////////////////////////////////////////////////
function GetShellWnd() {
  var oWnd = open("", "Shell");
  if (oWnd) {
    if (oWnd == oWnd.top) {
      oWnd.close();
      return undefined;
    }
    return oWnd.parent.window;
  }
  return null;
}

function OnLoadNotification() {
  for (var cName in g_oTransferValues)
    window[cName] = g_oTransferValues[cName];

  NotificationInit(g_iPlayBoothVisitorSound, g_iShowChatNotifyPopup, g_iNotificationCheckIntervalSecs);
}

function OnLoadRPC() {
  RPC.Init("Shell", g_iInstanceID);
}

function CopyObject(oObj) {
  var oCopy = new Object();
  for (var cName in oObj)
    oCopy[cName] = oObj[cName];
  return oCopy;
}

function CopyObjectArray(aArray) {
  var aCopy = new Array();
  for (var iLup = 0; iLup < aArray.length; iLup++)
    aCopy[iLup] = CopyObject(aArray[iLup]);
  return aCopy;
}
// Shell notifications transfer /////////////////////////////////////////////////////////////////////////


function ExtractParamBlock(cParamBlock, iParamNo) { // iParamNo is 1-based
  var aValues = cParamBlock.split("^");
  if (iParamNo <= aValues.length) {
    return aValues[iParamNo - 1];
  } else {
    return "";
  }
}

function SetParamBlock(cParamBlock, iParamNo, cValue) {
  if (typeof(cValue) == "string")
    cValue = StringReplace(StringReplace(StringReplace(cValue, "\"", ""), "\n", ""), "^", "");

  var aPB = cParamBlock.split("^");
  var iLup = aPB.length;
  while (iLup < iParamNo) {
    aPB[iLup] = "";
    iLup++;
  }

  aPB[iParamNo - 1] = cValue;

  return aPB.join("^");
}

function GetFileSizeLimits(iMaxBytes, iMinBytes) {
  var oLimits = {
    "MinBytes": (iMinBytes === undefined || isNaN(iMinBytes)) ? 0 : iMinBytes,
    "MaxBytes": (iMaxBytes === undefined || isNaN(iMaxBytes)) ? 1073741824 : iMaxBytes
  }
  return oLimits;
}

function ValidateUploadFileSize(oInput, oReturnedLimits, iMinBytes, iMaxBytes) {
  var oLimits = GetFileSizeLimits(iMaxBytes, iMinBytes);

  if (!oInput || oLimits.MaxBytes < oLimits.MinBytes)
    return false;

  if (!window.FileReader)
    return true;

  if (!oInput.files || !oInput.files[0])
    return false;

  var bReturnLimits = oReturnedLimits && typeof oReturnedLimits === 'object';
  if (bReturnLimits) {
    oReturnedLimits.MinBytes = oLimits.MinBytes;
    oReturnedLimits.MaxBytes = oLimits.MaxBytes;
    oReturnedLimits.Files = [];
  }

  var oReturn;
  var bInRange;
  for (var iLup = 0; iLup < oInput.files.length; iLup++) {
    bInRange = (oInput.files[iLup].size >= oLimits.MinBytes && oInput.files[iLup].size <= oLimits.MaxBytes)

    if (bReturnLimits) {
      if (bInRange) {
        oReturn = {
          "FileSize": oInput.files[iLup].size,
          "FileName": oInput.files[iLup].name
        };
        oReturnedLimits.Files.push(oReturn);
      } else {
        oReturnedLimits.Files = undefined;
        oReturnedLimits.FileSize = oInput.files[iLup].size;
        oReturnedLimits.FileName = oInput.files[iLup].name;

        return false;
      }
    }
  }

  return true;
}

function HasLocalStorage() {
  if (typeof(localStorage) != "undefined") {
    try {
      localStorage.setItem("Testing123", 1); //this will throw an exception in Safari private browser
      localStorage.removeItem("Testing123");
      return true;
    } catch (e) {
      return false;
    }
  }

  return false;
}

function InPrivateBrowsingMode(fnCallback) {
  try {
    if (window.webkitRequestFileSystem) //chrome
    {
      window.webkitRequestFileSystem(window.TEMPORARY, 1,
        function() {
          fnCallback(false);
        },
        function(e) {
          fnCallback(true);
        }
      );
    } else if (IsFirefox()) {
      var oDB = window.indexedDB.open('test');

      function WaitTil() {
        if (oDB.readyState === "done")
          fnCallback(oDB.error);

        setTimeout(WaitTil, 100);
      }

      WaitTil();
    } else if (IEVersion() >= 10) {
      fnCallback(!window.indexedDB);
    } else if (IsSafari()) {
      fnCallback(!HasLocalStorage());
    } else {
      fnCallback(false);
    }
  } catch (e) {
    fnCallback(true);
  }
}

function ParseSQLDateTime(cDateTime) {
  if (cDateTime && cDateTime.length == 23)
    return new Date(cDateTime.substr(0, 4),
      cDateTime.substr(5, 2) - 1,
      cDateTime.substr(8, 2),
      cDateTime.substr(11, 2),
      cDateTime.substr(14, 2),
      cDateTime.substr(17, 2),
      cDateTime.substr(20, 3));
  else
    return null;
}