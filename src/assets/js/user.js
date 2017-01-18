function searchSettings() {
  return {
    CompanyKey: 882,
    ShowTypeDesc: 'NutraIngredients'
  }
}

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
      { labelText: 'StateProv', fieldType: { inputElem: 'select', type: '' }, id: 'StateProv', required: 'XR' },
      { labelText: 'Postal Code', fieldType: { inputElem: 'input', type: 'text' }, id: 'PostalCode', required: 'XR' },
      { labelText: 'Country', fieldType: { inputElem: 'select', type: '' }, id: 'Country', required: 'XR' },
      { labelText: 'Email Address', fieldType: { inputElem: 'input', type: 'text' }, id: 'EMailAddress', required: 'XR' },
      { labelText: 'Password', fieldType: { inputElem: 'input', type: 'text' }, id: 'Password', required: 'XR' }
    ],
    udfFields: [{
      labelText: 'Employees',
      fieldType: { inputElem: 'select', type: 'udf' },
      name: 'UDF1024',
      required: '1',
      id: '',
      list: [
        { value: '(select)' },
        { value: '1-50' },
        { value: '51-100' },
        { value: '101-200' },
      ]
    }, {
      labelText: 'Job Role',
      fieldType: { inputElem: 'select', type: 'udf' },
      name: 'UDF1025',
      id: '',
      required: '1',
      list: [
        { value: '(select)' },
        { value: 'Project Manager' },
        { value: 'Event Producer' },
        { value: 'Creative Developer' },
        { value: 'Webcast Engineer' },
      ]
    }, {
      labelText: 'UDF Three',
      fieldType: { inputElem: 'input', type: 'udf' },
      name: 'UDF1026',
      id: '',
      required: '1'
    }, ],
    submit: [
      { labelText: 'REGISTER', fieldType: { inputElem: 'a', type: 'button' }, id: 'RegisterBTN', required: 'XR' }
    ]
  }
}