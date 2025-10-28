import { useMemo } from 'react';
import Header from '../components/Header';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';

const Planer = () => {
    const today = new Date();

    const eventsData = [
        {
            UserId: 1,
            name: 'Oma',
            startDate: new Date(1946, 10, 23),
            endDate: new Date(2025, 0, 9),
            color: '#ab3ed3',
            description: 'Die beste Oma der Welt',
            type: 'birthday',
        },
        {
            UserId: 1,
            name: 'Ich (Marvin Y.)',
            startDate: new Date(1998, 10, 23),
            color: '#4c5e7a',
            type: 'birthday',
        },
        {
            UserId: 1,
            name: 'Next Step Start',
            startDate: new Date(2025, 9, 27, 10, 0),
            endDate: new Date(2025, 9, 27, 11, 30),
            color: '#ff9f43',
            description: 'Sprint-Planung und Update',
            type: 'meeting',
        },
        {
            UserId: 1,
            name: 'Next Step Projektphase',
            startDate: new Date(2025, 9, 27),
            endDate: new Date(2025, 10, 18),
            color: '#ff9f43',
            description: 'Projekt Durchlauf',
            type: 'project',
        },
        {
            UserId: 1,
            name: 'Arzttermin',
            startDate: new Date(2025, 10, 5, 15, 30),
            color: '#e74c3c',
            description: 'Zahnarzttermin zur Kontrolle',
            type: 'termin',
        },
    ];

    const formatLocalDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const generatedEvents = useMemo(() => {
        const events = [];
        const currentYear = today.getFullYear();

        eventsData.forEach((item) => {
            const { name, type, color, description, startDate, endDate } = item;

            if (type === 'birthday' && startDate) {
                const endYear = endDate ? endDate.getFullYear() + 5 : currentYear + 5;

                for (let year = startDate.getFullYear(); year <= endYear; year++) {
                    const birthday = new Date(year, startDate.getMonth(), startDate.getDate());
                    const age = year - startDate.getFullYear();
                    const isAfterDeath = endDate && birthday > endDate;
                    const bg = isAfterDeath ? '#cbd5e1' : color;
                    const textColor = isAfterDeath ? '#555' : '#fff';

                    if (birthday >= startDate) {
                        events.push({
                            title: `${name} – ${age}. Geburtstag 🎂`,
                            date: formatLocalDate(birthday),
                            backgroundColor: bg,
                            textColor,
                        });
                    }
                }

                if (endDate) {
                    for (let year = endDate.getFullYear(); year <= currentYear + 5; year++) {
                        const gedenkTag = new Date(year, endDate.getMonth(), endDate.getDate());
                        const yearsSince = year - endDate.getFullYear();
                        const title =
                            yearsSince === 0
                                ? `🕊 ${name} – Verstorben`
                                : `🕯 ${name} – ${yearsSince}. Gedenktag`;

                        events.push({
                            title,
                            date: formatLocalDate(gedenkTag),
                            backgroundColor: '#9ca3af',
                            textColor: '#fff',
                        });
                    }
                }
            } else if (type === 'project' && startDate) {
                events.push({
                    title: name,
                    start: startDate,
                    end: endDate,
                    backgroundColor: color,
                    textColor: '#fff',
                    description,
                });
            } else if (type === 'meeting' && startDate) {
                events.push({
                    title: name,
                    start: startDate,
                    end: endDate,
                    backgroundColor: color,
                    textColor: '#fff',
                    description,
                });
            } else if (type === 'termin' && startDate) {
                events.push({
                    title: name,
                    start: startDate,
                    backgroundColor: color,
                    textColor: '#fff',
                    description,
                });
            } else if (type === 'custom' && startDate) {
                events.push({
                    title: name,
                    date: formatLocalDate(startDate),
                    backgroundColor: color || '#3e72b6ff',
                    textColor: '#fff',
                    description,
                });
            }
        });

        return events;
    }, [today]);

    const handleEventClick = (info) => {
        const desc = info.event.extendedProps.description || 'Keine Beschreibung vorhanden.';
        alert(`${info.event.title}\n Datum: ${info.event.start.toLocaleString('de-DE')}\n ${desc}`);
    };

    return (
        <div>
            <Header />
            <h1 className="text-3xl font-bold mb-6">Planer</h1>
            <div className="flex flex-col gap-10">
                <div>
                    <h2 className="text-2xl mb-3">
                        Übersicht ({today.toLocaleString('de-DE', { month: 'long', year: 'numeric' })})
                    </h2>
                    <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
                        initialView="dayGridMonth"
                        locale="de"
                        height="auto"
                        events={generatedEvents}
                        eventClick={handleEventClick}
                        eventTextColor="#000"
                    />
                </div>
            </div>
        </div>
    );
};

export default Planer;
