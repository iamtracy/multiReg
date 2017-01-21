(function(formSettings, searchSettings) {
  const companyKey = searchSettings.CompanyKey;
  const showDesc = searchSettings.ShowTypeDesc;
  const formFields = formSettings.formFields.concat(formSettings.udfFields).concat(formSettings.submit);
  const results = fakeAjax();
  const cardContainer = $('#cards')[0];
  const showArray = [];

  let cardCheckBoxes;
  let checkAllCheckbox;
  let submit;

  const initData = (data, array) => {
    data.filter(item => item.ShowTypeDesc === showDesc).map((item, index) => {
      let date = formatDate(item.FromDateTime);
      let speakerDisplay = speakerPresent(item.WCSpeakerList);
      console.log('speakerDisplay', speakerDisplay);
      var ayo = speakerDisplay.map(item => {
        let foo = ` <div class="media-object">
                      <div class="media-object-section">
                        <img src="${item.img}">
                      </div>
                      <div class="media-object-section">
                        <h4>${item.name}</h4>
                        <p>${item.bio}</p>
                      </div>
                    </div>
                 `
        return foo;
      });
      console.log('yo', ayo.join(' '));
      var speakerHTML = ayo.join(' ');
      array.push(
        `
          <div class="column cards" data-live=${item.OpenNow} data-ondemand=${item.IsOnDemand}>
            <div class="card">
              <div class="ShowCheckbox">
                <label class="customCheckboxControl customCheckboxTick">
                  <input type="checkbox" name="ShowKey" data-showkey="${item.ShowKey}" data-packagekey="${item.ShowPackageKey}">
                  <div class="customCheckbox"></div>
                  <span class="select-event">Select this event</span>
                </label>
              </div>
              <img src="${item.ShowImage}" alt="">
              <div class="card-section">
                <h4>${item.ShowTitle}</h4>
                <h6><b>Date</b>: ${date}</h6>
                <p>${item.Comments}</p>
                <button class="hollow button ${(speakerDisplay.length === 0 ? 'hide' : '')}" type="button" data-toggle="speaker${index}">View Speakers</button>
                <section>
                  <div class="dropdown-pane top hide" id="speaker${index}" data-toggler=".hide">
                    ${speakerHTML}
                  </div>
                </section>
              </div>
            </div>
          </div>
        `
      );
    });
    return array;
  }

  var data = initData(results, showArray);

  //console.log('initial data:', data);

  function init(items) {
    items.forEach(item => {
      cardContainer.innerHTML += item;
    });
  }

  let udfFielfd = [];

  formFields.forEach(item => buildForm(item));

  function buildForm(item) {
    let form = $('#formFields');
    if (item.id.toLowerCase() === 'registerbtn') {
      form.append(
        `<div class="small-12">
        <fieldset>
          <div class="input-group">
          <${item.fieldType.inputElem} 
            id="${item.id}"
            class="button primary small-4" 
            name="${item.id}"
            type="${item.fieldType.type}"
            required=${item.required}  
            fieldname="${item.labelText}"
          >
          ${item.labelText}
          </${item.fieldType.inputElem}>
          </div>
        </fieldset>
      </div>`);
    } else if (item.fieldType.inputElem.toLowerCase() === 'select' && item.name.toLowerCase().startsWith('udf')) {
      form.append(
        `<div class="small-12">
        <fieldset>
        <div class="input-group">
          <label for="right-label" class="small-4">${item.labelText}</label>
          <${item.fieldType.inputElem}
            class="small-7" 
            name="${item.name}"
            type="${item.type}"
            required=${item.required}  
            fieldname="${item.labelText}"
          >
          </${item.fieldType.inputElem}>
          </div>
        </fieldset>
      </div>`);
      (function() {
        let optionsBuilder = $(`[fieldname="${item.labelText}"]`);
        item.list.forEach(item => {
          optionsBuilder.append(
            `<option value="${item.value}">${item.value}</option>`
          )
        });
      }())
    } else {
      form.append(
        `<div class="small-12">
      <fieldset>
        <div class="input-group">
          <label for="right-label" class="small-4">${item.labelText}</label>
          <${item.fieldType.inputElem} 
            id="${item.id}"
            class="small-7" 
            name="${item.id}"
            type="${item.fieldType.type}"
            required=${item.required}  
            fieldname="${item.labelText}">
        </div>  
      </fieldset>
    </div>`);
    }
  }

  $(document).ready(function() {
    appendStates();
    appendCountry();
    init(data);
    listeners();
    $(document).foundation();
  });

  function appendStates() {
    $('#StateProv').html(
      `<option value="" selected="selected">(select)</option> <option value="AL">Alabama</option> <option value="AK">Alaska</option> <option value="AZ">Arizona</option> <option value="AR">Arkansas</option> <option value="CA">California</option> <option value="CO">Colorado</option> <option value="CT">Connecticut</option> <option value="DE">Delaware</option> <option value="DC">District of Columbia</option> <option value="FL">Florida</option> <option value="GA">Georgia</option> <option value="HI">Hawaii</option> <option value="ID">Idaho</option> <option value="IL">Illinois</option> <option value="IN">Indiana</option> <option value="IA">Iowa</option> <option value="KS">Kansas</option> <option value="KY">Kentucky</option> <option value="LA">Louisiana</option> <option value="ME">Maine</option> <option value="MD">Maryland</option> <option value="MA">Massachusetts</option> <option value="MI">Michigan</option> <option value="MN">Minnesota</option> <option value="MS">Mississippi</option> <option value="MO">Missouri</option> <option value="MT">Montana</option> <option value="NE">Nebraska</option> <option value="NV">Nevada</option> <option value="NH">New Hampshire</option> <option value="NJ">New Jersey</option> <option value="NM">New Mexico</option> <option value="NY">New York</option> <option value="NC">North Carolina</option> <option value="ND">North Dakota</option> <option value="OH">Ohio</option> <option value="OK">Oklahoma</option> <option value="OR">Oregon</option> <option value="PA">Pennsylvania</option> <option value="RI">Rhode Island</option> <option value="SC">South Carolina</option> <option value="SD">South Dakota</option> <option value="TN">Tennessee</option> <option value="TX">Texas</option> <option value="UT">Utah</option> <option value="VT">Vermont</option> <option value="VA">Virginia</option> <option value="WA">Washington</option> <option value="WV">West Virginia</option> <option value="WI">Wisconsin</option> <option value="WY">Wyoming</option> <option value="">------</option> <option value="AB">Alberta</option> <option value="BC">British Columbia</option> <option value="MB">Manitoba</option> <option value="NB">New Brunswick</option> <option value="NF">Newfoundland</option> <option value="NT">Northwest Territories and Nanavut</option> <option value="NS">Nova Scotia</option> <option value="NU">Nunavut Territories </option> <option value="ON">Ontario</option> <option value="PE">Prince Edward Island</option> <option value="QC">Quebec</option> <option value="SK">Saskatchewan</option> <option value="YT">Yukon</option> <option value="">------</option> <option value="Outside of USA/Canada">Outside of USA/Canada</option>`
    );
  }

  function appendCountry() {
    $('#Country').html(`<option value="">(select)</option> <option value="">------</option> <option value="AL">Albania</option> <option value="DZ">Algeria </option> <option value="AS">American Samoa </option> <option value="AD">Andorra </option> <option value="AO">Angola</option> <option value="AI">Anguilla</option> <option value="AQ">Antarctica</option> <option value="AG">Antigua And Barbuda </option> <option value="AR">Argentina</option> <option value="AM">Armenia </option> <option value="AW">Aruba</option> <option value="AU">Australia</option> <option value="AT">Austria</option> <option value="AF">Avfbnjdtan</option> <option value="AZ">Azerbaijan</option> <option value="BS">Bahamas</option> <option value="BH">Bahrain</option> <option value="BD">Bangladesh</option> <option value="BB">Barbados</option> <option value="BY">Belarus</option> <option value="BE">Belgium</option> <option value="BZ">Belize</option> <option value="BJ">Benin</option> <option value="BM">Bermuda</option> <option value="BT">Bhutan</option> <option value="BO">Bolivia</option> <option value="BA">Bosnia Hercegovina</option> <option value="BW">Botswana</option> <option value="BV">Bouvet Island</option> <option value="BR">Brazil</option> <option value="IO">British Indian Ocean Territory</option> <option value="BN">Brunei Darussalam</option> <option value="BG">Bulgaria</option> <option value="BF">Burkina Faso</option> <option value="BI">Burundi</option> <option value="KH">Cambodia</option> <option value="CM">Cameroon</option> <option value="CA">Canada</option> <option value="CV">Cape Verde</option> <option value="KY">Cayman Islands</option> <option value="CF">Central African Republic</option> <option value="TD">Chad</option> <option value="CL">Chile</option> <option value="CN">China</option> <option value="CX">Christmas Island</option> <option value="CC">Cocos (Keeling) Islands</option> <option value="CO">Colombia</option> <option value="KM">Comoros</option> <option value="CG">Congo</option> <option value="CK">Cook Islands</option> <option value="CR">Costa Rica</option> <option value="CI">Cote D'Ivoire</option> <option value="HR">Croatia</option> <option value="CU">Cuba</option> <option value="CY">Cyprus</option> <option value="CZ">Czech Republic</option> <option value="CS">Czechoslovakia</option> <option value="DK">Denmark</option> <option value="DJ">Djibouti</option> <option value="DM">Dominica</option> <option value="DO">Dominican Republic</option> <option value="TP">East Timor</option> <option value="EC">Ecuador</option> <option value="EG">Egypt</option> <option value="SV">El Salvador</option> <option value="GQ">Equatorial Guinea</option> <option value="ER">Eritrea</option> <option value="EE">Estonia</option> <option value="ET">Ethiopia</option> <option value="FK">Falkland Islands</option> <option value="FO">Faroe Islands</option> <option value="FJ">Fiji</option> <option value="FI">Finland</option> <option value="FR">France</option> <option value="GF">French Guiana</option> <option value="PF">French Polynesia</option> <option value="TF">French Southern Territories</option> <option value="GA">Gabon</option> <option value="GM">Gambia</option> <option value="GE">Georgia</option> <option value="DE">Germany</option> <option value="GH">Ghana</option> <option value="GI">Gibraltar</option> <option value="GB">Great Britain</option> <option value="GR">Greece</option> <option value="GL">Greenland</option> <option value="GD">Grenada</option> <option value="GP">Guadeloupe</option> <option value="GU">Guam</option> <option value="GT">Guatemala</option> <option value="GG">Guernsey</option> <option value="GN">Guinea</option> <option value="GW">Guinea-Bissau</option> <option value="GY">Guyana</option> <option value="HT">Haiti</option> <option value="HM">Heard And Mc Donald Islands</option> <option value="HN">Honduras</option> <option value="HK">Hong Kong</option> <option value="HU">Hungary</option> <option value="IS">Iceland</option> <option value="IN">India</option> <option value="ID">Indonesia</option> <option value="IR">Iran (Islamic Republic Of)</option> <option value="IQ">Iraq</option> <option value="IE">Ireland</option> <option value="IM">Isle Of Man</option> <option value="IL">Israel</option> <option value="IT">Italy</option> <option value="JM">Jamaica</option> <option value="JP">Japan</option> <option value="JN">Jean-Noel</option> <option value="JE">Jersey</option> <option value="JO">Jordan</option> <option value="KZ">Kazakhstan</option> <option value="KE">Kenya</option> <option value="KI">Kiribati</option> <option value="KR">Korea</option> <option value="KP">Korea, Democratic People's Republic Of</option> <option value="KW">Kuwait</option> <option value="KG">Kyrgyzstan</option> <option value="LA">Lao People'S Democratic Republic</option> <option value="LV">Latvia</option> <option value="LB">Lebanon</option> <option value="LS">Lesotho</option> <option value="LR">Liberia</option> <option value="LY">Libyan Arab Jamahiriya</option> <option value="LI">Liechtenstein</option> <option value="LT">Lithuania</option> <option value="LU">Luxembourg</option> <option value="MO">Macau</option> <option value="MK">Macedonia</option> <option value="MG">Madagascar</option> <option value="MW">Malawi</option> <option value="MY">Malaysia</option> <option value="MV">Maldives</option> <option value="ML">Mali</option> <option value="MT">Malta</option> <option value="MH">Marshall Islands</option> <option value="MQ">Martinique</option> <option value="MR">Mauritania</option> <option value="MU">Mauritius</option> <option value="YT">Mayotte</option> <option value="MX">Mexico</option> <option value="FM">Micronesia</option> <option value="MD">Moldova, Republic Of</option> <option value="MC">Monaco</option> <option value="MN">Mongolia</option> <option value="MS">Montserrat</option> <option value="MA">Morocco</option> <option value="MZ">Mozambique</option> <option value="MM">Myanmar</option> <option value="NA">Namibia</option> <option value="NR">Nauru</option> <option value="NP">Nepal</option> <option value="AN">Netherlands Antilles</option> <option value="NT">Neutral Zone</option> <option value="NC">New Caledonia</option> <option value="NZ">New Zealand</option> <option value="NI">Nicaragua</option> <option value="NE">Niger</option> <option value="NG">Nigeria</option> <option value="NU">Niue</option> <option value="NF">Norfolk Island</option> <option value="MP">Northern Mariana Islands</option> <option value="NO">Norway</option> <option value="OM">Oman</option> <option value="OO">Other</option> <option value="PK">Pakistan</option> <option value="PW">Palau</option> <option value="PA">Panama</option> <option value="PG">Papua New Guinea</option> <option value="PY">Paraguay</option> <option value="PE">Peru</option> <option value="PH">Philippines</option> <option value="PN">Pitcairn</option> <option value="PL">Poland</option> <option value="PT">Portugal</option> <option value="PR">Puerto Rico</option> <option value="QA">Qatar</option> <option value="RE">Reunion</option> <option value="RO">Romania</option> <option value="RU">Russian Federation</option> <option value="RW">Rwanda</option> <option value="KN">Saint Kitts And Nevis</option> <option value="LC">Saint Lucia</option> <option value="VC">Saint Vincent And The Grenadines</option> <option value="WS">Samoa</option> <option value="SM">San Marino</option> <option value="ST">Sao Tome And Principe</option> <option value="SA">Saudi Arabia</option> <option value="SN">Senegal</option> <option value="SC">Seychelles</option> <option value="SL">Sierra Leone</option> <option value="SG">Singapore</option> <option value="SK">Slovakia</option> <option value="SI">Slovenia</option> <option value="SB">Solomon Islands</option> <option value="SO">Somalia</option> <option value="ZA">South Africa</option> <option value="GS">South Georgia And The South Sandwich Islands</option> <option value="ES">Spain</option> <option value="LK">Sri Lanka</option> <option value="SH">St. Helena</option> <option value="PM">St. Pierre And Miquelon</option> <option value="SD">Sudan</option> <option value="SR">Suriname</option> <option value="SJ">Svalbard And Jan Mayen Islands</option> <option value="SZ">Swaziland</option> <option value="SE">Sweden</option> <option value="CH">Switzerland</option> <option value="SY">Syrian Arab Republic</option> <option value="TW">Taiwan</option> <option value="TJ">Tajikista</option> <option value="TZ">Tanzania, United Republic Of</option> <option value="TH">Thailand</option> <option value="CD">The Democratic Republic Of The Congo</option> <option value="NL">The Netherlands</option> <option value="TG">Togo</option> <option value="TK">Tokelau</option> <option value="TO">Tonga</option> <option value="TT">Trinidad And Tobago</option> <option value="TN">Tunisia</option> <option value="TR">Turkey</option> <option value="TM">Turkmenistan</option> <option value="TC">Turks And Caicos Islands</option> <option value="TV">Tuvalu</option> <option value="UG">Uganda</option> <option value="UA">Ukraine</option> <option value="AE">United Arab Emirates</option> <option value="UK">United Kingdom</option> <option value="US" selected="selected">United States</option> <option value="UM">United States Minor Outlying Islands</option> <option value="UY">Uruguay</option> <option value="UZ">Uzbekistan</option> <option value="VU">Vanuatu</option> <option value="VA">Vatican City State</option> <option value="VE">Venezuela</option> <option value="VN">Vietnam</option> <option value="VG">Virgin Islands (British)</option> <option value="VI">Virgin Islands (U.S.)</option> <option value="WF">Wallis And Futuna Islands</option> <option value="EH">Western Sahara</option> <option value="YE">Yemen, Republic Of</option> <option value="YU">Yugoslavia</option> <option value="ZR">Zaire</option> <option value="ZM">Zambia</option> <option value="ZW">Zimbabwe</option>`);
  }

  function listeners() {
    cardCheckBoxes = $('input[name="ShowKey"]');
    checkAllCheckbox = $('input[name="selectAll"]');
    submit = $('#RegisterBTN');
    cardCheckBoxes.change(selectionState);
    checkAllCheckbox.change(checkAll);
    submit.click(onSubmit);
  }

  function checkAll() {
    console.log('check all');
    let selectedListArray = selectedElemList.toArray();
    if (this.checked) {
      selectedListArray.forEach(item => item.checked = true)
    } else {
      selectedListArray.forEach(item => item.checked = false)
    }
    selectionState();
  }

  function selectionState() {
    console.log('selectState')
      //   let selectedListArray = selectedElemList.toArray();
      //   selected = [];
      //   selectedListArray.
      //   filter(item => item.checked === true).
      //   forEach(item => {
      //     selected.push({
      //       showKey: item.dataset.showkey,
      //       showPackageKey: item.dataset.packagekey
      //     });
      //   });
      //   console.log(selected);
      //   return selected;
  }

  function onSubmit() {
    console.log('dat boi')
      //let selected = selectionState();
    let formData = $('#MainForm').serialize();
    let cUrl = `Server.nxp?LASCmd=AI:4;F:LBSEXPORT!JSON&SQLID=1550&CompanyKey=${companyKey}&${formData}`;
    console.log(cUrl); //, selected
    //selected.forEach(item => item);
  }
})(formSettings(), searchSettings());