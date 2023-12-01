export function generarArrayFechas(start_date, end_date) {
    let startDate = new Date(start_date);
    let endDate = new Date(end_date);
    let arrayFechas = [];

    for (let currentDate = startDate; currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
        arrayFechas.push(currentDate.toISOString().split('T')[0]);
    }

    return arrayFechas;
}

