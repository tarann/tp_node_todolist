FROM node:7.7.1-alpine

RUN apk update

RUN apk add git curl python g++ make 

RUN git clone https://github.com/tarann/tp_node_todolist 

WORKDIR /tp_node_todolist

RUN cd /tp_node_todolist && npm install

EXPOSE 8080

CMD ["node", "app.js"] 
