using VetClinicService as service from '../routes/main';

annotate service.Owners with @(
    UI.FilterRestrictions: {
            FilterExpressionRestrictions: [
                {
                    Property: firstName,
                    AllowedExpressions: 'SearchExpression'
                },
                {
                    Property: email,
                    AllowedExpressions: 'SearchExpression'
                },
                {
                    Property: phone,
                    AllowedExpressions: 'SearchExpression'
                },
            ]
        },
    UI.HeaderInfo: {
        $Type: 'UI.HeaderInfoType',
        TypeName: 'Tutor',
        TypeNamePlural: 'Tutores',
        Title: {
            $Type: 'UI.DataField',
            Value: firstName
        },
    },
    UI.Identification: [
        { $Type: 'UI.DataField', Value: firstName},
        { $Type: 'UI.DataField', Value: lastName},
        { $Type: 'UI.DataField', Value: email     },
        { $Type: 'UI.DataField', Value: phone    }
    ],

    UI.SelectionFields: [
        firstName,
        email,
        phone,           
    ],

    UI.LineItem : [
        {
            $Type: 'UI.DataField',
            Label: 'name',
            Value: firstName,
        },
        {
            $Type: 'UI.DataField',
            Label: 'email',
            Value: email,
        },
        {
            $Type: 'UI.DataField',
            Label: 'phone',
            Value: phone,
        }
    ],
    UI.Facets: [
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Dados do Tutor',
            Target: '@UI.Identification'
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Pets',
            Target: 'pets/@UI.LineItem'
        }
    ],
){
    firstName @Common.Label: 'Nome';
    lastName @Common.Label: 'Sobrenome';
    email @Common.Label: 'Email';
    phone @Common.Label: 'Número de telefone';
}
