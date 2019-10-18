const form = {
  title: '',
  subTitle: '',
  destinationUrl: '',
  fields: [
    {
      name: 'title',
      label: 'Title',
      placeholder: '',
      fieldType: 'TextField',
      contentType: 'text',
      isRequired: true,
      defaultValue: '',
      dbName: '',
      readOnly: false
    },
    {
      name: '',
      label: '',
      placeholder: '',
      fieldType: 'TextField',
      contentType: 'text',
      isRequired: false,
      defaultValue: '',
      dbName: '',
      readOnly: false
    },
    {
      name: '',
      label: '',
      placeholder: '',
      fieldType: 'HTMLField',
      contentType: 'text',
      isRequired: false,
      defaultValue: '',
      dbName: '',
      readOnly: false
    },
    {
      name: '',
      placeholder: '',
      fieldType: 'Radio',
      contentType: 'number',
      readOnly: false,
      data: [],
      child: {
        valueToCheck: '',
        fields: [
          {
            name: 'title',
            label: 'Title',
            placeholder: '',
            fieldType: 'TextField',
            contentType: 'text',
            isRequired: true,
            defaultValue: '',
            dbName: '',
            readOnly: false
          },
          {
            name: '',
            label: '',
            placeholder: '',
            fieldType: 'TextField',
            contentType: 'text',
            isRequired: false,
            defaultValue: '',
            dbName: '',
            readOnly: false
          },
        ]
      }
    },
    {
      name: '',
      placeholder: '',
      fieldType: 'Dropdown',
      contentType: 'number',
      readOnly: false,
      data: []
    },
    {
      name: '',
      placeholder: '',
      fieldType: 'Checkbox',
      selectMany: true,
      contentType: 'number',
      readOnly: false,
      dbName: '',
      data: []
    },
    {
      name: '',
      placeholder: '',
      fieldType: 'Checkbox',
      selectMany: true,
      contentType: 'number',
      readOnly: false,
      dbName: '',
      data: []
    },
    {
      name: '',
      placeholder: '',
      fieldType: 'Checkbox',
      selectMany: false,
      contentType: 'number',
      readOnly: false,
      dbName: '',
      data: [{ }]
    },
    {
      name: 'files',
      label: 'Upload Files',
      placeholder: '',
      fieldType: 'File',
      selectMany: true,
      contentType: 'text',
      isRequired: true,
      defaultValue: '',
      dbName: 'files',
      readOnly: false,
      filesLimit: 1
    },
  ]

};

console.log(form);
