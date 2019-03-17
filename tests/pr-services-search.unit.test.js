const { axios   } = require('axios');
const { 
    filterReviewInProgress,
    makeGetCall

} = require('../src/pr/services/pr-search');



test("should filter out PRs without assigned reviewers", () => {
    var results = filterReviewInProgress(
        [
            {
                number: 1,
                requested_reviewers: ['abcd'],
                requested_teams:    ['team']
            },
            {
                number: 2,
                requested_reviewers: [],
                requested_teams:    ['team']
            },
            {
                number: 3,
                requested_reviewers: ['abcd'],
                requested_teams:    []
            },
            {
                number: 4,
                requested_reviewers: [],
                requested_teams:    []
            },
            
        ]
    );
    expect(results).not.toBeNull();
    // expect(typeof results).toBe("array");
    expect(results).toEqual([1,2,3]);
});



test("should make get API call to correct URL", async () => {

    axios.mockImplementationOnce(() => Promise.resolve({"data": true}));
    var results = await makeGetCall('abcd', 'auth');
    expect(axios).toHaveBeenCalled();
});