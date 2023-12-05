export function generarArrayFechas(start_date, end_date) {
  let startDate = new Date(start_date);
  let endDate = new Date(end_date);
  let arrayFechas = [];

  for (
    let currentDate = startDate;
    currentDate <= endDate;
    currentDate.setDate(currentDate.getDate() + 1)
  ) {
    arrayFechas.push(currentDate.toISOString().split("T")[0]);
  }

  return arrayFechas;
}



// Ejemplo de uso
const fechaStringBC = "-1999-01-01";
const fechaStringAD = "1985-12-27";

const julianDateBC = fechaAJuliano(fechaStringBC);
const julianDateAD = fechaAJuliano(fechaStringAD);

console.log("Fecha Juliana (antes de Cristo):", julianDateBC);
console.log("Fecha Juliana (después de Cristo):", julianDateAD);
