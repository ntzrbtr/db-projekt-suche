# Google Sheets wrapper for DB project

The wrapper is intended to be used as a Google cloud function; so to use the thing you first and foremost need a project set up in the Google cloud console.

## Setup

To use the Google Sheets API you need two things: an API key and the id of the spreadsheet.

The API key must be created in the Google cloud console. While there, make sure that the Google Sheets API is activated for your project.

The spreadsheet must have separate sheets for each station and on each sheet a list of POIs. Copy the id of the spreadsheet from the url.

Create a file called `.env.yaml` that looks like this:

``` yaml
API_KEY: hsgadfkdashgdsgajkdgaj
SPREADSHEET_ID: ndsfgjkdshfkjahs
```

For local testing, put the API key and spreadsheet id in a `.env` file with the same variable names.

## Deployment

To be able to deploy, you have to activate the following APIs there:

- Cloud Functions API
- Cloud Logging API
- Cloud Pub/Sub API
- Cloud Build API

Create a `.env` file and set up the following variables in there:

- `FUNCTION_NAME`: name of the function (e.g. `db-projekt-suche`)
- `FUNCTION_REGION`: name of the region to deploy to (e.g. `europe-west3`)
- `FUNCTION_PROJECT`: id of the project to deploy to (e.g. `my-project-12345`)

Next, set up the Google cloud cli on your machine; to do so, follow the instructions on https://cloud.google.com/sdk/gcloud.

Now you can use `npm run deploy` to deploy the function.

## Usage

- `https://my-function/?type=station&term=<term>` gets a list of stations for term `term`
- `https://my-function/?type=poi&station=<station>&term=<term>` gets a list of pois for term `term` at station `station`

If search can be executed, you get a JSON response object with two keys:

- `count`: number of items found
- `data`: data found (an array of items)

If anything goes wrong, the API returns HTTP status code 400 with some explanation of the error.

## Local testing

To test the function locally, run `npm start`; this will set up an Express server on port 3000 for your API calls.
