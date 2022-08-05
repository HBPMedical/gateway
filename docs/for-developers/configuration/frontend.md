---
description: >-
  This page description all the possible configuration that can be made in the
  Gateway.
---

# Frontend

### :toolbox: Options

#### Matomo

Matomo is an open source alternative to Google Analytics.

| name             | type                | default   | description                                                                                         |
| ---------------- | ------------------- | --------- | --------------------------------------------------------------------------------------------------- |
| MATOMO\_ENABLED  | boolean             | false     | Enable or disable Matomo                                                                            |
| MATOMO\_URL      | string \| undefined | undefined | Base url for matomo scripts and data reporting. This parameter is `required` if Matomo is `enabled` |
| MATOMO\_SITE\_ID | string \| undefined | undefined | Matomo Website ID. This parameter is required if `Matomo` is `enabled`.                             |

####
