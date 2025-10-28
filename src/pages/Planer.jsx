import { useMemo } from 'react';
import Header from '../components/Header';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import './planer.css';

const Planer = () => {
    const today = new Date();

    const eventsData = [
        {
            name: 'Oma',
            birthDate: new Date(1946, 10, 23),
            // deathDate: new Date(2025, 0, 9),
            color: '#ab3ed3',
            description: 'Die beste Oma der Welt',
            type: 'birthday',
        },
        {
            name: 'Oliver N.',
            birthDate: new Date(2007, 9, 27),
            color: '#59d88e',
            type: 'birthday',
        },
        {
            name: 'Nico Y.',
            birthDate: new Date(2001, 4, 14),
            color: '#0046f6',
            type: 'birthday',
        },
        {
            name: 'Papa (Torsten S.)',
            birthDate: new Date(1966, 1, 15),
            color: '#3b82f6',
            type: 'birthday',
        },
        {
            name: 'Ich (Marvin Y.)',
            birthDate: new Date(1998, 10, 23),
            color: '#4c5e7a',
            type: 'birthday',
        },
        {
            name: 'Next Step Start',
            startDate: new Date(2025, 9, 27, 10, 0),
            endDate: new Date(2025, 9, 27, 11, 30),
            color: '#ff9f43',
            description: 'Sprint-Planung und Update',
            type: 'meeting',
        },
        {
            name: 'Next Step Projektphase',
            startDate: new Date(2025, 9, 27),
            endDate: new Date(2025, 10, 18),
            color: '#ff9f43',
            description: 'Projekt Durchlauf',
            type: 'project',
        },
        {
            name: 'Arzttermin',
            date: new Date(2025, 10, 5, 15, 30),
            color: '#e74c3c',
            description: 'Zahnarzttermin zur Kontrolle',
            type: 'termin',
        },
    ];

    const formatLocalDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // +1 für Anzeige
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const generatedEvents = useMemo(() => {
        const events = [];
        const currentYear = today.getFullYear();

        eventsData.forEach((item) => {
            const { name, type, color, description } = item;

            if (type === 'birthday' && item.birthDate) {
                const { birthDate, deathDate } = item;
                const endYear = deathDate ? deathDate.getFullYear() + 5 : currentYear + 5;

                for (let year = birthDate.getFullYear(); year <= endYear; year++) {
                    const birthday = new Date(year, birthDate.getMonth(), birthDate.getDate());
                    const age = year - birthDate.getFullYear();
                    const isAfterDeath = deathDate && birthday > deathDate;
                    const bg = isAfterDeath ? '#cbd5e1' : color;
                    const textColor = isAfterDeath ? '#555' : '#fff';

                    if (birthday >= birthDate) {
                        events.push({
                            title: `${name} – ${age}. Geburtstag 🎂`,
                            date: formatLocalDate(birthday),
                            backgroundColor: bg,
                            textColor,
                        });
                    }
                }

                if (deathDate) {
                    for (let year = deathDate.getFullYear(); year <= currentYear + 5; year++) {
                        const gedenkTag = new Date(year, deathDate.getMonth(), deathDate.getDate());
                        const yearsSince = year - deathDate.getFullYear();
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
            }

            else if (type === 'project' && item.startDate) {
                events.push({
                    title: ` ${name}`,
                    start: item.startDate,
                    end: item.endDate,
                    backgroundColor: color,
                    textColor: '#fff',
                    description,
                });
            }

            else if (type === 'meeting' && item.startDate) {
                events.push({
                    title: ` ${name}`,
                    start: item.startDate,
                    end: item.endDate,
                    backgroundColor: color,
                    textColor: '#fff',
                    description,
                });
            }

            else if (type === 'termin' && item.date) {
                events.push({
                    title: ` ${name}`,
                    start: item.date,
                    backgroundColor: color,
                    textColor: '#fff',
                    description,
                });
            }

            else if (type === 'custom' && item.date) {
                events.push({
                    title: name,
                    date: formatLocalDate(item.date),
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
        <div className="p-6">
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
