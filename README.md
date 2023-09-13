# Countdown Clock Banner

See `example.html` for example implementation.

All attributes of the `countdown-banner` element are optional, and defaults are shown in the example.

The `end` attribute specifies the end date and time of the countdown clock and must be specified in a format readable by JavaScript's `Date.parse()` — the most compatible of which is [ISO 8601](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#date_time_string_format). Check out [time.lol](https://time.lol/) for an easy conversion tool.

Your clickthrough is the A tag wrapping the `countdown-banner` element.

Your image macro should be set as the `background-image` attribute of `countdown-banner`.