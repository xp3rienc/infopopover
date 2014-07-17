/*!
 * Info Popover 0.1.0 by @Garethderioth
 * https://github.com/Garethderioth/infopopover 
 */

(function( $ ) {
	$.fn.infopopover = function( options ) {
		var defaults = {
			x: 40,
			y: 25,
			// TODO Problema con el body offset en Firefox y Chrome
			container: "wrapper",
			infoClass: "",
			hasImage: true,
			image: "",
			message: "",
			isHoldOnHover: true
		};
		
		var settings = $.extend( {}, defaults, options );
		
		function calculateOffset( $el, container) {			
			var elementOffset = $el.offset(),
				containerOffset = $(container).offset(),
				realOffset = {};
			
			realOffset.left = elementOffset.left - containerOffset.left;
			realOffset.top = elementOffset.top - containerOffset.top;
			
			return realOffset;
		}
		
		function holdOnHover( e ) {
			e.stopPropagation();
			$(this).off("mouseleave.hideinfopopover").on("mouseleave.hideinfopopover", function( e ){
				hideInfoPopover();
			});
		}
		
		function showInfopopover( e ) {
			e.stopPropagation();			
			var $infopopoverWrapper = $("#" + $(this).data("infopopover-id")).parent(".info-popover-wrapper");
			
			hideInfoPopover();
			$infopopoverWrapper.show();
			
			if ( settings.isHoldOnHover ) {
				$infopopoverWrapper.off("mouseover.holdinfopopover").on("mouseover.holdinfopopover", holdOnHover);
			}
		}
		
		function hideInfoPopover() {
			$(".info-popover-wrapper").hide();
		}

		return this.each(function( i, el ) {
			var $el = $(el),
				$parent = $el.parent(),
				container = settings.container == "auto" || settings.container == "body" ? settings.container : "#" + settings.container,
				offset = settings.container == "auto" ? $el.position() : calculateOffset($el, container),
				heigth = $el.height(),
				width = $el.width(),
				zIndex = $el.css("z-index"),
				$infopopover = $("<div class='info-popover' />").addClass(settings.infoClass),
				message = $el.data("infopopover-message") ? $el.data("infopopover-message") : settings.message;
				image = $el.data("infopopover-image") ? $el.data("infopopover-image") : settings.image;
			
			if ( options == "show" ) {
				$("#" + $el.data("infopopover-id")).parent(".info-popover-wrapper").show();
			} else if ( options == "hide" ) {
				$("#" + $el.data("infopopover-id")).parent(".info-popover-wrapper").hide();
			} else {
				//Temp Id generation
				var infopopoverId = new Date().getTime();
				$el.data("infopopover-id", "infopopover_" + infopopoverId);
				
				$infopopover.attr("id", "infopopover_" + infopopoverId);
				
				//Buscamos un valor de z-index diferente de auto.
				while ( zIndex == "auto" && !$parent.is("body") ) {
					zIndex = $parent.css("z-index");
					$parent = $parent.parent();
				}
				
				//Establecemos el valor del z-index mayor a su contenedor
				if ( zIndex != "auto" ) {
					zIndex = ( zIndex + 1 );
				}
	
				if ( settings.hasImage ) {
					$infopopover.append("<div class='info-popover-img'>" + "<img src='" + image + "' />" + "</div>").append("<div class='info-popover-bd'>" + message + "</div>");
				} else {
					$infopopover.append("<div class='info-popover-bd'>" + message + "</div>");
				}

				$el.data("info-popover-message", message);
			
				var $infopopoverWrapper = $("<div class='info-popover-wrapper' />").append($infopopover);
				
				if (container != "auto") {
					$(container).css("position", "relative")
				}
				
				$infopopoverWrapper.appendTo(container == "auto" ? $el.parent() : container ).addClass( settings.infoClass ).css({ "top": ( offset.top - heigth - $infopopoverWrapper.height() - ( settings.y ) ) + "px", "left": ( offset.left  /* + width */ - ( settings.x ) ) + "px", "z-index": zIndex }).hide();
				
				$infopopoverWrapper.find(".info-popover-img").css("height", $infopopoverWrapper.height() + "px");
				
				//Instance hover functions
				$el.on("mouseenter", showInfopopover);
				$("body").on("mouseover.hideinfopopover", hideInfoPopover);
			}
		});
	};
}( jQuery ));
