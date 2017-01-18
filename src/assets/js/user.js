function formSettings() {
  return {
    formFields: [
      { labelText: 'First Name', fieldType: { inputElem: 'input', type: 'text' }, id: 'FirstName', required: 'XR' },
      { labelText: 'Last Name', fieldType: { inputElem: 'input', type: 'text' }, id: 'LastName', required: 'XR' },
      { labelText: 'Title', fieldType: { inputElem: 'input', type: 'text' }, id: 'JobTitle', required: 'XR' },
      { labelText: 'Phone', fieldType: { inputElem: 'input', type: 'text' }, id: 'FirstName', required: 'XR' },
      { labelText: 'Company Name', fieldType: { inputElem: 'input', type: 'text' }, id: 'CompanyName', required: 'XR' },
      { labelText: 'Address', fieldType: { inputElem: 'input', type: 'text' }, id: 'Address1', required: 'XR' },
      { labelText: 'Unit / Apt. / Suite', fieldType: { inputElem: 'input', type: 'text' }, id: 'Address2', required: 'XR' },
      { labelText: 'City', fieldType: { inputElem: 'input', type: 'text' }, id: 'City', required: 'XR' },
      { labelText: 'StateProv', fieldType: { inputElem: 'select', type: null }, id: 'StateProv', required: 'XR' },
      { labelText: 'Postal Code', fieldType: { inputElem: 'input', type: 'text' }, id: 'PostalCode', required: 'XR' },
      { labelText: 'Country', fieldType: { inputElem: 'select', type: null }, id: 'Country', required: 'XR' },
      { labelText: 'Email Address', fieldType: { inputElem: 'input', type: 'text' }, id: 'EMailAddress', required: 'XR' },
      { labelText: 'Password', fieldType: { inputElem: 'input', type: 'text' }, id: 'Password', required: 'XR' }
    ],
    udfFields: [
      { labelText: 'UDF One', fieldType: { inputElem: 'input', type: 'text' }, id: 'EMailAddress', required: 'XR' },
      { labelText: 'UDF Two', fieldType: { inputElem: 'input', type: 'text' }, id: 'EMailAddress', required: 'XR' },
      { labelText: 'UDF Three', fieldType: { inputElem: 'input', type: 'text' }, id: 'EMailAddress', required: 'XR' },
    ],
    submit: [
      { labelText: 'REGISTER', fieldType: { inputElem: 'a', type: 'button' }, id: 'RegisterBTN', required: 'XR' }
    ]
  }
}

function searchSettings() {
  return {
    CompanyKey: 882,
    ShowTypeDesc: 'NutraIngredients'
  }
}