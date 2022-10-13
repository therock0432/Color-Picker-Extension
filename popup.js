const btn  = document.querySelector('.changeColorBtn');
const colorGrid = document.querySelector('.colorGrid');
const colorValue = document.querySelector('.colorValue');
const colorValueRGBA = document.querySelector('.colorValueRGBA');

const colorGridComp = document.querySelector('.colorGridComp');
const colorValueComp = document.querySelector('.colorValueComp');
const colorValueRGBAComp = document.querySelector('.colorValueRGBAComp');

const colorGridPicked1 = document.querySelector('.colorGridPicked1');
const colorGridPicked2 = document.querySelector('.colorGridPicked2');
const colorGridPicked3 = document.querySelector('.colorGridPicked3');
const colorGridPicked4 = document.querySelector('.colorGridPicked4');
const colorGridPicked5 = document.querySelector('.colorGridPicked5');

const arr = [];


var blink = 
document.getElementById('blink');

setInterval(function () {
blink.style.opacity = 
(blink.style.opacity == 0 ? 1 : 0);
}, 500); 


function hexToComplimentary(hex){

   
    var rgb = 'rgb(' + (hex = hex.replace('#', '')).match(new RegExp('(.{' + hex.length/3 + '})', 'g')).map(function(l) { return parseInt(hex.length%2 ? l+l : l, 16); }).join(',') + ')';

   
    rgb = rgb.replace(/[^\d,]/g, '').split(',');

    var r = rgb[0], g = rgb[1], b = rgb[2];

    
    r /= 255.0;
    g /= 255.0;
    b /= 255.0;
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2.0;

    if(max == min) {
        h = s = 0; 
    } else {
        var d = max - min;
        s = (l > 0.5 ? d / (2.0 - max - min) : d / (max + min));

        if(max == r && g >= b) {
            h = 1.0472 * (g - b) / d ;
        } else if(max == r && g < b) {
            h = 1.0472 * (g - b) / d + 6.2832;
        } else if(max == g) {
            h = 1.0472 * (b - r) / d + 2.0944;
        } else if(max == b) {
            h = 1.0472 * (r - g) / d + 4.1888;
        }
    }

    h = h / 6.2832 * 360.0 + 0;

   
    h+= 180;
    if (h > 360) { h -= 360; }
    h /= 360;

  
    if(s === 0){
        r = g = b = l; // achromatic
    } else {
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;

        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    r = Math.round(r * 255);
    g = Math.round(g * 255); 
    b = Math.round(b * 255);

    
    rgb = b | (g << 8) | (r << 16); 
    return "#" + (0x1000000 | rgb).toString(16).substring(1);
}  


function hexToRGB(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
        return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
        return "rgb(" + r + ", " + g + ", " + b + ")";
    }
}


btn.addEventListener('click', async ()=>{
    let [tab] = await chrome.tabs.query({active:true, currentWindow: true});


    chrome.scripting.executeScript({
        target:{ tabId: tab.id}, 
        function: pickColor,
    }, async(injectionResults) => {
        const [data] = injectionResults;
        if(data.result)
        {
            const color = data.result.sRGBHex;
            console.log(color);
            if(arr.length > 4)
            {
                arr.shift();
            }
            arr.push(color);
            colorGridPicked1.style.backgroundColor = arr[0];
            colorGridPicked2.style.backgroundColor = arr[1];
            colorGridPicked3.style.backgroundColor = arr[2];
            colorGridPicked4.style.backgroundColor = arr[3];
            colorGridPicked5.style.backgroundColor = arr[4];

            console.log(arr);
            const colorRGBA =  hexToRGB(color);

            colorGrid.style.backgroundColor = color;
            colorValue.innerText = color;
            colorValueRGBA.innerText = colorRGBA;

            const complimentaryColor = hexToComplimentary(color);
            const colorRGBAComp =  hexToRGB(complimentaryColor); 
            colorGridComp.style.backgroundColor = complimentaryColor;
            colorValueComp.innerText = complimentaryColor;
            colorValueRGBAComp.innerText = colorRGBAComp;


            try{
            await navigator.clipboard.writeText(color);
            }
            catch(err)
            {
                console.log(err);
            }

        }

    });

});



async function pickColor() {
    try{

        const eyeDropper = new EyeDropper();
        return await eyeDropper.open();


    }
    catch(err)
    {
        console.error(err);
    }
}