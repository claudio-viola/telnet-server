#Runs a telnet chat server

# Requirements
- node >= 10.16.3
- typescript >= 3.8



# Installation
```
npm install
```

```
cp .env.example .env
```

# Lint project
```
npm run lint
```

# Build project
```
npm run build
```


# Run Unit Tests
```
npm run test:Unit
```

View unit tests coverage
```
open coverage_unit/index.html
```

# Run Integration Tests
```
npm run test:integration
```

View integration tests coverage
```
open coverage_integration/index.html
```


# Development run

```
npm run start:dev
```

# Production run
```
npm run build
```

```
npm run start
```


# Docker run
Build the docker image
```
docker build  -f ./Dockerfile . -t telnet```
```
Run the  docker image
```
docker run -p 10000:10000 telnet
```
