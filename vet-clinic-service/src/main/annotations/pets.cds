using VetClinicService as service from '../routes/main';

annotate service.Pets with @(
    UI.FilterRestrictions: {
            FilterExpressionRestrictions: [
                {
                    Property: name,
                    AllowedExpressions: 'SearchExpression'
                },
                {
                    Property: species,
                    AllowedExpressions: 'SearchExpression'
                },
                {
                    Property: breed,
                    AllowedExpressions: 'SearchExpression'
                },
                {
                    Property: ownerName,
                    AllowedExpressions: 'SearchExpression'
                }
            ]
        },
    
    UI.SelectionFields: [
        name,
        species,
        breed, 
        ownerName          
    ],

    UI.LineItem: [
        { $Type: 'UI.DataField', Value: name    },
        { $Type: 'UI.DataField', Value: species },
        { $Type: 'UI.DataField', Value: breed   },
        { $Type: 'UI.DataField', Value: weight  },
        { $Type: 'UI.DataField', Value: birthDate  },
        { $Type: 'UI.DataField', Value: ownerName  }
    ],

    UI.HeaderInfo: [
        {
            $Type: 'UI.HeaderInfoType',
            TypeName: 'Pet',
            TypeNamePlural: 'Pets',
            Title: {
                $Type: 'UI.DataField',
                Value: name
            },
        }
    ],

    UI.Identification: [
        { $Type: 'UI.DataField', Value: name},
        { $Type: 'UI.DataField', Value: species},
        { $Type: 'UI.DataField', Value: breed     },
        { $Type: 'UI.DataField', Value: weight    },
        { $Type: 'UI.DataField', Value: birthDate    },
        { $Type: 'UI.DataField', Value: ownerName  }
    ],

    UI.Facets:[
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Dados do Pet',
            Target: '@UI.Identification'
        },
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'Consultas',
            Target: 'appointments/@UI.LineItem'
        }
    ]
){
    name @Common.Label: 'Nome';
    species @Common.Label: 'Especie';
    breed @Common.Label: 'Raça';
    weight @Common.Label: 'Peso'; 
    birthDate @Common.Label: 'Data de nascimento';
    ownerName @Common.Label: 'Tutor'
}