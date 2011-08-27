window.onload = ->
  helper = new Canvas(document.getElementById('game-canvas'))
  background = new Background()
  planet = new Planet()
  orbit = new Orbit(200)
  
  
  helper.draw ->
    background.draw(this)
    planet.draw(this)
    orbit.draw(this)
  
