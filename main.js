var ari = require('ari-client');
require('dotenv').config();

ari.connect(process.env.ARI_URL, process.env.ARI_USER, process.env.ARI_PASS, clientLoaded);

function clientLoaded(err, client) {
    console.log('clientLoaded Start');
    if (err) {
        console.error('clientLoadedError', err);
        return;
    }
    function hangup(channel) {
      try {
        channel.hangup(function (err) {
          channel = null;
          if (err) {
            console.error('channel hangup: ', err);
          }
        });
      } catch (e) {
        console.error('hangup: ', e);
      }
    }

    function stasisStart(event, channelWithUser) {
        console.log("channelWithUser",channelWithUser);
        if (channelWithUser.dialplan.context != process.env.CHANNEL) {
            return;
        }
        
        var phoneFrom = channelWithUser.caller.number;
        var imei = process.env.CHANNEL.split('-')[2];
        console.log('\n ================== inboundfrom: phone %s to imei %s', phoneFrom, imei);


        var bridge;
        var channelWithUser;
        var channelWithJanus;

        function closeAllChannel() {
            hangup(channelWithUser);
            hangup(channelWithJanus);
            try{
              bridge.destroy(
                {bridgeId: val},
                function (err) {}
              );
            } catch (e) {
              console.error('hangup: ', e);
            }
            client.removeListener('ChannelStateChange', channelStateChange);
            client.removeListener('StasisEnd', stasisEnd);
          }
          client.on('ChannelStateChange', channelStateChange);
          function channelStateChange(event, channel) {
            console.log('ChannelStateChange %s, %s', channel.name, channel.state);
          }
      
          client.on('StasisEnd', stasisEnd);
          function stasisEnd(event, channel) {
            console.log('StasisEnd %s', channel.name);
            closeAllChannel();
          }
      
          channelWithJanus = client.Channel();
          channelWithJanus.create({
            app:process.env.CHANNEL,
            endpoint:`SIP/1080  `,
            callerId:phoneFrom,
            appArgs:'forward call from phone customer'+phoneFrom,
            extensions:phoneFrom
          },(err,channelWithJanus)=>{
            if(err){
              closeAllChannel();
              return console.error('create with channel janus-failed',channelWithJanus.state);
            }
            console.log("create channel with janus success");
            channelWithJanus.on('StasisStart',function(event,channelWithJanus){
              console.log('statisStart channelWithJanus',channelWithJanus.state);
            });
            bridge=client.Bridge();
            bridge.create({
              type:'mixing'
            },(err,bridge)=>{
              if(err){
                closeAllChannel();
                return console.error('bridege error',err);
              }
              console.log('bridge Created %s', bridge.id);
              bridge.addChannel({ channel: channelWithUser.id }, function (err) {
                console.log('bridge addchannel channelWithUser');
              });
              channelWithJanus.dial(function (err) {
                if (err) {
                  closeAllChannel();
                  return console.error('dial err:', err.code, err.message, err)
                }
                console.log('dial sussccessfully');
      
                bridge.addChannel({ channel: channelWithJanus.id }, function (err) {
                  if (err) {
                    closeAllChannel();
                    return console.error('bridge create err:', err)
                  }
                  console.log('bridge addChannel channelWithJanus');
                });
      
              });
            });
          });
    }
    client.on('StasisStart', stasisStart);
  client.start(process.env.CHANNEL);
}
