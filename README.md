# Project description

Project contains a JavaScript REST API which communicates with GitHub API and returns the current state of open PR's assuming the following workflow:

- REVIEWER_PENDING (PR created and reviewer is not assigned)
  - PR state is open, review is none and requested_reviewers && requested_teams arrays are empty
- REVIEW_IN_PROGRESS (Reviewer is assigned and PR is not yet approved)
  - PR state is open, review is none and requested_reviewers || requested_teams arrays is populated
- STATUS_CHECK_PENDING (PR is approved and status checks are not reported)
  - PR state is open, status is pending and review is approved
- FAILING (Status checks are failing for the PR)
  - PR state is open, status is Failing and PR approval status is not checked
- MERGE_PENDING (PR is approved and status checks have passed)
  - PR state is open, status is success and review is approved

GET /api/v1/pr endpoint returns the open PR states as json:

```json
{
  prs: [
    {
      "id": 1,
      "state": "REVIEWER_PENDING"
    },
    {
      "id": 2,
      "state": "FAILING"
    }
  ]
}
```

The API server has been implemented :-

- **Authorization** : By default Authorization is sent as "null" to GitHub API server. Github limits the number of requests made without Authentication. For limits please refer to GitHub API's limits.
  This can be overridden by passing an Authorization header with GET request. The API server currently doesn't validate Authorization header and will use the same header for subsequent GitHub API calls.
- **Repo** : By default **twbs/bootstrap** repository is configured. This can be overridden by passing a **repo** header and value.
- The current API server return details of all the open PR and respective status for given repository.


# Monitoring
Project also exposes health metrics in prometheus format in GET /metrics. 

- request_latency_seconds_count
- request_latency_seconds_sum
- request_count
- Status codes of http requests

Prometheus's rate function allows calculation of both requests per second, and latency over time from this data.

# Packaging
The final solution includes Dockerfile as well as a helm chart for kubernetes deployment. The helm chart also pass linter checks and be written in accordance to helm's best practices.

Docker Image is already pushed to dockerhub repo kshavgarg/pr-status-app. Image name and version can be found in helm values.yaml

# How to Run

```kubectl create namespace prstatus```

```helm install -n prstatus ./pr-status-app```

# How to check

kubectl port-forward "pod" 5000:5000

go to http://localhost:5000/ for pr status and http://localhost:5000/metrics for prometheus exposed metrics
