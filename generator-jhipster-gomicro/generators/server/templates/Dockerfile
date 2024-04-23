FROM golang:1.20-alpine AS build-env

<%_ if (postgresql||mongodb){  _%>
RUN apk add --no-cache protobuf
<%_ } _%>

WORKDIR /app

COPY . .

WORKDIR /app/src

<%_ if (postgresql||mongodb){  _%>
RUN GO111MODULE=on \
    go get google.golang.org/protobuf/cmd/protoc-gen-go@v1.25.0 \
    google.golang.org/grpc/cmd/protoc-gen-go-grpc@v1.1.0

RUN go install google.golang.org/protobuf/cmd/protoc-gen-go

RUN mkdir -p /app/src/pb

ENV PATH=$PATH:/go/bin

RUN go get github.com/golang/protobuf/proto

RUN protoc --proto_path=proto --go_out=pb --go_opt=paths=source_relative proto/*.proto
<%_ } _%>

RUN go mod tidy && go mod download

RUN CGO_ENABLED=0 GOOS=linux go build -o <%= baseName %> .

FROM alpine:latest  

WORKDIR /app/

COPY ./ ./

COPY --from=build-env /app/src/<%= baseName %> /app/src/<%= baseName %> 

WORKDIR /app/src

EXPOSE <%= serverPort %>

CMD ["./<%= baseName %>"]

