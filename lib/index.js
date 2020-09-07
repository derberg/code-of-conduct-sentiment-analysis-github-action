const core = require('@actions/core');
const eventPayload = require(process.env.GITHUB_EVENT_PATH);
const eventName = process.env.GITHUB_EVENT_NAME;
let content, url;

//todo always check if null or not and analyze not null only

async function run() {
  switch (eventName) {
  case 'issues':
    content = eventPayload.issue.body;
    url = eventPayload.issue.html_url;
    console.log(content, url);  
    break;
  case 'issue_comment':
  case 'pull_request_review_comment':
    content = eventPayload.comment.body;
    url = eventPayload.comment.html_url;
    console.log(content, url);  
    break;
  case 'pull_request':
    content = eventPayload.pull_request.body;
    url = eventPayload.pull_request.html_url;
    console.log(content, url);  
    break;
  case 'pull_request_review':
    content = eventPayload.review.body;
    url = eventPayload.review.html_url;
    console.log(content, url);
    break;
  default:
    break;
  }
  
  //core.debug(eventName, eventPayload);
  core.setOutput('sentiment', 'TODO pass sentiment info here');
  core.setOutput('source', 'TODO pass link to the location where is the comment');
}
  
run();
