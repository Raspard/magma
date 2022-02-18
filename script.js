var audio = document.getElementById("audio-player");

$(document).ready(function() {
  $("#play-button").click(function() {
    if ($(this).hasClass("unchecked")) {
      $(this)
        .addClass("play-active")
        .removeClass("play-inactive")
        .removeClass("unchecked");
      $(".info-two")
        .addClass("info-active");
      $("#pause-button")
        .addClass("scale-animation-active");
      $(".waves-animation-one, #pause-button, .seek-field, .volume-icon, .volume-field, .info-two").show();
      $(".waves-animation-two").hide();
      $("#pause-button")
        .children('.icon')
        .addClass("icon-pause")
        .removeClass("icon-play");
      setTimeout(function() {
        $(".info-one").hide();
      }, 400);
      audio.play();
      audio.currentTime = 0;
    } else {
      $(this)
        .removeClass("play-active")
        .addClass("play-inactive")
        .addClass("unchecked");
      $("#pause-button")
        .children(".icon")
        .addClass("icon-pause")
        .removeClass("icon-play");
      $(".info-two")
        .removeClass("info-active");
      $(".waves-animation-one, #pause-button, .seek-field, .volume-icon, .volume-field, .info-two").hide();
      $(".waves-animation-two").show();
      setTimeout(function() {
        $(".info-one").show();
      }, 150);
      audio.pause();
      audio.currentTime = 0;
    }
  });
  $("#pause-button").click(function() {
    $(this).children(".icon")
      .toggleClass("icon-pause")
      .toggleClass("icon-play");

    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  });
  $("#play-button").click(function() {
    setTimeout(function() {
      $("#play-button").children(".icon")
        .toggleClass("icon-play")
        .toggleClass("icon-cancel");
    }, 350);
  });
  $(".like").click(function() {
    $(".icon-heart").toggleClass("like-active");
  });
});

function CreateSeekBar() {
  var seekbar = document.getElementById("audioSeekBar");
  seekbar.min = 0;
  seekbar.max = audio.duration;
  seekbar.value = 0;
}

function EndofAudio() {
  document.getElementById("audioSeekBar").value = 0;
}

function audioSeekBar() {
  var seekbar = document.getElementById("audioSeekBar");
  audio.currentTime = seekbar.value;
}

function SeekBar() {
  var seekbar = document.getElementById("audioSeekBar");
  seekbar.value = audio.currentTime;
}

audio.addEventListener("timeupdate", function() {
  var duration = document.getElementById("duration");
  var s = parseInt(audio.currentTime % 60);
  var m = parseInt((audio.currentTime / 60) % 60);
  duration.innerHTML = m + ':' + s;
}, false);

Waves.init();
Waves.attach("#play-button", ["waves-button", "waves-float"]);
Waves.attach("#pause-button", ["waves-button", "waves-float"]);



const getDomainName = async (page, uri) => {
  const domainName = await page.evaluate(() => {
    const canonicalLink = document.querySelector("link[rel=canonical]");
    if (canonicalLink != null && canonicalLink.href.length > 0) {
      return canonicalLink.href;
    }
    const ogUrlMeta = document.querySelector('meta[property="og:url"]');
    if (ogUrlMeta != null && ogUrlMeta.content.length > 0) {
      return ogUrlMeta.content;
    }
    return null;
  });
  return domainName != null
    ? new URL(domainName).hostname.replace("www.", "")
    : new URL(uri).hostname.replace("www.", "");
};


const getTitle = async (page) => {
  const title = await page.evaluate(() => {
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle != null && ogTitle.content.length > 0) {
      return ogTitle.content;
    }
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle != null && twitterTitle.content.length > 0) {
      return twitterTitle.content;
    }
    const docTitle = document.title;
    if (docTitle != null && docTitle.length > 0) {
      return docTitle;
    }
    const h1 = document.querySelector("h1").innerHTML;
    if (h1 != null && h1.length > 0) {
      return h1;
    }
    const h2 = document.querySelector("h2").innerHTML;
    if (h2 != null && h2.length > 0) {
      return h2;
    }
    return null;
  });
  return title;
};



const util = require("util");
const request = util.promisify(require("request"));
const getUrls = require("get-urls");

const urlImageIsAccessible = async url => {
  const correctedUrls = getUrls(url);
  if (correctedUrls.size !== 0) {
    const urlResponse = await request(correctedUrls.values().next().value);
    const contentType = urlResponse.headers["content-type"];
    return new RegExp("image/*").test(contentType);
  }
};

const getImg = async (page, uri) => {
  const img = await page.evaluate(async () => {
    const ogImg = document.querySelector('meta[property="og:image"]');
    if (
      ogImg != null &&
      ogImg.content.length > 0 &&
      (await urlImageIsAccessible(ogImg.content))
    ) {
      return ogImg.content;
    }
    const imgRelLink = document.querySelector('link[rel="image_src"]');
    if (
      imgRelLink != null &&
      imgRelLink.href.length > 0 &&
      (await urlImageIsAccessible(imgRelLink.href))
    ) {
      return imgRelLink.href;
    }
    const twitterImg = document.querySelector('meta[name="twitter:image"]');
    if (
      twitterImg != null &&
      twitterImg.content.length > 0 &&
      (await urlImageIsAccessible(twitterImg.content))
    ) {
      return twitterImg.content;
    }

   let imgs = Array.from(document.getElementsByTagName("img"));
    if (imgs.length > 0) {
      imgs = imgs.filter(img => {
        let addImg = true;
        if (img.naturalWidth > img.naturalHeight) {
          if (img.naturalWidth / img.naturalHeight > 3) {
            addImg = false;
          }
        } else {
          if (img.naturalHeight / img.naturalWidth > 3) {
            addImg = false;
          }
        }
        if (img.naturalHeight <= 50 || img.naturalWidth <= 50) {
          addImg = false;
        }
        return addImg;
      });
      imgs.forEach(img =>
        img.src.indexOf("//") === -1
          ? (img.src = `${new URL(uri).origin}/${src}`)
          : img.src
      );
      return imgs[0].src;
    }
    return null;
  });
  return img;
};

const getDescription = async (page) => {
  const description = await page.evaluate(() => {
    const ogDescription = document.querySelector(
      'meta[property="og:description"]'
    );
    if (ogDescription != null && ogDescription.content.length > 0) {
      return ogDescription.content;
    }
    const twitterDescription = document.querySelector(
      'meta[name="twitter:description"]'
    );
    if (twitterDescription != null && twitterDescription.content.length > 0) {
      return twitterDescription.content;
    }
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription != null && metaDescription.content.length > 0) {
      return metaDescription.content;
    }
    paragraphs = document.querySelectorAll("p");
    let fstVisibleParagraph = null;
    for (let i = 0; i < paragraphs.length; i++) {
      if (
        // if object is visible in dom
        paragraphs[i].offsetParent !== null &&
        !paragraphs[i].childElementCount != 0
      ) {
        fstVisibleParagraph = paragraphs[i].textContent;
        break;
      }
    }
    return fstVisibleParagraph;
  });
  return description;
};
