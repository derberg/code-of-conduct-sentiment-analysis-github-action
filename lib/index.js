const core = require('@actions/core');
const eventPayload = require(process.env.GITHUB_EVENT_PATH);
const eventName = process.env.GITHUB_EVENT_NAME;

async function run() {
  switch (eventName) {
  case 'issues':
    const content = eventPayload.issue.body;
    console.log(content);  
    break;
  case 'issue_comment':
    console.log(eventPayload);  
    break;
  case 'pull_request':
    console.log(eventPayload);  
    break;
  case 'pull_request_review':
    console.log(eventPayload);  
    break;
  case 'pull_request_review_comment':
    console.log(eventPayload);  
    break;
  default:
    break;
  }
  
  //core.debug(eventName, eventPayload);
  core.setOutput('sentiment', 'TODO pass sentiment info here');
  core.setOutput('source', 'TODO pass link to the location where is the comment');
}
  
run();
