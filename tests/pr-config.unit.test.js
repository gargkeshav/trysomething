const config = require ('../src/pr/config')

test("should have all config attributes", () => {
    expect(config).toHaveProperty('defaultRepo')
    expect(config).toHaveProperty('searchApiEndpoint')
    expect(config).toHaveProperty('pullApiEndpoint')
    expect(config).toHaveProperty('mergePendingState')
    expect(config).toHaveProperty('mergePendingQuery')
    expect(config).toHaveProperty('statusFailingState')
    expect(config).toHaveProperty('statusFailingQuery')
    expect(config).toHaveProperty('statusPendingState')
    expect(config).toHaveProperty('statusPendingQuery')
    expect(config).toHaveProperty('reviewPendingState')
    expect(config).toHaveProperty('reviewPendingQuery')
    expect(config).toHaveProperty('reviewInProgressState')
    expect(config).toHaveProperty('getAllOpenPRQuery')
});