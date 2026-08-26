using VetClinicService as service from '../routes/main';

annotate service.Appointments with @(
    UI.FilterRestrictions: {
            FilterExpressionRestrictions: [
                {
                    Property: date,
                    AllowedExpressions: 'SearchExpression'
                },
                {
                    Property: status,
                    AllowedExpressions: 'SearchExpression'
                },
                {
                    Property: isEmergency,
                    AllowedExpressions: 'SearchExpression'
                },
                {
                    Property: totalCost,
                    AllowedExpressions: 'SearchExpression'
                },
                {
                    Property: petName,
                    AllowedExpressions: 'SearchExpression'
                },
                {
                    Property: veterinarianName,
                    AllowedExpressions: 'SearchExpression'
                },
            ]
        },
    UI.SelectionFields: [
        date,
        status,
        isEmergency,
        petName,
        veterinarianName
    ],
    UI.LineItem: [
        {$Type: 'UI.DataField', Value: petName},
        {$Type: 'UI.DataField', Value: veterinarianName},
        {$Type: 'UI.DataField', Value: notes},
        {$Type: 'UI.DataField', Value: date},
        {$Type: 'UI.DataField', Value: status},
        {$Type: 'UI.DataField', Value: totalCost}
    ],
    UI.HeaderInfo: [
        {
            $Type: 'UI.HeaderInfoType',
            TypeName: 'Consulta',
            TypeNamePlural: 'Consultas',
            Title: {
                $Type: 'UI.DataField',
                Value: notes
            },
        }
    ],
    UI.Identification: [
        { $Type: 'UI.DataField', Value: petName},
        { $Type: 'UI.DataField', Value: veterinarianName},
        { $Type: 'UI.DataField', Value: notes     },
        { $Type: 'UI.DataField', Value: status    },
        { $Type: 'UI.DataField', Value: isEmergency    },
        { $Type: 'UI.DataField', Value: date  },
        { $Type: 'UI.DataField', Value: totalCost  }
    ],

    UI.Facets:[
        {
           $Type : 'UI.ReferenceFacet',
            Label : 'Informação da consulta',
            Target: '@UI.Identification' 
        },
        {
           $Type : 'UI.ReferenceFacet',
            Label : 'Procedimentos',
            Target: 'procedures/@UI.LineItem' 
        },
    ]
){
    date @Common.Label: 'Data';
    status @Common.Label: 'Status';
    isEmergency @Common.Label: 'Emergencia';
    totalCost @Common.Label: 'Custo Total';
    notes @Common.Label: 'Notas';
    petName @Common.Label: 'Pet';
    veterinarianName @Common.Label: 'Veterinário';
};