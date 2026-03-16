using { VetClinicService } from '../routes/index';

annotate VetClinicService.Pets with @(
    UI: {
        SelectionFields  : [name, species, breed, birthDate, weight],
        LineItem  : [
            {
                $Type: 'UI.DataField',
                Value: id,
                ![@HTML5.CssDefaults]: {
                    $Type: 'HTML5.CssDefaultsType',
                    width: '20rem'
                }
            },
            {
                $Type: 'UI.DataField',
                Value: name,
                ![@HTML5.CssDefaults]: {
                    $Type: 'HTML5.CssDefaultsType',
                    width: '10rem'
                }
            },
            {
                $Type: 'UI.DataField',
                Value: species,
                ![@HTML5.CssDefaults]: {
                    $Type: 'HTML5.CssDefaultsType',
                    width: '12rem'
                }
            },
            {
                $Type: 'UI.DataField',
                Value: breed,
                ![@HTML5.CssDefaults]: {
                    $Type: 'HTML5.CssDefaultsType',
                    width: '14rem'
                }
            },
            {
                $Type: 'UI.DataField',
                Value: birthDate,
                ![@HTML5.CssDefaults]: {
                    $Type: 'HTML5.CssDefaultsType',
                    width: '14rem'
                }
            },
            {
                $Type: 'UI.DataField',
                Value: weight,
                ![@HTML5.CssDefaults]: {
                    $Type: 'HTML5.CssDefaultsType',
                    width: '8rem'
                }
            }
        ],
        HeaderInfo  : {
            $Type : 'UI.HeaderInfoType',
            TypeName : '{i18n>pet}',
            TypeNamePlural : '{i18n>pets}',
            Title : {
                $Type : 'UI.DataField',
                Value :  '{i18n>pet}: {name}'
            }
        },
        Facets  : [
            {
                ID: 'petData',
                $Type: 'UI.CollectionFacet',
                Label: '{i18n>petData}',
                Facets: [
                    {
                        ID: 'pet',
                        $Type: 'UI.ReferenceFacet',
                        Target: '@UI.FieldGroup#Pet'
                    }
                ]
            }
        ],
        FieldGroup#Pet: {
            $Type: 'UI.FieldGroupType',
            Data: [
                {
                    $Type: 'UI.DataField',
                    Value: name
                },
                {
                    $Type: 'UI.DataField',
                    Value: species
                },
                {
                    $Type: 'UI.DataField',
                    Value: breed
                },
                {
                    $Type: 'UI.DataField',
                    Value: birthDate
                },
                {
                    $Type: 'UI.DataField',
                    Value: weight
                }
            ]
        }
    }
){
    id @title : 'ID';
    name @title : '{i18n>name}';
    species @title : '{i18n>specie}';
    breed @title : '{i18n>breed}';
    birthDate @title : '{i18n>birthDate}';
    weight @title : '{i18n>weight}';
};