# pdf-lambda

An AWS Lambda that renders PDFs from HTML templates with the help of [`Handlebars`](https://handlebarsjs.com/) and [`puppeteer`](https://github.com/GoogleChrome/puppeteer).

## Setup

Deploy the Cloudformation stack to AWS:

```shell
make deploy
```

This will create an API gateway and an S3 bucket for your PDFs.

## Usage

The API exposes a single POST endpoint:

### `/pdf-lambda`

**Parameters**

- `url` - The URL to use as a template.
- `data` - A JSON object to feed Handlebars

**Description**

Request a render from the API endpoint:

```
curl \
  -X POST \
  -H "Content-Type: application/json" \
  https://your-api-gateway-hostname/pdf-lambda \
  -d '{
    "url": "https://docs.google.com/document/d/e/2PACX-1vRsOF1-sr6U5ONvX6rvk3SYJII2Qf3SlCyj-DD1gNYpH7h3D1ut-rXd_kjphC0Fs9_GsCTAM5Xl8vrH/pub",
    "data": {
      "name": "Sleavely",
      "experiences": [
        { "company": "Stark Industries", "title": "Tech Lead", "description": "Making tiny iron people." },
        { "company": "Wayne Enterprises", "title": "Security Officer", "description": "Security officer by day, millionaire by night."},
        { "company": "Los Pollos Hermanos", "title": "Clerk", "description": "I took a sabbatical to fry some chicken. Learned a lot about chemistry."},
        { "company": "Gringotts", "title": "Financial Advisor", "description": "Improved securiy with KMS"}
      ]
    }
  }'
```

The API will return an S3 URL for the rendered PDF.

Here's a before- & after- using the cURL from earlier:

![](https://i.imgur.com/kC7627v.png)
