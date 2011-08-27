window.onload = ->
  helper = new Canvas(document.getElementById('game-canvas'))
  orbit = new Orbit()
  planet = new Planet()
  background = new Background()
  
  
  helper.draw ->
    orbit.draw(this)
    planet.draw(this)
    background.draw(this)
  
