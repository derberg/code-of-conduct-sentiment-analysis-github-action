# Code of Conduct Compliance Through Sentiments Analysis

Use this action to analyze sentiments in issues and pull request to identify emotions that need to be checked against the Code of Conduct

//TODO

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