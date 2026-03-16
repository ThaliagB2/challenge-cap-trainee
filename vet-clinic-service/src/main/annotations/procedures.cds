using { VetClinicService } from '../routes/index';

annotate VetClinicService.Procedures with @(
    UI: {
        SelectionFields  : [description, cost],
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
                Value: description,
                ![@HTML5.CssDefaults]: {
                    $Type: 'HTML5.CssDefaultsType',
                    width: '30rem'
                }
            },
            {
                $Type: 'UI.DataField',
                Value: cost,
                ![@HTML5.CssDefaults]: {
                    $Type: 'HTML5.CssDefaultsType',
                    width: '8rem'
                }
            },
            {
                $Type: 'UI.DataField',
                Value: appointment.id,
                Label: '{i18n>appointment}',
                ![@HTML5.CssDefaults]: {
                    $Type: 'HTML5.CssDefaultsType',
                    width: '20rem'
                }
            }
        ],
        HeaderInfo  : {
            $Type : 'UI.HeaderInfoType',
            TypeName : '{i18n>procedure}',
            TypeNamePlural : '{i18n>procedures}',
            Title : {
                $Type : 'UI.DataField',
                Value :  '{i18n>procedure}: {description}'
            }
        },
        Facets  : [
            {
                ID: 'procedureData',
                $Type: 'UI.CollectionFacet',
                Label: '{i18n>procedureData}',
                Facets: [
                    {
                        ID: 'procedure',
                        $Type: 'UI.ReferenceFacet',
                        Target: '@UI.FieldGroup#ProcedureData'
                    }
                ]
            },
            {
                ID: 'appointment',
                $Type: 'UI.ReferenceFacet',
                Label: '{i18n>appointment}',
                Target: 'appointment/@UI.FieldGroup#AppointmentData'
            }
        ],
        FieldGroup#ProcedureData: {
            $Type: 'UI.FieldGroupType',
            Data: [
                {
                    $Type: 'UI.DataField',
                    Value: description
                },
                {
                    $Type: 'UI.DataField',
                    Value: cost
                }
            ]
        }
    }
){
    id @title: 'ID';
    description @title : '{i18n>description}';
    cost @title : '{i18n>cost}';
};
