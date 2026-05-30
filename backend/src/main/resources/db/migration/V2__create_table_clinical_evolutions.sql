CREATE TABLE clinical_evolutions (
    id UUID PRIMARY KEY,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    doctor_name VARCHAR(255),
    gemini_summary TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_clinical_evolutions_patient_id ON clinical_evolutions(patient_id);
CREATE INDEX idx_clinical_evolutions_created_at ON clinical_evolutions(created_at);