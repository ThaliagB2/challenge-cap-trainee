using { VetClinicService } from '../routes/index';

annotate VetClinicService.Veterinarians with @(
    UI: {
        SelectionFields  : [firstName, lastName, specialty, crmv],
        LineItem  : [
            {
                $Type: 'UI.DataField',
                Value: id,
                Label: 'ID',
                ![@HTML5.CssDefaults]: {
                    $Type: 'HTML5.CssDefaultsType',
                    width: '20rem'
                }
            },
            {
                $Type: 'UI.DataField',
                Value: firstName,
                ![@HTML5.CssDefaults]: {
                    $Type: 'HTML5.CssDefaultsType',
                    width: '14rem'
                }
            },
            {
                $Type: 'UI.DataField',
                Value: lastName,
                ![@HTML5.CssDefaults]: {
                    $Type: 'HTML5.CssDefaultsType',
                    width: '16rem'
                }
            },
            {
                $Type: 'UI.DataField',
                Value: specialty,
                ![@HTML5.CssDefaults]: {
                    $Type: 'HTML5.CssDefaultsType',
                    width: '14rem'
                }
            },
            {
                $Type: 'UI.DataField',
                Value: crmv,
                ![@HTML5.CssDefaults]: {
                    $Type: 'HTML5.CssDefaultsType',
                    width: '14rem'
                }
            }
        ],
        HeaderInfo  : {
            $Type : 'UI.HeaderInfoType',
            TypeName : '{i18n>veterinarian}',
            TypeNamePlural : '{i18n>veterinarians}',
            Title : {
                $Type : 'UI.DataField',
                Value : '{i18n>veterinarian}: {firstName} {lastName}'
            }
        },
        Facets  : [
            {
                ID: 'veterinarianData',
                $Type: 'UI.CollectionFacet',
                Label: '{i18n>veterinarianData}',
                Facets: [
                    {
                        ID: 'veterinarian',
                        $Type: 'UI.ReferenceFacet',
                        Target: '@UI.FieldGroup#VeterinarianData'
                    }
                ]
            }
        ],
        FieldGroup#VeterinarianData: {
            $Type: 'UI.FieldGroupType',
            Data: [
                {
                    $Type: 'UI.DataField',
                    Value: firstName
                },
                {
                    $Type: 'UI.DataField',
                    Value: lastName
                },
                {
                    $Type: 'UI.DataField',
                    Value: specialty
                },
                {
                    $Type: 'UI.DataField',
                    Value: crmv
                }
            ]
        }
    }
){
    id @title: 'ID';
    firstName @title: '{i18n>firstName}';
    lastName @title: '{i18n>lastName}';
    specialty @title: '{i18n>specialty}';
    crmv @title: '{i18n>crmv}';
};

