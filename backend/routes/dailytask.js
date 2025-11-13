const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/auth");
// Tägliche Aufgaben abfragen
router.get("/dailytask", auth, (req, res) => {
    const sqlQuery = `
        SELECT * FROM dailyTask 
        WHERE id = ? 
          AND (
              DATE(due_date) = DATE('now')
            OR (repeat_interval IS NOT NULL)
          )
    `;
    db.all(sqlQuery, [req.user.id], (err, rows) => {
        if (err) {
            console.error("SQL Error:", err); 
            return res.status(500).send("Error in Query Request");
        } else {
            return res.status(200).json(rows);
        }
    });
});

// Aufgaben abhaken
router.put("/dailytask/done/:taskid", auth, (req, res) => {
    const taskId = req.params.taskid;
    const userId = req.user.id;
    const requestedStatus = req.body.is_done; 
    const newStatus = (requestedStatus === 0) ? 0 : 1; 

    const sqlQuery = `
        UPDATE dailyTask 
        SET is_done = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE taskid = ? AND id = ?
    `;
    db.run(sqlQuery, [newStatus, taskId, userId], function (err) {
        if (err) {
            console.error("SQL Error:", err);
            return res.status(500).send("Error updating task status");
        } 
        if (this.changes === 0) {
            return res.status(404).send("Task not found or unauthorized");
        }
        const message = `Task marked or unmarked as done`;
        return res.status(200).json({ message, taskId: taskId });
    });
});

// Aufgabe erstellen
router.post("/dailytask", auth, (req, res) => {
    const userId = req.user.id; 
    const { title, description, due_date, repeat_interval } = req.body;
    const sqlQuery = `
        INSERT INTO dailyTask (id, title, description, due_date, repeat_interval)
        VALUES (?, ?, ?, ?, ?)
    `;
    db.run(sqlQuery, [userId, title, description, due_date, repeat_interval], function (err) {
        if (err) {
            console.error("SQL Error:", err);
            return res.status(500).send("Error inserting task"); 
        }
        return res.status(201).json({ 
            message: "Task created successfully", 
            taskId: this.lastID 
        });
    });
});
// Aufgabe löschen
router.delete("/dailytask/:taskid", auth, (req, res) => {
    const taskId = req.params.taskid;
    const userId = req.user.id;
    const sqlQuery = `
        DELETE FROM dailyTask 
        WHERE taskid = ? AND id = ?
    `;
    db.run(sqlQuery, [taskId, userId], function (err) {
        if (err) {
            console.error("SQL Error:", err);
            return res.status(500).send("Error deleting task");
        }
        if (this.changes === 0) {
            return res.status(404).send("Task not found or unauthorized");
        }
        return res.status(200).json({ message: "Task deleted successfully", taskId: taskId });
    });
});

// Aufgabe updaten
router.put("/dailytask/:taskid", auth, (req, res) => {
    const taskId = req.params.taskid;
    const userId = req.user.id;
    
    const allowedFields = ['title', 'description', 'due_date', 'repeat_interval'];
    const updates = {}; 
    
    allowedFields.forEach(field => {
        if (req.body[field] !== undefined && req.body[field] !== null) {
            updates[field] = req.body[field];
        }
    });

    const updateKeys = Object.keys(updates);
    if (updateKeys.length === 0) {
        return res.status(400).json({ 
            message: "Bitte geben Sie mindestens ein gültiges Feld zum Aktualisieren an." 
        });
    }

    const setClauses = updateKeys.map(key => `${key} = ?`).join(', ');
    const updateValues = updateKeys.map(key => updates[key]);

    const sqlQuery = `
        UPDATE dailyTask 
        SET ${setClauses}, updated_at = CURRENT_TIMESTAMP
        WHERE taskid = ? AND id = ?
    `;

    const allValues = [...updateValues, taskId, userId];

    db.run(sqlQuery, allValues, function (err) {
        if (err) {
            console.error("SQL Error:", err);
            return res.status(500).json({ 
                message: "Fehler beim Aktualisieren der Aufgabe in der Datenbank.",
                error: err.message
            });
        }

        if (this.changes === 0) {
            return res.status(404).json({ 
                message: "Aufgabe nicht gefunden oder keine Berechtigung zum Ändern." 
            });
        }
        
        return res.status(200).json({ 
            message: "Aufgabe erfolgreich aktualisiert", 
            taskId: taskId 
        });
    });
});
//EXPORT
module.exports = router;