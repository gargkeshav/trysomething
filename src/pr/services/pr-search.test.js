const axios = require('axios');

jest.mock('axios');

const {
  filterReviewInProgress,
  getPRState,
  makeGetCall,
  scrapPullApi,
  scrapSearchApi
} = require('./pr-search');

describe('filterReviewInProgress Test', () => {
  const mockReq = [
    {
      number: 1,
      requested_reviewers: ['abcd'],
      requested_teams: ['team']
    },
    {
      number: 2,
      requested_reviewers: [],
      requested_teams: ['team']
    },
    {
      number: 3,
      requested_reviewers: ['abcd'],
      requested_teams: []
    },
    {
      number: 4,
      requested_reviewers: [],
      requested_teams: []
    }
  ];

  const mockResponse = [1, 2, 3];

  test('Should return the correct response', () => {
    const result = filterReviewInProgress(mockReq);

    expect(result).not.toBeNull();
    expect(result).toEqual(mockResponse);
  });
});

describe('makeGetCall test', () => {
  test('makeGetCall', async () => {
    axios.mockImplementationOnce(() => Promise.resolve({ data: true }));
    var results = await makeGetCall('abcd', 'auth');
    expect(axios).toHaveBeenCalled();
    expect(results).toEqual({ data: true });
  });
});

