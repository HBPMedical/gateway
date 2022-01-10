// This file contains all transformation queries for JSONata
// see : https://docs.jsonata.org/

import * as jsonata from 'jsonata';

export const transformToDomains = jsonata(`
{
    "id": "sophia",
    "datasets": datasets.{
        "id": $.id[0],
        "label": $.label[0]
    },
    "rootGroup": {
        "id": "rootGroup",
        "label": "Root group",
        "groups": groups.id
    },
    "groups": groups.{
        "id": $.id[0],
        "label": $.label[0],
        "variables": $.variables
    },
    "variables": $distinct(groups.variables).{
        "id": $,
        "label": $
    }
}
`);
