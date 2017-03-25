"use strict";

function isLatitude(lat) {
  return isFinite(lat) && Math.abs(lat) <= 90;
}

function isLongitude(lng) {
  return isFinite(lng) && Math.abs(lng) <= 180;
}

module.exports = {

    geoValidation : function(lat, lng){
        return new Promise((resolve, reject) => {
			if (isLatitude(lat) && isLongitude(lng)){
				resolve({lat: lat, lng: lng});
			}
			else {
				reject("bad latlng");
			}
		});
	}
};