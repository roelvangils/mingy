/* Debouncing function by John Hann (http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/) */
/* Idea for Using it to resize the browser window (http://paulirish.com/2009/throttled-smartresize-jquery-event-handler/) */

(function($, sr) {
	var debounce = function(func, threshold, execAsap) {
		var timeout;
		return function debounced() {
			var obj = this, args = arguments;
			function delayed() {
				if (!execAsap)
					func.apply(obj, args);
				timeout = null;
			}
			if (timeout)
				clearTimeout(timeout);
			else if (execAsap)
				func.apply(obj, args);
			timeout = setTimeout(delayed, threshold || 50);
		};
	}
	jQuery.fn[sr] = function(fn) {
		return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr);
	};
}(jQuery, 'smartResize'));

/*! Mingy Image Replacement Plugin v0.0.1 by @roelvangils */
(function(window, $) {

	var
	$window = $(window),
	mingy = $.fn.mingy = function(options) {

		var $elements = this;

		options = $.extend({}, mingy.defaults, options);

		if (options.noscriptFallback) {
			document.cookie = 'js=true; expires=Fri, 31 Dec 2038 00:00:00 GMT; path=/';
		}

		/* This function sets the src */
		$.fn.setSrc = function() {
			return this.each(function() {
				var $img = $(this);
				return $img
					.attr('data-src', this.src)
					.attr('src',
						$img.data('src') + '(' +
						$img.width() + ',' +
						$img.height() + ',' +
						($img.data('retina') || options.retina) + ',' +
						(window.devicePixelRatio > 1) + ',' +
						($img.data('quality') || options.quality) + ')');
			});
		};

		/* Add parameters to image src to allow mod_rewrite */
		$elements.setSrc();

		/* Set src again on resize */
		if (options.reloadOnResize) {
			$window.smartResize(function() {
				$elements.setSrc();
			});
		}

		/* Allow this jQuery plugin to be chained */
		return $elements;

	};

	/* Set default values */
	mingy.defaults = {
		'quality': 50,
		'retina': false,
		'noscriptFallback': true,
		'reloadOnResize': true
	};

}(this, jQuery));