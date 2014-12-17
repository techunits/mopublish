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

mpmgrApp.controller('UpdateContent', function() {
	//	initialize tinymce for the editor.
	tinymce.init({
		selector:'textarea.maineditor',
		menubar	: false,
		toolbar: ["bold italic underline strikethrough | alignleft aligncenter alignright alignjustify outdent indent | bullist numlist | blockquote subscript superscript | removeformat"]
	});
	
	//	add form validations
	$('form[name="updateContent"]').validate();
	
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
	
	
	//	gmap handlers
	
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
