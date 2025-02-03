# Coffee Time Keeper
HTML5 and JavaScript based timer with notification chime for Coffee.

### How to Use?
Access
~~https://maruta.github.io/timekeeper/~~
or you can use local copy of this repository.

**:bangbang: Be careful to turn off screen savers and automatic screen cut :bangbang:**

### How to Save the Settings?
All current settings are included in URL.
Just use bookmark to preserve your settings.

When you are using Chrome and running local copy of Time Keeper,
Chrome does not permit to update the URL due to a security reason.
Time Keeper logo on left-top is the link to the URL with the current setting, and can be used to get the URL.

### How to Customize Appearance?

 * Edit timekeeper/theme/default.css
 * By using class added to the body tag, the appearance can be changed according to the phase and state of the timer.
 * Theme can be specified via URL as  
   http://maruta.github.io/timekeeper/#th=example  
   In this case, timekeeper/theme/example.css will be loaded in place of default.css.

### オリジナルのtimekeeper からの拡張・変更
- 6:4 メソッドのオリジナルに言及
- 時刻をを6個に拡張
- 入れ方のアドバイスを初期値に入れた

### License
Timekeeper is open-sourced software licensed under The MIT License.

This repository contains codes from

 * [jQuery](https://jquery.org/license/) licensed under MIT License
 * [jQuery Timer plugin](http://www.mattptr.net/) licensed under BSD License
 * [Bootstrap](https://github.com/twbs/bootstrap/blob/master/LICENSE) licensed under MIT License
 * [DOMPurify](https://github.com/cure53/DOMPurify) licensed under Apache-2.0 License

and

 * A modified version of [Roboto](https://fonts.google.com/specimen/Roboto/about) font
    * In this version, the "colon" is replaced with a "fancy colon" to be displayed in the proper position in the time display. Roboto is licensed under the Apache-2.0 License. Our modifications don't in any way alter the existing license of the font. 
