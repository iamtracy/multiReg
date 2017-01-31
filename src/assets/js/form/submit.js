const messages = {
  success: 'Dat Boi',
  error: `<div>No Shows Were Selected</div>`
}

function getRVARes(url, showKey, showPackageKey) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onreadystatechange = handleResponse;
    xhr.onerror = e => console.log(e);
    xhr.send();

    function handleResponse() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          const data = response.ResultSet[0][0];
          const iRetval = data.RegistrationVisitActivityKey;
          doRegistration(iRetval, showKey, showPackageKey);
        }
      }
    }
  });
}

function doRegistration(iRetval, showKey, showPackageKey) {
  let formData = $('#MainForm').serialize();
  let cUrl = `?LASCmd=AI:4;F:LBSEXPORT!JSON&SQLID=1010&ShowKey=${showKey}&ShowPackageKey=${showPackageKey}&RegistrationVisitActivityKey=${iRetval}&${formData}`;
  if (iRetval > 0) {
    g_oAjax.SendSyncRequest("POST", "Server.nxp", cUrl);
    const oResponse = EvalResponse(g_oAjax.m_oXMLHTTPReqObj.responseText);
    console.log(iRetval, oResponse);
  }
}

function getRVAKey(showKey, showPackageKey) {
  const g_cAffiliateData = '';
  const cUrl = `Server.nxp?LASCmd=AI:4;F:LBSEXPORT!JSON&SQLID=1000&ShowKey=${showKey}${g_cAffiliateData !== '' ? '&AffiliateData=' + affliData : ''}${false ? '&LangLocaleID=' + cLangLocaleID : ''}`;
  getRVARes(cUrl, showKey, showPackageKey);
}

function isUserRegisteredForShow(data, selectedShows) {
  selectedShows.map(item => {
    if (item.showKey === data.showKey) {
      return true;
    }
  });
  return false;
}

function registerUser() {
  const selectedShows = selectionState();
  if (selectedShows.length === 0) {
    $('#RegisterBTN').after(messages.error); //handle more elegantly
  } else {
    selectedShows.map(item => {
      if (!isUserRegisteredForShow(item, selectedShows)) {
        getRVAKey(item.showKey, item.showPackageKey) //needs to support oFormData.LangLocaleID
      }
    });
  }
}

function onSubmit() {
  registerUser();
}