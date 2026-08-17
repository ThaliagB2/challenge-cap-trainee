using VetClinicService as service from '../routes/main';

annotate service.Veterinarians with @(
    UI.FilterRestrictions: {
            FilterExpressionRestrictions: [
                {
                    Property: firstName,
                    AllowedExpressions: 'SearchExpression'
                },
                {
                    Property: specialty,
                    AllowedExpressions: 'SearchExpression'
                },
                {
                    Property: crmv,
                    AllowedExpressions: 'SearchExpression'
                }
            ]
        },
    UI.SelectionFields: [
        firstName,
        specialty,
        crmv,
    ],
    UI.LineItem: [
        { $Type: 'UI.DataField', Value: firstName    },
        { $Type: 'UI.DataField', Value: specialty },
        { $Type: 'UI.DataField', Value: crmv   }
    ],
    UI.HeaderInfo: [
        {
            $Type: 'UI.HeaderInfoType',
            TypeName: 'Veterinário',
            TypeNamePlural: 'Veterinários',
            Title: {
                $Type: 'UI.DataField',
                Value: 'Dr.(a) {firstName}'
            },
        }
    ],
    UI.Identification: [
        { $Type: 'UI.DataField', Value: firstName},
        { $Type: 'UI.DataField', Value: specialty},
        { $Type: 'UI.DataField', Value: crmv     }
    ],
    UI.Facets: [
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Informações do Veterinário',
            Target: '@UI.Identification'
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Consultas',
            Target: 'appointments/@UI.LineItem'
        }
    ]
){
    firstName @Common.Label: 'Nome';
    specialty @Common.Label: 'Especialidade';
    crmv @Common.Label: 'CRMV';
}