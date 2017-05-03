"use strict";
// Reference :  https://gist.github.com/BigstickCarpet/a0d6389a5d0e3a24814b
// TODO : do error handling
// TODO : bug testing
// TODO : test in mobile
// TODO : convert to es6
// TODO : build using npm
// TODO : Strip tags

$(document).ready(function () {

  // declaration
  var table, tableInputTemplate, editStatus;
  var indexedDB, database, nameStore;

  // initialization
  table = $("#dynamic-table");
  editStatus = $('#edit-status');
  tableInputTemplate = '<input type="text" value="{value}" data-old="{value}"/>';
  initDB();

  // event binding
  table.on("mouseenter", "tbody td.editable", function(){
    if(editStatus.prop('checked')) editColumn($(this));
  });
  table.on("mouseleave", "tbody tr.active td.editable", function(){leaveColumn($(this),false)});
  table.on("keypress", "tbody tr.active td.editable input", function(e) {
     if(e.keyCode == 13) saveColumn($(this).parent());
  });

  /**
  * Edit column
  */
  function editColumn(column) {
    column.parent().addClass("active");
    var template = tableInputTemplate;
    var currentValue = column.html();
    column.html(template.replace(/{value}/g,$.trim(currentValue)));
    column.children("input[type='text']").data("old", currentValue);
  };

  /**
  * Leave column
  * @param {object} column    current column
  * @param {String} toBeSaved determine if the string has to be updated
  */
  function leaveColumn(column, toBeSaved) {
    var currentValue;
    column.parent().removeClass("active");

    if(toBeSaved) {
      currentValue = column.children("input[type='text']").val();
    } else {
      currentValue = column.children("input[type='text']").data("old");
    }

    column.html($.trim(currentValue));
  };

  /**
  * Save column
  */
  function saveColumn(column) {
    leaveColumn(column, true);
  };

  /**
  * Create indexeddb database
  *
  * @param {string} databaseName
  * @return {object} database object
  */
  function createIndexedDB(databaseName) {

    return indexedDB.open(databaseName, 1);
  }

  /**
  * Create indexeddb table
  *
  * @param {object} database
  * @param {string} tableName
  * @param {string} primaryColumn
  * @return {object} table object
  */
  function createIndexedDBTable(database, tableName, primaryColumn) {

    database.onupgradeneeded = function() {
        var db = database.result;
        return db.createObjectStore(tableName, {keyPath: primaryColumn});
    };
  }

  /**
  * Add a name to store
  *
  * @param {object} database
  * @param {string} tableName
  * @param {string} name
  */
  function addName(database, tableName, name) {

    var db = database.result;
    var tx = db.transaction(tableName, "readwrite");
    var store = tx.objectStore(tableName);

    store.put({name: name});
  }

  /**
  * Initialize DB
  * Create database and table
  */
  function initDB() {

    indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
    database = createIndexedDB("myDatabase");
    nameStore = createIndexedDBTable(database, "nameStore", "name");
  }
});

// open.onsuccess = function() {

//
//     // Query the data
//     // var getJohn = store.get(12345);
//     //var getBob = index.get(["Smith", "Bob"]);
//
//     // getJohn.onsuccess = function() {
//     //     console.log(getJohn.result.name.first);  // => "John"
//     // };
//
//     // getBob.onsuccess = function() {
//     //     console.log(getBob.result.name.first);   // => "Bob"
//     // };
//
//     // Close the db when the transaction is done
//     tx.oncomplete = function() {
//         db.close();
//     };
// }
