var express = require('express');
var router = express.Router();
var path = require('path');
var storage = require('../../modules/storage');



/**********************************************************************************
 * GET
 */

router.get('/', function (req, res) {
   let statusCode = 200;
   let defaultData = {
     description: "entity api"
   };
   res.status(statusCode).json(defaultData);
 });

router.get('/:entityId', (req, res) => {
   const entityId = req.params.entityId;
   let hash = getEntityHash(entityId);

   function handleQueryResult(entityInfo){
      let statusCode = 200;
      if (entityInfo === null) {
         // Not found
         statusCode = 404;
         res.status(statusCode).send();
      } else {
         // Success
         res.status(statusCode).json(entityInfo);
      }   
   }

   storage.hgetall(hash, function (err, entityInfo) {
      err ? handleError(err) : handleQueryResult(entityInfo);
   });
});




/**********************************************************************************
 * SUPPORT FUNCS ...which maybe ought to be separated out into modules that hande specific parts of the business logic...
 */

function handleError(res, message){
   console.log(message);
   res.status(500).send(message);
}

function getEntityHash(entityId) {
   return 'entityId:' + entityId;
}


/**********************************************************************************
* EXPORT MODULE
*/

module.exports = router;