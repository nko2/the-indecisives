class window.Planet
  constructor: ->
    helper = new Canvas(null, 220, 220)
    @canvas = helper.canvas
    helper.circle(110,110,110)
    helper.fill('rgba(255,255,255,0.4)')
    
  draw:(helper) -> 
    helper.save()
    helper.translate(helper.width / 2, helper.height / 2) #/
    helper.draw_image(@canvas, -110, -110, 220, 220)
    helper.restore()   