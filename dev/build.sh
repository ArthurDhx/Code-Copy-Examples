#!/bin/bash

# requires Chrome and ImageMagick

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

mkdir -p build

for stage in stage* extras*
do
  for file in "$stage"/*.{js,html}
  do
    filename=`basename "$file"`
    buildname=build/"html-$stage-$filename.html"
    imgname=build/"src-$stage-$filename.png"
    trimname=build/"trim-$stage-$filename.png"
    finalname=docs/img/"$stage-$filename.png"

    if [ "$file" -nt "$finalname" ]
    then
      echo processing "$file" into "$finalname"

      # syntax highlight into html
      node dev/syntax-highlight "$file" > "$buildname"

      # screenshot into image
      "$CHROME" --headless --screenshot="$imgname" --window-size=880,5000 "$buildname" 2>/dev/null

      # strip png metadata, including timestamp
      STRIP="-define png:exclude-chunk=EXIF,iCCP,iTXt,sRGB,tEXt,zCCP,zTXt,date,tIME"

      # trim into final
      convert "$imgname" -trim -trim +repage $STRIP "$trimname"

      if compare -metric AE -fuzz 1% "$trimname" "$finalname" /dev/null > /dev/null 2>&1
      then
        echo "  produced the same image (within 1% color difference)"
        touch "$finalname"
      else
        mv "$trimname" "$finalname"
      fi

    else
      [ -e "$file" ] && echo "skipping unchanged $file" || true
    fi
  done
done
