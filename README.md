mopublish (alpha)
=========

*Version: 1.0.2*

Mopublish is an innovative nodejs cms build on top of MEAN stack i.e. MongoDB - noSql Database, ExpressJs, AngularJs & NodeJS. Besides those Bootstrap framework has been used to provide 100% responsive mobile friendly admin panel.

Our goal is to create an NodeJS & MongoDB based CMS which can be compared with popular PHP based flexible cms. To achieve our target we have plans to include following features to the system:

* Actions & Filters Support
* Secure Session Management
* Built-in HTTP & HTTPS Support
* Secured REST API Support
* Email Support (Local SMTP & 3rd Party SMTP)
* Built-in Contact Form Support
* Built-in custom Taxonomy & Content types
* Built-in Localization Support


Please note, Monpublish is in active testing be our developers to provide a extremely stable version. Few of our live usecases as follows:

* http://www.techunits.com
* http://www.mopublish.com
* http://rate-exchange.herokuapp.com


### Mopublish Tests

Mopublish has been tested successfully on the following PaaS platforms (using free/trial accounts):

  * [Heroku](http://www.heroku.com/)
  * [OpenShift](https://openshift.redhat.com/app/)
  * [Modulus](https://modulus.io/)
  * [AppFog](http://www.appfog.com/)
  * [Nodejitsu](http://nodejitsu.com/)
  * [Windows Azure](http://www.windowsazure.com/)
  * [Amazon Web Services - AWS](https://aws.amazon.com/)


###	Events & Hooks

Mopublish has been equipped with many Events and Actions into it's core, which provides developers a greater advantage to write plugins on top of it.

**You can emit following events to update respective functions:**

Action/Event  | Description
------------- | -----------------
MP:HEADER     | To add extra tags & texts to the header section.
MP:STYLESHEET | Load stylesheets.
MP:SCRIPT     | Load scripts.
MP:PAGETITLE  | Update page title based on page & pluigns.
MP:SEOMETA    | To update SEO meta title, keywords & description, as per requirement.
MP:OPENGRAPH  | To update Opengraph tags as per requirement. Supports opengraph tags: (http://ogp.me/)
MP:FOOTER     | To add extra tags & texts to the footer section.

**Also you can bind to following events to modify the default flow of the system**

* **MP:LOGIN** To add extra functionality or special redirection once user is loggedin.

#### Note from Auhtor

**Mopublish** is a Content Management System inspired by Drupal & Wordpress, so we have tried our best to match it's features and usubility to those php based CMS as much as possible.
We will always keep up the work to add more advanced features to enrich the product. Hope you will like it!!!


#### License

**Mopublish** is licensed under [MIT license](https://github.com/techunits/mopublish/blob/master/LICENSE), so you are free to use it as you like.


