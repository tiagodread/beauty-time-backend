# Backend


## Requirements

- Docker 
- docker-compose
- mailtrap (connected via githubaccount)

## Install

1. Clone this repo
```shell
git clone git@github.com:tiagodread/backend.git
```
2. Go to the project's folder
```shell
cd backend
```
3. Build
```shell
docker-compose build
```
4. Run
```shell
docker-compose up
```

## Testing

```
curl --request GET \
  --url http://localhost:3000/health \
  --header 'content-type: application/json'
```

Response:
```shell
{
  status: "OK"
}
```
