const g_oAjax = new InxpoAJAXObject();
const g_omessages = {
  success: '<div class="success-message"><i class="fa fa-check-square" aria-hidden="true"></i><span class="select-event event-success caption">Successfully Registered</span></div>',
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

function postUI(showKey) {
  const elem = $(`[data-showkey="${showKey}"]`);
  elem.parent().html(g_omessages.success);
}

function doRegistration(iRetval, showKey, showPackageKey) {
  let formData = $('#MainForm').serialize();
  let cUrl = `LASCmd=AI:4;F:REG!1500;F:LBSEXPORT!JSON&SQLID=1010&ShowKey=${showKey}&ShowPackageKey=${showPackageKey}&RegistrationVisitActivityKey=${iRetval}&${formData}`;
  if (iRetval > 0) {
    g_oAjax.SendSyncRequest("POST", `${baseURI}Server.nxp?`, cUrl);
    const oResponse = EvalResponse(g_oAjax.m_oXMLHTTPReqObj.responseText);
    if ((oResponse.ResultSet[0][0].ShowRegistrationKey != '0')) {
      postUI(showKey);
      $('#successModal').foundation('open');
    }
  }
}

function getRVAKey(showKey, showPackageKey) {
  const g_cAffiliateData = '';
  const cUrl = `${baseURI}Server.nxp?LASCmd=AI:4;F:LBSEXPORT!JSON&SQLID=1000&ShowKey=${showKey}${g_cAffiliateData !== '' ? '&AffiliateData=' + affliData : ''}${false ? '&LangLocaleID=' + cLangLocaleID : ''}`;
  getRVARes(cUrl, showKey, showPackageKey);
}

function isUserRegisteredForShow(data, selectedShows) {
  selectedShows.map(item => {
    if (item.showKey === data.showKey) return true;
  });
  return false;
}

function onSubmit() {
  const oForm = document.getElementById('MainForm');
  if (InputForm_Validate(oForm)) {
    let oLID = document.getElementById("EMailAddress");
    let oPWD = document.getElementById("Password");
    if (oPWD === null) {
      const pw = document.createElement('input');
      pw.id = 'Password';
      pw.name = 'Password';
      pw.fieldname = 'Password';
      pw.type = 'hidden';
      pw.value = oLID.value.toLowerCase();
      oForm.appendChild(pw);
    } else {
      oPWD.value = oLID.value.toLowerCase();
    }

    const selectedShows = selectionState();
    selectedShows.map(item => {
      if (!isUserRegisteredForShow(item, selectedShows)) {
        getRVAKey(item.showKey, item.showPackageKey) //needs to support oFormData.LangLocaleID
      }
    });
  }
}