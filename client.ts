import { OPCUAClient,
   MessageSecurityMode,
   SecurityPolicy,
   AttributeIds,
   makeBrowsePath,
   ClientSubscription,
   TimestampsToReturn,
   MonitoringParametersOptions,
   ClientMonitoredItem,
   DataValue, 
   DataType} from "node-opcua";

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
  
      // step 3 : browse
      // const browseResult = await session.browse("RootFolder");

      // console.log("references of RootFolder :");
      // for (let reference of browseResult.references!) {
      //   console.log( "   -> ", reference.browseName.toString());
      // }
  
      // step 4 : read a variable with readVariableValue
      // const dataValue2 = await session.readVariableValue("ns=1;i=1001");
      // console.log(" value = " , dataValue2.toString());
  
      // step 4' : read a variable with read
      const maxAge = 0;
      const nodeToRead = {
      nodeId: "ns=1;b=1020FFAA",
      attributeId: AttributeIds.Value
      };
      const dataValue =  await session.read(nodeToRead, maxAge);
      console.log(" value " , dataValue.value.value.toString());

      // step 4" : write variables

      let nodesToWrite = [{
        nodeId: "ns=1;b=1020FFAA",
        attributeId: AttributeIds.Value,
        // indexRange: null,
        value: { 
            value: { 
                dataType: DataType.Double,
                 value: 34
            }
        }
      }];
      let writeResult = await session.write(nodesToWrite);
        console.log(writeResult.toString());
  
      // step 5: install a subscription and install a monitored item for 10 seconds
    //   const subscription = ClientSubscription.create(session, {
    //     requestedPublishingInterval: 1000,
    //     requestedLifetimeCount:      100,
    //     requestedMaxKeepAliveCount:   10,
    //     maxNotificationsPerPublish:  100,
    //     publishingEnabled: true,
    //     priority: 10
    // });
    
    // subscription.on("started", function() {
    //     console.log("subscription started for 2 seconds - subscriptionId=", subscription.subscriptionId);
    // }).on("keepalive", function() {
    //     console.log("keepalive");
    // }).on("terminated", function() {
    //    console.log("terminated");
    // });
    
    
    // // install monitored item
    
    // const itemToMonitor = {
    //     nodeId: "ns=1;i=1001",
    //     attributeId: AttributeIds.Value
    // };
    // const parameters: MonitoringParametersOptions = {
    //     samplingInterval: 100,
    //     discardOldest: true,
    //     queueSize: 10
    // };
    
    // const monitoredItem  = ClientMonitoredItem.create(
    //     subscription,
    //     itemToMonitor,
    //     parameters,
    //     TimestampsToReturn.Both
    // );
    
    // monitoredItem.on("changed", (dataValue: DataValue) => {
    //    console.log(" value has changed : ", dataValue.value.toString());
    // });
    
    
    
    // async function timeout(ms: number) {
    //     return new Promise(resolve => setTimeout(resolve, ms));
    // }
    // await timeout(10000);
    
    // console.log("now terminating subscription");
    // await subscription.terminate();
  
      // step 6: finding the nodeId of a node by Browse name
      // const browsePath = makeBrowsePath("RootFolder", "/Objects/1:MyDevice.1:MyVariable1");
    
      // const result = await session.translateBrowsePath(browsePath);
      // console.log(result);
    // const productNameNodeId = result.targets[1].targetId;
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

main();