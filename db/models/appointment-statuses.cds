namespace db.models;

entity AppointmentStatuses {
    key id: String(20) enum {
            SCHEDULED = 'SCHEDULED';
            IN_PROGRESS = 'IN_PROGRESS';
            COMPLETED = 'COMPLETED';
            CANCELLED = 'CANCELLED';
        };
        description: localized String(200);
}
