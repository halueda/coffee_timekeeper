# Coffee Time Keeper
HTML5 and JavaScript based timer with notification chime for Coffee.

### How to Use?
Access
https://halueda.github.io/coffee_timekeeper/
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
- 時刻を5個に拡張

#### 4:6メソッドの基本レシピ
- 4:6 メソッドは、粕谷哲さんの https://philocoffea.com/?mode=f3 を参照
- 粉量:20g 湯量:300g 粗挽き

| 時間  | 投数   | 注ぐお湯の量 | 総量(スケールが示す量) |
|-------|--------|--------------|------------------------|
| Start | 1投目  | 60g          | 60g                    |
| 0:45  | 2投目  | 60g          | 120g                   |
| 1:30  | 3投目  | 60g          | 180g                   |
| 2:10  | 4投目  | 60g          | 240g                   |
| 2:40  | 5投目  | 60g          | 300g                   |
| 3:30  | Finish |              |                        |


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
