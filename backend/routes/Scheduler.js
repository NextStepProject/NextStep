const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/auth");

// Scheduler abfragen
router.get("/scheduler", auth, (req, res) => {
    const sqlQuery = "SELECT * FROM scheduler WHERE id = ?";
    db.all(sqlQuery, [req.user.id], (err, rows) => {
        if (err) {
            console.error("SQL Error:", err);
            return res.status(500).send("Error in Query Request");
        } else {
            return res.status(200).json(rows);
        }
    });
});
// Beschreibung abfragen
router.get("/scheduler/description", auth, (req, res) => {
    const sqlQuery = "SELECT description FROM scheduler WHERE id = ?";
    db.all(sqlQuery, [req.user.id], (err, rows) => {
        if (err) {
            console.error("SQL Error:", err);
            return res.status(500).send("Error in Query Request");
        } else {
            return res.status(200).json(rows);
        }
    });
});
// Eintrag erstellen
router.post("/scheduler", auth, (req, res) => {
    const userId = req.user.id;
    const {
        title,
        description,
        type,
        start_time,
        end_time,
        is_birthday, 
        repeat_interval, 
        linked_task_id 
    } = req.body;

    if (!title || !type || !start_time || !end_time) {
        return res.status(400).json({
            message: "Fehlende erforderliche Felder: title, type, start_time und end_time sind notwendig."
        });
    }

    const sqlQuery = `
        INSERT INTO calendar 
        (id, title, description, type, start_time, end_time, is_birthday, repeat_interval, linked_task_id) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        userId,
        title,
        description,
        type,
        start_time,
        end_time,
        is_birthday || 0,
        repeat_interval || null,
        linked_task_id || null
    ];

    db.run(sqlQuery, values, function (err) {
        if (err) {
            console.error("SQL Error:", err);
            return res.status(500).send("Fehler beim Einfügen des Kalendereintrags");
        }

        return res.status(201).json({
            message: "Kalendereintrag erfolgreich erstellt",
            calendarId: this.lastID
        });
    });
});
// Eintrag updaten
router.put("/scheduler/:calendarid", auth, (req, res) => {
    const calendarId = req.params.calendarid;
    const userId = req.user.id;
    const {
        title,
        description,
        type,
        start_time,
        end_time,
        is_birthday, 
        repeat_interval, 
        linked_task_id 
    } = req.body;

    if (!title || !type || !start_time || !end_time) {
        return res.status(400).json({
            message: "Fehlende erforderliche Felder: title, type, start_time und end_time sind notwendig."
        });
    }

    const sqlQuery = `
        UPDATE calendar 
        SET title = ?, description = ?, type = ?, start_time = ?, end_time = ?, is_birthday = ?, repeat_interval = ?, linked_task_id = ?
        WHERE calendarid = ? AND id = ?
    `;

    const values = [
        title,
        description,
        type,
        start_time,
        end_time,
        is_birthday || 0,
        repeat_interval || null,
        linked_task_id || null,
        calendarId,
        userId
    ];

    db.run(sqlQuery, values, function (err) {
        if (err) {
            console.error("SQL Error:", err);
            return res.status(500).send("Fehler beim Aktualisieren des Kalendereintrags");
        }

        return res.status(200).json({
            message: "Kalendereintrag erfolgreich aktualisiert",
            calendarId: calendarId
        });
    });
});
// Eintrag löschen
router.delete("/scheduler/:calendarid", auth, (req, res) => {
    const calendarId = req.params.calendarid;
    const userId = req.user.id;
    const sqlQuery = `
        DELETE FROM calendar 
        WHERE calendarid = ? AND id = ?
    `;
    db.run(sqlQuery, [calendarId, userId], function (err) {
        if (err) {
            console.error("SQL Error:", err);
            return res.status(500).send("Fehler beim Löschen des Kalendereintrags");
        }
        return res.status(200).send("Kalendereintrag erfolgreich gelöscht");
    });
});
// Export
module.exports = router;