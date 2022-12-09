# XR Walkers 2022

A Map showing all the walks done by XR Walkers in 2022:
* https://flavour.github.io/xrwalkers2022/

To join XR Walkers:
* https://mailchi.mp/82eb3183021c/xr-walkers-landing-page

## TODO
* Add all Points, Lines, and Circles to GeoJSON
* Make Quiz work on small screen, e.g. Mobile....not this time!

## Developers
```
git clone https://github.com/flavour/xrwalkers2022
cd xrwalkers2022
npm start
```

To generate a build ready for production:
```
npm run build
```

Then deploy the contents of the `dist` directory to `docs` and edit index.html to remove the leading `/` from `/assets`

You can also run `npm run serve` to serve the results of the `dist` directory for preview.
- to get this working you will need to copy the `data` & `img` folders from `docs` to `dist` after each build
