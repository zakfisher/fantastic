Fantastic = {};

Fantastic.Grid = function(breakpoints, showBreakpoints) {
	/*
			0___320__480__640__768_1024_1280_1366_1440_1680
		320_|1   |2   |3   |4   |5   |6   |7   |8   |9   |10
		480_|11  |12  |13  |14  |15  |16  |17  |18  |19  |20
		640_|21  |22  |23  |24  |25  |26  |27  |28  |29  |30
		768_|31  |32  |33  |34  |35  |36  |37  |38  |39  |40
	   1024_|41  |42  |43  |44  |45  |46  |47  |48  |49  |50
	   1280_|51  |52  |53  |54  |55  |56  |57  |58  |59  |60
	   1366_|61  |62  |63  |64  |65  |66  |67  |68  |69  |70
	   1440_|71  |72  |73  |74  |75  |76  |77  |78  |79  |80
	   1680_|81  |82  |83  |84  |85  |86  |87  |88  |89  |90
	   		|91  |92  |93  |94  |95  |96  |97  |98  |99  |100
	*/

	showBreakpoints = showBreakpoints || false;

	var self = {};
	self.zones = {};
	self.zoneCount = 0;
	self.currentZone = 0;

	self.registerZones = function() {
		self.zoneCount = Math.pow(breakpoints.length, 2);
		var i = 0;
		var leftIndex = 0;
		var topIndex = 0;
		while (i < self.zoneCount) {
			i++;
			leftIndex = (leftIndex === breakpoints.length) ? 0 : leftIndex;
			self.zones[i] = {
				left: breakpoints[leftIndex],
				top: breakpoints[topIndex],
				handlers: {}
			};
			leftIndex++;
			topIndex += (leftIndex === breakpoints.length) ? 1 : 0;
		}
	};

	self.setZone = function() {
		var w = window.innerWidth;
		var h = window.innerHeight;

		// Calculate this by counting up from zone 1.
		for (var z in self.zones) {
			var zone = self.zones[z];
			
			// It will hit the first zone it passes.
			if (zone.left > w && zone.top > h) {
				var correctZone = z - breakpoints.length - 1;

				// Escape if new zone is current zone
				if (correctZone === self.currentZone) {
					return false;
				}

				// So we go back up and left by one.
				self.currentZone = correctZone;
				break;
			}
		}
		self.fireZoneHandlers();
	};

	self.fireZoneHandlers = function() {
		console.log('zone', self.currentZone);
		for (var h in self.zones[self.currentZone].handlers) {
			self.zones[self.currentZone].handlers[h]();
		}
	};

	self.onZoneEvent = function(zone, eventName, handler) {
		self.zones[zone].handlers[eventName] = handler;
	};

	self.showBreakpoints = function() {
		$('body').append('<div id="breakpoints"></div>');
		for (var z in self.zones) {
			$('#breakpoints').append('<div style="z-index:10' + z + ';border-top:1px solid #ccc;border-left:1px solid #ccc;height:100%;width:100%;position: absolute;top:' + self.zones[z].top + 'px;left:' + self.zones[z].left + 'px">' + z + '</div>');
		}
	};

	self.init = function() {
		self.registerZones();
		window.addEventListener("resize", self.setZone);
		if (showBreakpoints) {
			$(self.showBreakpoints);
		}
	};

	self.init();
	return self;
};

$grid = new Fantastic.Grid([
	0,
	320,
	480,
	640,
	768,
	1024,
	1280,
	1366,
	1440,
	1680
], false);

$grid.onZoneEvent(25, 'handlers', function() {
	console.log('fire zone 25 handlers');
});

$grid.setZone();

module.exports = Fantastic;