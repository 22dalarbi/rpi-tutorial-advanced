/* Magic Mirror Config Sample
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 *
 * For more information how you can configurate this file
 * See https://github.com/MichMich/MagicMirror#configuration
 *
 */

var config = {
	address: "localhost", // Address to listen on, can be:
	                      // - "localhost", "127.0.0.1", "::1" to listen on loopback interface
	                      // - another specific IPv4/6 to listen on a specific interface
	                      // - "", "0.0.0.0", "::" to listen on any interface
	                      // Default, when address config is left out, is "localhost"
	port: 8080,
	ipWhitelist: ["127.0.0.1", "::ffff:127.0.0.1", "::1"], // Set [] to allow all IP addresses
	                                                       // or add a specific IPv4 of 192.168.1.5 :
	                                                       // ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.1.5"],
	                                                       // or IPv4 range of 192.168.3.0 --> 192.168.3.15 use CIDR format :
	                                                       // ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.3.0/28"],

	language: "en",
	timeFormat: 24,
	units: "metric",

	modules: [
		{
			module: "MMM-NotificationTrigger",
			config:
			{
				useWebhook: true,
				triggers:
				[
				{
					trigger: "ASSISTANT_ACTION",
					triggerSenderFilter: function (sender)
					{
						if (sender.name == "MMM-AssistantMk2")
						{
							return true;
						}
						else
						{
							return false;
						}
					},
					triggerPayloadFilter: function (payload)
					{
						return true;
					},
					fires: [{
						fire: "SHOW_ALERT",
						payload: function (payload)
						{
							return {
								type: "notification",
								title: payload[0].execution[0].type,
								message: payload[0].execution[0].command
							};
						},
					}, ],
				},
				{
					trigger: "ASSISTANT_HOOK",
					fires: [{
					fire: "SHOW_ALERT",
					payload: function (payload)
					{
						return {
							title: "HOOK",
							message: "Are you saying " + payload.hook + "?",
							timer: 5000
						};
					},
					}, ],
				},
				{
					trigger: "HOTWORD_DETECTED",
					fires: [{
						fire: "HOTWORD_PAUSE"
						},
						{
						fire: "ASSISTANT_ACTIVATE",
						payload: function (payload) {
							return {
							"profile": payload.hotword
							};
						},
						delay: 200
						},
					]
				},
				{
					trigger: "ASSISTANT_DEACTIVATED",
					fires: [{
						fire: "HOTWORD_RESUME"
					}]
				},
				]
			}
		},
		{
			module: "MMM-Hotword",
			config:
			{
				snowboy: [
				{
					hotwords: "smartmirror",
					file: "resources/models/smart_mirror.umdl",
					sensitivity: '6.0',
				},
				{
					hotwords: "johnyjohny",
					file: "resources/models/JohnyJohny.pmdl",
					sensitivity: '6.0',
				}
				]
			}
		},
		{
			module: "MMM-AssistantMk2",
			position: "top_center",
			config:
			{
				useScreen: true,
				deviceLocation:{
					coordinates: {
					latitude: 40.74,
					longitude: -73.98
					},
				},
				transcriptionHook: {
					"UNICORN": "unicorn"
				},
				profiles: {
					"default": {
						lang: "en-US"
					},
				}
			}
		},
		{
			module: 'MMM-TTS',
			position: 'middle_center',
			config: {
			}
		}
				
	]
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {module.exports = config;}
