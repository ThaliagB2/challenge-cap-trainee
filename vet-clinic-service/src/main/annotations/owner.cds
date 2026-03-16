using { VetClinicService } from '../routes/index';

annotate VetClinicService.Owners with @(
    UI: {
        SelectionFields  : [firstName, lastName, phone, email],
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
                Value: firstName,
                ![@HTML5.CssDefaults]: {
                    $Type: 'HTML5.CssDefaultsType',
                    width: '12rem'
                }
            },
            {
                $Type: 'UI.DataField',
                Value: lastName,
                ![@HTML5.CssDefaults]: {
                    $Type: 'HTML5.CssDefaultsType',
                    width: '20rem'
                }
            },
            {
                $Type: 'UI.DataField',
                Value: phone,
                ![@HTML5.CssDefaults]: {
                    $Type: 'HTML5.CssDefaultsType',
                    width: '10rem'
                }
            },
            {
                $Type: 'UI.DataField',
                Value: email,
                ![@HTML5.CssDefaults]: {
                    $Type: 'HTML5.CssDefaultsType',
                    width: '16rem'
                }
            }
        ],
        HeaderInfo  : {
            $Type : 'UI.HeaderInfoType',
            TypeName : '{i18n>owner}',
            TypeNamePlural : '{i18n>owners}',
            Title : {
                $Type : 'UI.DataField',
                Value :  '{i18n>owner}: {firstName} {lastName}'
            }
        },
        Facets  : [
            {
                ID: 'ownerData',
                $Type: 'UI.CollectionFacet',
                Label: '{i18n>ownerData}',
                Facets: [
                    {
                        ID: 'owner',
                        $Type: 'UI.ReferenceFacet',
                        Target: '@UI.FieldGroup#OwnerData'
                    }
                ]
            },
            {
                ID: 'ownerPets',
                $Type: 'UI.ReferenceFacet',
                Label: '{i18n>ownerPets}',
                Target: 'pets/@UI.LineItem'
            }
        ],
        FieldGroup#OwnerData: {
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
                    Value: phone
                },
                {
                    $Type: 'UI.DataField',
                    Value: email
                }
            ]
        }
    }
){
    id @title: 'ID';
    firstName @title : '{i18n>name}';
    lastName @title : '{i18n>lastName}';
    phone @title : '{i18n>phone}';
    email @title : '{i18n>email}';
};