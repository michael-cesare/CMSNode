# CMSNode
<h2>Purpose</h2>
Node project which is used as a middleware between frontend and CMS rest API. <br/>
The purpose is just to listen from Frontend request, and proxy request to a CMS system.<br/>
This will take care of mapping and transforming data between CMS models and Frontend Models using typescript.<br/>
This will be it the ideal place to have centralised requests, and might add cashing of data.<br/>

# SRC File structure
<h4>Root directory</h4>
mock: mock data similar to wordpress post/pages and a custom menu plugin.<br/>
pages: html pages to test out. or use as frontend using node.<br/>
public: all files to copy into the route folders. e.g robots.txt<br/>
public/confg.json: has all the env values, which are easily be overrided by pipelines.<br/>
<br/>

<h4>Source Code directories</h4>
src: main source of this project. <br/>
config: class which will contian the values from the public/config,json<br/>
controller: node routes for Rest API. Might also add Sockets endpoints.<br/>
helpers:  objects to keep a standard and centrelised functionality, such as custom parsers.<br/>
middleware: routes that are used for all requests, normally ends with a next function to pass into anothe route.<br/>
repositories: The main classes which uses external data. This includes calling other Rest API/Sockets, filesystem, FTP, Cache..<br/>
services: business logic for the applications. Connects all respositories into single entry, <br/>
types: Models, interfaces, classes, Enums, Types, and definitions.<br/>
util:    libraries and utilities that extend classes, third party libraries, or packages.<br/>

