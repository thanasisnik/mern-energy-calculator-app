
function timeStrToDate(referenceDate, timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number)
    const date = new Date(referenceDate)
    date.setHours(hours, minutes, 0, 0)
    return date;
}

module.expots = {
    timeStrToDate
};