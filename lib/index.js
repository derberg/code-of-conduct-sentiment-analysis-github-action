const core = require('@actions/core');
const eventPayload = require(process.env.GITHUB_EVENT_PATH);
const eventName = require(process.env.GITHUB_EVENT_NAME);

async function run() {
  core.debug(eventName, eventPayload);
  core.setOutput('sentiment', 'TODO pass sentiment info here');
  core.setOutput('source', 'TODO pass link to the location where is the comment');
}
  
run();
