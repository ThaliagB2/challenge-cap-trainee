using VetClinicService from '../routes/index';

annotate VetClinicService.Appointments with @(
    UI: {
        SelectionFields  : [date, status, isEmergency, totalCost, notes],
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
                Value: date,
                ![@HTML5.CssDefaults]: {
                    $Type: 'HTML5.CssDefaultsType',
                    width: '14rem'
                }
            },
            {
                $Type: 'UI.DataField',
                Value: status,
                Criticality: (status == 'COMPLETED' ? 3 : (status == 'IN_PROGRESS' ? 2 : 1)),
                CriticalityRepresentation: #WithoutIcon,
                ![@HTML5.CssDefaults]: {
                    $Type: 'HTML5.CssDefaultsType',
                    width: '10rem'
                }
            },
            {
                $Type: 'UI.DataField',
                Value: totalCost,
                ![@HTML5.CssDefaults]: {
                    $Type: 'HTML5.CssDefaultsType',
                    width: '6rem'
                }
            },
            {
                $Type: 'UI.DataField',
                Value: notes,
                ![@HTML5.CssDefaults]: {
                    $Type: 'HTML5.CssDefaultsType',
                    width: '20rem'
                }
            },
                        {
                $Type: 'UI.DataField',
                Value: isEmergency,
                Criticality: (isEmergency == true ? 3 : 1),
                CriticalityRepresentation: #WithIcon,
                ![@HTML5.CssDefaults]: {
                    $Type: 'HTML5.CssDefaultsType',
                    width: '8rem'
                }
            }
        ],
        HeaderInfo  : {
            $Type : 'UI.HeaderInfoType',
            TypeName : '{i18n>appointment}',
            TypeNamePlural : '{i18n>appointments}',
            Title : {
                $Type : 'UI.DataField',
                Value : '{i18n>appointment}: {id}'
            }
        },
        Facets  : [
            {
                ID: 'appointmentData',
                $Type: 'UI.CollectionFacet',
                Label: '{i18n>appointmentData}',
                Facets: [
                    {
                        ID: 'appointment',
                        $Type: 'UI.ReferenceFacet',
                        Target: '@UI.FieldGroup#AppointmentData'
                    }
                ]
            }, 
            {
                ID: 'appointmentPet',
                $Type: 'UI.ReferenceFacet',
                Label: '{i18n>pet}',
                Target: 'pet/@UI.FieldGroup#Pet'
            },
            {
                ID: 'appointmentVeterinarian',
                $Type: 'UI.ReferenceFacet',
                Label: '{i18n>veterinarian}',
                Target: 'veterinarian/@UI.FieldGroup#VeterinarianData'
            },
            {
                ID: 'procedures',
                $Type: 'UI.ReferenceFacet',
                Label: '{i18n>procedures}',
                Target: 'procedures/@UI.LineItem'
            }
        ],
        FieldGroup#AppointmentData: {
            $Type: 'UI.FieldGroupType',
            Data: [
                {
                    $Type: 'UI.DataField',
                    Value: date
                },
                {
                    $Type: 'UI.DataField',
                    Value: status
                },
                {
                    $Type: 'UI.DataField',
                    Value: isEmergency
                },
                {
                    $Type: 'UI.DataField',
                    Value: totalCost
                },
                {
                    $Type: 'UI.DataField',
                    Value: notes
                }
            ]
        }
    }
){
    id @title: 'ID';
    date @title : '{i18n>date}';
    status @title : '{i18n>status}';
    isEmergency @title : '{i18n>isEmergency}';
    totalCost @title : '{i18n>totalCost}';
    notes @title : '{i18n>notes}';
};
