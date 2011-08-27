class window.Planet
  constructor: ->
    helper = new Canvas(null, 224, 224)
    @canvas = helper.canvas
    helper.draw_image('/images/planet_grey.png', 0,0, 224, 224)
    
  draw:(helper) -> 
    helper.save()
    helper.translate(helper.width / 2, helper.height / 2) #/
    helper.rotate(helper.ticks * 0.001)
    helper.draw_image(@canvas, -112, -112, 224, 224)
    helper.restore()   