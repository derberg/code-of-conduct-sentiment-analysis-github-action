const core = require('@actions/core');
const axios = require('axios');
const Sentiment = require('sentiment');
const eventPayload = require(process.env.GITHUB_EVENT_PATH);
const eventName = process.env.GITHUB_EVENT_NAME;
const sentiment = new Sentiment();
module.exports = { processingEvent };

async function run() {
  let url, result;

  try {
    [url, result] = await processingEvent(eventName, eventPayload);
  } catch (e) {
    console.log(e);
  }
  
  if (!result) return null;
  core.setOutput('source', url);
  core.setOutput('sentiment', result.score);
  if (result.negative) core.setOutput('negative', result.negative);
}

async function processingEvent(eventName, eventPayload) {
  let content, url, result;
  const gcp_key = process.env.GCP_KEY || core.getInput('gcp_key');

  switch (eventName) {
  case 'issues':
    content = eventPayload.issue.body;
    url = eventPayload.issue.html_url;
    result = content && await analyzeSentiments(content, gcp_key);
  
    break;
  case 'issue_comment':
  case 'pull_request_review_comment':
    content = eventPayload.comment.body;
    url = eventPayload.comment.html_url;
    result = content && await analyzeSentiments(content, gcp_key);
    break;
  case 'pull_request':
    content = eventPayload.pull_request.body;
    url = eventPayload.pull_request.html_url;
    result = content && await analyzeSentiments(content, gcp_key);
    break;
  case 'pull_request_review':
    content = eventPayload.review.body;
    url = eventPayload.review.html_url;
    result = content && await analyzeSentiments(content, gcp_key);
    break;
  default:
    console.log('Only the following events are supported by the action: issues, issue_comment, pull_request_review_comment, pull_request, pull_request_review');
  }

  return [url, result];
}

/**
 * Triggers proper analyze funcion depending if GCP_KEY is provided or not
 * @private
 * 
 * @param  {String} content Content that must be checked for the sentiment
 * @param  {String} key GCP API key
 */
async function analyzeSentiments(content, key) {
  if (key) 
    return await analyzeSentimentsOnGCP(content, key); 
  return analyzeSentimentsAFINN165(content);
}

/**
 * Calls sentiment package from NPM to do basic sentiment analytics
 * @private
 * 
 * @param  {String} content Content that must be checked for the sentiment
 * @param  {String} key GCP API key
 * @returns {Object} object with score and negative parameters
 */
function analyzeSentimentsAFINN165(content) {
  const result = sentiment.analyze(content);
  core.debug(`Full sentiment library evaluation result: ${ result }`);
  return { score: result.comparative, negative: result.negative.join(', ') };
}

/**
 * Calls GCP's Analyze Sentiment API 
 * @private
 * 
 * @param  {String} content Content that must be checked for the sentiment
 * @param  {String} key GCP API key
 * @returns {Object} object with score parameter
 */
async function analyzeSentimentsOnGCP(content, key) {
  let res;

  const request = {
    method: 'post',
    url: `https://language.googleapis.com/v1/documents:analyzeSentiment?key=${ key }`,
    headers: { 
      'Content-Type': 'application/json; charset=utf-8'
    },
    data: { 
      encodingType: 'UTF8', 
      document: {
        type: 'PLAIN_TEXT',
        content
      }
    }
  };
  
  try {
    res = await axios(request);
  } catch (e) {
    throw new Error(e.response.status === 400 ? 'Please provide a correct API key in GitHub Repository Secrets with key GCP_KEY' : e.message);
  }

  core.debug(`Full GCP response: ${ JSON.stringify(res.data) }`);
  return { score: res.data.documentSentiment.score };
};

run();
