namespace db.types;

type status: String 
enum {
        SCHEDULED = 'SCHEDULED';
        IN_PROGRESS = 'IN_PROGRESS';
        COMPLETED = 'COMPLETED';
        CANCELLED = 'CANCELLED';
    };
