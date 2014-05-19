var couchapp = require('couchapp'),
    path = require('path'),
    ddoc;

ddoc = {
  _id: '_design/d3demo',
  rewrites: [
    //{ "from": "app/_design/app/_view/allItems" ,    "to"  : "/_view/allItems" },
    //garrensmith.cloudant.com /  app/_design/app/_rewrite
    { "from": "d3demo/_design/:ddoc/*" ,    "to"  : "/../../_design/:ddoc/*" },
    { "from": "d3demo/:doc","to": "/../../:doc"},
    { "from": "d3demo/","to": "/../../"},
    /*{ "from": "_db/*" ,  "to"  : "../../*" },
    { "from": "_ddoc" ,  "to"  : "" },
    { "from": "_ddoc/*", "to"  : "*"},*/
    {from: '/', to: 'index.html'},
    {from: '/*', to: '*'}
  ],
  views: {},
  shows: {},
  lists: {},
  validate_doc_update: function(newDoc, oldDoc, userCtx) {
    /*if (newDoc._deleted === true && userCtx.roles.indexOf('_admin') === -1) {
      throw "Only admin can delete documents on this database.";
    }*/
  }
};


couchapp.loadAttachments(ddoc, path.join(__dirname, 'dist'));
module.exports = ddoc;

