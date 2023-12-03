import { Pane } from "tweakpane";
import { addDays, format } from "date-fns";

const pane = new Pane();

const menuFolder = pane.addFolder({
  title: "Time Selector",
});

const getDate = (year, dayOfYear) => {
  const era = year >= 1 ? "AC" : "BC";
  let date = new Date(year, 0, 1);
  date = addDays(date, dayOfYear - 1);
  const dateFormatted = format(date, `yyyy-MM-dd`);
  return dateFormatted + " " + era;
};

const yearBlade = pane.addBlade({
  view: "slider",
  label: "year",
  min: -2099,
  max: 2099,
  value: 2023,
});

const dayBlade = pane.addBlade({
  view: "slider",
  label: "day",
  min: 1,
  max: 366,
  value: 1,
});

const dateBlade = pane.addBlade({
  view: "text",
  label: "date",
  parse: (v) => getDate(v),
  disabled: true,
  value: getDate(yearBlade.value, dayBlade.value),
});

const updateSliderBladeValue = () => {
  const dateValue = getDate(yearBlade.value, dayBlade.value);
  dateBlade.value = dateValue;
};

yearBlade.on("change", updateSliderBladeValue);
dayBlade.on("change", updateSliderBladeValue);

export { pane, dateBlade };
