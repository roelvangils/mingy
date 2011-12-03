/* Mingy Image Replacement Plugin v0.1 by @roelvangils */

$.fn.mingy = function(options) {

  /* Set default values */

	var
	  defaults = {
	    quality : 50,
	    retina : false,
	    noscriptFallback : true,
	    reloadOnResize : true,
	    elements : $(this),
	  },
	  mingy = $.extend({}, defaults, options);

  /* Debouncing function by John Hann (http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/) */
  /* Idea for Using it to resize the browser window (http://paulirish.com/2009/throttled-smartresize-jquery-event-handler/) */

  (function($,sr){
    var debounce = function (func, threshold, execAsap) {
      var timeout;
      return function debounced () {
        var obj = this, args = arguments;
        function delayed () {
          if (!execAsap)
            func.apply(obj, args);
          timeout = null; 
        };
        if (timeout)
          clearTimeout(timeout);
        else if (execAsap)
          func.apply(obj, args);
        timeout = setTimeout(delayed, threshold || 50); 
      };
    }
  	jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };   
  })(jQuery,'smartresize');

  if (mingy.noscriptFallback) {
    document.cookie = 'js=true; expires=Fri, 31 Dec 2038 0:0:0 UTC; path=/';
  };
  
  /* Add parameters to image src to allow mod_rewrite */
  
  this.each(function() {
    setSrc($(this));
	});

  /* Set src again on resize */
  
  if (mingy.reloadOnResize) {
    $(window).smartresize(function() {
      mingy.elements.each(function() {
        setSrc($(this));
      });
    });
  }

  /* This function sets the src */

  function setSrc(img) {
   img
      .attr('data-src',img.attr('src'))
      .attr('src',
        img.data('src')+'('+
        img.width()+','+
        img.height()+','+
        (img.data('retina') != null ? img.data('retina') : mingy.retina )+','+
        (window.devicePixelRatio > 1 ? true : false)+','+
        (img.data('quality') != null ? img.data('quality') : mingy.quality )+')');
  };

  /* Allow this jQuery plugin to be chained */

  return this;

}
