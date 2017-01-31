var g_oDisablePageLayer = null;

function DisablePage(sMessage, sImageSrc, oLayer) {
  if (oLayer)
    g_oDisablePageLayer = oLayer;
  if (!oLayer && !g_oDisablePageLayer) {
    oLayer = document.createElement("TABLE");
    oBody = document.createElement("TBODY");
    oLayer.appendChild(oBody);
    oLayer.id = "DisablePageElem";
    oLayer.className = "DisablePageLayer";
    oLayer.border = 0;
    oLayer.cellSpacing = 0;
    oLayer.cellPadding = 0;
    var oRow = document.createElement("TR");
    oBody.appendChild(oRow);
    var oCell = document.createElement("TD");
    oRow.appendChild(oCell);
    oCell.align = "center";
    oCell.valign = "middle";
    oCell.innerHTML = "<span id=\"DisablePageMessage\"></span><br />";
    document.body.appendChild(oLayer);
    var oImg = document.createElement("IMG");
    oImg.src = (sImageSrc ? sImageSrc : "/cfr/images/VTS/progressbar.gif");
    oCell.appendChild(oImg);
    g_oDisablePageLayer = oLayer;
  }

  var iLeft = 0,
    iTop = 0,
    iWidth, iHeight;
  if (document.documentElement && document.documentElement.clientWidth > 0) {
    iLeft = document.documentElement.scrollLeft;
    iWidth = document.documentElement.clientWidth;
  } else
    iWidth = document.body.clientWidth;
  if (document.documentElement && document.documentElement.clientHeight > 0) {
    iTop = document.documentElement.scrollTop;
    iHeight = document.documentElement.clientHeight;
  } else
    iHeight = document.body.clientHeight;

  document.getElementById("DisablePageMessage").innerHTML = (sMessage ? sMessage : "Please wait...")
  g_oDisablePageLayer.style.top = iTop + "px";
  g_oDisablePageLayer.style.left = iLeft + "px";
  g_oDisablePageLayer.style.width = iWidth + "px";
  g_oDisablePageLayer.style.height = iHeight + "px";
  g_oDisablePageLayer.style.display = "";
  return g_oDisablePageLayer;
}

function EnablePage() {
  if (g_oDisablePageLayer)
    g_oDisablePageLayer.style.display = "none";
}