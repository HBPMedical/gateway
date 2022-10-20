---
description: >-
  This page description all the possible configuration that can be made in the
  Gateway.
---

# Gateway

### :toolbox: Options

#### General

| name               | type    | default                         | description                                                                                 |
| ------------------ | ------- | ------------------------------- | ------------------------------------------------------------------------------------------- |
| ENGINE\_TYPE       | string  | exareme                         | Define the connector that should be used : **`exareme, datashield, csv, local`**.           |
| ENGINE\_BASE\_URL  | string  | http://127.0.0.1:8080/services/ | Specify the endpoint for the data source. The parameter will be provided for the connector. |
| TOS\_SKIP          | boolean | false                           | Allow to skip the `terms of services` (this parameter is provided to the frontend)          |
| GATEWAY\_PORT      | number  | 8081                            | Indicate the port that should be used by the gateway                                        |
| NODE\_ENV          | string  | dev                             | Value can be `prod` or `dev`                                                                |
| BASE\_URL\_CONTEXT | string  | null                            | Define context of the gateway. E.g. `api` if the api is under `http://127.0.0.1/api/`       |

#### Authentication

| name                                   | type    | default  | description                                                                                                                                           |
| -------------------------------------- | ------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| AUTH\_SKIP                             | boolean | false    | Allow to skip authentication. Warn: all routes will be accessible without authentication.                                                             |
| AUTH\_JWT\_SECRET                      | string  | N/A      | Secret that should be used to generate JWT                                                                                                            |
| AUTH\_JWT\_REFRESH\_SECRET             | string  | N/A      | Secret that should be used to generate Refresh Token                                                                                                  |
| AUTH\_JWT\_TOKEN\_EXPIRES\_IN          | string  | '1h'     | <p>JWT time to live.</p><p>Expressed in seconds or a string describing a time span <a href="https://github.com/vercel/ms">vercel/ms</a></p>           |
| AUTH\_JWT\_REFRESH\_TOKEN\_EXPIRES\_IN |         | '2d'     | <p>Refresh token time to live.</p><p>Expressed in seconds or a string describing a time span <a href="https://github.com/vercel/ms">vercel/ms</a></p> |
| AUTH\_COOKIE\_SAME\_SITE               | string  | 'strict' | Specify the cookie same site option. Value can be `lax`, `strict` or `none`                                                                           |
| AUTH\_COOKIE\_SECURE                   | boolean | true     | Specify the cookie secure option. Should be set to true if same site is not set to `strict`.                                                          |
| AUTH\_ENABLE\_SSO                      | boolean | false    | Enable SSO login process, this variable will be provided to the frontend in order to perform the login.                                               |

#### Database

| name         | type   | default   | description                     |
| ------------ | ------ | --------- | ------------------------------- |
| DB\_HOST     | string | localhost | Hostname                        |
| DB\_PORT     | number | 5432      | Port number                     |
| DB\_USERNAME | string | postgres  | Username                        |
| DB\_PASSWORD | string | pass123   | Password                        |
| DB\_NAME     | string | postgres  | Name of the database's instance |

#### Matomo

Matomo is an open source alternative to Google Analytics. The gateway provide this configuration in order to be used by any frontend. The real implementation is left to the frontend.

| name             | type                | default   | description                                                                                         |
| ---------------- | ------------------- | --------- | --------------------------------------------------------------------------------------------------- |
| MATOMO\_ENABLED  | boolean             | false     | Enable or disable Matomo                                                                            |
| MATOMO\_URL      | string \| undefined | undefined | Base url for matomo scripts and data reporting. This parameter is `required` if Matomo is `enabled` |
| MATOMO\_SITE\_ID | string \| undefined | undefined | Matomo Website ID. This parameter is required if `Matomo` is `enabled`.                             |

#### Cache

The Gateway offers the possibility to cache some of the most used queries (domains and algorithms queries). This cache use In-Memory data store.

| name              | type    | default | description                                            |
| ----------------- | ------- | ------- | ------------------------------------------------------ |
| CACHE\_ENABLED    | boolean | true    | Enable or disable the cache                            |
| CACHE\_TTL        | number  | 1800    | Define (in seconds) time to live for cached elements.  |
| CACHE\_MAX\_ITEMS | number  | 100     | Max items that can be cached at the same time          |

### Overwrite parameters

These parameters can be overwrite by either

* setting a variable in `.env` file (you can create it if it does not exist) along with the file `.env.defaults` in the root folder
* or setting an environment variable on your system

Default variables are stored in the `.env.defaults` file, under the `db.config.ts` file for the database configuration and `matomo.config.ts` for Matomo configuration.
