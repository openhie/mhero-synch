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
