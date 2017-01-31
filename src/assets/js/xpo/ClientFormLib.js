var g_cRequiredImage = "url(/cfr/images/EntryRequired.gif)";
var g_cDecimalSeparator = ".";
var g_cDefaultDateFormat = "M/D/Y";
var g_cTimeFormat = "hh:mm tt".replace(" tt", "").replace("tt ", "");
var g_oElemInError = null;
var g_bUsePasswordPolicy = false;
var g_aPasswordPolicy = [0, 0, false, false, false, false, false];
var g_aIllegalPasswords = ["PASSWORD", "PASS", "PW", "TEST", "TESTING", "VTS", "INXPO", "XPOCAST"];
var g_oStrings = {
  EntryRequired: "{FieldName} may not be blank!\nPlease re-enter.",
  FileRequired: "Please select a file to upload!",
  FileExceedsBounds: "Your uploaded file {FileName} must be under {MaxSize} in size.",
  InvalidEmail: "{FieldName} must be a valid email address!\nPlease re-enter.",
  InvalidDate: "{FieldName} is an invalid date!\nPlease re-enter in {Format} format.",
  InvalidTime: "{FieldName} is an invalid time!\nPlease re-enter in {Format} format.",
  InvalidNumber: "{FieldName} may only contain digits 0-9 and a decimal separator!",
  NotNegative: "{FieldName} may not be negative!",
  InvalidInteger: "{FieldName} may only contain digits 0-9!",
  InvalidURL: "{FieldName} does not appear to be a valid URL!",
  URLHint: "Please re-enter, beginning with http://, https://, ftp:// or ftps://.",
  InvalidMinValue: "{FieldName} must be greater than or equal to {Value}.",
  InvalidMaxValue: "{FieldName} must be less than or equal to {Value}.",
  InvalidChar: "{FieldName} must not contain characters in the set [].",
  InvalidMinLength: "{FieldName} must be at least {Number} characters in length.",
  InvalidMaxLength: "{FieldName} must be no more than {Number} characters in length.",
  AlphaNumeric: "{FieldName} must contain letters and numbers.",
  AllNumeric: "{FieldName} must contain a letter or symbol.",
  SameCharacter: "{FieldName} must contain differing characters.",
  InvalidWord: "{FieldName} is a word that is not allowed.",
  ContainsLogin: "{FieldName} cannot contain your Login ID.",
  InvalidInclusion: "{FieldName} must be in the value set [].",
  InvalidExclusion: "{FieldName} must not be in the value set [].",
  InvalidSymbols: "The password must not contain any of the following symbols...",
  PasswordRequired: "Password is required",
  PasswordShort: "Password is too short",
  PasswordLong: "Password is too long",
  PasswordAlpha: "Password must contain letters and numbers",
  PasswordNumeric: "Password must contain a letter or symbol",
  PasswordSameChar: "Password must contain differing characters",
  PasswordNotAllowed: "That password is not allowed",
  PasswordContainsLogin: "Password cannot contain your Login ID",
  PasswordValid: "Password is acceptable",
  InvalidIPAddress: "{FieldName} must be a valid IP address!\nPlease re-enter in {Format} format, (i.e. {example})."
};
var g_oPasswordElemHold = null;
var g_bSuppressValidationAlert = false;
var g_cLastValidationError = "";

function InputField_OnBlur(aEvent) {
  var oEvent = new EventObj(aEvent);
  var oElem = oEvent.srcElement;

  var cInputType = oElem.getAttribute("InputType");
  if (cInputType != null && cInputType.indexOf("R") > -1) {
    if (oElem.value.length < 1 && ["checkbox", "radio"].indexOf(oElem.type) == -1 && oElem.tagName != "SELECT") {
      oElem.style.backgroundImage = g_cRequiredImage;
      oElem.style.backgroundRepeat = "no-repeat";
    }
  }
}

function InputField_OnChange(aEvent) {
  var oEvent = new EventObj(aEvent);
  var oElem = oEvent.srcElement;
  var cInputType = oElem.getAttribute("InputType");
  if (cInputType != null && oElem.type == "text" && oElem.value.length > 0) {
    // check for force of uppercase
    if (cInputType.indexOf("U") > -1)
      oElem.value = oElem.value.toUpperCase();
    else {
      // check for force of lowercase
      if (cInputType.indexOf("L") > -1)
        oElem.value = oElem.value.toLowerCase();
    }
  }
}

function InputField_OnFocus(aEvent) {
  var oEvent = new EventObj(aEvent);
  var oElem = oEvent.srcElement;
  var cInputType = oElem.getAttribute("InputType");
  if (cInputType != null && cInputType.indexOf("R") > -1)
    oElem.style.backgroundImage = "";
}

function InputForm_Submit(aEvent, oEvent) {
  if (oEvent == null)
    oEvent = new EventObj(aEvent);
  oEvent.ReturnValue(true);
  var oForm = oEvent.srcElement;

  if (!InputForm_Validate(oForm, oEvent))
    oEvent.ReturnValue(false);
}

function InputForm_Validate(oForm, oEvent) {
  var iCount = oForm.length;
  var oElem;
  var bRetval = true;

  g_oElemInError = null;

  for (var iLup = 0; iLup < iCount; iLup++) {
    oElem = oForm.elements[iLup];

    bRetval = ValidateInputField(oElem, oEvent);
    if (!bRetval)
      break;
  }

  return bRetval;
}

