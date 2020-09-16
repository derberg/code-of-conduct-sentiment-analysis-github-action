# Code of Conduct Compliance Through Sentiments Analysis

<!-- toc -->

- [Overview](#overview)
  * [Why this action requires other actions?](#why-this-action-requires-other-actions)
  * [How sentiments are analized](#how-sentiments-are-analized)
- [Examples](#examples)
  * [Basic example using AFINN wordlist](#basic-example-using-afinn-wordlist)
  * [Basic example using Google Natural Language API](#basic-example-using-google-natural-language-api)
  * [Example using Google API and Slack action](#example-using-google-api-and-slack-action)
- [Troubleshooting](#troubleshooting)
- [Development](#development)

<!-- tocstop -->

## Overview

Use this action to analyze sentiments in issues and pull request to identify emotions that need to be checked against the Code of Conduct.
This action only analyzes sentiments. Alone it is not very useful as it is just able log the sentiment on GitHub Actions log level. It is intended to be used with other Github Actions.
Example use case could be run this action and then send the results to Slack with another action.

### Why this action requires other actions? 

It is because it "only" analyzes the sentiment, but it is up to you to decide in the workflow setup what is the negative sentiment for you, what score you consider as something you should react on.

### How sentiments are analized

This action can analize sentiments using two different solutions: built-in and 3rd party. Out of the box this action is integrated with [sentiment](https://www.npmjs.com/package/sentiment) package to do analitics based on [AFINN](http://www2.imm.dtu.dk/pubdb/pubs/6010-full.html) wordlist. Insted of such a basic analitics, better use this action to communicate with [Google Natural Language API](https://cloud.google.com/natural-language/docs/basics).

## Examples

### Basic example using AFINN wordlist

Below you can find a basic example of how you can use the action without any other actions. It analizes the sentiment and puts the information the the logs.

```yaml
name: 'Sentiment analysis'
on: 
  issue_comment:
    types: 
      - created
      - edited
  issues:
    types:
      - opened
      - edited
  pull_request:
    types:
      - opened
      - edited
  pull_request_review:
    types:
      - submitted
      - edited
  pull_request_review_comment:
    types:
      - created
      - edited
jobs:
  test:
    name: Checking sentiments
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Check sentiment
        uses: derberg/code-of-conduct-sentiment-analysis-github-action@v1
        id: sentiments
      - name: Echo sentiment
        run: > 
          echo 'Sentiment: ${{steps.sentiments.outputs.sentiment}}'
          echo 'Source: ${{steps.sentiments.outputs.source}}'
          echo 'Negative words: ${{steps.sentiments.outputs.negative}}'
```

### Basic example using Google Natural Language API

Below you can find a basic example of how you can use the action with Google API. It analizes the sentiment and puts the information the the logs. Google API key should be stored in [GitHub secrets](https://docs.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets) under `GCP_KEY` name.

Google API is [not expensive](https://cloud.google.com/natural-language/pricing). It is free up to 5k requests, and 1$ up to 1m requests.

```yaml
name: 'Sentiment analysis'
on: 
  issue_comment:
    types: 
      - created
      - edited
  issues:
    types:
      - opened
      - edited
  pull_request:
    types:
      - opened
      - edited
  pull_request_review:
    types:
      - submitted
      - edited
  pull_request_review_comment:
    types:
      - created
      - edited
jobs:
  test:
    name: Checking sentiments
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Check sentiment
        uses: derberg/code-of-conduct-sentiment-analysis-github-action@v1
        id: sentiments
        with:
          # you can find an instruction on how to setup Google project with access to Natural Language API here https://github.com/BogDAAAMN/copy-sentiment-analysis#gcp_key-get-your-gcp-api-key
          gcp_key: ${{ secrets.GCP_KEY }} 
      - name: Echo sentiment
        run: > 
          echo 'Sentiment: ${{steps.sentiments.outputs.sentiment}}'
          echo 'Source: ${{steps.sentiments.outputs.source}}'
          echo 'Negative words: ${{steps.sentiments.outputs.negative}}'
```

### Example using Google API and Slack action

Below example shows how you can use this action with other actions. In this case it is a Slack action that you can use to send information about the sentiment to specific Slack channel.

```yaml
name: 'testing workflow'

on: 
  issue_comment:
    types: 
      - created
      - edited
  issues:
    types:
      - opened
      - edited
  pull_request:
    types:
      - opened
      - edited
  pull_request_review:
    types:
      - submitted
      - edited
  pull_request_review_comment:
    types:
      - created
      - edited
jobs:
  test:
    name: Checking sentiments
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Check sentiment
        uses: derberg/code-of-conduct-sentiment-analysis-github-action@v1
        id: sentiments
        with:
          # you can find an instruction on how to setup Google project with access to Natural Language API here https://github.com/BogDAAAMN/copy-sentiment-analysis#gcp_key-get-your-gcp-api-key
          gcp_key: ${{ secrets.GCP_KEY }} 
      - uses: someimportantcompany/github-actions-slack-message@v1
        # this step runs only if sentiment is a negative numner
        if: steps.sentiments.outputs.sentiment < 0
        with:
          # to get a webhook url of your channel use this documentation https://slack.com/intl/en-pl/help/articles/115005265063-Incoming-webhooks-for-Slack
          # first register new app here (https://api.slack.com/apps
          webhook-url: ${{ secrets.SLACK_WEBHOOK_URL }}
          text: Here ${{steps.sentiments.outputs.source}} you can find a potential negative text that requires your attention as the sentiment analysis score is ${{steps.sentiments.outputs.sentiment}}
          color: orange
```

## Troubleshooting

You can enable more log information in GitHub Action by adding `ACTIONS_STEP_DEBUG` secret to repository where you want to use this action. Set the value of this secret to `true` and you'll notice more debug logs from this action.

## Development

1. Produce action distribution `npm run package`
2. Run the action against a sample event:
```bash
# good sentiment
GITHUB_EVENT_PATH=../test/sampleIssueEvent.json GITHUB_EVENT_NAME=issues npm run start
# higher than 0.2 so close to being negative
GITHUB_EVENT_PATH=../test/samplePullRequestEventNegative.json GITHUB_EVENT_NAME=pull_request npm run start
```