-- Tabelle: users
CREATE TABLE users (
    userid INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    birthday DATETIME
);

-- Tabelle: tasks
CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userid INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    due_date DATETIME,
    repeat_interval TEXT, -- z. B. 'daily', 'weekly', 'monthly'
    is_done BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userid) REFERENCES users(userid) ON DELETE CASCADE
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
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userid INTEGER NOT NULL,
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
    FOREIGN KEY (userid) REFERENCES users(userid) ON DELETE CASCADE,
    FOREIGN KEY (linked_task_id) REFERENCES tasks(id) ON DELETE SET NULL
);

-- Trigger, um updated_at automatisch zu aktualisieren
CREATE TRIGGER update_calendar_timestamp
AFTER UPDATE ON calendar
FOR EACH ROW
BEGIN
    UPDATE calendar SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
END;


INSERT INTO users (username, password, birthday)
VALUES ('admin', 'test123', '1996-11-03');

INSERT INTO users (username, password)
VALUES ('admin2', 'test123');

INSERT INTO tasks (userid, title, description, due_date)
VALUES (1, 'Erste Aufgabe', 'Beschreibung der Aufgabe', '2025-11-01 10:00:00');

INSERT INTO calendar (userid, title, start_time, end_time, type)
VALUES (1, 'Meeting', '2025-11-01 14:00:00', '2025-11-01 15:00:00', 'event');

DELETE FROM users WHERE username = 'admin';

DROP TABLE users;