function ValidateInputField(oElem, oEvent) {
  var cInputType;
  var bValid = true;
  var bFound = false;

  if (oElem.type != "text" && oElem.type != "file" && oElem.type != "select" && oElem.type != "select-one" && oElem.type != "select-multiple" && oElem.type != "password" && oElem.type != "textarea")
    return true;
  if (oElem.readOnly || oElem.disabled)
    return true;

  cInputType = oElem.getAttribute("InputType");

  if (cInputType != null) {
    // check for *required* fields
    if (cInputType.indexOf("R") > -1 && oElem.value.length < 1) {
      // error required field blank!
      if (oElem.type == "file")
        DoValidationError(oEvent, oElem, g_oStrings.FileRequired);
      else
        DoValidationError(oEvent, oElem, g_oStrings.EntryRequired);

      return false;
    }

    if (oElem.type == "select" || oElem.type == "select-one" || oElem.type == "select-multiple")
      return true;

    //Validate file upload size
    if (oElem.type == "file" && oElem.value != "" && ValidateUploadFileSize && cInputType.indexOf("FileSize") > -1) {
      var cMinBytes = oElem.getAttribute("MinBytes");
      var iMinBytes = (cMinBytes != null && cMinBytes != "") ? cMinBytes * 1 : undefined;
      var cMaxBytes = oElem.getAttribute("MaxBytes");
      var iMaxBytes = (cMaxBytes != null && cMaxBytes != "") ? cMaxBytes * 1 : undefined;
      var oReturnedLimits = {};
      if (!ValidateUploadFileSize(oElem, oReturnedLimits, iMinBytes, iMaxBytes)) {
        var cErrorMessage = g_oStrings.FileExceedsBounds.replace("{FileSize}", oReturnedLimits.FileSize)
          .replace("{MaxSize}", FormatFileSize(oReturnedLimits.MaxBytes))
          .replace("{MinSize}", FormatFileSize(oReturnedLimits.MinBytes))
          .replace("{FileName}", oReturnedLimits.FileName);
        DoValidationError(oEvent, oElem, cErrorMessage);
        return false;
      }
    }

    // Validate Email Address 
    if (cInputType.indexOf("E") > -1 && oElem.value != "") {
      if (oElem.value.indexOf(" ") > -1) {
        bValid = false;
      } else {
        var emailReg1 = /(@.*@)|(\.\.)|(@\.)|(\.@)|(^\.)/; // not valid
        var emailReg2 = /^.+\@(\[?)[a-zA-Z0-9\-_\.]+\.([a-zA-Z]{2,6}|[0-9]{1,3})(\]?)$/; // valid
        if (!(!emailReg1.test(oElem.value) && emailReg2.test(oElem.value)))
          bValid = false;

        if (bValid && oElem.value.indexOf(",") > -1)
          bValid = false;
      }

      if (!bValid) {
        DoValidationError(oEvent, oElem, g_oStrings.InvalidEmail);
        return false;
      }
    }

    // validate IP Address format 
    if (cInputType.indexOf("ipv") > -1 && oElem.value != "") {
      if (cInputType.indexOf("ipv4") > -1 && !IsValidIPv4(oElem.value)) {
        DoValidationError(oEvent, oElem, g_oStrings.InvalidIPAddress.replace("{Format}", "IPv4").replace("{example}", "192.168.1.1"));
        return false;
      } else if (cInputType.indexOf("ipv6") > -1 && !IsValidIPv6(oElem.value)) {
        DoValidationError(oEvent, oElem, g_oStrings.InvalidIPAddress.replace("{Format}", "IPv6").replace("{example}", "FE80:0000:0000:0000:0202:B3FF:FE1E:8329"));
        return false;
      } else if (cInputType.indexOf("ipvx") > -1 && !IsValidIPv4(oElem.value) && !IsValidIPv6(oElem.value)) {
        DoValidationError(oEvent, oElem, g_oStrings.InvalidIPAddress.replace("{Format}", "IPv4 or IPv6").replace("{example}", "192.168.1.1 or FE80:0000:0000:0000:0202:B3FF:FE1E:8329"));
        return false;
      }
    }

    // check Date format
    if (cInputType.indexOf("D") > -1 && oElem.value != "") {
      var cDateFmt = g_cDateFmtMask;
      if (cDateFmt == null)
        cDateFmt = g_cDefaultDateFormat;

      oElem.defaultValue = oElem.value;
      if (!IsValidDate(oElem, cDateFmt)) {
        DoValidationError(oEvent, oElem, g_oStrings.InvalidDate.replace("{Format}", cDateFmt));
        return false;
      }
    }

    // check Time format
    if (cInputType.indexOf("T") > -1 && oElem.value != "") {
      if (!IsValidTime(oElem)) {
        DoValidationError(oEvent, oElem, g_oStrings.InvalidTime.replace("{Format}", g_cTimeFormat));
        return false;
      }
    }

    // check DecimalNumber
    if (cInputType.indexOf("N") > -1 && oElem.value != "") {
      var cChar = "";
      for (var iIndex = 0; iIndex < oElem.value.length; iIndex++) {
        cChar = oElem.value.charAt(iIndex);
        if ((iIndex == 0 ? "-.0123456789".indexOf(cChar) : ".0123456789".indexOf(cChar)) < 0) {
          DoValidationError(oEvent, oElem, g_oStrings.InvalidNumber);
          bValid = false;
          break;
        }
      }

      if (!bValid)
        return false;

      if (oElem.value == ".")
        oElem.value = "0.0";

      if (cInputType.indexOf("+") > -1) // positive
      {
        if ((oElem.value * 1) < 0) {
          DoValidationError(oEvent, oElem, g_oStrings.NotNegative);
          return false;
        }
      }
    }

    // check Integer
    if (cInputType.indexOf("I") > -1 && oElem.value != "") {
      var cChar = "";
      for (var iIndex = 0; iIndex < oElem.value.length; iIndex++) {
        cChar = oElem.value.charAt(iIndex);
        if ((iIndex == 0 ? "-0123456789".indexOf(cChar) : "0123456789".indexOf(cChar)) < 0) {
          DoValidationError(oEvent, oElem, g_oStrings.InvalidInteger);
          bValid = false;
          break;
        }
      }

      if (!bValid)
        return false;

      if (cInputType.indexOf("+") > -1) // positive
      {
        if ((oElem.value * 1) < 0) {
          DoValidationError(oEvent, oElem, g_oStrings.NotNegative);
          return false;
        }
      }
    }

    // check HREF/URL
    if (cInputType.indexOf("H") > -1 && oElem.value != "") {
      var cProto = oElem.value.substr(0, 8).toLowerCase();
      if (cProto.substr(0, 7) != "http://" && cProto != "https://" &&
        cProto.substr(0, 6) != "ftp://" && cProto.substr(0, 7) != "ftps://" &&
        oElem.value.substr(0, 10).toLowerCase() != "server.nxp" &&
        cProto.substr(0, 6) != "mms://") {
        if (cProto.substr(0, 1) != "/") // check for relative url
        {
          DoValidationError(oEvent, oElem, g_oStrings.InvalidURL + "\n" + g_oStrings.URLHint);
          return false;
        }
      }
    }

    // check for force of uppercase
    if (cInputType.indexOf("U") > -1)
      oElem.value = oElem.value.toUpperCase();

    // check for force of lowercase
    if (cInputType.indexOf("L") > -1)
      oElem.value = oElem.value.toLowerCase();

    // check for Min/Max values
    var cMinValue = oElem.getAttribute("MinValue");
    if (cMinValue != null && cMinValue != "" && oElem.value != "") {
      if (cInputType.indexOf("I") > -1 || cInputType.indexOf("N") > -1) {
        if ((oElem.value * 1) < (cMinValue * 1))
          bValid = false;
      } else if (cInputType.indexOf("D") > -1) {
        var oMinDate = new Date(Date.parse(cMinValue));
        var oElemDate = new Date(Date.parse(oElem.value));
        if (oElemDate < oMinDate)
          bValid = false;
      } else {
        if (oElem.value < cMinValue)
          bValid = false;
      }

      if (!bValid) {
        DoValidationError(oEvent, oElem, g_oStrings.InvalidMinValue.replace("{Value}", cMinValue));
        return false;
      }
    }

    var cMaxValue = oElem.getAttribute("MaxValue");
    if (cMaxValue != null && cMaxValue != "" && oElem.value != "") {
      if (cInputType.indexOf("I") > -1 || cInputType.indexOf("N") > -1) {
        if ((oElem.value * 1) > (cMaxValue * 1))
          bValid = false;
      } else if (cInputType.indexOf("D") > -1) {
        var oMaxDate = new Date(Date.parse(cMaxValue));
        var oElemDate = new Date(Date.parse(oElem.value));
        if (oElemDate > oMaxDate)
          bValid = false;
      } else {
        if (oElem.value > cMaxValue)
          bValid = false;
      }

      if (!bValid) {
        DoValidationError(oEvent, oElem, g_oStrings.InvalidMaxValue.replace("{Value}", cMaxValue));
        return false;
      }
    }

    // check excluded chars
    if (cInputType.indexOf("X") > -1) {
      var cExcludeChars = oElem.getAttribute("ExcludeChars");
      if (cExcludeChars && cExcludeChars != "") {
        for (var i = 0; i < cExcludeChars.length; i++) {
          if (oElem.value.indexOf(cExcludeChars.substr(i, 1)) > -1) {
            bFound = true;
            break;
          }
        }
      }

      if (bFound) {
        DoValidationError(oEvent, oElem, g_oStrings.InvalidChar.replace("[]", "[" + cExcludeChars + "]"));
        return false;
      }
    }

    // check password fields
    if (cInputType.indexOf("P") > -1 && oElem.value.length > 0) {
      // min length
      if (g_aPasswordPolicy[0] && oElem.value.length < g_aPasswordPolicy[0]) {
        DoValidationError(oEvent, oElem, g_oStrings.InvalidMinLength.replace("{Number}", g_aPasswordPolicy[0]));
        return false;
      }

      // max length
      if (g_aPasswordPolicy[1] && oElem.value.length > g_aPasswordPolicy[1]) {
        DoValidationError(oEvent, oElem, g_oStrings.InvalidMaxLength.replace("{Number}", g_aPasswordPolicy[1]));
        return false;
      }

      // must be alpha-numeric
      if (g_aPasswordPolicy[2]) {
        var oRegEx = /^[ A-Za-z0-9\!\@\_\-\.]*?([A-Za-z][ A-Za-z0-9\!\@\_\-\.]*?[0-9]|[0-9][ A-Za-z0-9\!\@\_\-\.]*?[A-Za-z])[ A-Za-z0-9\!\@\_\-\.]*$/;
        if (!oRegEx.test(oElem.value)) {
          DoValidationError(oEvent, oElem, g_oStrings.AlphaNumeric);
          return false;
        }
      }

      // allow all numeric
      if (g_aPasswordPolicy[3]) {
        var oRegEx = /^[ A-Za-z0-9\!\@\_\-\.]*?[ a-zA-Z\!\@\_\-\.]+[ A-Za-z0-9\!\@\_\-\.]*$/;
        if (!oRegEx.test(oElem.value)) {
          DoValidationError(oEvent, oElem, g_oStrings.AllNumeric);
          return false;
        }
      }

      // allow same character string
      if (g_aPasswordPolicy[4]) {
        var iIndex = 0,
          bSame = true;
        var cChar = oElem.value.toUpperCase().substr(0, 1);
        do {
          if (cChar != oElem.value.toUpperCase().substr(iIndex, 1))
            bSame = false;
          iIndex++;
        } while (bSame && iIndex < oElem.value.length);
        if (bSame) {
          DoValidationError(oEvent, oElem, g_oStrings.SameCharacter);
          return false;
        }
      }

      // check the dictionary of illegal passwords
      if (g_aPasswordPolicy[5] && g_aIllegalPasswords.indexOf(oElem.value.toUpperCase()) > -1) {
        DoValidationError(oEvent, oElem, g_oStrings.InvalidWord);
        return false;
      }

      // allow UserID in the password
      if (g_aPasswordPolicy[6]) {
        var cUserID = null;
        if (document.forms[0] && document.forms[0].elements["LoginID"])
          cUserID = document.forms[0].elements["LoginID"].value;
        if (g_aPasswordPolicy[6] && cUserID && oElem.value.toUpperCase().indexOf(cUserID.toUpperCase()) > -1) {
          DoValidationError(oEvent, oElem, g_oStrings.ContainsLogin);
          return false;
        }
      }
    }

    // check inclusion and exclusion lists
    //InclusionSet
    if (oElem.getAttribute("InclusionSet") != null && oElem.value != "") {
      var xValue;
      var aInclusionSet = oElem.getAttribute("InclusionSet");
      for (var iIndex = 0; iIndex < cInclusionSet.length; iIndex++) {
        xValue = aInclusionSet[iIndex];
        if (cInputType.indexOf("I") > -1 || cInputType.indexOf("N") > -1) {
          if ((oElem.value * 1) == xValue)
            bFound = true;
        } else {
          if (oElem.value == xValue)
            bFound = true;
        }

        if (bFound)
          break;
      }

      if (!bFound) {
        DoValidationError(oEvent, oElem, g_oStrings.InvalidInclusion.replace("[]", "[" + aInclusionSet.toString() + "]"));
        return false;
      }
    }

    //ExclusionSet
    if (oElem.getAttribute("ExclusionSet") != null && oElem.value != "") {
      var bFound = false;
      var xValue;
      var aExclusionSet = oElem.getAttribute("ExclusionSet");
      for (var iIndex = 0; iIndex < aExclusionSet.length; iIndex++) {
        xValue = aExclusionSet[iIndex];
        if (cInputType.indexOf("I") > -1 || cInputType.indexOf("N") > -1) {
          if ((oElem.value * 1) == xValue)
            bFound = true;
        } else {
          if (oElem.value == xValue)
            bFound = true;
        }

        if (bFound)
          break;
      }

      if (bFound) {
        DoValidationError(oEvent, oElem, g_oStrings.InvalidExclusion.replace("[]", "[" + aExclusionSet.toString() + "]"));
        return false;
      }
    }

    // maxlen for text area
    if (oElem.tagName == "TEXTAREA" && oElem.getAttribute("maxlength")) {
      var iLen = parseInt(oElem.getAttribute("maxlength"));
      if (oElem.value.length > iLen) {
        DoValidationError(oEvent, oElem, g_oStrings.InvalidMaxLength.replace("{Number}", iLen));
        return false;
      }
    }
  }

  return true;
}


