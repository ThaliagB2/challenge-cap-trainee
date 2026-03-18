namespace db.types;

type AppointmentStatus : String enum {
    SCHEDULED;
    IN_PROGRESS;
    COMPLETED;
    CANCELLED;
}