-- Tabelle: users
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

-- Tabelle: dailytasks
CREATE TABLE dailyTask (
    taskid INTEGER PRIMARY KEY AUTOINCREMENT,
    id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    due_date DATETIME NOT NULL,
    repeat_interval INTEGER, 
    is_done BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
);

-- Trigger, um updated_at automatisch zu aktualisieren
CREATE TRIGGER update_tasks_timestamp
AFTER UPDATE ON tasks
FOR EACH ROW
BEGIN
    UPDATE tasks SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;

-- Tabelle: calendar
CREATE TABLE calendar (
    calendarid INTEGER PRIMARY KEY AUTOINCREMENT,
    id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    is_birthday BOOLEAN DEFAULT 0,
    repeat_interval TEXT,  -- für Geburtstage oder wiederkehrende Termine
    linked_task_id INTEGER,           -- optional: Verbindung zur Task
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (linked_task_id) REFERENCES tasks(taskid) ON DELETE SET NULL
);

-- Trigger, um updated_at automatisch zu aktualisieren
CREATE TRIGGER update_calendar_timestamp
AFTER UPDATE ON calendar
FOR EACH ROW
BEGIN
    UPDATE calendar SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;

INSERT INTO users (username, password)
VALUES ('admin', 'test123');

INSERT INTO tasks (id, title, description, due_date)
VALUES (1, 'Erste Aufgabe', 'Beschreibung der Aufgabe', '2025-11-01 10:00:00');

INSERT INTO calendar (id, title, start_time, end_time, type)
VALUES (1, 'Meeting', '2025-11-01 14:00:00', '2025-11-01 15:00:00', 'event');

DELETE FROM users WHERE username = 'admin';

DROP TABLE users;

DROP TABLE dailyTask;

SELECT * FROM users WHERE username = 'admin';

SELECT * FROM dailyTask WHERE id = 1;

UPDATE dailyTask SET is_done = 0 WHERE id = 1;


UPDATE dailyTask SET is_done = 1 WHERE id = 1;