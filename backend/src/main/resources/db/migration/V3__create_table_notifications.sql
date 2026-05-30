CREATE TABLE notifications (
    id UUID PRIMARY KEY,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    evolution_id UUID REFERENCES clinical_evolutions(id) ON DELETE CASCADE,
    message VARCHAR(500) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_patient_id ON notifications(patient_id);