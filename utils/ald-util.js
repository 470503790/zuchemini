function setEvent(key, params) {
  if (app != undefined) {
    app.aldstat.sendEvent(key, params);
  }

}
module.exports = {
  setEvent: setEvent
}