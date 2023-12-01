# Object positions from CSV obtained from Nasa Horizons API
Data is obtained using https://ssd-api.jpl.nasa.gov/doc/horizons.html
## CSV structure
Columns:

1. **JDTDB (Julian Date TDB - Barycentric Dynamical Time)** <br>
Column 1.
Description: It is the Julian Date Barycentric Dynamical Time, which is a time measurement used in astronomy. It represents time in terms of Julian barycentric days from a specific epoch.
2. **Calendar (TDB)** <br>
Column 2. Description: A calendar date is a way of expressing a specific point in time using a calendar system, typically including the year, month, day, and sometimes additional details like hours, minutes, and seconds. In the context of astronomy and space missions, calendar dates are often used to specify observation times, mission events, or other temporal aspects.
3. **Position X, Y, Z** <br>
Column 3, 4 y 5. Description: Represents the three-dimensional Cartesian coordinates indicating the position of the object in space. X, Y, Z: Spatial coordinates of the object in the reference frame used.
4. **Velocity VX, VY, VZ** <br>
Column 6, 7, 8. Description: Represents the components of the object's velocity in the respective directions.
VX, VY, VZ: Components of the object's velocity in the reference frame used.
5. **LT (Light Time):** <br>
Column 9. Description: It is the time it takes for light to travel from the object to the observer. It is expressed in minutes and is used to adjust observations, taking into account the time it takes light to travel from the object observed to Earth.
6. **RG (Geocentric Range):** <br>
Column 10. Description: It is the distance from the center of the Earth to the object in question.
7. **RR (Radial Range):** <br>
Column 11. Description: It is the distance between the object and the observer at the time of observation.
RR: Radial range in kilometers.