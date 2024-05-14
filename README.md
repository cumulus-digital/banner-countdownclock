# Countdown Clock Banner

See `EXAMPLE.html` for implementation. It includes a script tag loading `dist/banner.js` from jsdelivr referencing a release version of this code. To choose a different version, alter the version number after the `@` symbol in the jsdelivr URL. See [jsdelivr documentation](https://www.jsdelivr.com/documentation#id-github) for details.

All attributes of the `countdown-banner` element are optional except for `end`. The example includes the default value of all attributes.

The `end` attribute specifies the end date and time of the countdown clock and must be specified in a format readable by JavaScript's `Date.parse()` — the most compatible of which is [ISO 8601](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#date_time_string_format). Check out [time.lol](https://time.lol/) for an easy conversion tool.

Your click-through is the A tag wrapping the `countdown-banner` element. This must be edited to replace "http://google.com" from the example with your click-through URL.

Your image macro should be set as the `background-image` attribute of `countdown-banner`.

When countdown completes, an `end-message` may be shown. Omit or leave blank to show all 0's.

## Attributes

Defaults in parenthesis.

* `width` (300px)
  Width of the banner.
* `height` (250px)
  Height of the banner.
* `background-color` (transparent)
  Background color of the clock.
* `background-image` ()
  Background image of the clock.
* `end` ()
  Date and time to count down to. Must be in a format understood by `Date.parse()` — the most compatible of which is [ISO 8601](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date#date_time_string_format). Check out [time.lol](https://time.lol/) for an easy conversion tool.
* `end-message` ()
  A message to display once the countdown completes.
* `end-message-font-size` (1em)
  An alternate font size for the `end-message`.
* `end-message-color` (inherit)
  An alternate text color for the `end-message`.
* `load-font` ()
  URL to a web-font, applied to the clock digits, labels, and `end-message`.
* `font-family` (sans-serif)
  CSS font-family applied to the clock digits, labels, and `end-message`.
* `clock-align` (center)
  Vertical alignment of the clock within the element. Values equivalent to flexbox align-items.
* `clock-justify` (center)
  Horizontal alignment of the clock within the element. Values equivalent to flexbox justify-content.
* `clock-fontsize` (55px)
  Font size of the clock digits. Labels' font size adjusts automatically to 33% of this size.
* `clock-lineheight` (1)
  Line height of all clock text elements.
* `clock-font-variant-numeric` (tabular-nums)
  Specify the font variant for numbers. The default, "tabular-nums", attempts to use a fixed-width space for numbers similar to a monospace font if such a variant exists for the font in use.
* `clock-color` (#fff)
  Text color of the clock digits and labels.
* `clock-separator` (":")
  The separator character between clock digits. Leave blank to remove the separator.
* `clock-margin` (0.5em 0 0)
  Adjusts the margin of the clock. Values equivalent to CSS margin shorthand.
* `clock-digit-gap` (.1em)
  Adjusts the gap between clock digits and separator.
* `clock-show-days` (true)
  Display the "days" remaining. If false, days will be represented as accumulated hours.
* `clock-show-seconds` (true)
  Display the "seconds" remaining.
* `clock-show-2digits` (true)
  If true, display clock parts as 2 digits. For example, 9 seconds would display as 09 seconds.
* `clock-show-labels` (true)
  Show or hide the digit labels.

## Example Screenshot

Below is a screenshot of what EXAMPLE.html may produce:

![Example screenshot of countdown clock](https://github.com/cumulus-digital/banner-countdownclock/blob/main/EXAMPLE.jpg?raw=true)