describe('scrapPullApi call test', () => {
  const mockGetCallResponse = {
    response1: {
      data: {
        total_count: 2,
        incomplete_results: false,
        items: [
          {
            url: 'https://api.github.com/repos/torvalds/linux/pulls/636',
            id: 241448926,
            number: 636,
            state: 'open',
            title: 'Create CODE_OF_CONDUCT.md',
            merge_commit_sha: '8aeb8258a8484836e4753067b6a50a44e92b61a0',
            assignee: null,
            assignees: [],
            requested_reviewers: [],
            requested_teams: [],
            labels: []
          }
        ]
      }
    },
    response2: {
      data: {
        total_count: 2,
        incomplete_results: false,
        items: [
          {
            url: 'https://api.github.com/repos/torvalds/linux/pulls/636',
            id: 241448926,
            number: 636,
            state: 'open',
            title: 'Create CODE_OF_CONDUCT.md',
            merge_commit_sha: '8aeb8258a8484836e4753067b6a50a44e92b61a0',
            assignee: null,
            assignees: [],
            requested_reviewers: [],
            requested_teams: [],
            labels: []
          }
        ]
      }
    },
    response3: {
      data: {
        total_count: 2,
        incomplete_results: false,
        items: []
      }
    }
  };

  const mockResponse = [
    {
      url: 'https://api.github.com/repos/twbs/bootstrap/issues/28487',
      repository_url: 'https://api.github.com/repos/twbs/bootstrap',
      labels_url:
        'https://api.github.com/repos/twbs/bootstrap/issues/28487/labels{/name}',
      comments_url:
        'https://api.github.com/repos/twbs/bootstrap/issues/28487/comments',
      events_url:
        'https://api.github.com/repos/twbs/bootstrap/issues/28487/events',
      html_url: 'https://github.com/twbs/bootstrap/pull/28487',
      id: 420785838,
      node_id: 'MDExOlB1bGxSZXF1ZXN0MjYwOTkwNjM4',
      number: 28487,
      title: 'Tweak our docs headers for proper document outline.',
      user: {
        login: 'XhmikosR',
        id: 349621,
        node_id: 'MDQ6VXNlcjM0OTYyMQ==',
        avatar_url: 'https://avatars2.githubusercontent.com/u/349621?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/XhmikosR',
        html_url: 'https://github.com/XhmikosR',
        followers_url: 'https://api.github.com/users/XhmikosR/followers',
        following_url:
          'https://api.github.com/users/XhmikosR/following{/other_user}',
        gists_url: 'https://api.github.com/users/XhmikosR/gists{/gist_id}',
        starred_url:
          'https://api.github.com/users/XhmikosR/starred{/owner}{/repo}',
        subscriptions_url:
          'https://api.github.com/users/XhmikosR/subscriptions',
        organizations_url: 'https://api.github.com/users/XhmikosR/orgs',
        repos_url: 'https://api.github.com/users/XhmikosR/repos',
        events_url: 'https://api.github.com/users/XhmikosR/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/XhmikosR/received_events',
        type: 'User',
        site_admin: false
      },
      labels: [
        {
          id: 144484759,
          node_id: 'MDU6TGFiZWwxNDQ0ODQ3NTk=',
          url:
            'https://api.github.com/repos/twbs/bootstrap/labels/accessibility',
          name: 'accessibility',
          color: 'bfd4f2',
          default: false
        },
        {
          id: 143597,
          node_id: 'MDU6TGFiZWwxNDM1OTc=',
          url: 'https://api.github.com/repos/twbs/bootstrap/labels/docs',
          name: 'docs',
          color: '007bff',
          default: false
        },
        {
          id: 1069712305,
          node_id: 'MDU6TGFiZWwxMDY5NzEyMzA1',
          url: 'https://api.github.com/repos/twbs/bootstrap/labels/v5',
          name: 'v5',
          color: '103987',
          default: false
        }
      ],
      state: 'open',
      locked: false,
      assignee: null,
      assignees: [],
      milestone: null,
      comments: 3,
      created_at: '2019-03-14T01:02:40Z',
      updated_at: '2019-03-14T19:49:44Z',
      closed_at: null,
      author_association: 'MEMBER',
      pull_request: {
        url: 'https://api.github.com/repos/twbs/bootstrap/pulls/28487',
        html_url: 'https://github.com/twbs/bootstrap/pull/28487',
        diff_url: 'https://github.com/twbs/bootstrap/pull/28487.diff',
        patch_url: 'https://github.com/twbs/bootstrap/pull/28487.patch'
      },
      body:
        "~~I need to go through the whole docs again after the Hugo switch to make sure I haven't missed anything.~~\r\n\r\nApart from this, I'm not sure if we should use the header classes (.h5, .h4) or not.",
      score: 1
    },
    {
      url: 'https://api.github.com/repos/twbs/bootstrap/issues/28275',
      repository_url: 'https://api.github.com/repos/twbs/bootstrap',
      labels_url:
        'https://api.github.com/repos/twbs/bootstrap/issues/28275/labels{/name}',
      comments_url:
        'https://api.github.com/repos/twbs/bootstrap/issues/28275/comments',
      events_url:
        'https://api.github.com/repos/twbs/bootstrap/issues/28275/events',
      html_url: 'https://github.com/twbs/bootstrap/pull/28275',
      id: 410581353,
      node_id: 'MDExOlB1bGxSZXF1ZXN0MjUzMjkxODQ4',
      number: 28275,
      title: "Workaround for MS Edge does not update  disabled control's style",
      user: {
        login: 'ysds',
        id: 4065765,
        node_id: 'MDQ6VXNlcjQwNjU3NjU=',
        avatar_url: 'https://avatars0.githubusercontent.com/u/4065765?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/ysds',
        html_url: 'https://github.com/ysds',
        followers_url: 'https://api.github.com/users/ysds/followers',
        following_url:
          'https://api.github.com/users/ysds/following{/other_user}',
        gists_url: 'https://api.github.com/users/ysds/gists{/gist_id}',
        starred_url: 'https://api.github.com/users/ysds/starred{/owner}{/repo}',
        subscriptions_url: 'https://api.github.com/users/ysds/subscriptions',
        organizations_url: 'https://api.github.com/users/ysds/orgs',
        repos_url: 'https://api.github.com/users/ysds/repos',
        events_url: 'https://api.github.com/users/ysds/events{/privacy}',
        received_events_url:
          'https://api.github.com/users/ysds/received_events',
        type: 'User',
        site_admin: false
      },
      labels: [
        {
          id: 1239236697,
          node_id: 'MDU6TGFiZWwxMjM5MjM2Njk3',
          url:
            'https://api.github.com/repos/twbs/bootstrap/labels/backport-to-v4',
          name: 'backport-to-v4',
          color: 'dd4d57',
          default: false
        },
        {
          id: 210556,
          node_id: 'MDU6TGFiZWwyMTA1NTY=',
          url: 'https://api.github.com/repos/twbs/bootstrap/labels/css',
          name: 'css',
          color: '563d7c',
          default: false
        },
        {
          id: 250176882,
          node_id: 'MDU6TGFiZWwyNTAxNzY4ODI=',
          url: 'https://api.github.com/repos/twbs/bootstrap/labels/v4',
          name: 'v4',
          color: '563d7c',
          default: false
        },
        {
          id: 1069712305,
          node_id: 'MDU6TGFiZWwxMDY5NzEyMzA1',
          url: 'https://api.github.com/repos/twbs/bootstrap/labels/v5',
          name: 'v5',
          color: '103987',
          default: false
        }
      ],
      state: 'open',
      locked: false,
      assignee: null,
      assignees: [],
      milestone: null,
      comments: 4,
      created_at: '2019-02-15T02:48:28Z',
      updated_at: '2019-03-14T17:06:57Z',
      closed_at: null,
      author_association: 'CONTRIBUTOR',
      pull_request: {
        url: 'https://api.github.com/repos/twbs/bootstrap/pulls/28275',
        html_url: 'https://github.com/twbs/bootstrap/pull/28275',
        diff_url: 'https://github.com/twbs/bootstrap/pull/28275.diff',
        patch_url: 'https://github.com/twbs/bootstrap/pull/28275.patch'
      },
      body:
        'Fixes #28247 \r\n\r\nBefore: https://codepen.io/anon/pen/VgEmwV\r\nAfter: https://codepen.io/anon/pen/PVyGLv\r\n\r\nThis PR targets the components of the Bootstrap. However, if bootstrap team prefer to fix every situation, it can also add the following CSS to the `_reboot.scss`.\r\n```scss\r\n[disabled] ~ _ {}\r\n```',
      score: 1
    }
  ];

  let makeGetCall = jest.fn();
  const maxPerPage = 1;

  makeGetCall
    .mockReturnValueOnce(Promise.resolve(mockGetCallResponse.response1))
    .mockReturnValueOnce(Promise.resolve(mockGetCallResponse.response2))
    .mockReturnValueOnce(Promise.resolve(mockGetCallResponse.response3));

  test('scrapPullApi', async () => {
    const res1 = await makeGetCall();
    const res2 = await makeGetCall();
    const res3 = await makeGetCall();
    const result = await scrapSearchApi('state=open', null, 'api end point');

    expect(res3).toEqual(2);
  });
});
