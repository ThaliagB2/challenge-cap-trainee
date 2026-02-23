namespace db.types;

type AppointmentStatus: String 
enum {
        SCHEDULED = 'SCHEDULED';
        IN_PROGRESS = 'IN_PROGRESS';
        COMPLETED = 'COMPLETED';
        CANCELLED = 'CANCELLED';
    };
