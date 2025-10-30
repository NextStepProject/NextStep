--SQLite3

CREATE TABLE users (
    userid INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL);


CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATETIME,
    repeat_interval VARCHAR(50),  -- z. B. 'daily', 'weekly', 'monthly'
    is_done BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE calendar (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type TEXT,
    start_time DATETIME,
    end_time DATETIME,
    is_birthday BOOLEAN DEFAULT FALSE,
    repeat_interval VARCHAR(50),  -- für Geburtstage oder wiederkehrende Termine
    linked_task_id INT,           -- optional: Verbindung zur Task
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (linked_task_id) REFERENCES tasks(id) ON DELETE SET NULL
);

INSERT INTO users (userid, username, password) VALUES (1, 'admin', 'test123');

DROP TABLE users;