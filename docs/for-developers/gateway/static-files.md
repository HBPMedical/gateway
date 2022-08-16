---
description: This page describe how the static files are managed
---

# 🗃 Static files

As different connector implies different context, there is some cases where the Frontend needed to change depending on the connector currently used, the changes can be related to&#x20;

1. Custom CSS
2. Favicon / logo
3. Terms of Service&#x20;
4. Login page&#x20;

A module `files` has been create to allows dynamic resources based on the connector currently used.&#x20;

All static assets are stored under `assets/engines/*`, in this path you have one folder for each connector. By default, all resources are retrieve in the `default` folder. If you want to override a specific file for your connector you just need to create a file with the same name under your connector's folder `assets/engines/yourconnector`.

#### Markdown files and static files

For markdown files, there is a specific process which allows to define a placeholder for relative path. For example, if you want to make a reference to a static image inside the Gateway you cannot just use an absolute link to the resource as you don't know the domain that will be used. So for this specific case, you can use the placeholder `$ASSETS_URL$`. Which will be replaced dynamically at the markdown file's rendering.
