import requests
from pathlib import Path
import ephem
import pandas as pd
from datetime import datetime
import os
import json


planets = {
    "Mercury": "199",
    "Venus": "299",
    "Earth": "399",
    "Mars": "499",
    "Jupiter": "599",
    "Saturn": "699",
    "Uranus": "799",
    "Neptune": "899",
    "Pluto": "999"
}


def check_start_date_ephem_by_planet(start_date, planet):
    ephemerides_startdate_by_planet = {
        "Mercury": "-4000-01-01",
        "Venus": "-4000-01-01",
        "Earth": "-4000-01-01",
        "Mars": "1600-01-02",
        "Jupiter": "1600-01-11",
        "Saturn": "1749-12-31",
        "Uranus": "1599-12-15",
        "Neptune": "1600-01-15",
        "Pluto": "1700-01-07"
    }
    start_date_dt = ephem.Date(start_date)
    if ephemerides_startdate_by_planet[planet]:
        start_date_ephem_dt = ephem.Date(ephemerides_startdate_by_planet[planet])

        if start_date_dt < start_date_ephem_dt:
            return False
        else:
            return True


def convert_from_juliandate(julian_date):
    date_ephem = ephem.date(julian_date - 2415020)
    # date_str = datetime.strptime(str(date_ephem), "%Y/%m/%d %H:%M:%S")
    # date_str = date_str.strftime("%Y-%m-%d")
    date_str = str(date_ephem).split()[0]
    year, month, day = map(int, date_str.split('/'))
    if str(year).startswith("-"):
        date_formatted = f"{year:05d}-{month:02d}-{day:02d}"
    else:
        date_formatted = f"{year:04d}-{month:02d}-{day:02d}"
    return date_formatted


def convert_to_juliandate(date):
    jd = ephem.julian_date(date)
    return jd


def get_planet_positions_from_sun_csv(start_date, end_date, time_step, planet, output_folder):

    url = 'https://ssd.jpl.nasa.gov/api/horizons.api'

    param = {
        "format": "text",
        "COMMAND": planets[planet],
        "OBJ_DATA": "YES",
        "MAKE_EPHEM": "YES",
        "EPHEM_TYPE": "VECTORS",
        "CENTER": "@sun",
        "START_TIME": f"JD{str(convert_to_juliandate(start_date))}",
        "STOP_TIME": f"JD{str(convert_to_juliandate(end_date))}",
        "STEP_SIZE": time_step,
        "CSV_FORMAT": "YES"
    }

    ephem_exists = check_start_date_ephem_by_planet(start_date, planet)

    if ephem_exists:
        response = requests.get(url, params=param)
        content_txt = response.text

        start = content_txt.find("$$SOE")
        end = content_txt.find("$$EOE")

        data = content_txt[start + len("$$EOE"):end]

        # Eliminar la coma al final de cada línea
        cleaned_data = '\n'.join(line.strip(',') for line in data.split('\n'))

        file_path = Path(output_folder) / f"{planet}_{start_date}_{end_date}.csv"

        with open(file_path, 'w', encoding="utf-8") as file:
            file.write(cleaned_data)
    else:
        print(f"No ephemeris for target '{planet}' for date {start_date}")


def get_multiple_planet_position_from_sun(start_date="1985-01-01", end_date="1985-12-31", time_step="1d", output_folder="./data"):
    for planet in planets:
        get_planet_positions_from_sun_csv(
            start_date, end_date, time_step, planet, output_folder)


def create_json_file_with_planet_positions_from_csv_files(csv_folder):
    planet_position_dict = {}

    col_names = {
        0: "date_julian",
        1: "date_calendar",
        2: "position_x",
        3: "position_y",
        4: "position_z",
        5: "velocity_x",
        6: "velocity_y",
        7: "velocity_z",
        8: "light_time",
        9: "range_geocentric",
        10: "range_radial"
    }

    for csv_file in os.listdir(csv_folder):
        if csv_file.endswith(".csv"):
            planet = csv_file.split("_")[0]

            path = f"{csv_folder}/{csv_file}"
            try:
                df = pd.read_csv(path, sep=",", header=None)
                df = df.rename(columns=col_names)

                for _, row in df.iterrows():
                    date = convert_from_juliandate(row["date_julian"])

                    if date not in planet_position_dict:
                        planet_position_dict[date] = {}

                    planet_position_dict[date][planet] = [
                        row["position_x"], row["position_y"], row["position_z"]]
            except Exception as e:
                print(f"Error reading {csv_file}: {e}")

        with open(f"./planet_position_{csv_folder.split('/')[-1]}.json", "w") as json_file:
            json.dump(planet_position_dict, json_file)


# get_planet_positions_from_sun_csv(
#     "0001-01-01", "0499-12-31", "1y", "Earth", "./data")

# Getting data BC
# get_multiple_planet_position_from_sun(
#     start_date="-2000-01-01", end_date="-0001-12-31", time_step="10d", output_folder="./data/bc/2000-0001_10d")

# Getting data AC
# get_multiple_planet_position_from_sun(
#     start_date="1751-01-01", end_date="2099-12-31", time_step="5d", output_folder="./data/ac/1751-2099_5d")


create_json_file_with_planet_positions_from_csv_files("./data/ac/1751-2099_5d")
