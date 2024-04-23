## Initial Setup

- Node.js <https://nodejs.org/en/download/>

To verify that you have Node.js installed
```console
node -v
```

```console
npm install
```
### Environment Variables
`DATABASE_URL`: The URL of the database that Prisma ORM connects to. See the [documentation](https://www.prisma.io/docs/reference/database-reference/connection-urls) for info about supported database options.

`PORT`: The port where the app will run

`NEXTAUTH_SECRET`: The key used to encrypt JWTs with NextAuth. This is the default value for the `secret` option in NextAuth.

`NEXT_PUBLIC_RAPID_API_KEY`: The API key required to access a Rapid API host

`NEXT_PUBLIC_APP_DEFAULT_LOCATION`: The default city location used by the app. This must be formtted as "[city.name], [city.countryCode]" based on response data of type `city` from the GeoDB Cities API (e.g. "San Francisco, US").

#### Initialize Database
```console
npm run prisma-sync
```

```console
npm run seed-db
```

```console
npx prisma format
```

```console
npx prisma validate
```

```console
npx prisma migrate dev
```

```console
npx prisma generate
```

## Run the app

```console
npm run dev
```

## External APIs

- [Open-Meteo Free Weather API](https://open-meteo.com/en/docs) 

- [GeoDB Cities API](https://rapidapi.com/wirefreethought/api/geodb-cities)
