#  api-queue-k8s-demo

This project is a simple REST api publishing a message on a queue. The main endpoint is `/publish`. Here is an example payload:

```
{
	"ts": "1530228282",
	"sender": "testy-test-service",
	"message": {
		"foo": "bar",
		"baz": "bang"
	},
	"sent-from-ip": "1.2.3.4",
	"priority": 2
}

```

The validation rules are:
* `ts` must be present and a valid Unix timestamp
* `sender` must be present and a string
* `message` must be present, a JSON object, and have at least one field set
* If present, `sent-from-ip` must be a valid IPv4 address
* `priority` is optional and should be a number

All fields not listed in the example above are invalid, and should result in the message being rejected.


## Dev setup

This project has been tested in NodeJS 12.20.

To setup the project locally, run
```
npm ci
npm run start
```
This will start both a Redis instance and the node api in parallel.
The api will be accessible on http://localhost:3000/publish


### Unit tests
To run the unit tests:
```
npm run test
```

### E2E tests

The e2e tests are running inside docker. The following command will build a docker image, start a container using that
image and a redis container, and run a test suite on the running api.

To launch the e2e:
```
npm run test:e2e
```

## Docker
To run both the api and the redis instance in docker, you can simply use the provided docker-compose
```
docker-compose build
docker-compose up
```

The docker image for the API can be built using:
```
docker build . -t matdurand/api-queue-k8s-demo:1.0.0
```


## Kubernetes

To deploy the api to kubernetes, we need to:

* Create a namespace
* Deploy a Redis instance (using Helm)
* Deploy our backend

### Namespace

Let's create a namespace  for our project
```
kubectl create namespace api-queue
```

### Deploying Redis

It's easier to use Helm to deploy an instance of Redis that we will use as a message broker. We are using bitnami chart for this.
The persistence will not be enabled since it's a demo.

First step is to add the bitnami charts repository
```
helm repo add bitnami https://charts.bitnami.com/bitnami
```

Then we apply our secret
```
kubectl apply -f k8s/redis/redis-secret.yaml --namespace=api-queue
```

And we can deploy out redis cluster, using our provided config (k8s/redis/redis-config-values.yaml)
```
helm install api-queue-release bitnami/redis --values k8s/redis/redis-config-values.yaml --namespace=api-queue
```

### Deploying our backend api

We first need to build our docker image.
```
docker build . -t matdurand/api-queue-k8s-demo:1.0.0
docker push matdurand/api-queue-k8s-demo:1.0.0
```

Since the docker image is using my docker hub username, you won't be able to push the image. Just change the username everywhere, or push the image to a private registry visible to your kubernetes cluster.

Then, we can apply our kubernetes manifests:
```
kubectl apply -f ./k8s/api-queue --namespace=api-queue
```

### Testing the deployment
To test the deployment:
```
kubectl port-forward service/api-queue-svc 3000:80 --namespace=api-queue
```
and use Postman or Curl to send a payload at http://localhost:3000/publish



