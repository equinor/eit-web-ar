/**
 * Iterate properties as fast as possible and do something with each property.
 * @param {object} obj 
 * @param {function} callback - For each property callback(key)
 */
export const onEachProperty = (obj, callback) => {
   for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
         callback(key);
      }
   }
};


/**
 * A simple publish/subscribe handler.
 */
export const getPubSubHandler = () => {
   return (() => {
      const api = {};
      const events = {};

      /**
       * Trigger an event and return a payload object to all subscriber callbacks
       * @param {string} name 
       * @param {object} payload - Default value is {}
       */
      const emit = (name, payload = {}) => {
         const callbacks = events[name] ? events[name] : [];
         callbacks.forEach(callback => callback(payload));
      };

      /**
       * Subscribe to an event
       * @param {string} name 
       * @param {function} callback 
       */
      const on = (name, callback) => {
         if (!events[name]) {
            events[name] = [];
         }
         events[name].push(callback);
      };

      /**
       * Unsubscribe to an event
       * @param {string} name 
       * @param {function} callback 
       */
      const off = (name, callback) => {
         if (!callback) {
            delete events[name];
         }
         if (events[name]) {
            events[name] = events[name].filter(value => { return value != callback });
         }
      };

      // MAIN
      api.on = on;
      api.off = off;
      api.emit = emit;
      return api;
   })();
};


/**
 * Provide logger for the given namespace that will produce a colorized output to console according to log type.
 * Available types: debug, error, info, warn
 * @param {string} namespace namespace:separated:by:colon
 * @returns {object} log.<type>(message)
 */
export const getLogger = (namespace) => {
   const api = {};
   const styles = {
      debug: "color: gray;",
      error: "color: red;",
      info: "color: gray;",
      warning: "color: orange;"
   };

   const log = (type, namespace) => {

      return (message) => {
         const ns = namespace;
         console.log(`%c${ns}: ${message}`, styles[type]);
      };
   };

   // MAIN
   onEachProperty(styles, (key) => {
      api[key] = log(key, namespace)
   });

   return api;
};