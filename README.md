# gatsby-plugin-content-hash

[![npm version](https://badge.fury.io/js/gatsby-plugin-content-hash.svg)](https://badge.fury.io/js/gatsby-plugin-content-hash)

Add content hash to requests for `app-data.json` and `page-data.json` generated by Gatsby. This plugin is probably needed for the Gatsby app to work properly in an environment like GitHub Pages where file cache control is not possible. For details, refer to the issue below.

[Why are page-data.json files not content hashed? #15080](https://github.com/gatsbyjs/gatsby/issues/15080)

This plugin only works on files generated by `gats by build`.

It works on Gatsby v2, v3 and v4.

### Sample repository

[gatsby-plugin-content-hash-example](https://github.com/sititou70/gatsby-plugin-content-hash-example)

## Installation

`npm i --save gatsby-plugin-content-hash`

## Usage

In your `gatsby-config.js`:

```javascript
{
  resolve: "gatsby-plugin-content-hash",
  options: { build_root_path: `${__dirname}/public` },
},
```

| option                      | default                                                                             | description                                             |
| :-------------------------- | :---------------------------------------------------------------------------------- | :------------------------------------------------------ |
| `build_root_path`           | none, **you must specify** in your `gatsby-config.js`. See the usage example above. | The directory where the built static files are located. |
| `hashing_target_file_names` | `['app-data.json', 'page-data.json']`                                               | Resource file names to add the hash.                    |

## Is it works?

You will find the following log in the `npm run build` command.

```
info [gatsby-plugin-content-hash] modified 27 HTML/JS files.
```

And the built app will reference the hashed `app-data.json` and` page-data.json`.

![Network traffic of the built app](https://user-images.githubusercontent.com/18525488/170714185-5c0ff101-7880-4feb-b75e-0556d04393d3.png)

## Licence

MIT
