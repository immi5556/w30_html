(function ($)
{
	var superBind = $.fn.bind;
	var superUnbind = $.fn.unbind;
	var touchHandlersKey = "clicktouchHandlers";

	// override bind
	$.fn.bind = function ()
	{
		var $window = $(window);
		var callback;
		var data;

		if (typeof(arguments[1]) === "function")
		{
			callback = arguments[1];
		}
		else if (typeof(arguments[1]) === "object" )
		{
			data = arguments[1];
			callback = arguments[2];
		}


		if (typeof(arguments[0] == "string") && arguments[0] == "click" && "ontouchstart" in window)
		{
			// bind touch handlers fallback to default click behaviour and return jquery object
			return this.each(function ()
			{
				var didMove = false;
				var $el = $(this);


				$el.bind("touchstart", touchStartHandler);
				superBind.call($el, "click", clickHandler);

				function clickHandler (e)
				{
					e.preventDefault();
					e.stopImmediatePropagation();
				}

				function touchStartHandler (e)
				{
					$el.addClass("active");
					$window.bind("touchmove", touchMoveHandler);
					$window.bind("touchend", touchEndHandler);
				}

				function touchMoveHandler (e)
				{
					$el.removeClass("active");
					didMove = true;
				}

				function touchEndHandler (e)
				{
					$el.removeClass("active");

					if (!didMove && typeof(callback) === "function")
					{
						if (data) e.data = data;
						callback(e);
					}

					superUnbind.call($window, "touchmove", touchMoveHandler);
					superUnbind.call($window, "touchend", touchEndHandler);

					didMove = false;

					e.preventDefault();
					e.stopImmediatePropagation();
				}

				// keep references to handlers for unbinding
				var handlers = $el.data(touchHandlersKey) || [];

				handlers.push(
				{
					callback: callback,
					clickHandler: clickHandler,
					touchStartHandler: touchStartHandler,
					touchMoveHandler: touchMoveHandler,
					touchEndHandler: touchEndHandler
				})

				$el.data(touchHandlersKey, handlers);
			});
		}
		else
		{
			return superBind.apply(this, arguments);
		}
	};


	// override unbind
	$.fn.unbind = function ()
	{
		var $window = $(window);
		var $el = $(this);
		var callback = arguments[1];

		if (typeof(arguments[0] == "string") && arguments[0] == "click" && "ontouchstart" in window)
		{
			return this.each(function ()
			{
				$el = $(this);

				if (typeof(callback) === "function")
				{
					var handlers = $el.data(touchHandlersKey);

					if (handlers)
					{
						for (var i = 0, num = handlers.length; i < num; i++)
						{
							var handler = handlers[i];

							if (handler.callback === callback)
							{
								superUnbind.call($el, "touchstart", handler.touchStartHandler);
								superUnbind.call($window, "touchmove", handler.touchMoveHandler);
								superUnbind.call($window, "touchend", handler.touchEndHandler);
								superUnbind.call($el, "click", handler.clickHandler);
							}
						}
					}
				}
				else
				{
					superUnbind.call($el, "touchstart");
					superUnbind.call($el, "click");
				}
			});
		}
		else
		{
			return superUnbind.apply(this, arguments);
		}
	};

})( jQuery );