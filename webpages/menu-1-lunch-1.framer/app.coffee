#Framer settings
Framer.Extras.Hints.disable()


 


# getDate
getDate = ->
	today = new Date
	mm = today.getMonth() + 1 
	dd = today.getDate() + 1
	if dd < 10  
		dd = '0' + dd  
	if mm < 10  
		mm = '0' + mm  
	yyyy = today.getFullYear() 
	return ""+yyyy+mm+dd

# Variables
gutter = 16
scrollStart = Header.maxY + 8

# Firebase init 
{Firebase} = require 'firebase'
menuDB = new Firebase
	projectID: "rndmenu"
	secret: "8aHinuTCIWkUQaRhztogGYq0BnzqrvIJDq6kKrkb" 
	
# Scroll
scroll = ScrollComponent.wrap(contents)
scroll.scrollHorizontal = false
scroll.sendToBack()
scroll.contentInset =
	top: scrollStart
	right: 0
	bottom: 8
	left: 0

scroll.onMove (event) ->
	range = -80
	Header.height = Utils.modulate(event.y, [scrollStart, range], [80, 40], true)
	HeaderNew.opacity = Utils.modulate(event.y, [scrollStart, range], [1, 0], true)
	HeaderDay.y = Utils.modulate(event.y, [scrollStart, range], [32, 15], true)
	HeaderDay.fontSize = Utils.modulate(event.y, [scrollStart, range], [36, 14], true)

# Get Menu DB 		
menuDB.get "/menu/"+getDate()+"/1식당/점심", (menus) ->
	menusArray = _.toArray(menus)

	if menus is null
		noMenu.opacity = 1.0
	
	dotGroup.visible = false
		
	lastItemMaxY = 0	
	for menuData, index in menusArray
		item = _item_image.copySingle()	
		item.parent = scroll.content
		item.visible = true
		#item.y = index * (item.height + gutter) + 64
		item.y = lastItemMaxY + gutter
		lastItemMaxY = item.maxY

		menu = _menu.copySingle()
		menu.parent = item
		menu.text = menuData.menu
		menu.width = item.width * 0.5
		doHyeon = Utils.loadWebFont("BM DoHyeon")
		menu.fontFamily = doHyeon
		
		# Load Raleway from Google Web Fonts 
		raleway = Utils.loadWebFont("Raleway")
	
		sidemenu = _sidemenu.copySingle()
		sidemenu.parent = item
		sidemenu.text = menuData.description
		sidemenu.maxY = Align.bottom(-8)
		sidemenu.width = item.width * 0.5
		sidemenu.fontFamily = doHyeon
	
		restaurant = _restaurant.copySingle()
		restaurant.parent = item
		restaurant.text = menuData.restaurant
		restaurant.width = item.width * 0.6
		
		image = _image.copySingle()
		image.parent = item
		image.image = menuData.photoUrl
		#menu.width = item.width - image.width
		#sidemenu.width = item.width - image.width
		#restaurant.width = item.width - image.width
		#print menuData.menu + ": " + menuData.photoUrl	
						
		menuDB.get "/foods/"+menuData.menu, (foods) ->
			if foods.image
				image = _image.copySingle()
				image.parent = item
				image.image = foods.image
				sidemenu.width = item.width * 0.5
				
		item.animate
			y: index * (item.height + gutter) + 8
			time: 0.5
			options: 
				curve: Spring(damping: 0.3)
				delay: 0.2 * (index + 1)

# loading
dots = [dot1, dot2, dot3]

for dot in dots
	dot.states =
		small:
			scale: 0.8
			opacity: 0.3
		normal: 
			scale: 1.2
			opacity: 1.0
		animationOptions:
			time: 0.5
			curve: Bezier.easeInOut
			
	dot.stateSwitch("small")
	
	dot.on Events.AnimationEnd, ->
		this.stateCycle("small", "normal")

dot1.stateCycle("small", "normal")
Utils.delay 0.3, ->
	dot2.stateCycle("small", "normal")
Utils.delay 0.6, ->
	dot3.stateCycle("small", "normal")		
	