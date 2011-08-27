(function() {
  window.onload = function() {
    var background, helper, orbit, planet;
    helper = new Canvas(document.getElementById('game-canvas'));
    background = new Background();
    planet = new Planet();
    orbit = new Orbit(200);
    return helper.draw(function() {
      background.draw(this);
      planet.draw(this);
      return orbit.draw(this);
    });
  };
}).call(this);
