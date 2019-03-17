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

# API Details and Configurations

- **Authorization** : By default Authorization is sent as "null" to GitHub API server. Github limits the number of requests made without Authentication. For limits please refer to GitHub API's limits.
  This can be overridden by passing an Authorization header with GET request. The API server currently doesn't validate Authorization header and will use the same header for subsequent GitHub API calls.
- **Repo** : By default **twbs/bootstrap** repository is configured. This can be overridden by passing a **repo** header and value. The current API server return details of all the open PR and respective status for given repository.
- **MAX_PER_PAGE** : By default the API server sets the per_page=100 parameter while querying the GitHub API which is the current max limit set by GitHub. This can however be changed by setting an environment variable MAX_PER_PAGE.

# Monitoring
Project also exposes health metrics in prometheus format for monitoring for but not limited to the following metrics:
- Average no of req/s per 1 second
- Average request latency
- Status codes of http requests

This project supports 2 approaches to enable this functionality but favors the approach 2.
### Approach 1 :-
- Creating custom metrics in API server using prom-cient library and collecting data for respective metrics.
- The metrics are exposed in prometheus format and available over /metrics endpoint.
- But the module has been commented out and metrics disabled in lieu of approach 2.

### Approach 2:-
- This approach uses the built in monitoring functionality offered by nginx-ingress controller which is used as an Ingress controller for this project.
- Nginx Ingress collects and exposes the health metrics in prometheus format by default which can be queried to derive the required information.
- This takes away the extra weight lifting from the API server to collect and expose the required health checks.
- If Prometeus is present in the same cluster it can auto discover the endpoints for scraping health metrics.
- Or else we can create a service for monitoring which can be exposed over an HTTP endpoint. (Refer to "How to Run" section for steps required to enable)
- In case of multiple replicas of Ingress controller, we can deploy a controller which can collect, aggregate, label and expose the required metrics.

## Metrics Supported 

Name  |   Query
---   |   ---
Throughput (req/sec)  |   sum(label_replace(rate(nginx_ingress_controller_requests{namespace=”%{kube_namespace}”,ingress=~”.%{ci_environment_slug}.”}[2m]), “status_code”, “${1}xx”, “status”, “(.)..”)) by (status_code)
Latency (sec)  |   sum(rate(nginx_ingress_controller_ingress_upstream_latency_seconds_sum{namespace=”%{kube_namespace}”,ingress=~”.%{ci_environment_slug}.”}[2m])) / sum(rate(nginx_ingress_controller_ingress_upstream_latency_seconds_count{namespace=”%{kube_namespace}”,ingress=~”.%{ci_environment_slug}.”}[2m]))
Status Code   |   sum(label_replace(count(nginx_ingress_controller_requests{namespace=”%{kube_namespace}”,ingress=~”.%{ci_environment_slug}.”}[2m]), “status_code”, “${1}xx”, “status”, “(.)..”)) by (status_code)

# Packaging
#### Dockerfile
Included in the project uses node 10 Alpine image as base image to build. A built docker Image is already pushed to dockerhub repo kshavgarg/pr-status-app. Image name and version can be found in helm values.yaml
#### HELM
Helm chart is also available under Helm directory. The chart "pr-status-app" can be used to deploy the application in kubernetes cluster. Additional/Optional yaml files are also present in Helm directory which can be used to create a service to expose nginx-ingress controller default metrics over an HTTP endpoint using an Ingress resource.

# How to Run

#### Pre Requisite
- Setup Kubernetes cluster
- Setup kubectl, helm, tiller
- Setup nginx-ingress controller or change the ingress annotation in Values.yaml file in Helm chart.
- If you want to deploy in new/specific namespace or can deploy in default. Go to ./helm directory


```kubectl create namespace prstatus```

```helm install -n prstatus ./pr-status-app```

#### To expose nginx ingress controller metrics
Go to ./helm/monitor-ingress directory

Must apply in the same namespace of ingress controller.

```kubectl apply -n ingress-nginx -f ./service.yaml```

```kubectl apply -n ingress-nginx -f ./ingress.yaml```

# How to check

Get the External endpoint or LB endpoint and Go to http://${EXTERNAL_ENDPOINT}/api/v1/pr for PR status and http://${EXTERNAL_ENDPOINT}/metrics for prometheus metrics if exposed.

A live instance of this project is currently available on public cloud via "http://35.189.14.9/api/v1/pr" endpoint and the metrics can be scraped via "http://35.189.14.9/metrics" endpoint. ** Not sure how long it'll be running.
