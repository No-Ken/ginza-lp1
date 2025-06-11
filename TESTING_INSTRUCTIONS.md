# Testing Instructions for Re:anne Clinic Links

## How to Test the Links

The pricing card buttons should work properly when the HTML files are served correctly. Here are the testing methods:

### Method 1: Using a Local Web Server (Recommended)

1. Open Terminal/Command Prompt
2. Navigate to the demo_ver1 folder:
   ```bash
   cd "/Users/noriken/claude-project/project/ginza-clinic/HP:LP/demo_ver1"
   ```

3. Start a local web server:
   ```bash
   # Using Python 3
   python3 -m http.server 8000
   
   # Or using Python 2
   python -m SimpleHTTPServer 8000
   
   # Or using Node.js (if you have it)
   npx http-server . -p 8000
   ```

4. Open your browser and go to:
   ```
   http://localhost:8000/re;anne_lp_ver1.html
   ```

5. Click on the pricing card buttons - they should navigate to the treatment pages

### Method 2: Using Browser Developer Tools

1. Open the main page in your browser
2. Open Developer Tools (F12)
3. Go to the Console tab
4. Click on a pricing button
5. Check for any JavaScript errors in the console

### Method 3: Direct File Testing

If you're opening the HTML files directly (file:// protocol), some browsers may have security restrictions. Try:

1. Chrome: Launch with `--allow-file-access-from-files` flag
2. Firefox: Should work by default
3. Safari: Enable "Develop" menu and check file access settings

## Troubleshooting

If the links still don't work:

1. **Check console for errors**: Press F12 → Console tab
2. **Verify file paths**: All HTML files should be in the same directory
3. **Clear browser cache**: Ctrl+F5 or Cmd+Shift+R
4. **Try a different browser**: Test in Chrome, Firefox, and Safari

## Expected Behavior

When clicking a pricing button like "他の脱毛メニューを確認 →":
- Browser should navigate to the corresponding treatment page
- URL should change to show the new page (e.g., medical-hair-removal.html)
- The treatment page should load with all content visible

## Link Mapping

- 医療脱毛 → medical-hair-removal.html
- ハイフ → hifu.html  
- エクソソーム → exosome.html
- ダーマペン → dermapen.html
- ハイドラフェイシャル → peeling.html
- ボツリヌストキシン → injection.html
- レーザーシャワー → laser-treatment.html
- 水光注射 → injection.html
- マッサージピール → peeling.html
- フラクショナルレーザー → co2-laser.html
- 美容点滴 → beauty-injection-drip.html
- 医療用ピアス → piercing.html