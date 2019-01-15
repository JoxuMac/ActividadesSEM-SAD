var zmq = require('zmq')
var publisher = zmq.socket('pub')

publisher.bind('tcp://*:5563', function(err) {
  if(err)
    console.log(err)
  else
    console.log('Listening on 5563…')
})

setInterval(function() {
  publisher.send(["A", "We do not want to see this"]);
  publisher.send("B", zmq.ZMQ_SNDMORE);
  publisher.send("We would like to see this");
},1000);