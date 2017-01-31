function InxpoAJAXObject() {
  if (window.XMLHttpRequest)
    this.m_oXMLHTTPReqObj = new XMLHttpRequest;
  else
    this.m_oXMLHTTPReqObj = new ActiveXObject("Microsoft.XMLHTTP");
  this.m_aHeaders = new Array();
}
InxpoAJAXObject.prototype.AddHeader = function(cHeadName, cHeaderValue) { this.m_aHeaders.push([cHeadName, cHeaderValue]); }
InxpoAJAXObject.prototype.SendRequest = function(cMethod, cURL, cPostParams) {
  var aHeader;
  try {
    if (this.m_oXMLHTTPReqObj) {
      if (this.m_oXMLHTTPReqObj.readyState == 4 || this.m_oXMLHTTPReqObj.readyState == 0) {
        var oThis = this;
        this.m_oXMLHTTPReqObj.open(cMethod, cURL, true);
        aHeader = this.m_aHeaders.pop();
        while (aHeader != undefined) { this.m_oXMLHTTPReqObj.setRequestHeader(aHeader[0], aHeader[1]);
          aHeader = this.m_aHeaders.pop(); }
        if (oThis.OnFileUploadProgress && this.m_oXMLHTTPReqObj.upload)
          this.m_oXMLHTTPReqObj.upload.onprogress = function(oEventP) { oThis.OnFileUploadProgress(oEventP); };
        this.m_oXMLHTTPReqObj.onreadystatechange = function() { oThis.ReadyStateChange(); };
        this.m_oXMLHTTPReqObj.send(cPostParams);
      }
    }
  } catch (e) {}
}
InxpoAJAXObject.prototype.SendSyncRequest = function(cMethod, cURL, cPostParams, bEvalResponse) {
  var oResponse = null;
  try {
    if (this.m_oXMLHTTPReqObj) {
      if (this.m_oXMLHTTPReqObj.readyState == 4 || this.m_oXMLHTTPReqObj.readyState == 0) {
        var oThis = this;
        this.m_oXMLHTTPReqObj.open(cMethod, cURL, false);
        this.m_oXMLHTTPReqObj.send(cPostParams);
        if (bEvalResponse) {
          if (window.JSON) {
            try { oResponse = window.JSON.parse(this.m_oXMLHTTPReqObj.responseText); } catch (e) { eval("oResponse = " + this.m_oXMLHTTPReqObj.responseText); }
          } else
            eval("oResponse = " + this.m_oXMLHTTPReqObj.responseText);
        }
      }
    }
  } catch (e) {}
  return oResponse;
}
InxpoAJAXObject.prototype.Abort = function() {
  if (this.m_oXMLHTTPReqObj && this.m_oXMLHTTPReqObj.readyState != 4)
    this.m_oXMLHTTPReqObj.abort();
}
InxpoAJAXObject.prototype.OnLoading = function() {}
InxpoAJAXObject.prototype.OnLoaded = function() {}
InxpoAJAXObject.prototype.OnInteractive = function() {}
InxpoAJAXObject.prototype.OnComplete = function(cResponse, oInxpoAJAXObject) {}
InxpoAJAXObject.prototype.OnAbort = function() {}
InxpoAJAXObject.prototype.OnFileUploadProgress = function(oEvent) {}
InxpoAJAXObject.prototype.OnError = function(iStatus, cStatusText) {}
InxpoAJAXObject.prototype.ReadyStateChange = function() {
  try {
    if (this.m_oXMLHTTPReqObj.readyState == 1) {
      if (this.OnLoading)
        this.OnLoading();
    } else if (this.m_oXMLHTTPReqObj.readyState == 2) {
      if (this.OnLoaded)
        this.OnLoaded();
    } else if (this.m_oXMLHTTPReqObj.readyState == 3) {
      if (this.OnInteractive)
        this.OnInteractive();
    } else if (this.m_oXMLHTTPReqObj.readyState == 4) {
      if (this.m_oXMLHTTPReqObj.status == 0) {
        if (this.OnAbort)
          this.OnAbort();
      } else if (this.m_oXMLHTTPReqObj.status == 200) {
        if (this.OnComplete)
          this.OnComplete(this.m_oXMLHTTPReqObj.responseText, this);
      } else {
        if (this.OnError)
          this.OnError(this.m_oXMLHTTPReqObj.status, this.m_oXMLHTTPReqObj.statusText);
      }
    }
  } catch (e) {}
}

function InxpoAJAXExtractHTMLBody(cHTML) {
  var iPos = cHTML.indexOf("<BODY");
  if (iPos < 0)
    iPos = cHTML.indexOf("<body");
  if (iPos > -1) {
    var iPos2 = cHTML.indexOf(">", iPos + 1);
    if (iPos2 > -1) {
      iPos = cHTML.indexOf("</body>", iPos2 + 1);
      if (iPos < 0)
        iPos = cHTML.indexOf("</BODY>", iPos2 + 1);
      if (iPos > 0)
        cHTML = cHTML.substring(iPos2 + 1, iPos);
      else
        cHTML = cHTML.substr(iPos2 + 1);
    }
  }
  return cHTML;
}

function InxpoAJAXEvalJSON(cJSON) {
  var cRetval;
  if (window.JSON) {
    try { cRetval = window.JSON.parse(cJSON); } catch (e) { eval("cRetval = (" + cJSON + ")"); }
  } else { eval("cRetval = (" + cJSON + ")"); }
  return cRetval;
}

function EvalResponse(cResponse) {
  var oResponse = null;
  try {
    if (window.JSON) {
      try { oResponse = window.JSON.parse(cResponse); } catch (e) { eval("oResponse = " + cResponse); }
    } else { eval("oResponse = " + cResponse); }
  } catch (e) {
    if (typeof(cResponse) == "string")
      oResponse = FindErrorMessage(cResponse);
    if (oResponse == null)
      oResponse = { Status: 1, Diag: "The server is not responding.", ResultSet: [] };
  }
  return oResponse;
}

function FindErrorMessage(cResponse) {
  var oResponse = null;
  try {
    var iIndex = cResponse.indexOf("\"DisplayField\"");
    if (iIndex > -1) {
      iIndex = cResponse.indexOf("<td>", iIndex);
      if (iIndex > -1) {
        iIndex += 4;
        var iEnd = cResponse.indexOf(".", iIndex);
        if (iEnd == -1)
          iEnd = cResponse.indexOf("</td>", iIndex);
        else
          iEnd++;
        cResponse = cResponse.substr(iIndex, (iEnd - iIndex));
        oResponse = { Status: 1, Diag: cResponse, ResultSet: [] };
      }
    }
  } catch (e) {}
  return oResponse;
}