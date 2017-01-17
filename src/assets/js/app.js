data.filter(item => item.ShowTypeDesc === 'NutraIngredients').map((item, index) => buildCard(item, index));

function buildCard(item, index) {
  $('#cards').append(
    `
    <div class="column">
      <div class="card">
        <div class="ShowCheckbox">
          <label class="customCheckboxControl customCheckboxTick">
            <input type="checkbox" name="ShowKey" value="${item.ShowKey}" spk="${item.ShowPackageKey}">
            <div class="customCheckbox"></div>Select this event
          </label>
        </div>
        <img src="${item.ShowImage}" alt="">
        <div class="card-section">
          <h4>${item.ShowTypeDesc}</h4>
          <p>${item.Comments}</p>
        </div>
      </div>
    </div>
    `
  );
}

let formFields = [
  { labelText: 'FirstName', fieldType: { inputElem: 'input', type: 'text' }, id: 'FirstName' },
];

formFields.map(item => buildForm(item));

function buildForm(item) {
  $('#formFields').append(
    `
    <div class="medium-6 columns">
      <fieldset><label>First Name</label> 
      <input id="FirstName" maxlength="80" name="FirstName" size="30" type="text" value="" inputtype="XR" fieldname="First Name" style="background-repeat: no-repeat; background-image: url(&quot;/cfr/images/EntryRequired.gif&quot;);">
      </fieldset>
    </div>
    `
  )
}

$(document).foundation();