const core = require('@actions/core');
const eventPayload = require(process.env.GITHUB_EVENT_PATH);
const eventName = process.env.GITHUB_EVENT_NAME;

async function run() {
  switch (eventName) {
  case 'issues':
    console.log('event payload', eventPayload);  
    break;
  case 'issue_comment':
    break;
  case 'pull_request':
    break;
  default:
    break;
  }
  
  //core.debug(eventName, eventPayload);
  core.setOutput('sentiment', 'TODO pass sentiment info here');
  core.setOutput('source', 'TODO pass link to the location where is the comment');
}
  
run();
