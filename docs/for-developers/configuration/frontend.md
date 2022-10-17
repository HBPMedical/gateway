---
description: >-
  This page description all the possible configuration that can be made in the
  Gateway.
---

# Frontend

### :toolbox: Options

#### General

| name                       | type                | default                   | description                                                                                                                                                                                       |
| -------------------------- | ------------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| VERSION                    | string              | "DEV"                     | Portal frontend's version                                                                                                                                                                         |
| INSTANCE\_NAME             | string              | "HBP MIP"                 | Instance name of the MIP (visible in the header)                                                                                                                                                  |
| ONTOLOGY\_URL              | string \| undefined | undefined                 | Ontology's URL                                                                                                                                                                                    |
| DATACATALOGUE\_SERVER      | string \| undefined | undefined                 | Datacatalogue's URL                                                                                                                                                                               |
| CONTACT\_LINK              | string              | http://ebrains.eu/support | Contact URL (support)                                                                                                                                                                             |
| EXPERIMENTS\_LIST\_REFRESH | string              | "300000"                  | Time to wait before refresh experiments list in `milliseconds`                                                                                                                                    |
| GATEWAY\_SERVER            | string              | none                      | Indicate the Gateway's endpoint. Used when the Gateway is behind the Frontend (reverse proxy)                                                                                                     |
| EXTERNAL\_MIP\_PROTOCOL    | string              | https                     | Indicate the protocol should be forwarded to the Gateway.                                                                                                                                         |
| ERROR\_LOG\_LEVEL          | string              | WARN                      | Level is the minimum level to emit, and is inclusive. Possible levels: DEBUG, INFO, WARN, ERROR, PANIC, and FATAL. See [Caddy logs level](https://caddyserver.com/docs/json/logging/logs/level/). |

#### Matomo

Matomo is an open source alternative to Google Analytics.

| name             | type                | default   | description                                                                                         |
| ---------------- | ------------------- | --------- | --------------------------------------------------------------------------------------------------- |
| MATOMO\_ENABLED  | boolean             | false     | Enable or disable Matomo                                                                            |
| MATOMO\_URL      | string \| undefined | undefined | Base url for matomo scripts and data reporting. This parameter is `required` if Matomo is `enabled` |
| MATOMO\_SITE\_ID | string \| undefined | undefined | Matomo Website ID. This parameter is required if `Matomo` is `enabled`.                             |

#### Caddyfile configuration

The frontend container has a simple implementation of Caddyfile, located in `/etc/caddy/Caddyfile`. If you are using Docker compose you can easily overwrite by specifying a volume :

{% code title="docker-compose.yml" %}
```
...
   volumes:
   - ./path/to/your/Caddyfile:/etc/caddy/Caddyfile
```
{% endcode %}
