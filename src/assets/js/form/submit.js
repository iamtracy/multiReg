const g_oAjax = new InxpoAJAXObject();
const messages = {
  success: '<div>Success</div>',
  error: `<div>There was an error during registration</div>`,
  alreadyRegistered: `<div>You are already registered for this show</div>`,
  submitError: `<div>No Shows Were Selected</div>`
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

function postUI(showKey, regStatus) {
  const elem = $(`[data-showkey="${showKey}"]`);
  console.log(elem);
  if (regStatus === 'error') {
    elem.parent().html(messages.error);
  } else if (regStatus === 'success') {
    elem.parent().html(messages.success);
  } else if (regStatus === 'alreadyRegistered') {
    elem.parent().html(messages.alreadyRegistered);
  }
}

function doRegistration(iRetval, showKey, showPackageKey) {
  let formData = $('#MainForm').serialize();
  let cUrl = `LASCmd=AI:4;F:REG!1500;F:LBSEXPORT!JSON&SQLID=1010&ShowKey=${showKey}&ShowPackageKey=${showPackageKey}&RegistrationVisitActivityKey=${iRetval}&${formData}`;
  if (iRetval > 0) {
    g_oAjax.SendSyncRequest("POST", "https://vts.inxpo.com/scripts/Server.nxp?", cUrl);
    const oResponse = EvalResponse(g_oAjax.m_oXMLHTTPReqObj.responseText);
      if ((oResponse.ResultSet[0][0].ShowRegistrationKey == '0')) {
        postUI(showKey, 'error');
      } else {
        postUI(showKey, 'success');
      }
  }
}

function getRVAKey(showKey, showPackageKey) {
  const g_cAffiliateData = '';
  const cUrl = `https://vts.inxpo.com/scripts/Server.nxp?LASCmd=AI:4;F:LBSEXPORT!JSON&SQLID=1000&ShowKey=${showKey}${g_cAffiliateData !== '' ? '&AffiliateData=' + affliData : ''}${false ? '&LangLocaleID=' + cLangLocaleID : ''}`;
  getRVARes(cUrl, showKey, showPackageKey);
}

function isUserRegisteredForShow(data, selectedShows) {
  selectedShows.map(item => {
    if (item.showKey === data.showKey) return true;
  });
  return false;
}

function onSubmit() {
  const selectedShows = selectionState();
  if (selectedShows.length === 0) {
    $('#RegisterBTN').after(messages.submitError); //handle more elegantly
  } else {
    selectedShows.map(item => {
      if (!isUserRegisteredForShow(item, selectedShows)) {
        getRVAKey(item.showKey, item.showPackageKey) //needs to support oFormData.LangLocaleID
      }
    });
  }
}