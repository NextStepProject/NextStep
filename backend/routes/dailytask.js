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
                OR (repeat_interval = ? AND is_done = 0)
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
    const sqlQuery = `
        UPDATE dailyTask 
        SET is_done = 1, updated_at = CURRENT_TIMESTAMP 
        WHERE taskid = ? AND id = ?
    `;

    db.run(sqlQuery, [taskId, userId], function (err) {
        if (err) {
            console.error("SQL Error:", err);
            return res.status(500).send("Error updating task status");
        } 

        if (this.changes === 0) {
            return res.status(404).send("Task not found or unauthorized");
        }
        return res.status(200).json({ message: "Task marked as done", taskId: taskId });
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


module.exports = router;