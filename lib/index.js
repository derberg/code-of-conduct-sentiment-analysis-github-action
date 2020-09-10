const core = require('@actions/core');
const eventPayload = require(process.env.GITHUB_EVENT_PATH);
const eventName = process.env.GITHUB_EVENT_NAME;
const Sentiment = require('sentiment');
const sentiment = new Sentiment();

let content, url, result;

//todo always check if null or not and analyze not null only

async function run() {
  switch (eventName) {
  case 'issues':
    content = eventPayload.issue.body;
    url = eventPayload.issue.html_url;
    result = analyzeSentiments(content);

    break;
  case 'issue_comment':
  case 'pull_request_review_comment':
    content = eventPayload.comment.body;
    url = eventPayload.comment.html_url;
    result = analyzeSentiments(content);
    break;
  case 'pull_request':
    content = eventPayload.pull_request.body;
    url = eventPayload.pull_request.html_url;
    result = analyzeSentiments(content);
    break;
  case 'pull_request_review':
    content = eventPayload.review.body;
    url = eventPayload.review.html_url;
    result = analyzeSentiments(content);
    break;
  default:
    break;
  }
  
  core.setOutput('source', url);
  core.setOutput('sentiment', result.score);
  core.setOutput('negative', result.negative);
}

function analyzeSentiments(content) {
  const { comparative: score, negative } = sentiment.analyze(content);
  return { score, negative: negative.join(', ') };
}

run();
