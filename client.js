const { OPCUAClient,
  MessageSecurityMode,
  SecurityPolicy,
  AttributeIds,
  makeBrowsePath,
  ClientSubscription,
  TimestampsToReturn,
  ClientMonitoredItem,
  ClientMonitoredItemGroup,
  DataType} = require("node-opcua");
const { isIndexedAccessTypeNode } = require("typescript");

const { seq_auth, updateTags } = require('./models/tag.js')

seq_auth()

const connectionStrategy = {
    initialDelay: 1000,
    maxRetry: 1
}

const options = {
    applicationName: "NodeOPCUA-Client",
    connectionStrategy: connectionStrategy,
    securityMode: MessageSecurityMode.None,
    securityPolicy: SecurityPolicy.None,
    endpointMustExist: false,
};
const client = OPCUAClient.create(options);
// const endpointUrl = "opc.tcp://opcuademo.sterfive.com:26543";
const endpointUrl = "opc.tcp://" + require("os").hostname() + ":4334/UA/MyLittleServer";

async function main() {
    try {
      // step 1 : connect to
      await client.connect(endpointUrl);
      console.log("connected !");
  
      // step 2 : createSession
      const session = await client.createSession();
      console.log("session created !");
  
      // // // step 3 : browse
      // const browseResult = await session.browse("RootFolder");

      // console.log("references of RootFolder :");
      // for (let reference of browseResult.references) {
      //   console.log( "   -> ", reference.browseName.toString());
      // }
  
      // // step 4 : read a variable with readVariableValue
      // const dataValue2 = await session.readVariableValue("ns=1;b=1020FFAA");
      // console.log(" value = " , dataValue2.toString());
  
      // step 4' : read a variable with read
    //   const maxAge = 0;
    //   const nodesToRead = {
    //     names: ['Counter', 'Static', 'FreeMem'],
    //     nodesToRead: [
    //     { nodeId: "ns=1;i=1", attributeId: AttributeIds.Value },
    //     { nodeId: "ns=1;i=2", attributeId: AttributeIds.Value },
    //     { nodeId: "ns=1;i=3", attributeId: AttributeIds.Value }
    //   ]
    // }
    //   // const nodeToRead = {
    //   // nodeId: "ns=1;i=2",
    //   // attributeId: AttributeIds.Value
    //   // }

    // setInterval(async () => {

    //   const dataValue =  await session.read(nodesToRead.nodesToRead, maxAge);
    //   console.log(" value " , dataValue)


    //   // // Write data to DB
    //   let writeToDB =  function(dataValue) {
    //     for (let k = 0; k < dataValue.length; k++) {
    //       // console.log(nodesToRead.nodesToRead[k].nodeId)
    //       let dataToDB_Read = {id: (k+1), name: (nodesToRead.names[k]), address: ('ns=' + nodesToRead.nodesToRead[k].nodeId.namespace + ',i=' + nodesToRead.nodesToRead[k].nodeId.value), value: dataValue[k].value.value, qualityText: dataValue[k].statusCode._name}
    //       // console.log(dataToDB_Read)
    //       updateTags(dataToDB_Read)
    //     }
    //   }
    //   await writeToDB(dataValue)
    // }, 2000)
      
      // step 4" : write variables

      // let nodesToWrite = [{
      //   nodeId: "ns=1;b=1020FFAA",
      //   attributeId: AttributeIds.Value,
      //   // indexRange: null,
      //   value: { 
      //       value: { 
      //           dataType: DataType.Double,
      //            value: 243
      //       }
      //   }
      // }];
      // let writeResult = await session.write(nodesToWrite);
      //   console.log(writeResult.toString());
  
      // step 5: install a subscription and install a monitored item for 10 seconds
      const subscription = ClientSubscription.create(session, {
        requestedPublishingInterval: 1000,
        requestedLifetimeCount:      100,
        requestedMaxKeepAliveCount:   10,
        maxNotificationsPerPublish:  100,
        publishingEnabled: true,
        priority: 10
    });
    
    subscription.on("started", function() {
        console.log("subscription started for 2 seconds - subscriptionId=", subscription.subscriptionId);
    }).on("keepalive", function() {
        console.log("keepalive");
    }).on("terminated", function() {
       console.log("terminated");
    });
    
    
    // install monitored item
    
    // const itemToMonitor = {
    //     nodeId: "ns=1;i=3",
    //     attributeId: AttributeIds.Value
    // }

    const itemsToMonitor = {
          names: ['Counter', 'Static', 'FreeMem'],
          itemsToMonitor: [
          { nodeId: "ns=1;i=1", attributeId: AttributeIds.Value },
          { nodeId: "ns=1;i=2", attributeId: AttributeIds.Value },
          { nodeId: "ns=1;i=3", attributeId: AttributeIds.Value }
        ]
      }


    const parameters = {
        samplingInterval: 100,
        discardOldest: true,
        queueSize: 10
    };
    
    const monitoredItems  = ClientMonitoredItemGroup.create(
        subscription,
        itemsToMonitor.itemsToMonitor,
        parameters,
        TimestampsToReturn.Both
    );
    
    monitoredItems.on("changed", (monitoredItem, dataValue, index) => {
      //  console.log(" value has changed : ", dataValue.value.toString())
      console.log("Changed on ", index ,  dataValue.value.value.toString())

      //  { id: 2, name: 'Static_Upd', address: 'ns=1;i=2', value: 222.90, qualityText: 'Bad' }

    let dataToDB = {id: (index+1), name: (itemsToMonitor.names[index]), address: ('ns=' + itemsToMonitor.itemsToMonitor[index].nodeId.namespace + ',i=' + itemsToMonitor.itemsToMonitor[index].nodeId.value), value: dataValue.value.value, qualityText: dataValue.statusCode._name}  
    // console.log(dataToDB)
    updateTags(dataToDB)
    });
    
    
    
    async function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    await timeout(40000);
    
    console.log("now terminating subscription");
    await subscription.terminate();
  
      // // step 6: finding the nodeId of a node by Browse name
      // const browsePath = makeBrowsePath("RootFolder", "/Objects/1:MyDevice.1:Static");
    
      // const result = await session.translateBrowsePath(browsePath);
      // console.log(result);
    
    // const productNameNodeId = result.targets[0].targetId;
    // console.log(" Product Name nodeId = ", productNameNodeId.toString());
  
      // close session
      await session.close();
  
      // disconnecting
      await client.disconnect();
      console.log("done !");
    } catch(err) {
      console.log("An error has occured : ",err);
      }
}

main()

module.exports = main;