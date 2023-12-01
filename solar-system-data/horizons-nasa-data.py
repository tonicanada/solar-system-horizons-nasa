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


def get_planet_positions_from_sun_csv(start_date, end_date, time_step, planet, output_folder):

    url = 'https://ssd.jpl.nasa.gov/api/horizons.api'

    param = {
        "format": "text",
        "COMMAND": planets[planet],
        "OBJ_DATA": "YES",
        "MAKE_EPHEM": "YES",
        "EPHEM_TYPE": "VECTORS",
        "CENTER": "@sun",
        "START_TIME": start_date,
        "STOP_TIME": end_date,
        "STEP_SIZE": time_step,
        "CSV_FORMAT": "YES"
    }

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


def get_multiple_planet_position_from_sun(start_date="1985-01-01", end_date="1985-12-31", output_folder="./data"):
    for planet in planets:
        get_planet_positions_from_sun_csv(
            start_date, end_date, "1d", planet, output_folder)


def convert_julian_date(julian_date):
    date_ephem = ephem.date(julian_date - 2415020)
    date_str = datetime.strptime(str(date_ephem), "%Y/%m/%d %H:%M:%S")
    date_str = date_str.strftime("%Y-%m-%d")
    return date_str


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

            df = pd.read_csv(f"./data/{csv_file}",
                             sep=",", header=None)

            df = df.rename(columns=col_names)

            for _, row in df.iterrows():
                date = convert_julian_date(row["date_julian"])

                if date not in planet_position_dict:
                    planet_position_dict[date] = {}

                planet_position_dict[date][planet] = [
                    row["position_x"], row["position_y"], row["position_z"]]
                
    with open("./planet_position.json", "w") as json_file:
        json.dump(planet_position_dict, json_file)

# get_planet_positions_from_sun_csv("1985-01-01", "1985-01-31", "1d", "Earth", "./data")
# get_multiple_planet_position_from_sun()
create_json_file_with_planet_positions_from_csv_files("./data")
