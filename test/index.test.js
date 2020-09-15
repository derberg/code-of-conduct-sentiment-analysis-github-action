const { processingEvent } = require('../lib/index');

describe('processingEvent()', () => {
  it('analyzis should log proper message to user that only given events are supported', async () => {
    console.log = jest.fn();
    await processingEvent('newuser', {});
    expect(console.log).toHaveBeenCalledWith('Only the following events are supported by the action: issues, issue_comment, pull_request_review_comment, pull_request, pull_request_review');
  });
});

