using VetClinicService as service from '../routes/main';

annotate service.Procedures with @(
    UI.FilterRestrictions: {
            FilterExpressionRestrictions: [
                {
                    Property: description,
                    AllowedExpressions: 'SearchExpression'
                },
                {
                    Property: cost,
                    AllowedExpressions: 'SearchExpression'
                }
            ]
        },
    
    UI.SelectionFields: [
        description,
        cost      
    ],

    UI.LineItem: [
        { $Type: 'UI.DataField', Value: description    },
        { $Type: 'UI.DataField', Value: cost }
    ],
){
    description @Common.Label: 'Descrição';
    cost @Common.Label: 'Custo';
}