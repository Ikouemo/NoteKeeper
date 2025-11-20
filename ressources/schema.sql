CREATE TABLE IF NOT EXISTS notes(  
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE PLPGSQL;

-- Trigger pour exécuter la fonction à chaque mise à jour
CREATE TRIGGER set_update_at
BEFORE UPDATE on notes
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();