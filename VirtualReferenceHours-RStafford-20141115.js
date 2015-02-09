

var dates = {
    convert:function(d) {
        // Converts the date in d to a date-object. The input can be:
        //   a date object: returned without modification
        //   a string     : Any format supported by the javascript engine, like
        //                  "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc
		//					The VRhours.xml uses the format YYYY/MM/DD
        //   an object     : Interpreted as an object with year, month and date
        //                  attributes.  **NOTE** month values are 0-11.
        return (
            d.constructor === Date ? d :
            d.constructor === String ? new Date(d) :
            typeof d === "object" ? new Date(d.year,d.month,d.date) :
            NaN
        );
    },
    compare:function(a,b) {
        // Compare two dates (could be of any type supported by the convert
        // function above) and returns:
        //  -1 : if a < b
        //   0 : if a = b
        //   1 : if a > b
        // NaN : if a or b is an illegal date
        // NOTE: The code inside isFinite does an assignment (=).
        return (
            isFinite(a=this.convert(a).valueOf()) &&
            isFinite(b=this.convert(b).valueOf()) ?
            (a>b)-(a<b) :
            NaN
        );
    },
    inRange:function(d,start,end) {
        // This function is not currently in use, but might be useful
		// if we want to add exception ranges to the VRhours.xml
		//
		// Checks if date in d is between dates in start and end.
        // Returns a boolean or NaN:
        //    true  : if d is between start and end (inclusive)
        //    false : if d is before start or after end
        //    NaN   : if one or more of the dates is illegal.
        // NOTE: The code inside isFinite does an assignment (=).
       return (
            isFinite(d=this.convert(d).valueOf()) &&
            isFinite(start=this.convert(start).valueOf()) &&
            isFinite(end=this.convert(end).valueOf()) ?
            start <= d && d <= end :
            NaN
        );
    }
}

function findExceptionalHours( dateHolder, exceptionsObject) {
		// This function accepts a date and the exceptions object from VRhours.xml
		// Determines if there is an exception
		//		if so, determines if there are any VR hours 
		// 			yes: replaces the text on the /ask page with new text including 
		//				these hours.  
		// 			no: replaces the text on the /ask page with new text indicating 
		//				the VR desk is closed.
		// Returns a boolean:
		//		true: if an exception is found 
		//		false: if one is not.
		
		var closed = false;
		var valueReturn = false;
		for (var prop in exceptionsObject) {
			if (exceptionsObject.hasOwnProperty(prop)) {
				if (!dates.compare( exceptionsObject[prop], dateHolder)==0 {
					if (exceptionsObject[prop].nextSibling.nodeValue = "closed") {
						closed = true;
					} else {
						var hours = {
							beginTime: exceptionsObject[prop].getElementsByTagName("Begin").nodeValue;
							endTime: exceptionsObject[promp].getElementsByTagName("Begin").nodeValue;
						}
					var valueReturn = true;
				} 
			}
		}
		if 	( valueReturn ) {
			if (!closed) {
				document.getElementById("hourslink").innerHTML=("When there is a Virtual Reference Librarian available, use the virtual reference chat widget, available on many of this site's pages, to get answers to your quick questions. The Virtual Reference hours for ", dateString, " are ", hours.beginTime, " until ", hours.endTime);
			} else {
				document.getElementById("hourslink").innerHTML=("When there is a Virtual Reference Librarian available, use the virtual reference chat widget, available on many of this site's pages, to get answers to your quick questions. The Virtual Reference desk is closed today")
			}
		}
		return valueReturn;
	}

function findRegularHours( dayHolder, regularsObject ) {
		// This function accepts a day and the regular days object
		// it searches the regulars Object for a day match and returns the
		// open and close times VR on that day
		for (var prop in regularsObject) {
			if (regularsObject.hasOwnProperty(prop)) {
				if (regularsObject[prop].nodeValue == dayHolder) {
					var hours = {
						beginTime: regularsObject[prop].firstChild.nodeValue;
						endTime: regularsObject[prop].lastChile.nodeValue;
					}
				}
			}	
			
		}	
		return hours;
	}



try {
		// initialize variables and objects which hold day and date data
		var dateHolder = new Date();
		var dayHolder = dateHolder.getDay();
		var dateString = dateHolder.toDateString();
		
		// legacy XML support for older browser's implementations of javascript
		if (window.XMLHttpRequest) {//code for IE7+, etc.
			xmlhttp=new XMLHttpRequest();
		} else {//legacy code for IE <=6
			xmlhttp= new ActiveXObject("Microsoft.XMLHTTP");
		}
		
		//open regular VR hours XML file
		xmlhttp.open("GET", "VRhours.xml", false);
		xmlhttp.send();
		xmlDoc=xmlhttp.responseXML;
		
		// initialize two objects from the data in VRhours.xml
		//		regularsObject: the open times for regular days of the week
		//			each record is a <day>
		//				<name>: the numerical representation of a day of the week 0-6
		//				<begin>: the open time for VR
		//				<end>: the close time for VR
		//		exceptionsObject: the times for days which are irregular
		//			each record is an <exception>
		//				<yyyymmdd>: the date of the irregular hours in the format YYYY/MM/DD
		//				<status>: either open or closed
		//				<begin>: the open time for VR
		//				<end>: the close time for VR
		var regularsObject=xmlDoc.getElementsByTagName("regular");
		var exceptionsObject=xmlDoc.getElementsByTagName("exceptions");
		
		// if no exceptions are found, then replace the text on /ask with the regular hours for that day
		if (!findExceptionalHours(dateHolder, exceptionsObject)){
			document.getElementById("hourslink").innerHTML=("When there is a Virtual Reference Librarian available, use the virtual reference chat widget, available on many of this site's pages, to get answers to your quick questions. The Virtual Reference hours for ", dateString, " are ", findRegularHours(dayHolder, regularsObject).beginTime, " until ", findRegularHours(dayHolder, regularsObject).endTime); //complete here
		}
	}
catch(err) 
		// send any errors to console for debugging
	{
		console.log("ERRORS DETECTED! The dateString is", dateString);
	}
	
