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
    repeat_interval INTEGER,  -- für Geburtstage oder wiederkehrende Termine
    linked_task_id INTEGER,           -- optional: Verbindung zur Task
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (linked_task_id) REFERENCES dailyTask(taskid) ON DELETE SET NULL
);

DROP TABLE users;

DROP TABLE dailyTask;

SELECT * FROM users WHERE username = 'admin';

SELECT * FROM dailyTask WHERE id = 1;

UPDATE dailyTask SET is_done = 0 WHERE id = 1;


UPDATE dailyTask SET is_done = 1 WHERE id = 1;
DROP TABLE calendar;
