CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);
-- Create the 'todos' table
CREATE TABLE todos (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    priority INT CHECK (
        priority BETWEEN 1 AND 5
    ),
    status VARCHAR(50) CHECK (status IN ('pending', 'finished')) NOT NULL
);


CREATE OR REPLACE FUNCTION set_end_time() RETURNS TRIGGER AS $$ BEGIN -- Check if the status is 'finished'
    IF NEW.status = 'finished' THEN -- Set end_time to the current timestamp
    NEW.end_time = CURRENT_TIMESTAMP;
END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trigger_set_end_time BEFORE
INSERT
    OR
UPDATE ON todos FOR EACH ROW EXECUTE FUNCTION set_end_time();


SELECT *
FROM users;
SELECT *
FROM todos -- GROUP BY priority;

drop table tasks;