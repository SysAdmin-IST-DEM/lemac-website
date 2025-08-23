# lemac-website

Website for the laboratory LEMAC (Computer Assisted Mechanical Engineering Laboratory).

## Project setup

To configure the app please run `npm install` firstly on the root folder.

Next, configure the database locally (requires a local mySQL server) by creating the test database and connecting to it in the mySQL shell. Finally, source the `dbschema.sql` into the db using `source .\backend\dbschema.sql`.

To configure the `.env` file in the `\backend` directory, copy the `.env.example` and rename it to `.env` open it and fill in with the local environment variables, including the db connection information, the jwt secret and Fénix API secrets.

## frontend

#### Compiles and hot-reloads for development

```
npm run dev
```

#### Compiles and minifies for production

```
npm run build
```

Project first started by [Hacker School](https://github.com/HackerSchool), and later picked up by:
1. [Hugo Teixeira](https://github.com/Timber1900)
2. [Diogo Miranda](https://github.com/diogomsmiranda)
3. [Filipe Miranda](https://github.com/picono435) [current maintainer]

This development of this project is in the responsibility of the DEM Systems Administration.