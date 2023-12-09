# Building a Solar System with Nasa Horizons API and three.js

This repository has 2 main folders, one written in Python that queries data from the [NASA Horizons API](https://ssd-api.jpl.nasa.gov/doc/horizons.html), and another one that is a web app in Vite with Three.js.

The purpose of the Python project is to generate JSON files with the position of the planets, which are later used by the web app.

To open the app, execute the following commands.

```
cd solar-system-threejs
npm run install
npm run dev
```

This will allow you to view the app on some localhost port.

Take into account the following table to know since when there is data on the positions of the planets.

| Planet  | Date from which data is available | Date until data is available |
|---------|------------------------------------|-------------------------------|
| Mercury | Before 8.000 b.C.                  | After 8.000 a.C.             |
| Venus   | Before 8.000 b.C.                  | After 8.000 a.C.             |
| Earth   | Before 8.000 b.C.                  | After 8.000 a.C.             |
| Mars    | 02-01-1600 a.C.                    | 03-01-2500 a.C.              |
| Jupiter | 11-01-1.600 a.C.                   | 09-01-2.200 a.C.             |
| Saturn  | 31-12-1.749 a.C.                   | 05-01-2.250 a.C.             |
| Uranus  | 15-12-1.599 a.C.                   | 26-12-2.599 a.C.             |
| Neptune | 15-01-1.600 a.C.                   | 30-12-2.399 a.C.             |
| Pluto   | 07-01-1.700 a.C.                   | 31-12-2.099 a.C.             |

You can view the website in production at https://tonicanada.github.io/solar-system-threejs/.

For more information, read the following article.