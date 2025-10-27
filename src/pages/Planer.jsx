import { useMemo } from 'react';
import Header from '../components/Header';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import './planer.css';

const Planer = () => {
    const today = new Date();

    const persons = [
        {
            name: 'Oma',
            birthDate: new Date(1946, 11, 23),
            deathDate: new Date(2025, 1, 9),
            color: '#ab3ed3',
            description: 'Die beste Oma der Welt',
            type: 'birthday',
        },
        {
            name: 'Oliver N.',
            birthDate: new Date(2007, 10, 20),
            deathDate: null,
            color: '#59d88e',
            description: '',
            type: 'birthday',
        },
        {
            name: 'Nico Y.',
            birthDate: new Date(2001, 5, 14),
            deathDate: null,
            color: '#0046f6ff',
            description: '',
            type: 'birthday',
        },
        {
            name: 'Papa (Torsten S.)',
            birthDate: new Date(1966, 2, 15),
            deathDate: null,
            color: '#3b82f6',
            description: '',
            type: 'birthday',
        },
        {
            name: 'ich (Marvin Y.)',
            birthDate: new Date(1998, 11, 23),
            deathDate: null,
            color: '#4c5e7aff',
            description: '',
            type: 'birthday',
        },
    ];

    const formatLocalDate = (date) => {
        const corrected = new Date(date);
        corrected.setDate(corrected.getDate() + 1);  // Korrektur für Tages.Indexierung
        corrected.setMonth(corrected.getMonth() - 1); // Korrektuer der Monat-Indexierung
        return corrected.toISOString().split('T')[0];
    };

    const generatedEvents = useMemo(() => {
        const events = [];
        const currentYear = today.getFullYear();

        persons.forEach((person) => {
            const { name, birthDate, deathDate, color } = person;
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
        });

        return events;
    }, [today]);

    const handleEventClick = (info) => {
        alert(`📅 ${info.event.title}\nDatum: ${info.event.start.toLocaleDateString('de-DE')}`);
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
