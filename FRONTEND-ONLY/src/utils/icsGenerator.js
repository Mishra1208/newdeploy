export const generateICS = (termName, events) => {
    let icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//ConU Planner//Academic Dates//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH'
    ];

    events.forEach(event => {
        // Parse date string: "Tue, Sep. 1, 2026"
        // We can use the 'fullDate' field we scraped
        const cleanDateStr = event.fullDate.replace(/^[A-Za-z]{3},\s+/, ''); // Remove "Tue, " prefix if present to be safe, or just parse directly

        const startDate = new Date(event.fullDate);

        if (isNaN(startDate.getTime())) {
            console.warn('Invalid date:', event.fullDate);
            return;
        }

        // Format date to YYYYMMDD
        const formatDate = (date) => {
            return date.toISOString().split('T')[0].replace(/-/g, '');
        };

        const dtStart = formatDate(startDate);
        // All day events usually end the next day in ICS, or same day
        // For simple deadlines, DTSTART;VALUE=DATE:YYYYMMDD is best

        const uid = `${dtStart}-${Math.random().toString(36).substr(2, 9)}@conuplanner.com`;

        icsContent.push('BEGIN:VEVENT');
        icsContent.push(`DTSTART;VALUE=DATE:${dtStart}`);
        icsContent.push(`SUMMARY:${event.description}`);
        icsContent.push(`UID:${uid}`);
        icsContent.push('STATUS:CONFIRMED');
        icsContent.push('TRANSP:TRANSPARENT'); // Show as free (available), or OPAQUE for busy
        icsContent.push('END:VEVENT');
    });

    icsContent.push('END:VCALENDAR');

    return icsContent.join('\r\n');
};

export const downloadICS = (filename, content) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/calendar;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    document.body.removeChild(element);
};
