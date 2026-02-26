using { db.models } from '../../../../db/models';

@path: '/sample'
@requires: 'authenticated-user'
service VetClinicService {
    // Removendo referências a entidades inexistentes
}

// Functions
extend service VetClinicService with {
    function extractProductsToExcel() returns String;
}
