var mixins = {

  within: function(eventName, range, callback) {
    var upper;

    if (typeof range === "number") {
      upper = range;
      range = [0, upper];
    }

    if (!Array.isArray(range)) {
      this.emit("error", {
        message: "range must be an array"
      });
      return;
    }

    this.on(eventName , function(value){
      if (value >= range[0] && value <= range[1]) {
        callback.call(this, null, value);
      }
    }.bind(this));

    return this;
  }
};

module.exports = mixins;
