mHero Synchronisation Coordinator
=================================

It synchronises health worker information from Health Worker Registry to RapidPro.

How to setup
------------

After 'git clone' the repository, do following in your working directory:

Prepare your environment:

* (Make sure you have NodeJS installed)
* npm install -g grunt-cli
* npm install

Run test:

* cp config/hero-config.sample.json config/hero-config.dev.json
* (edit config/hero-config.dev.json to fit your config)
* grunt 

Pull and push data:

* cp config/hero-config.sample.json config/hero-config.staging.json
* (edit config/hero-config.staging.json to fit your config)
* ./scripts/heracles.js (to pull data)
* ./scripts/sisyphus.js (to push data)

Run as a service:

* ./scripts/server.js
* (Access http://localhost:8082 to run pull and push)

Run at staging server:

* (Get LiberiaHWR.pem from Carl and copy it to ~/.ssh/ folder.)
* ssh -i ~/.ssh/LiberiaHWR.pem -l ubuntu liberia-staging.mhero.org
* cd node/mhero-synch/
* git pull
* (Make sure config/hero-config.staging.json is what you want.)
* forever restartall (Run the latest revision.) 
* lynx http://localhost:8082 (Trigger a pull-push activity.)
* (Check ~/.forever/Wr-_.log for logs. Check run/push.log for errors happened when pushing contacts to RapidPro.)