function IsValidTime(oElem) {
  var iHour = 0;
  var iMinute = 0;
  var iPos = oElem.value.indexOf(":");
  if (iPos < 0)
    return false;

  iHour = oElem.value.substr(0, iPos) * 1;
  iMinute = oElem.value.substr(iPos + 1) * 1;

  if (iHour < 0 || iHour > 23)
    return false;

  if (iMinute < 0 || iMinute > 59)
    return false;

  return true;
}


function IsValidIPv4(cIPAddress) {
  var regIPv4 = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/; // valid

  return regIPv4.test(cIPAddress);
}


function IsValidIPv6(cIPAddress) {
  var regIPv6 = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$|^(([a-zA-Z]|[a-zA-Z][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$|^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/; // valid

  return regIPv6.test(cIPAddress);
}


function IsLeapYear(iYear) {
  return !((iYear % 4 != 0) || ((iYear % 100 == 0) && (iYear % 400 != 0)))
}


function IsValidDate(oElem, cDateFmt) {
  var iPos;
  var iPos2;
  var cDelimiter;
  var iMonth = 0;
  var iDay = 0;
  var iYear = 0;

  iPos = oElem.value.indexOf("/");
  if (iPos < 0) {
    iPos = oElem.value.indexOf("-");
    if (iPos < 0) {
      iPos = oElem.value.indexOf(".");
      if (iPos < 0)
        return false;
      else
        cDelimiter = ".";
    } else
      cDelimiter = "-";
  } else
    cDelimiter = "/";

  if (oElem.value.split(cDelimiter).length > 3)
    return false;

  iPos2 = oElem.value.indexOf(cDelimiter, iPos + 1);

  switch (cDateFmt.substr(0, 1)) {
    case "M":
      iMonth = oElem.value.substr(0, iPos) * 1;
      break;
    case "D":
      iDay = oElem.value.substr(0, iPos) * 1;
      break;
    case "Y":
      iYear = oElem.value.substr(0, iPos) * 1;
      break;
  }

  switch (cDateFmt.substr(2, 1)) {
    case "M":
      iMonth = oElem.value.substr(iPos + 1, iPos2 - iPos - 1) * 1;
      break;
    case "D":
      iDay = oElem.value.substr(iPos + 1, iPos2 - iPos - 1) * 1;
      break;
    case "Y":
      iYear = oElem.value.substr(iPos + 1, iPos2 - iPos - 1) * 1;
      break;
  }

  switch (cDateFmt.substr(4, 1)) {
    case "M":
      iMonth = oElem.value.substr(iPos2 + 1) * 1;
      break;
    case "D":
      iDay = oElem.value.substr(iPos2 + 1) * 1;
      break;
    case "Y":
      iYear = oElem.value.substr(iPos2 + 1) * 1;
      break;
  }

  if (iMonth < 1 || iMonth > 12)
    return false;

  if (iDay < 1)
    return false;

  if ((iMonth == 4 || iMonth == 6 || iMonth == 9 || iMonth == 11)) {
    if (iDay > 30)
      return false;
  } else {
    if (iMonth == 2 && iDay > 28) {
      if (IsLeapYear(iYear)) {
        if (iDay > 29)
          return false;
      } else {
        return false;
      }
    } else {
      if (iDay > 31)
        return false;
    }
  }

  if (iYear < 1900) {
    if (iYear < 50)
      iYear = iYear + 2000;
    else
      iYear = iYear + 1900;
  }

  if (iYear > 2199)
    return false;

  oElem.value = MDYToDate101(iMonth, iDay, iYear); // rebuild date in full 101 format

  return true;
}

function MDYToDate101(iMonth, iDay, iYear) {
  var cRetval;
  var cPart;

  cPart = "0" + iMonth;
  cPart = cPart.substr(cPart.length - 2, 2);
  cRetval = cPart + "/";
  cPart = "0" + iDay;
  cPart = cPart.substr(cPart.length - 2, 2);
  cRetval += cPart + "/" + iYear;

  return cRetval;
}

function Date101ToLocalDate(cDate101) {
  var iPos;
  var iPos2;
  var cDelimiter;
  var iMonth = 0;
  var iDay = 0;
  var iYear = 0;

  iPos = cDate101.indexOf("/");
  if (iPos < 0) {
    iPos = cDate101.indexOf("-");
    if (iPos < 0) {
      iPos = cDate101.indexOf(".");
      if (iPos < 0)
        return "";
      else
        cDelimiter = ".";
    } else
      cDelimiter = "-";
  } else
    cDelimiter = "/";

  iPos2 = cDate101.indexOf(cDelimiter, iPos + 1);

  iMonth = cDate101.substr(0, iPos) * 1;
  iDay = cDate101.substr(iPos + 1, iPos2 - iPos - 1) * 1;
  iYear = cDate101.substr(iPos2 + 1) * 1;

  return MDYToLocalDate(iMonth, iDay, iYear);
}


function MDYToLocalDate(iMonth, iDay, iYear) {
  var cRetval = "";
  var cPart;
  var cDelimiter = g_cDateFmtMask.substr(1, 1);

  for (var iLup = 0; iLup < 5; iLup += 2) {
    switch (g_cDateFmtMask.substr(iLup, 1)) {
      case "M":
        cPart = "0" + iMonth;
        cPart = cPart.substr(cPart.length - 2, 2);
        break;
      case "D":
        cPart = "0" + iDay;
        cPart = cPart.substr(cPart.length - 2, 2);
        break;
      case "Y":
        cPart = "" + iYear;
        break;
    }

    cRetval += cPart;
    if (iLup < 4)
      cRetval += cDelimiter;
  }

  return cRetval;
}

function LocalDateToDate101(cLocalDate) {
  var iPos;
  var iPos2;
  var cDelimiter;
  var iMonth = 0;
  var iDay = 0;
  var iYear = 0;

  iPos = cLocalDate.indexOf("/");
  if (iPos < 0) {
    iPos = cLocalDate.indexOf("-");
    if (iPos < 0) {
      iPos = cLocalDate.indexOf(".");
      if (iPos < 0)
        return "";
      else
        cDelimiter = ".";
    } else
      cDelimiter = "-";
  } else
    cDelimiter = "/";

  iPos2 = cLocalDate.indexOf(cDelimiter, iPos + 1);

  switch (g_cDateFmtMask.substr(0, 1)) {
    case "M":
      iMonth = cLocalDate.substr(0, iPos) * 1;
      break;
    case "D":
      iDay = cLocalDate.substr(0, iPos) * 1;
      break;
    case "Y":
      iYear = cLocalDate.substr(0, iPos) * 1;
      break;
  }

  switch (g_cDateFmtMask.substr(2, 1)) {
    case "M":
      iMonth = cLocalDate.substr(iPos + 1, iPos2 - iPos - 1) * 1;
      break;
    case "D":
      iDay = cLocalDate.substr(iPos + 1, iPos2 - iPos - 1) * 1;
      break;
    case "Y":
      iYear = cLocalDate.substr(iPos + 1, iPos2 - iPos - 1) * 1;
      break;
  }

  switch (g_cDateFmtMask.substr(4, 1)) {
    case "M":
      iMonth = cLocalDate.substr(iPos2 + 1) * 1;
      break;
    case "D":
      iDay = cLocalDate.substr(iPos2 + 1) * 1;
      break;
    case "Y":
      iYear = cLocalDate.substr(iPos2 + 1) * 1;
      break;
  }

  return MDYToDate101(iMonth, iDay, iYear);
}

function DoValidationError(oEvent, oElem, cErrorText) {
  if (oEvent && oEvent.ReturnValue)
    oEvent.ReturnValue(false);

  var cError = cErrorText;

  if (oElem) {
    RestoreDateFields(oElem);

    var cTitle = oElem.getAttribute("FieldName");
    if (!cTitle || cTitle.length == 0)
      cTitle = (oElem.title.length > 0 ? oElem.title : oElem.name);
    if (cTitle.length == 0 && oElem.id)
      cTitle = oElem.id;

    cTitle = StripHTML(cTitle);
    cError = cErrorText.replace("{FieldName}", cTitle);
  }

  if (!g_bSuppressValidationAlert) {
    alert(cError);

    if (oElem) {
      g_oElemInError = oElem;
      try {
        oElem.focus();
      } catch (e) {}
    }
  } else {
    g_cLastValidationError = cError;
  }
}

var g_oCFLib_FileGuide = [
  { "Denominator": Math.pow(2, 0), "Unit": "B" },
  { "Denominator": Math.pow(2, 10), "Unit": "KB" },
  { "Denominator": Math.pow(2, 20), "Unit": "MB" },
  { "Denominator": Math.pow(2, 30), "Unit": "GB" },
  { "Denominator": Math.pow(2, 40), "Unit": "TB" },
  { "Denominator": Math.pow(2, 50), "Unit": "PB" }
];

function FormatFileSize(iSize) {
  if (iSize <= 0)
    return "0 B";

  //can't use Math.log2 beause IE,
  //Math.log2(iSize) / Math.log2(1024) = Math.log(iSize) / Math.log(2) = Math.log(iSize) / 6.931471805599453
  //Note: can't multiply by the inverse due to floating point inprecision
  var iMag = Math.max(Math.min(Math.floor(Math.log(iSize) / 6.931471805599453), g_oCFLib_FileGuide.length - 1), 0);

  return (Math.round(iSize / g_oCFLib_FileGuide[iMag].Denominator * 10) * 0.1) + " " + g_oCFLib_FileGuide[iMag].Unit;

}

function RestoreDateFields(oErrElem) {
  var oForm = oErrElem.form;
  if (!oForm)
    return;
  var iCount = oForm.length;
  var oElem;
  for (var iLup = 0; iLup < iCount; iLup++) {
    oElem = oForm.elements[iLup];
    if (oElem == oErrElem)
      break;

    if (oElem.type != "text")
      continue;
    if (oElem.readOnly || oElem.disabled)
      continue;

    if (oElem.getAttribute("InputType") != null) {
      if (oElem.getAttribute("InputType").indexOf("D") > -1) {
        if (oElem.defaultValue.length > 0)
          oElem.value = oElem.defaultValue;
      }
    }
  }
}

function RestoreAllDateFields(oForm) {
  var iCount = oForm.length;
  var oElem;
  for (var iLup = 0; iLup < iCount; iLup++) {
    oElem = oForm.elements[iLup];

    if (oElem.type != "text")
      continue;
    if (oElem.readOnly || oElem.disabled)
      continue;

    if (oElem.getAttribute("InputType") != null) {
      if (oElem.getAttribute("InputType").indexOf("D") > -1) {
        if (oElem.defaultValue.length > 0)
          oElem.value = oElem.defaultValue;
      }
    }
  }
}

function IsNavKey(iKeyCode) {
  switch (iKeyCode) {
    case 8: // BS
    case 9: // tab
    case 13: // <enter>
      return true;
    default:
      return false;
  }
}

function InputField_OnKeyPressNumbersOnly(aEvent) {
  var oEvent = new EventObj(aEvent);
  if (oEvent.srcElement.tagName == "INPUT") {
    if (oEvent.keyCode < 48 || oEvent.keyCode > 57) {
      if (oEvent.keyCode == 45 &&
        oEvent.srcElement.getAttribute("InputType") != null) {
        // if allows negatives, only one negative sign per value
        if (oEvent.srcElement.getAttribute("InputType").indexOf("+") > -1 ||
          oEvent.srcElement.value.indexOf("-") > -1) {
          oEvent.ReturnValue(false);
          oEvent.CancelBubble(true);
        }
      } else if (oEvent.keyCode == 46 &&
        oEvent.srcElement.getAttribute("InputType") != null &&
        oEvent.srcElement.getAttribute("InputType").indexOf("N") > -1) {
        if (oEvent.srcElement.value.indexOf(g_cDecimalSeparator) > -1) { // only one decimal separator per value!
          oEvent.ReturnValue(false);
          oEvent.CancelBubble(true);
        }
      } else if (!IsNavKey(oEvent.keyCode)) {
        oEvent.ReturnValue(false);
        oEvent.CancelBubble(true);
      }
    }
  }
}

function InputField_OnKeyPressDateValuesOnly(aEvent) {
  var oEvent = new EventObj(aEvent);
  if (oEvent.srcElement.tagName == "INPUT") {
    // filter non-numbers and non-delimiters (.-/) out
    if ((oEvent.keyCode < 45 || oEvent.keyCode > 57) && !IsNavKey(oEvent.keyCode)) {
      oEvent.ReturnValue(false);
      oEvent.CancelBubble(true);
    }
  }
}

function InputField_OnKeyPressIPv4Address(aEvent) {
  var oEvent = new EventObj(aEvent);
  var iDelimeterCount;
  var cSearch;
  if (oEvent.srcElement.tagName == "INPUT") {
    if (oEvent.keyCode < 48 || oEvent.keyCode > 57) {
      if (oEvent.keyCode == 46) {
        iDelimeterCount = 0;
        cSearch = oEvent.srcElement.value;
        for (var iLup = 0; iLup < cSearch.length; iLup++) {
          if (cSearch.substr(iLup, 1) == ".")
            iDelimeterCount++;
        }

        if (iDelimeterCount >= 3) { // only 3 decimals per IP Address!
          oEvent.ReturnValue(false);
          oEvent.CancelBubble(true);
        }
      } else if (!IsNavKey(oEvent.keyCode)) {
        oEvent.ReturnValue(false);
        oEvent.CancelBubble(true);
      }
    }
  }
}

function InputField_OnKeyPressExcludeChars(aEvent) {
  var oEvent = new EventObj(aEvent);
  if (oEvent.srcElement.tagName == "INPUT" || oEvent.srcElement.tagName == "TEXTAREA") {
    // filter out any characters in the "ExcludeChars" attribute
    var cChar = (aEvent == undefined || aEvent.charCode == undefined) ? oEvent.keyCode : aEvent.charCode;
    var cExcludeChars = oEvent.srcElement.getAttribute("ExcludeChars");
    if (cExcludeChars && cExcludeChars != "" && !IsNavKey(cChar)) {
      if (cExcludeChars.indexOf(String.fromCharCode(cChar)) > -1) {
        oEvent.ReturnValue(false);
        oEvent.CancelBubble(true);
      }
    }
  }
}

function InputField_OnKeyDownPassword(aEvent) {
  var oEvent = new EventObj(aEvent);
  var iChar = oEvent.keyCode;

  if (iChar == 8 || iChar == 46) {
    g_oPasswordElemHold = oEvent.srcElement;
    setTimeout("ValidatePassword()");
  }
}

function InputField_OnKeyPressPassword(aEvent) {
  var oEvent = new EventObj(aEvent);
  var iChar = oEvent.keyCode;
  // skip nav chars
  if (iChar >= 35 && iChar <= 46) {
    oEvent.ReturnValue(true);
    return;
  }

  // don't allow specific characters
  if ("#$%^&*()\\/<>,`~=+\"';:[]{}?|".indexOf(String.fromCharCode(iChar)) > -1) {
    alert(g_oStrings.InvalidSymbols + "\n\n# $ % ^ & * ( ) \\ / < > , ` ~ = + \" ' ; : [ ] { } ? |");
    oEvent.ReturnValue(false);
    oEvent.CancelBubble(true);
    return false;
  }

  g_oPasswordElemHold = oEvent.srcElement;
  setTimeout("ValidatePassword()");
  oEvent.ReturnValue(true);
}

function InputField_OnChangeLoginID(aEvent) {
  g_oPasswordElemHold = document.forms[0].elements["Password"];
  if (g_oPasswordElemHold)
    setTimeout("ValidatePassword()");
}

function InputField_OnPastePassword(aEvent) {
  var oEvent = new EventObj(aEvent);
  g_oPasswordElemHold = oEvent.srcElement;
  setTimeout("ValidatePassword()");
}

function ValidatePassword(oPassword) {
  if (!oPassword)
    oPassword = g_oPasswordElemHold;
  if (oPassword) {
    var cPassword = oPassword.value;
    var cInputType = oPassword.getAttribute("InputType");
    if (cInputType == null || cInputType == "")
      return true;

    if (cInputType.indexOf("R") > -1 && cPassword.length == 0) {
      ShowPasswordStatus(oPassword, false, g_oStrings.PasswordRequired);
      return true;
    }

    if (!g_bUsePasswordPolicy) {
      ShowPasswordStatus(oPassword, true, null);
      return;
    }

    // min length
    if (g_aPasswordPolicy[0] && cPassword.length < g_aPasswordPolicy[0]) {
      ShowPasswordStatus(oPassword, false, g_oStrings.PasswordShort);
      return true;
    }

    // max length
    if (g_aPasswordPolicy[1] && cPassword.length > g_aPasswordPolicy[1]) {
      ShowPasswordStatus(oPassword, false, g_oStrings.PasswordLong);
      return true;
    }

    // must be alpha-numeric
    if (g_aPasswordPolicy[2]) {
      var oRegEx = /^[ A-Za-z0-9\!\@\_\-\.]*?([A-Za-z][ A-Za-z0-9\!\@\_\-\.]*?[0-9]|[0-9][ A-Za-z0-9\!\@\_\-\.]*?[A-Za-z])[ A-Za-z0-9\!\@\_\-\.]*$/;
      if (!oRegEx.test(cPassword)) {
        ShowPasswordStatus(oPassword, false, g_oStrings.PasswordAlpha);
        return true;
      }
    }

    // allow all numeric
    if (g_aPasswordPolicy[3]) {
      var oRegEx = /^[ A-Za-z0-9\!\@\_\-\.]*?[ a-zA-Z\!\@\_\-\.]+[ A-Za-z0-9\!\@\_\-\.]*$/;
      if (!oRegEx.test(cPassword)) {
        ShowPasswordStatus(oPassword, false, g_oStrings.PasswordNumeric);
        return true;
      }
    }

    // allow same character string
    if (g_aPasswordPolicy[4]) {
      var iIndex = 0,
        bSame = true;
      var cChar = cPassword.toUpperCase().substr(0, 1);
      do {
        if (cChar != cPassword.toUpperCase().substr(iIndex, 1))
          bSame = false;
        iIndex++;
      } while (bSame && iIndex < cPassword.length);
      if (bSame) {
        ShowPasswordStatus(oPassword, false, g_oStrings.PasswordSameChar);
        return true;
      }
    }

    // check the dictionary of illegal passwords
    if (g_aPasswordPolicy[5] && g_aIllegalPasswords.indexOf(cPassword.toUpperCase()) > -1) {
      ShowPasswordStatus(oPassword, false, g_oStrings.PasswordNotAllowed);
      return true;
    }

    // allow UserID in the password
    if (g_aPasswordPolicy[6]) {
      var cUserID = null;
      if (document.forms[0] && document.forms[0].elements["LoginID"])
        cUserID = document.forms[0].elements["LoginID"].value;
      if (g_aPasswordPolicy[6] && cUserID && cPassword.toUpperCase().indexOf(cUserID.toUpperCase()) > -1) {
        ShowPasswordStatus(oPassword, false, g_oStrings.PasswordContainsLogin);
        return true;
      }
    }
    ShowPasswordStatus(oPassword, true, "");
    g_oPasswordElemHold = null;
  }
  return true;
}

function ShowPasswordStatus(oPasswordElem, bValid, cMsg) {
  var oStatusImg = document.getElementById("PasswordStatusImg");
  var oStatusText = document.getElementById("PasswordStatusText");
  if ((!oStatusImg || !oStatusText) && oPasswordElem.className != "ContentBox") {
    CreatePasswordStatus(oPasswordElem);
    oStatusImg = document.getElementById("PasswordStatusImg");
    oStatusText = document.getElementById("PasswordStatusText");
  }
  if (oStatusImg && oStatusText) {
    oStatusImg.src = (bValid ? "/cfr/Images/VTS/PasswordGood.png" : "/cfr/Images/VTS/PasswordBad.png");
    oStatusImg.title = (bValid ? g_oStrings.PasswordValid : cMsg);
    oStatusText.style.color = (bValid ? "Green" : "Red");
    oStatusText.innerHTML = (bValid ? g_oStrings.PasswordValid : cMsg);
  }
}

function CreatePasswordStatus(oPasswordElem) {
  if (!oPasswordElem)
    return;
  var oParent = oPasswordElem.parentNode;
  var oStatusImg = document.getElementById("PasswordStatusImg");
  if (!oStatusImg) {
    // create the status img
    oStatusImg = document.createElement("IMG");
    oStatusImg.id = "PasswordStatusImg";
    oStatusImg.className = "PasswordStatusImage";
    if (oParent)
      oParent.insertBefore(oStatusImg, oPasswordElem.nextSibling);
  }
  var oStatusText = document.getElementById("PasswordStatusText");
  if (!oStatusText) {
    oStatusText = document.createElement("SPAN");
    oStatusText.id = "PasswordStatusText";
    oStatusText.className = "PasswordStatus";
    if (oParent)
      oParent.insertBefore(oStatusText, oStatusImg.nextSibling);
  }
}

function SetPasswordPolicy(cPolicy) {
  var aPolicy = [0, 0, false, false, false, false, false];
  if (cPolicy && cPolicy != "" && cPolicy != "NULL")
    aPolicy = cPolicy.split(",");
  g_aPasswordPolicy[0] = ((aPolicy[0] * 1) ? aPolicy[0] * 1 : 0);
  g_aPasswordPolicy[1] = ((aPolicy[1] * 1) ? aPolicy[1] * 1 : 0);
  g_aPasswordPolicy[2] = (aPolicy[2] == "1" ? true : false);
  g_aPasswordPolicy[3] = (aPolicy[3] == "1" ? true : false);
  g_aPasswordPolicy[4] = (aPolicy[4] == "1" ? true : false);
  g_aPasswordPolicy[5] = (aPolicy[5] == "1" ? true : false);
  g_aPasswordPolicy[6] = (aPolicy[6] == "1" ? true : false);
  if (g_aPasswordPolicy[0] > 0 || g_aPasswordPolicy[1] > 0 || g_aPasswordPolicy.indexOf(true) > -1)
    g_bUsePasswordPolicy = true;
}

function InitForms(bSetFocusToFirstElement) {
  var oForm;

  var iCount = document.forms.length;
  for (var iLup = 0; iLup < iCount; iLup++) {
    oForm = document.forms[iLup];
    bSetFocusToFirstElement = (!InitSingleForm(oForm, bSetFocusToFirstElement) && bSetFocusToFirstElement);
  }
}

function InitSingleForm(oForm, bSetFocusToFirstElement) {
  var oElem;
  var oFirstElement = null;
  var bFocusSet = false;

  if (oForm.onsubmit == null)
    oForm.onsubmit = InputForm_Submit;

  var iFormCount = oForm.length;
  for (var iIndex = 0; iIndex < iFormCount; iIndex++) {
    oElem = oForm.elements[iIndex];

    if (oFirstElement == null && oElem.type != "hidden" && oElem.disabled === false && oElem.style.display != "none" && oElem.style.display != "hidden")
      oFirstElement = oElem;

    if (oElem.getAttribute("InputType") != null)
      ConfigureInputField(oElem);
  }

  if (bSetFocusToFirstElement && oFirstElement != null) {
    try {
      oFirstElement.focus();
      bFocusSet = true;
    } catch (e) {}
  }
  return bFocusSet;
}

function ConfigureInputField(oElem) {
  if (oElem == null || oElem.getAttribute("InputType") == null)
    return;

  var cInputType = oElem.getAttribute("InputType");

  // setup "required" watermark
  if (cInputType.indexOf("R") > -1 && "checkbox,radio".indexOf(oElem.type) == -1 && oElem.tagName != "SELECT") {
    if (oElem.style.backgroundImage == "" && oElem.value == "") {
      oElem.style.backgroundImage = g_cRequiredImage;
      oElem.style.backgroundRepeat = "no-repeat";
    }
  }

  if (oElem.onfocus == null)
    oElem.onfocus = InputField_OnFocus;
  if (oElem.onblur == null)
    oElem.onblur = InputField_OnBlur;
  if (oElem.onchange == null)
    oElem.onchange = InputField_OnChange;

  // filter out non-numeric keys
  if ((cInputType.indexOf("N") > -1 ||
      cInputType.indexOf("I") > -1) &&
    oElem.onkeypress == null) {
    oElem.onkeypress = InputField_OnKeyPressNumbersOnly;
  }


  // filter out non-date keys
  if (cInputType.indexOf("D") > -1 &&
    oElem.onkeypress == null) {
    oElem.onkeypress = InputField_OnKeyPressDateValuesOnly;
  }


  if (cInputType.indexOf("X") > -1 &&
    oElem.getAttribute("ExcludeChars") != null &&
    oElem.getAttribute("ExcludeChars") != "" &&
    oElem.onkeypress == null) {
    oElem.onkeypress = InputField_OnKeyPressExcludeChars;
  }

  // password policy
  if (cInputType.indexOf("P") > -1 &&
    oElem.onkeypress == null) {
    oElem.onkeypress = InputField_OnKeyPressPassword;
    oElem.onkeydown = InputField_OnKeyDownPassword;
    oElem.onpaste = InputField_OnPastePassword;
    if (cInputType.indexOf("R") > -1) {
      g_oPasswordElemHold = oElem;
      setTimeout("ValidatePassword()");
    }
    var oLoginID = document.forms[0].elements["LoginID"];
    if (oLoginID)
      oLoginID.onchange = InputField_OnChangeLoginID;
  }

  // filter out non IPv4 Keys  
  if (cInputType.indexOf("ipv4") > -1 &&
    oElem.onkeypress == null) {
    oElem.onkeypress = InputField_OnKeyPressIPv4Address;
  }
  //note: handlers for IPv6 and IPvX not yet written. LTAFI 

  // setup inclusion list
  if (oElem.getAttribute("InclusionSet") != null) {
    var cIncSet = oElem.getAttribute("InclusionSet");
    var cItem;

    var aInclusionSet = new Array();
    var iArrElem = 0;
    var iPos = cIncSet.indexOf(";");
    while (iPos > 0) {
      cItem = cIncSet.substr(0, iPos);
      if (cInputType.indexOf("N") > -1 || cInputType.indexOf("I") > -1)
        aInclusionSet[iArrElem++] = (cItem * 1);
      else
        aInclusionSet[iArrElem++] = cItem;

      cIncSet = cIncSet.substr(iPos + 1);
      iPos = cIncSet.indexOf(";");
    }

    if (cIncSet.length > 0) {
      if (cInputType.indexOf("N") > -1 || cInputType.indexOf("I") > -1)
        oInclusionSet[iArrElem++] = (cIncSet * 1);
      else
        oInclusionSet[iArrElem++] = cIncSet;
    }

    oElem.setAttribute("InclusionSet", aInclusionSet);
  }

  // setup exclusion list
  if (oElem.getAttribute("ExclusionSet") != null) {
    var cExSet = oElem.getAttribute("ExclusionSet");
    var cItem;

    var aExclusionSet = new Array();
    var iArrElem = 0;
    var iPos = cExSet.indexOf(";");
    while (iPos > 0) {
      cItem = cExSet.substr(0, iPos);
      if (cInputType.indexOf("N") > -1 || cInputType.indexOf("I") > -1)
        aExclusionSet[iArrElem++] = (cItem * 1);
      else
        aExclusionSet[iArrElem++] = cItem;

      cExSet = cExSet.substr(iPos + 1);
      iPos = cExSet.indexOf(";");
    }

    if (cExSet.length > 0) {
      if (cInputType.indexOf("N") > -1 || cInputType.indexOf("I") > -1)
        aExclusionSet[iArrElem++] = (cExSet * 1);
      else
        aExclusionSet[iArrElem++] = cExSet;
    }

    oElem.setAttribute("ExclusionSet", aExclusionSet);
  }
}

//locking or unlocking elements
function LockForm(oForm) {
  var aElt, iLup;
  var aElt = oForm.elements;
  for (iLup = 0; iLup < aElt.length; iLup++)
    LockSpecificElement(aElt[iLup]);
}

function UnlockForm(oForm) {
  var aElt, iLup;
  var aElt = oForm.elements;
  for (iLup = 0; iLup < aElt.length; iLup++)
    UnlockSpecificElement(aElt[iLup]);
}

function LockTag(cKey) {
  var aElt, iLup;
  var aElt = document.getElementsByTagName(cKey);
  if (aElt != null) {
    for (iLup = 0; iLup < aElt.length; iLup++)
      LockSpecificElement(aElt[iLup]);
  }
}

function UnlockTag(cKey) {
  var aElt, iLup;
  var aElt = document.getElementsByTagName(cKey);
  if (aElt != null) {
    for (iLup = 0; iLup < aElt.length; iLup++)
      UnlockSpecificElement(aElt[iLup]);
  }
}

function LockElement(cKey) {
  var oElt, aElt, iLup;
  oElt = document.getElementById(cKey);
  if (oElt != null)
    LockSpecificElement(oElt);
  var aElt = document.getElementsByName(cKey);
  if (aElt != null) {
    for (iLup = 0; iLup < aElt.length; iLup++)
      LockSpecificElement(aElt[iLup]);
  }
}

function LockSpecificElement(oElt) {
  var readonly = 0;
  if (oElt.style.display != "")
    return;
  if (oElt.tagName.toUpperCase() == "A") {
    oElt.href = "#";
    return;
  }
  if (oElt.tagName.toUpperCase() == "INPUT")
    if (oElt.type.toUpperCase() == "HIDDEN")
      return;
    else if (oElt.type.toUpperCase() == "TEXT")
    readonly = 1;
  if (oElt.tagName == "TEXTAREA")
    readonly = 1;
  if (readonly)
    oElt.readOnly = true;
  else
    oElt.disabled = true;
}

function UnlockElement(cKey) {
  var oElt, aElt, iLup;
  oElt = document.getElementById(cKey);
  if (oElt != null)
    UnlockSpecificElement(oElt);
  var aElt = document.getElementsByName(cKey)
  if (aElt != null) {
    for (iLup = 0; iLup < aElt.length; iLup++)
      UnlockSpecificElement(aElt[iLup]);
  }
}

function UnlockSpecificElement(oElt) {
  var readonly = 0;
  if (oElt.tagName.toUpperCase() == "A")
    return;
  if (oElt.style.display != "")
    return;
  if (oElt.tagName.toUpperCase() == "INPUT")
    if (oElt.type.toUpperCase() == "HIDDEN")
      return;
    else if (oElt.type.toUpperCase() == "TEXT")
    readonly = 1;
  if (oElt.tagName == "TEXTAREA")
    readonly = 1;
  if (readonly)
    oElt.readOnly = false;
  else
    oElt.disabled = false;
}


function ValidateFromTo(cMask, cFromDate, iFromH, iFromM, iFromAMPM, cToDate, iToH, iToM, iToAMPM) {
  if (cFromDate == "" || cToDate == "")
    return true;

  var dFromDate = LocalDateToUTC(cMask, cFromDate, iFromH, iFromM, iFromAMPM);
  var dToDate = LocalDateToUTC(cMask, cToDate, iToH, iToM, iToAMPM);
  if (iFromH == null)
    return (dFromDate <= dToDate); //for dates only from can be equal to
  else
    return (dFromDate < dToDate);
}


function LocalDateToUTC(cMask, cDate, iH, iM, iAMPM) {
  var iYear = null;
  var iMonth = null;
  var iDay = null;

  if (!cMask)
    cMask = "M\D\Y";
  else
    cMask = cMask.toUpperCase();

  var aMask = cMask.split(/[\/\.\-]/);
  var aDate = cDate.split(/[\/\.\-]/);
  if (aMask.length != aDate.length || aMask.length < 2)
    return null;

  for (var iLup = 0; iLup < aMask.length; iLup++) {
    if (aMask[iLup] == "Y" && !isNaN(aDate[iLup]))
      iYear = aDate[iLup] * 1;
    if (aMask[iLup] == "M" && !isNaN(aDate[iLup]))
      iMonth = aDate[iLup] * 1 - 1;
    if (aMask[iLup] == "D" && !isNaN(aDate[iLup]))
      iDay = aDate[iLup] * 1;
  }

  if (!(iYear && iMonth != null && iDay))
    return null;

  iH = (isNaN(iH) ? 0 : iH * 1);
  iM = (isNaN(iM) ? 0 : iM * 1);

  if (iAMPM != null) {
    iAMPM = (isNaN(iAMPM) ? 0 : iAMPM * 1);
    iH = HourAMPMTo24(iH, iAMPM);
  }

  try {
    var dDate = new Date(iYear, iMonth, iDay, iH, iM, 0, 0);
    return dDate;
  } catch (e) {
    return null;
  }

}


function HourAMPMTo24(iH, iAMPM) {
  if (iH == 12 && iAMPM == 0)
    return 0;
  if (iH == 12 && iAMPM == 1)
    return 12;
  else
    return iH + iAMPM * 12;
}

function ValidateFileObjectSize(oEvent, oFile, iMinBytes, iMaxBytes) {
  var oLimits = GetFileSizeLimits(iMaxBytes, iMinBytes);
  var bValid = (oFile.size >= oLimits.MinBytes && oFile.size <= oLimits.MaxBytes);

  if (!bValid) {
    var cErrorMessage = g_oStrings.FileExceedsBounds.replace("{FileSize}", oFile.size)
      .replace("{MaxSize}", FormatFileSize(oLimits.MaxBytes))
      .replace("{MinSize}", FormatFileSize(oLimits.MinBytes))
      .replace("{FileName}", File.name);

    DoValidationError(oEvent, undefined, cErrorMessage);
  }

  return bValid;
}