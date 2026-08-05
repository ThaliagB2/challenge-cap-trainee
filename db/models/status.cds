namespace db.models;

entity Status {
    key id : String enum {
        SCHEDULED   = 'SCHEDULED';
        IN_PROGRESS = 'IN_PROGRESS';
        COMPLETED   = 'COMPLETED';
        CANCELLED   = 'CANCELLED';
    };

    description : localized String;
}