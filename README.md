opcua-client
==========

Test application. It connects to opcua-server, get some data, send them to MySQL DB and publish to MQTT broker RabbitMQ. 

[![OPC UA](https://b.repl.ca/v1/OPC-UA-blue.png)](https://opcfoundation.org/)

## Getting started

### installing opcua-client

    $ https://github.com/inkerinmaa/opcclient.git
    $ cd cd opcclient
    $ npm init S
    $ npm i
    $ # configure db.config.js - you need to fill in db credentials and MQTT BrokerS
    $ npm run start 
    $ or docker-compose -f docker-compose.yml up -d --build
