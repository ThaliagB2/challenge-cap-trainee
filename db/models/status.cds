namespace db.models;

using { sap.common.CodeList } from '@sap/cds/common';

entity Status : CodeList {
    key code : String(30);
}