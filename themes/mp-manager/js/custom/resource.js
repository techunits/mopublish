var mpmgrApp = angular.module('MopublishManager', {});

/**
 * content removal confirmation
 */
$(document).ready(function() {
	$('a.removeItem').click(function() {
		var removalBox = confirm("Are you sure want to delete this?");
		if (removalBox == true) {
		    window.location = $(this).attr('href');
		} else {
		    return false;
		}
		return false;
	});
});

mpmgrApp.controller('SiteSettings', function() {
	//	add form validations
	$('form[name="siteSettings"]').validate();
});

/**
 * action controllers for UpdateContent view
 */
mpmgrApp.controller('UpdateContent', function($scope, $http) {
	//	initialize tinymce for the editor.
	tinymce.init({
		selector:'textarea.maineditor',
		menubar	: false,
		toolbar: ["bold italic underline strikethrough | alignleft aligncenter alignright alignjustify outdent indent | bullist numlist | blockquote subscript superscript | removeformat"]
	});
	
	//	add form validations
	$('form[name="updateContent"]').validate();
	
	//	datepicker
	
	//	data auto replication
	$('form[name="updateContent"]	input[name="title"]').focusout(function() {
		if('' == $('form[name="updateContent"]	input[name="metaTitle"]').val()) {
			$('form[name="updateContent"]	input[name="metaTitle"]').val($(this).val());
		}
		
		if('' == $('form[name="updateContent"]	input[name="ogTitle"]').val()) {
			$('form[name="updateContent"]	input[name="ogTitle"]').val($(this).val());
		}
	});
	
	//	data auto replication
	$('form[name="updateContent"]	textarea[name="excerpt"]').focusout(function() {
		if('' == $('form[name="updateContent"]	textarea[name="metaDescription"]').val()) {
			$('form[name="updateContent"]	textarea[name="metaDescription"]').val($(this).val());
		}
		
		if('' == $('form[name="updateContent"]	textarea[name="ogDescription"]').val()) {
			$('form[name="updateContent"]	textarea[name="ogDescription"]').val($(this).val());
		}
	});
	
	
	function setGeoCodingInfo(geoaddress) {
		$scope.lat = geoaddress.geometry.location.lat();
		$scope.lng = geoaddress.geometry.location.lng();
		
		var latlngObj = new google.maps.LatLng($scope.lat, $scope.lng);
		map.panTo(latlngObj);
		marker.setPosition(latlngObj);
		$('input[name="lat"]').focus();
	}
	
	/**
	 * initialize map and set default marker
	 */
    $scope.lat = $('input[name="lat"]').val();
    $scope.lng = $('input[name="lng"]').val();
    var geocoder = new google.maps.Geocoder();
    var latlngObj = new google.maps.LatLng($scope.lat, $scope.lng);
	var map = new google.maps.Map(document.getElementById('map-canvas'), {
		center: latlngObj,
		zoom: 12
	});
	var marker = new google.maps.Marker({
		map: map,
		position: latlngObj,
		title: "Current Location",
		animation: google.maps.Animation.DROP,
		draggable: true
	});
	
	google.maps.event.addListener(map, 'click', function(selectedMarker) {
		$scope.searchterm = null;
		$scope.lat = selectedMarker.latLng.lat();
		$scope.lng = selectedMarker.latLng.lng();
		
		var latlngObj = new google.maps.LatLng($scope.lat, $scope.lng);
		map.panTo(latlngObj);
		marker.setPosition(latlngObj);
		
		$('input[name="lat"]').focus();
	});
	
	google.maps.event.addListener(marker, 'dragend', function(selectedMarker) {
		$scope.searchterm = null;
		$scope.lat = selectedMarker.latLng.lat();
		$scope.lng = selectedMarker.latLng.lng();
		
		$('input[name="lat"]').focus();
	});
	
	$('input[readonly="readonly"]').click(function() {
		alert('Please drag marker on map to choose the exact location.');
	});
	
	/**
	 * term search for map frame
	 */
	$scope.searchLocation = function($event) {
		geocoder.geocode({'address': $scope.searchterm}, function(results, status) {
			if(google.maps.GeocoderStatus.OK == status && results[0]) {
				setGeoCodingInfo(results[0]);
			}
			else {
				alert('Sorry!!! Location not found, please try other locations again.');
			}
		});
	};
});

mpmgrApp.controller('ContentTypeSettings', function() {
	//	add form validations
	$('form[name="contentTypeSettings"]').validate();
});

mpmgrApp.controller('RegisterAccount', function() {
	//	add form validations
	$('form[name="registerAccount"]').validate();
});

mpmgrApp.controller('AccountLogin', function() {
	//	add form validations
	$('form[name="accountLogin"]').validate();
});

mpmgrApp.controller('ForgotPassword', function() {
	//	add form validations
	$('form[name="forgotPassword"]').validate();
});
