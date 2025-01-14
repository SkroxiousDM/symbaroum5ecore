/* Common operations and utilities for all
 * core submodules
 */

const NAME = 'symbaroum5ecore';
const TITLE = 'Symbaroum 5E Ruins of Symbaroum - Core System';
const PATH = `modules/${NAME}`;

export class COMMON {

  /** CONSTANTS **/
  static DATA = {
    name: NAME,
    path: PATH,
    title: TITLE,

    /* expecting item expansion in 2.2.0 which 
     * will surely mess with our operations. 
     * This check is only a warning.
     */
    systemCompat: ['2.1.0','2.1.x'], 
  };

  static isValidSystem() {
    const current = game.system.version;

    const lowValid = !isNewerVersion(COMMON.DATA.systemCompat[0], current);
    const highValid = !isNewerVersion(current, COMMON.DATA.systemCompat[1]);

    return {lowValid, highValid}
  }

  static buildNotification(type, message) {
    Hooks.once('ready', () => {
      ui.notifications[type](message);
    })
  }

  static NAME = this.name;
  /** \CONSTANTS **/

  /* pre-setup steps */
  static build() {
    let validBuild = true;
    const results = COMMON.isValidSystem();
    if (!results.lowValid) {
      const msg = `${COMMON.DATA.name}: Detected dnd5e system version as "${game.system.version}". Minimum supported dnd5e system version: "${COMMON.DATA.systemCompat[0]}". Disabling all module operations.`
      console.error(msg);
      COMMON.buildNotification('error', msg);
      validBuild = false;
    }

    if (!results.highValid) {
      const msg = `${COMMON.DATA.name}: Detected dnd5e system version as "${game.system.version}". Maximum supported dnd5e system version: "${COMMON.DATA.systemCompat[1]}". Full operation cannot be guaranteed.`
      console.warn(msg);
      COMMON.buildNotification('warn', msg);
      validBuild = true;
    }

    return validBuild;
  }

  static register() {
    COMMON.globals();
  }

  static globals() {

    /* register our namespace */
    globalThis.game.syb5e = {
      debug: {},
    };
   
  }

  /** HELPER FUNCTIONS **/
  static firstGM(){
    return game.users.find(u => u.isGM && u.active);
  }

  static isFirstGM(){
    return game.user.id === COMMON.firstGM()?.id;
  }

  static setting(key, value = null){

    if(value) {
      return game.settings.set(COMMON.DATA.name, key, value);
    }

    return game.settings.get(COMMON.DATA.name, key);
  }

  static localize( stringId, data = {} ) {
    return game.i18n.format(stringId, data);
  }

  static applySettings(settingsData, moduleKey = COMMON.DATA.name){
    Object.entries(settingsData).forEach(([key, data])=> {
      game.settings.register(
        moduleKey, key, {
          name : COMMON.localize(`SYB5E.setting.${key}.name`),
          hint : COMMON.localize(`SYB5E.setting.${key}.hint`),
          ...data
        }
      );
    });
  }

  static addGetter(object, fieldName, fn) {
    Object.defineProperty(object, fieldName, {
      get: fn
    });
  }

  static translateObject(obj) {
    /* translate in place */
    Object.keys(obj).forEach( key => obj[key] = COMMON.localize(obj[key]));

    return obj;
  }

  static addAbstract(cls, key) {
    if(!globalThis.game.syb5e.abstract) globalThis.game.syb5e.abstract = {};
    globalThis.game.syb5e.abstract[key] = cls;
  }

}

